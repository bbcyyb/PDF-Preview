import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { sampleFields } from '../fixtures/sampleFixture';
import { OcrFieldForm } from './OcrFieldForm';

describe('OcrFieldForm', () => {
  it('renders an empty state when no fields are loaded', () => {
    render(<OcrFieldForm fields={[]} selectedFieldId={null} onSelectField={() => undefined} />);
    expect(screen.getByText('未加载 OCR 字段。')).toBeInTheDocument();
  });

  it('renders OCR field labels and values', () => {
    render(
      <OcrFieldForm
        fields={sampleFields}
        selectedFieldId="document-number"
        onSelectField={() => undefined}
      />,
    );

    expect(screen.getByText('文档编号')).toBeInTheDocument();
    expect(screen.getByText('DOC-2026-001')).toBeInTheDocument();
  });

  it('applies selected state and handles selection changes', async () => {
    const user = userEvent.setup();
    const onSelectField = vi.fn();

    render(
      <OcrFieldForm
        fields={sampleFields}
        selectedFieldId="document-number"
        onSelectField={onSelectField}
      />,
    );

    expect(screen.getByRole('button', { name: /文档编号 DOC-2026-001/ })).toHaveClass('selected');

    await user.click(screen.getByRole('button', { name: /金额 CNY 12,800.00/ }));
    expect(onSelectField).toHaveBeenCalledWith('amount');
  });
});
