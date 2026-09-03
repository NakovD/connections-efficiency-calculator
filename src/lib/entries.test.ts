import { describe, expect, it } from 'vitest';
import {
  bestEfficiency,
  createEntry,
  efficiencyOf,
  formatEfficiency,
  formatInteger,
  sortEntries,
  updateEntry,
  validate,
  type Entry,
} from './entries';

function entry(partial: Partial<Entry> & Pick<Entry, 'connections' | 'stat'>): Entry {
  return {
    id: partial.id ?? `${partial.connections}-${partial.stat}`,
    name: partial.name ?? '',
    addedAt: partial.addedAt ?? 0,
    connections: partial.connections,
    stat: partial.stat,
  };
}

describe('efficiencyOf', () => {
  it('is stat per connection', () => {
    expect(efficiencyOf({ connections: 12, stat: 48 })).toBe(4);
    expect(efficiencyOf({ connections: 20, stat: 50 })).toBe(2.5);
  });
});

describe('validate', () => {
  it('accepts positive whole numbers', () => {
    expect(validate({ name: '', connections: '3', stat: '7' })).toEqual({});
  });

  it('rejects zero, negatives, decimals and junk', () => {
    for (const bad of ['0', '-4', '2.5', '', '   ', 'abc', '1e3']) {
      const errors = validate({ name: '', connections: bad, stat: bad });
      expect(errors.connections, `connections: ${bad}`).toBeDefined();
      expect(errors.stat, `stat: ${bad}`).toBeDefined();
    }
  });

  it('reports each field independently', () => {
    expect(validate({ name: '', connections: '5', stat: '0' })).toEqual({
      stat: expect.any(String),
    });
  });
});

describe('createEntry', () => {
  it('parses numbers and trims the name', () => {
    const created = createEntry({ name: '  Chemist L3  ', connections: '12', stat: '48' }, 1);
    expect(created).toMatchObject({ name: 'Chemist L3', connections: 12, stat: 48, addedAt: 1 });
  });

  it('returns null for invalid input', () => {
    expect(createEntry({ name: 'x', connections: '0', stat: '5' }, 1)).toBeNull();
  });
});

describe('updateEntry', () => {
  it('replaces the editable fields but keeps id and insertion order', () => {
    const original = entry({ id: 'keep-me', connections: 12, stat: 48, addedAt: 7, name: 'Old' });
    const updated = updateEntry(original, { name: 'New', connections: '20', stat: '50' });
    expect(updated).toEqual({ id: 'keep-me', addedAt: 7, name: 'New', connections: 20, stat: 50 });
  });

  it('returns null for invalid input and leaves the original entry alone', () => {
    const original = entry({ connections: 12, stat: 48 });
    expect(updateEntry(original, { name: '', connections: '0', stat: '5' })).toBeNull();
  });
});

describe('sortEntries', () => {
  it('orders by efficiency, highest first', () => {
    const sorted = sortEntries([
      entry({ id: 'low', connections: 20, stat: 50 }),
      entry({ id: 'high', connections: 12, stat: 48 }),
      entry({ id: 'mid', connections: 10, stat: 30 }),
    ]);
    expect(sorted.map((e) => e.id)).toEqual(['high', 'mid', 'low']);
  });

  it('breaks ties by fewer connections, then by insertion order', () => {
    const sorted = sortEntries([
      entry({ id: 'expensive', connections: 10, stat: 20, addedAt: 0 }),
      entry({ id: 'cheap-second', connections: 5, stat: 10, addedAt: 2 }),
      entry({ id: 'cheap-first', connections: 5, stat: 10, addedAt: 1 }),
    ]);
    expect(sorted.map((e) => e.id)).toEqual(['cheap-first', 'cheap-second', 'expensive']);
  });

  it('does not mutate the input', () => {
    const input = [entry({ id: 'a', connections: 1, stat: 1 }), entry({ id: 'b', connections: 1, stat: 9 })];
    sortEntries(input);
    expect(input.map((e) => e.id)).toEqual(['a', 'b']);
  });
});

describe('bestEfficiency', () => {
  it('returns null for an empty list', () => {
    expect(bestEfficiency([])).toBeNull();
  });

  it('returns the maximum, which may be shared by several entries', () => {
    const entries = [
      entry({ connections: 5, stat: 10 }),
      entry({ connections: 10, stat: 20 }),
      entry({ connections: 4, stat: 4 }),
    ];
    const best = bestEfficiency(entries);
    expect(best).toBe(2);
    expect(entries.filter((e) => efficiencyOf(e) === best)).toHaveLength(2);
  });
});

describe('formatEfficiency', () => {
  it('always shows two decimals', () => {
    expect(formatEfficiency(4)).toBe('4.00');
    expect(formatEfficiency(1 / 3)).toBe('0.33');
    expect(formatEfficiency(1234.5)).toBe('1,234.50');
  });
});

describe('formatInteger', () => {
  it('groups by thousands with a space, matching the entry form inputs', () => {
    expect(formatInteger(48)).toBe('48');
    expect(formatInteger(120000)).toBe('120 000');
    expect(formatInteger(1000000)).toBe('1 000 000');
  });
});
