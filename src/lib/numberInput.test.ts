import { describe, expect, it } from 'vitest';
import { caretIndexForDigitCount, groupDigits, reformatNumericInput, sanitizeDigits } from './numberInput';

describe('sanitizeDigits', () => {
  it('keeps only digits', () => {
    expect(sanitizeDigits('120000')).toBe('120000');
    expect(sanitizeDigits('1.2')).toBe('12');
    expect(sanitizeDigits('1,2')).toBe('12');
    expect(sanitizeDigits('-5')).toBe('5');
    expect(sanitizeDigits('1e3')).toBe('13');
    expect(sanitizeDigits('')).toBe('');
  });
});

describe('groupDigits', () => {
  it('groups by thousands with a space', () => {
    expect(groupDigits('')).toBe('');
    expect(groupDigits('5')).toBe('5');
    expect(groupDigits('120')).toBe('120');
    expect(groupDigits('1200')).toBe('1 200');
    expect(groupDigits('120000')).toBe('120 000');
    expect(groupDigits('1000000')).toBe('1 000 000');
  });
});

describe('caretIndexForDigitCount', () => {
  it('places the caret after the nth digit, accounting for separators', () => {
    // "120 000", want the caret after the 2nd digit ("12|0 000").
    expect(caretIndexForDigitCount('120 000', 2)).toBe(2);
    // After the 4th digit, past the separator ("120 0|00").
    expect(caretIndexForDigitCount('120 000', 4)).toBe(5);
    // Zero digits typed yet: caret at the very start.
    expect(caretIndexForDigitCount('120 000', 0)).toBe(0);
    // More digits requested than exist: caret goes to the end.
    expect(caretIndexForDigitCount('120', 9)).toBe(3);
  });
});

describe('reformatNumericInput', () => {
  it('formats and keeps the caret glued to the same digit while typing in the middle', () => {
    // User had "120000" with caret after "120" (index 3) and types "5" -> "1205000".
    const result = reformatNumericInput('1205000', 4);
    expect(result.digits).toBe('1205000');
    expect(result.formatted).toBe('1 205 000');
    // 4 digits precede the caret ("1205"); that lands just before the next group's space.
    expect(result.caret).toBe(5);
  });

  it('strips a decimal point typed by the user instead of accepting it', () => {
    const result = reformatNumericInput('1.2', 3);
    expect(result.digits).toBe('12');
    expect(result.formatted).toBe('12');
  });
});
