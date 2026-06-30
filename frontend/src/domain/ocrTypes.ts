export type PageNumber = number;

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SourcePageDimensions {
  sourcePageWidth: number;
  sourcePageHeight: number;
}

export interface OcrField {
  id: string;
  label: string;
  value: string;
  page: PageNumber;
  bbox?: BoundingBox;
  sourcePageWidth?: number;
  sourcePageHeight?: number;
}

export interface OcrDocument {
  documentId: string;
  pdfFile: string;
  coordinateSystem: 'top-left-pixels';
  pages: Array<SourcePageDimensions & { page: PageNumber }>;
  fields: OcrField[];
}

export interface RenderedPageDimensions {
  width: number;
  height: number;
}

export interface OverlayRect {
  left: number;
  top: number;
  width: number;
  height: number;
}
