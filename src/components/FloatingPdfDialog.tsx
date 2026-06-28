import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

interface FloatingPdfDialogProps {
  children: ReactNode;
  onClose: () => void;
  selectedLabel: string;
  title: string;
}

interface DialogPosition {
  left: number;
  top: number;
}

const viewportMargin = 16;

function getInitialPosition(): DialogPosition {
  const width = Math.min(720, window.innerWidth - viewportMargin * 2);
  const left = Math.max(viewportMargin, window.innerWidth - width - 28);

  return {
    left,
    top: Math.max(viewportMargin, Math.min(72, window.innerHeight - 360)),
  };
}

function clampPosition(left: number, top: number, element: HTMLElement | null): DialogPosition {
  const width = element?.offsetWidth ?? 720;
  const height = element?.offsetHeight ?? 640;
  const maxLeft = Math.max(viewportMargin, window.innerWidth - width - viewportMargin);
  const maxTop = Math.max(viewportMargin, window.innerHeight - height - viewportMargin);

  return {
    left: Math.min(Math.max(viewportMargin, left), maxLeft),
    top: Math.min(Math.max(viewportMargin, top), maxTop),
  };
}

export function FloatingPdfDialog({
  children,
  onClose,
  selectedLabel,
  title,
}: FloatingPdfDialogProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<{ pointerX: number; pointerY: number; left: number; top: number }>();
  const [position, setPosition] = useState<DialogPosition>(() => getInitialPosition());

  const dialogStyle = useMemo(
    () => ({
      left: position.left,
      top: position.top,
    }),
    [position.left, position.top],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleResize = () => {
      setPosition((current) => clampPosition(current.left, current.top, dialogRef.current));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [onClose]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button != null && event.button !== 0) {
      return;
    }

    dragStartRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      left: position.left,
      top: position.top,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const dragStart = dragStartRef.current;
    if (!dragStart) {
      return;
    }

    const nextLeft = dragStart.left + event.clientX - dragStart.pointerX;
    const nextTop = dragStart.top + event.clientY - dragStart.pointerY;
    setPosition(clampPosition(nextLeft, nextTop, dialogRef.current));
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStartRef.current = undefined;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  return (
    <section
      aria-label={title}
      className="pdf-floating-dialog"
      ref={dialogRef}
      role="dialog"
      style={dialogStyle}
    >
      <div
        className="pdf-floating-titlebar"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="pdf-floating-title">
          <h2>{title}</h2>
          <p>{selectedLabel}</p>
        </div>
        <button
          aria-label="关闭 PDF 预览"
          className="icon-button"
          onClick={onClose}
          onPointerDown={(event) => event.stopPropagation()}
          title="关闭"
          type="button"
        >
          ×
        </button>
      </div>
      <div className="pdf-floating-content">{children}</div>
    </section>
  );
}
