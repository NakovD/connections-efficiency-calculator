import { useState, type FormEvent } from 'react';
import { createEntry, validate, type Entry, type EntryInput, type FieldErrors } from '../lib/entries';
import { NAME_OPTIONS } from '../lib/nameOptions';

const EMPTY_INPUT: EntryInput = { name: '', connections: '', stat: '' };

type Props = {
  onAdd: (entry: Entry) => void;
};

export function EntryForm({ onAdd }: Props) {
  const [input, setInput] = useState<EntryInput>(EMPTY_INPUT);
  const [errors, setErrors] = useState<FieldErrors>({});

  function update(field: keyof EntryInput, value: string) {
    setInput((current) => ({ ...current, [field]: value }));
    // Clear the error as soon as the user starts fixing the field.
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const found = validate(input);
    if (found.connections || found.stat) {
      setErrors(found);
      return;
    }

    const entry = createEntry(input, Date.now());
    if (!entry) return;

    onAdd(entry);
    setInput(EMPTY_INPUT);
    setErrors({});
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit} noValidate>
      <div className="field field--wide">
        <label htmlFor="name">Name</label>
        <select id="name" value={input.name} onChange={(event) => update('name', event.target.value)}>
          <option value="">— Select —</option>
          {NAME_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <p className="hint">Optional</p>
      </div>

      <div className="field">
        <label htmlFor="connections">Connections</label>
        <input
          id="connections"
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={input.connections}
          placeholder="12"
          aria-invalid={errors.connections ? true : undefined}
          aria-describedby={errors.connections ? 'connections-error' : undefined}
          onChange={(event) => update('connections', event.target.value)}
        />
        {errors.connections && (
          <p className="hint hint--error" id="connections-error">
            {errors.connections}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="stat">Stat</label>
        <input
          id="stat"
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={input.stat}
          placeholder="48"
          aria-invalid={errors.stat ? true : undefined}
          aria-describedby={errors.stat ? 'stat-error' : undefined}
          onChange={(event) => update('stat', event.target.value)}
        />
        {errors.stat && (
          <p className="hint hint--error" id="stat-error">
            {errors.stat}
          </p>
        )}
      </div>

      <button type="submit" className="button button--primary">
        Add
      </button>
    </form>
  );
}
