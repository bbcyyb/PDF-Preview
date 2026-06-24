import type { OcrField } from '../domain/ocrTypes';

interface OcrFieldFormProps {
  fields: OcrField[];
  selectedFieldId: string | null;
  onSelectField: (fieldId: string) => void;
}

export function OcrFieldForm({ fields, selectedFieldId, onSelectField }: OcrFieldFormProps) {
  if (fields.length === 0) {
    return <p className="empty-state">未加载 OCR 字段。</p>;
  }

  return (
    <form className="ocr-form">
      {fields.map((field) => {
        const selected = field.id === selectedFieldId;

        return (
          <button
            aria-pressed={selected}
            className={selected ? 'field-row selected' : 'field-row'}
            key={field.id}
            onClick={() => onSelectField(field.id)}
            onFocus={() => onSelectField(field.id)}
            type="button"
          >
            <span className="field-label">{field.label}</span>
            <span className="field-value">{field.value}</span>
          </button>
        );
      })}
    </form>
  );
}
