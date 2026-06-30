import { useEffect, useMemo, useState } from 'react';
import { loadOcrDocument } from './fixtures/loadOcrDocument';
import type { OcrDocument } from './domain/ocrTypes';
import { validateMappableField } from './domain/ocrValidation';
import { OcrFieldForm } from './components/OcrFieldForm';
import { PdfPreview } from './components/PdfPreview';
import { FloatingPdfDialog } from './components/FloatingPdfDialog';

export default function App() {
  const [ocrDocument, setOcrDocument] = useState<OcrDocument | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadOcrDocument()
      .then((document) => {
        if (cancelled) {
          return;
        }
        setOcrDocument(document);
        setSelectedFieldId(document.fields[0]?.id ?? null);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setOcrError(error instanceof Error ? error.message : 'OCR fixture load failed');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedField = useMemo(
    () => ocrDocument?.fields.find((field) => field.id === selectedFieldId) ?? null,
    [ocrDocument?.fields, selectedFieldId],
  );
  const mappingResult = selectedField
    ? validateMappableField(selectedField, ocrDocument?.pages.length)
    : null;
  const pdfPreview = (
    <PdfPreview
      pdfUrl={ocrDocument?.pdfFile ?? '/fixtures/sample-document.pdf'}
      fields={ocrDocument?.fields ?? []}
      selectedFieldId={selectedFieldId}
      pageCountHint={ocrDocument?.pages.length}
    />
  );

  return (
    <main className="app-shell">
      <section className="form-panel" aria-label="OCR 字段">
        <div className="panel-header">
          <h1>OCR 字段映射</h1>
          <p>示例文档：{ocrDocument?.documentId ?? '加载中'}</p>
        </div>
        {ocrError ? <p className="status-message error">{ocrError}</p> : null}
        <OcrFieldForm
          fields={ocrDocument?.fields ?? []}
          selectedFieldId={selectedFieldId}
          onSelectField={setSelectedFieldId}
        />
        {selectedField && mappingResult && !mappingResult.mappable ? (
          <p className="status-message">当前字段缺少安全高亮所需的坐标数据。</p>
        ) : null}
      </section>

      <section className="preview-panel" aria-label="PDF 预览">
        <div className="preview-launcher">
          <h2>PDF 预览</h2>
          <p>当前字段：{selectedField?.label ?? '未选择'}</p>
          <div className="preview-actions">
            <button className="primary-action" type="button" onClick={() => setPdfDialogOpen(true)}>
              打开 PDF 预览
            </button>
          </div>
        </div>
      </section>

      {pdfDialogOpen ? (
        <FloatingPdfDialog
          onClose={() => setPdfDialogOpen(false)}
          selectedLabel={`当前字段：${selectedField?.label ?? '未选择'}`}
          title="PDF 预览"
        >
          {pdfPreview}
        </FloatingPdfDialog>
      ) : null}
    </main>
  );
}
