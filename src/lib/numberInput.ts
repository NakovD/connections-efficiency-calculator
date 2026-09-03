/**
 * Pure helpers behind the grouped-digit number inputs (Connections, Stat).
 * Kept separate from entries.ts, which only knows about already-parsed values.
 */

/** Strips everything but digits — this is what keeps decimals, minus signs, etc. out. */
export function sanitizeDigits(raw: string): string {
  return raw.replace(/\D/g, '');
}

/** Groups a digit string into thousands with a space, e.g. "1000000" -> "1 000 000". */
export function groupDigits(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/** How many digit characters appear in `text` before `index`. */
function digitsBefore(text: string, index: number): number {
  let count = 0;
  for (let i = 0; i < index && i < text.length; i++) {
    if (/\d/.test(text[i])) count++;
  }
  return count;
}

/**
 * Where the caret should land in `formatted` so it still sits after the same
 * digit it followed before formatting ran (grouping spaces shift everything
 * after the first thousands boundary).
 */
export function caretIndexForDigitCount(formatted: string, digitCount: number): number {
  if (digitCount <= 0) return 0;

  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      seen++;
      if (seen === digitCount) return i + 1;
    }
  }
  return formatted.length;
}

/**
 * Given the raw (unformatted) field value the browser just produced and where
 * the caret was in it, returns the grouped display value and the caret
 * position to restore in that new value.
 */
export function reformatNumericInput(
  rawInputValue: string,
  caretBefore: number,
): { digits: string; formatted: string; caret: number } {
  const digitCount = digitsBefore(rawInputValue, caretBefore);
  const digits = sanitizeDigits(rawInputValue);
  const formatted = groupDigits(digits);
  return { digits, formatted, caret: caretIndexForDigitCount(formatted, digitCount) };
}
