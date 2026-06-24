import { describe, expect, it } from 'vitest';
import { scaleBoundingBox } from './coordinateMapping';

const bbox = { x: 10, y: 20, width: 30, height: 40 };
const source = { sourcePageWidth: 100, sourcePageHeight: 200 };

describe('scaleBoundingBox', () => {
  it('keeps coordinates unchanged for same-size rendering', () => {
    expect(scaleBoundingBox(bbox, source, { width: 100, height: 200 })).toEqual({
      left: 10,
      top: 20,
      width: 30,
      height: 40,
    });
  });

  it('scales coordinates up', () => {
    expect(scaleBoundingBox(bbox, source, { width: 200, height: 400 })).toEqual({
      left: 20,
      top: 40,
      width: 60,
      height: 80,
    });
  });

  it('scales coordinates down', () => {
    expect(scaleBoundingBox(bbox, source, { width: 50, height: 100 })).toEqual({
      left: 5,
      top: 10,
      width: 15,
      height: 20,
    });
  });

  it('supports fractional rendered page dimensions', () => {
    const result = scaleBoundingBox(bbox, source, { width: 123.5, height: 333.25 });

    expect(result.left).toBeCloseTo(12.35);
    expect(result.top).toBeCloseTo(33.325);
    expect(result.width).toBeCloseTo(37.05);
    expect(result.height).toBeCloseTo(66.65);
  });
});
