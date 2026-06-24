import { describe, expect, it } from 'vitest';
import type { OcrField } from './ocrTypes';
import { validateMappableField } from './ocrValidation';

const validField: OcrField = {
  id: 'amount',
  label: '金额',
  value: 'CNY 12,800.00',
  page: 1,
  bbox: { x: 10, y: 20, width: 30, height: 40 },
  sourcePageWidth: 595,
  sourcePageHeight: 842,
};

describe('validateMappableField', () => {
  it('accepts a valid mappable field', () => {
    expect(validateMappableField(validField, 1).mappable).toBe(true);
  });

  it('rejects a missing bbox', () => {
    const result = validateMappableField({ ...validField, bbox: undefined }, 1);
    expect(result).toEqual({ mappable: false, reason: 'missing-bbox' });
  });

  it('rejects missing source dimensions', () => {
    const result = validateMappableField({ ...validField, sourcePageWidth: undefined }, 1);
    expect(result).toEqual({ mappable: false, reason: 'missing-source-dimensions' });
  });

  it('rejects an invalid page number', () => {
    const result = validateMappableField({ ...validField, page: 0 }, 1);
    expect(result).toEqual({ mappable: false, reason: 'invalid-page' });
  });

  it('rejects a page number outside the document', () => {
    const result = validateMappableField({ ...validField, page: 2 }, 1);
    expect(result).toEqual({ mappable: false, reason: 'page-out-of-range' });
  });
});
