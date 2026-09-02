import { useState, type KeyboardEvent } from 'react';
import { validate, type Entry, type EntryInput, type FieldErrors } from '../lib/entries';
import { NAME_OPTIONS } from '../lib/nameOptions';
import { NumericField } from './NumericField';

type Props = {
  entry: Entry;
  onSave: (input: EntryInput) => boolean;
  onCancel: () => void;
};

function toInput(entry: Entry): EntryInput {
  return { name: entry.name, connections: String(entry.connections), stat: String(entry.stat) };
}

/**
 * A results row swapped into edit mode. Mounted only while this row is being
 * edited (see EntryTable), so its local state always starts fresh from the
 * current entry and never leaks into the next edit.
 */
export function EntryEditRow({ entry, onSave, onCancel }: Props) {
  const [input, setInput] = useState<EntryInput>(() => toInput(entry));
  const [errors, setErrors] = useState<FieldErrors>({});

  function update(field: keyof EntryInput, value: string) {
    setInput((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSave() {
    const found = validate(input);
    if (found.connections || found.stat) {
      setErrors(found);
      return;
    }
    onSave(input);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSave();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();
    }
  }

  return (
    <tr className="is-editing">
      <td>
        <select
          aria-label="Name"
          value={input.name}
          onChange={(event) => update('name', event.target.value)}
          onKeyDown={handleKeyDown}
        >
          <option value="">— Select —</option>
          {NAME_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </td>
      <td className="numeric">
        <NumericField
          id={`edit-connections-${entry.id}`}
          value={input.connections}
          invalid={Boolean(errors.connections)}
          describedBy={errors.connections ? `edit-connections-error-${entry.id}` : undefined}
          onChange={(digits) => update('connections', digits)}
          onKeyDown={handleKeyDown}
        />
        {errors.connections && (
          <p className="hint hint--error" id={`edit-connections-error-${entry.id}`}>
            {errors.connections}
          </p>
        )}
      </td>
      <td className="numeric">
        <NumericField
          id={`edit-stat-${entry.id}`}
          value={input.stat}
          invalid={Boolean(errors.stat)}
          describedBy={errors.stat ? `edit-stat-error-${entry.id}` : undefined}
          onChange={(digits) => update('stat', digits)}
          onKeyDown={handleKeyDown}
        />
        {errors.stat && (
          <p className="hint hint--error" id={`edit-stat-error-${entry.id}`}>
            {errors.stat}
          </p>
        )}
      </td>
      <td className="numeric efficiency">—</td>
      <td className="row-actions">
        <button type="button" className="button button--primary" onClick={handleSave}>
          Save
        </button>
        <button type="button" className="button button--ghost" onClick={onCancel}>
          Cancel
        </button>
      </td>
    </tr>
  );
}
