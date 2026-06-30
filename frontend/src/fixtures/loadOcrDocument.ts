import type { OcrDocument } from '../domain/ocrTypes';

export async function loadOcrDocument(path = '/fixtures/sample-document.ocr.json'): Promise<OcrDocument> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`OCR fixture load failed: ${response.status}`);
  }

  return response.json() as Promise<OcrDocument>;
}
