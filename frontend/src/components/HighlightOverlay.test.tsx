import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { sampleFields } from '../fixtures/sampleFixture';
import { HighlightOverlay } from './HighlightOverlay';

describe('HighlightOverlay', () => {
  it('creates the expected highlight rectangle for fixture OCR data', () => {
    render(
      <HighlightOverlay
        field={sampleFields[0]}
        pageNumber={1}
        renderedDimensions={{ width: 1190, height: 1684 }}
        pageCount={1}
      />,
    );

    const highlight = screen.getByTestId('highlight-rect');
    expect(highlight).toHaveStyle({
      left: '356px',
      top: '332px',
      width: '264px',
      height: '32px',
    });
  });

  it('does not draw a highlight for another page', () => {
    render(
      <HighlightOverlay
        field={sampleFields[0]}
        pageNumber={2}
        renderedDimensions={{ width: 1190, height: 1684 }}
        pageCount={2}
      />,
    );

    expect(screen.queryByTestId('highlight-rect')).not.toBeInTheDocument();
  });
});
