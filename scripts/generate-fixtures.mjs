import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');
const outputPdf = resolve(rootDir, 'public/fixtures/sample-document.pdf');
const outputJson = resolve(rootDir, 'public/fixtures/sample-document.ocr.json');

const page = {
  page: 1,
  sourcePageWidth: 595,
  sourcePageHeight: 842,
};

const fields = [
  { id: 'document-number', label: 'Document No', ocrLabel: '文档编号', value: 'DOC-2026-001', x: 178, y: 166, width: 132, height: 16 },
  { id: 'applicant-name', label: 'Applicant', ocrLabel: '申请人', value: 'Li Ming', x: 178, y: 206, width: 72, height: 16 },
  { id: 'application-date', label: 'Date', ocrLabel: '申请日期', value: '2026-06-25', x: 178, y: 246, width: 96, height: 16 },
  { id: 'amount', label: 'Amount', ocrLabel: '金额', value: 'CNY 12,800.00', x: 178, y: 286, width: 118, height: 16 },
  { id: 'approval-status', label: 'Status', ocrLabel: '审批状态', value: 'Approved', x: 178, y: 326, width: 76, height: 16 },
];

function escapePdfText(value) {
  return value.replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)');
}

function textLine(x, topY, text, size = 14) {
  const pdfY = page.sourcePageHeight - topY - size;
  return `BT /F1 ${size} Tf ${x} ${pdfY} Td (${escapePdfText(text)}) Tj ET`;
}

function rectLine(x, topY, width, height) {
  const pdfY = page.sourcePageHeight - topY - height;
  return `${x} ${pdfY} ${width} ${height} re S`;
}

function createPdfBuffer() {
  const contentLines = [
    '1.25 w',
    '0.1 0.1 0.1 RG',
    textLine(72, 90, 'Sample OCR Field Mapping Document', 20),
    textLine(72, 126, 'This fixture is generated from deterministic field coordinates.', 11),
    ...fields.flatMap((field) => [
      textLine(72, field.y, `${field.label}:`, 14),
      textLine(field.x, field.y, field.value, 14),
      '0.98 0.78 0.08 RG',
      rectLine(field.x - 2, field.y - 2, field.width + 4, field.height + 4),
      '0.1 0.1 0.1 RG',
    ]),
  ];
  const content = `${contentLines.join('\n')}\n`;

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${page.sourcePageWidth} ${page.sourcePageHeight}] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${Buffer.byteLength(content, 'utf8')} >>\nstream\n${content}endstream`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, 'utf8');
}

function createOcrDocument() {
  return {
    documentId: 'sample-document',
    pdfFile: '/fixtures/sample-document.pdf',
    coordinateSystem: 'top-left-pixels',
    pages: [page],
    fields: fields.map((field) => ({
      id: field.id,
      label: field.ocrLabel,
      value: field.value,
      page: page.page,
      bbox: {
        x: field.x,
        y: field.y,
        width: field.width,
        height: field.height,
      },
      sourcePageWidth: page.sourcePageWidth,
      sourcePageHeight: page.sourcePageHeight,
    })),
  };
}

async function writeOrCheck(path, data) {
  if (checkOnly) {
    const current = await readFile(path);
    if (!current.equals(Buffer.from(data))) {
      throw new Error(`${path} is out of date. Run npm run fixtures:generate.`);
    }
    return;
  }

  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, data);
}

await writeOrCheck(outputPdf, createPdfBuffer());
await writeOrCheck(outputJson, `${JSON.stringify(createOcrDocument(), null, 2)}\n`);

console.log(checkOnly ? 'Fixtures are stable.' : 'Generated sample PDF and OCR fixtures.');
