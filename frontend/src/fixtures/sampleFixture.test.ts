import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { OcrDocument } from '../domain/ocrTypes';
import { validateMappableField } from '../domain/ocrValidation';
import { sampleOcrDocument } from './sampleFixture';

const rootDir = resolve(__dirname, '../..');

describe('sample fixtures', () => {
  it('contains mappable fields that reference existing pages and valid source bboxes', () => {
    const fixture = JSON.parse(
      readFileSync(resolve(rootDir, 'public/fixtures/sample-document.ocr.json'), 'utf8'),
    ) as OcrDocument;

    expect(fixture.pdfFile).toBe('/fixtures/sample-document.pdf');
    for (const field of fixture.fields) {
      const result = validateMappableField(field, fixture.pages.length);
      expect(result.mappable).toBe(true);
      expect(field.bbox!.x + field.bbox!.width).toBeLessThanOrEqual(field.sourcePageWidth!);
      expect(field.bbox!.y + field.bbox!.height).toBeLessThanOrEqual(field.sourcePageHeight!);
    }
  });

  it('matches the committed deterministic OCR source', () => {
    const fixture = JSON.parse(
      readFileSync(resolve(rootDir, 'public/fixtures/sample-document.ocr.json'), 'utf8'),
    ) as OcrDocument;

    expect(fixture).toEqual(sampleOcrDocument);
  });
});
