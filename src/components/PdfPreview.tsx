import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getDocument, type PDFDocumentProxy, type PDFPageProxy } from 'pdfjs-dist';
import type { OcrField, RenderedPageDimensions } from '../domain/ocrTypes';
import { validateMappableField } from '../domain/ocrValidation';
import { HighlightOverlay } from './HighlightOverlay';

interface PdfPreviewProps {
  pdfUrl: string;
  fields: OcrField[];
  selectedFieldId: string | null;
  pageCountHint?: number;
}

interface PageCanvasProps {
  pdfDocument: PDFDocumentProxy;
  pageNumber: number;
  selectedField: OcrField | null;
  renderedDimensions?: RenderedPageDimensions;
  onRendered: (pageNumber: number, dimensions: RenderedPageDimensions) => void;
  pageCount?: number;
}

function PageCanvas({
  pdfDocument,
  pageNumber,
  selectedField,
  renderedDimensions,
  onRendered,
  pageCount,
}: PageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [targetWidth, setTargetWidth] = useState(0);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) {
      return;
    }

    const updateWidth = () => setTargetWidth(Math.min(760, Math.max(320, element.clientWidth)));
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || targetWidth <= 0) {
      return;
    }

    let cancelled = false;
    let pageRenderTask: ReturnType<PDFPageProxy['render']> | null = null;

    async function renderPage() {
      const page = await pdfDocument.getPage(pageNumber);
      if (cancelled || !canvasRef.current) {
        return;
      }

      const initialViewport = page.getViewport({ scale: 1 });
      const scale = targetWidth / initialViewport.width;
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        return;
      }

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      pageRenderTask = page.render({ canvasContext: context, viewport });
      await pageRenderTask.promise;

      if (!cancelled) {
        onRendered(pageNumber, { width: viewport.width, height: viewport.height });
      }
    }

    void renderPage();

    return () => {
      cancelled = true;
      pageRenderTask?.cancel();
    };
  }, [onRendered, pageNumber, pdfDocument, targetWidth]);

  return (
    <div className="pdf-page" ref={wrapperRef}>
      <div className="pdf-page-surface">
        <canvas ref={canvasRef} aria-label={`PDF 第 ${pageNumber} 页`} />
        <HighlightOverlay
          field={selectedField}
          pageNumber={pageNumber}
          renderedDimensions={renderedDimensions}
          pageCount={pageCount}
        />
      </div>
    </div>
  );
}

export function PdfPreview({ pdfUrl, fields, selectedFieldId, pageCountHint }: PdfPreviewProps) {
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pageDimensions, setPageDimensions] = useState<Record<number, RenderedPageDimensions>>({});
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const selectedField = useMemo(
    () => fields.find((field) => field.id === selectedFieldId) ?? null,
    [fields, selectedFieldId],
  );

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setPdfDocument(null);

    const loadingTask = getDocument(pdfUrl);
    loadingTask.promise
      .then((document) => {
        if (!cancelled) {
          setPdfDocument(document);
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'PDF loading failed');
        }
      });

    return () => {
      cancelled = true;
      void loadingTask.destroy();
    };
  }, [pdfUrl]);

  useEffect(() => {
    if (!selectedField) {
      return;
    }

    const mapping = validateMappableField(selectedField, pdfDocument?.numPages ?? pageCountHint);
    if (!mapping.mappable) {
      return;
    }

    pageRefs.current[selectedField.page]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [pageCountHint, pdfDocument?.numPages, selectedField]);

  const handleRendered = useCallback((pageNumber: number, dimensions: RenderedPageDimensions) => {
    setPageDimensions((current) => {
      const previous = current[pageNumber];
      if (previous?.width === dimensions.width && previous.height === dimensions.height) {
        return current;
      }

      return { ...current, [pageNumber]: dimensions };
    });
  }, []);

  if (error) {
    return <p className="status-message error">PDF 加载失败：{error}</p>;
  }

  if (!pdfDocument) {
    return <p className="status-message">PDF 加载中...</p>;
  }

  return (
    <div className="pdf-document">
      {Array.from({ length: pdfDocument.numPages }, (_, index) => {
        const pageNumber = index + 1;

        return (
          <div
            key={pageNumber}
            ref={(element) => {
              pageRefs.current[pageNumber] = element;
            }}
          >
            <PageCanvas
              pdfDocument={pdfDocument}
              pageNumber={pageNumber}
              selectedField={selectedField}
              renderedDimensions={pageDimensions[pageNumber]}
              onRendered={handleRendered}
              pageCount={pdfDocument.numPages}
            />
          </div>
        );
      })}
    </div>
  );
}
