import type { OcrField, RenderedPageDimensions } from '../domain/ocrTypes';
import { scaleBoundingBox } from '../domain/coordinateMapping';
import { validateMappableField } from '../domain/ocrValidation';

interface HighlightOverlayProps {
  field: OcrField | null;
  pageNumber: number;
  renderedDimensions?: RenderedPageDimensions;
  pageCount?: number;
}

export function HighlightOverlay({
  field,
  pageNumber,
  renderedDimensions,
  pageCount,
}: HighlightOverlayProps) {
  if (!field || field.page !== pageNumber || !renderedDimensions) {
    return <div className="page-overlay" aria-hidden="true" />;
  }

  const mapping = validateMappableField(field, pageCount);
  if (!mapping.mappable) {
    return <div className="page-overlay" aria-hidden="true" />;
  }

  const { bbox, sourcePageWidth, sourcePageHeight } = mapping.value.field;
  const rect = scaleBoundingBox(
    bbox,
    { sourcePageWidth, sourcePageHeight },
    renderedDimensions,
  );

  return (
    <div className="page-overlay" aria-hidden="true">
      <div
        className="highlight-rect"
        data-testid="highlight-rect"
        style={{
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        }}
      />
    </div>
  );
}
