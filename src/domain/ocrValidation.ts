import type { OcrField } from './ocrTypes';

export interface MappableField {
  field: OcrField & {
    bbox: NonNullable<OcrField['bbox']>;
    sourcePageWidth: number;
    sourcePageHeight: number;
  };
}

export type FieldMappingResult =
  | { mappable: true; value: MappableField }
  | { mappable: false; reason: string };

function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

export function validateMappableField(field: OcrField, pageCount?: number): FieldMappingResult {
  if (!Number.isInteger(field.page) || field.page < 1) {
    return { mappable: false, reason: 'invalid-page' };
  }

  if (pageCount !== undefined && field.page > pageCount) {
    return { mappable: false, reason: 'page-out-of-range' };
  }

  if (!field.bbox) {
    return { mappable: false, reason: 'missing-bbox' };
  }

  if (
    !isPositiveNumber(field.bbox.width) ||
    !isPositiveNumber(field.bbox.height) ||
    !Number.isFinite(field.bbox.x) ||
    !Number.isFinite(field.bbox.y)
  ) {
    return { mappable: false, reason: 'invalid-bbox' };
  }

  if (!isPositiveNumber(field.sourcePageWidth) || !isPositiveNumber(field.sourcePageHeight)) {
    return { mappable: false, reason: 'missing-source-dimensions' };
  }

  return {
    mappable: true,
    value: {
      field: {
        ...field,
        bbox: field.bbox,
        sourcePageWidth: field.sourcePageWidth,
        sourcePageHeight: field.sourcePageHeight,
      },
    },
  };
}
