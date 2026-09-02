import { useLayoutEffect, useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { groupDigits, reformatNumericInput } from '../lib/numberInput';

type Props = {
  id: string;
  /** Raw digits only, no separators — e.g. "120000". */
  value: string;
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
  onChange: (digits: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
};

/**
 * A whole-numbers-only text input: digits are grouped by thousands as the
 * user types ("120000" -> "120 000"), anything else (decimal points, minus
 * signs, letters) is dropped, and there's no native spinner to click through.
 */
export function NumericField({ id, value, placeholder, invalid, describedBy, onChange, onKeyDown }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCaret = useRef<number | null>(null);

  // Runs after the DOM value updates but before the browser paints, so the
  // caret reset never becomes visible.
  useLayoutEffect(() => {
    if (pendingCaret.current !== null && inputRef.current) {
      inputRef.current.setSelectionRange(pendingCaret.current, pendingCaret.current);
      pendingCaret.current = null;
    }
  });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const caretBefore = event.target.selectionStart ?? event.target.value.length;
    const { digits, caret } = reformatNumericInput(event.target.value, caretBefore);
    pendingCaret.current = caret;
    onChange(digits);
  }

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={groupDigits(value)}
      placeholder={placeholder}
      aria-invalid={invalid ? true : undefined}
      aria-describedby={describedBy}
      onChange={handleChange}
      onKeyDown={onKeyDown}
    />
  );
}
