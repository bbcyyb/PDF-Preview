import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FloatingPdfDialog } from './FloatingPdfDialog';

function renderDialog(onClose = vi.fn()) {
  render(
    <FloatingPdfDialog onClose={onClose} selectedLabel="当前字段：文档编号" title="PDF 预览">
      <p>PDF content</p>
    </FloatingPdfDialog>,
  );

  return onClose;
}

function dispatchPointerEvent(
  element: Element,
  type: 'pointerdown' | 'pointermove' | 'pointerup',
  options: { button?: number; clientX?: number; clientY?: number; pointerId?: number } = {},
) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    button: { value: options.button ?? 0 },
    clientX: { value: options.clientX ?? 0 },
    clientY: { value: options.clientY ?? 0 },
    pointerId: { value: options.pointerId ?? 1 },
  });
  fireEvent(element, event);
}

describe('FloatingPdfDialog', () => {
  it('renders a non-modal floating PDF panel', () => {
    renderDialog();

    const dialog = screen.getByRole('dialog', { name: 'PDF 预览' });
    expect(dialog).toHaveClass('pdf-floating-dialog');
    expect(screen.getByText('当前字段：文档编号')).toBeInTheDocument();
    expect(screen.getByText('PDF content')).toBeInTheDocument();
  });

  it('closes from the close button and Escape key', async () => {
    const user = userEvent.setup();
    const onClose = renderDialog();

    await user.click(screen.getByRole('button', { name: '关闭 PDF 预览' }));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('moves when dragging the titlebar', () => {
    renderDialog();

    const dialog = screen.getByRole('dialog', { name: 'PDF 预览' });
    const titlebar = screen.getByText('PDF 预览').closest('.pdf-floating-titlebar');
    expect(titlebar).not.toBeNull();

    const initialLeft = dialog.style.left;
    const initialTop = dialog.style.top;

    dispatchPointerEvent(titlebar!, 'pointerdown', {
      button: 0,
      clientX: 20,
      clientY: 20,
      pointerId: 1,
    });
    dispatchPointerEvent(titlebar!, 'pointermove', { clientX: 80, clientY: 90, pointerId: 1 });
    dispatchPointerEvent(titlebar!, 'pointerup', { pointerId: 1 });

    expect(dialog.style.left).not.toBe(initialLeft);
    expect(dialog.style.top).not.toBe(initialTop);
  });
});
