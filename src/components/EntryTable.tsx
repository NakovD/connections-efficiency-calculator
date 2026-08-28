import {
  bestEfficiency,
  efficiencyOf,
  formatEfficiency,
  formatInteger,
  sortEntries,
  type Entry,
} from '../lib/entries';

type Props = {
  entries: readonly Entry[];
  onDelete: (id: string) => void;
};

export function EntryTable({ entries, onDelete }: Props) {
  if (entries.length === 0) {
    return (
      <p className="empty-state">
        No entries yet — add your first calculation above.
      </p>
    );
  }

  const sorted = sortEntries(entries);
  const best = bestEfficiency(entries);

  return (
    <div className="table-wrapper">
      <table className="entry-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col" className="numeric">Connections</th>
            <th scope="col" className="numeric">Stat</th>
            <th scope="col" className="numeric">Efficiency (stat / connection)</th>
            <th scope="col"><span className="visually-hidden">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((entry) => {
            const efficiency = efficiencyOf(entry);
            const isBest = efficiency === best;

            return (
              <tr key={entry.id} className={isBest ? 'is-best' : undefined}>
                <td>
                  {entry.name || <span className="unnamed">Unnamed</span>}
                  {isBest && <span className="badge">Best value</span>}
                </td>
                <td className="numeric">{formatInteger(entry.connections)}</td>
                <td className="numeric">{formatInteger(entry.stat)}</td>
                <td className="numeric efficiency">{formatEfficiency(efficiency)}</td>
                <td>
                  <button
                    type="button"
                    className="button button--ghost"
                    onClick={() => onDelete(entry.id)}
                    aria-label={`Delete ${entry.name || 'unnamed entry'}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
