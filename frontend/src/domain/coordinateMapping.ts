import type { BoundingBox, OverlayRect, RenderedPageDimensions, SourcePageDimensions } from './ocrTypes';

export function scaleBoundingBox(
  bbox: BoundingBox,
  source: SourcePageDimensions,
  rendered: RenderedPageDimensions,
): OverlayRect {
  const scaleX = rendered.width / source.sourcePageWidth;
  const scaleY = rendered.height / source.sourcePageHeight;

  return {
    left: bbox.x * scaleX,
    top: bbox.y * scaleY,
    width: bbox.width * scaleX,
    height: bbox.height * scaleY,
  };
}
