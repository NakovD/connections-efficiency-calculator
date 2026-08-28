export type Entry = {
  id: string;
  /** Free-text label. May be empty; the table renders a placeholder instead. */
  name: string;
  /** Connections spent. Always a positive integer. */
  connections: number;
  /** Stat gained. Always a positive integer. */
  stat: number;
  /** Insertion counter, used as the final tie-breaker so sorting stays stable. */
  addedAt: number;
};

export type EntryInput = {
  name: string;
  connections: string;
  stat: string;
};

export type FieldErrors = Partial<Record<'connections' | 'stat', string>>;

/** Stat gained per single connection spent. Higher is better. */
export function efficiencyOf(entry: Pick<Entry, 'connections' | 'stat'>): number {
  return entry.stat / entry.connections;
}

/**
 * Both fields are whole numbers greater than zero: connections are indivisible,
 * and an upgrade that grants no stat is not worth comparing.
 */
function parsePositiveInteger(raw: string): number | null {
  const trimmed = raw.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const value = Number(trimmed);
  return Number.isSafeInteger(value) && value > 0 ? value : null;
}

export function validate(input: EntryInput): FieldErrors {
  const errors: FieldErrors = {};
  if (parsePositiveInteger(input.connections) === null) {
    errors.connections = 'Enter a whole number greater than 0.';
  }
  if (parsePositiveInteger(input.stat) === null) {
    errors.stat = 'Enter a whole number greater than 0.';
  }
  return errors;
}

/** Returns the new entry, or null when the input does not validate. */
export function createEntry(input: EntryInput, addedAt: number): Entry | null {
  const connections = parsePositiveInteger(input.connections);
  const stat = parsePositiveInteger(input.stat);
  if (connections === null || stat === null) return null;

  return {
    id: `${addedAt}-${Math.random().toString(36).slice(2, 8)}`,
    name: input.name.trim(),
    connections,
    stat,
    addedAt,
  };
}

/**
 * Best value first. Ties break towards the cheaper entry (fewer connections),
 * then towards whichever was added first.
 */
export function sortEntries(entries: readonly Entry[]): Entry[] {
  return [...entries].sort((a, b) => {
    const byEfficiency = efficiencyOf(b) - efficiencyOf(a);
    if (byEfficiency !== 0) return byEfficiency;

    const byCost = a.connections - b.connections;
    if (byCost !== 0) return byCost;

    return a.addedAt - b.addedAt;
  });
}

/** The highest efficiency in the list, or null when there is nothing to compare. */
export function bestEfficiency(entries: readonly Entry[]): number | null {
  if (entries.length === 0) return null;
  return Math.max(...entries.map(efficiencyOf));
}

const efficiencyFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatEfficiency(value: number): string {
  return efficiencyFormatter.format(value);
}

const integerFormatter = new Intl.NumberFormat('en-US');

export function formatInteger(value: number): string {
  return integerFormatter.format(value);
}
