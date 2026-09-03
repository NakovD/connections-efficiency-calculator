import { efficiencyOf, formatEfficiency, formatInteger, type Entry } from '../lib/entries';

type Props = {
  entry: Entry;
  isBest: boolean;
  /** Another row is being edited, so this row's actions are held off until it's done. */
  actionsDisabled: boolean;
  onStartEdit: () => void;
  onDelete: () => void;
};

/** A results row in its normal, read-only display mode. */
export function EntryRow({ entry, isBest, actionsDisabled, onStartEdit, onDelete }: Props) {
  const efficiency = efficiencyOf(entry);

  return (
    <tr className={isBest ? 'is-best' : undefined}>
      <td>
        {entry.name || <span className="unnamed">Unnamed</span>}
        {isBest && <span className="badge">Best value</span>}
      </td>
      <td className="numeric">{formatInteger(entry.connections)}</td>
      <td className="numeric">{formatInteger(entry.stat)}</td>
      <td className="numeric efficiency">{formatEfficiency(efficiency)}</td>
      <td className="row-actions">
        <button
          type="button"
          className="button button--ghost"
          onClick={onStartEdit}
          disabled={actionsDisabled}
          aria-label={`Edit ${entry.name || 'unnamed entry'}`}
        >
          Edit
        </button>
        <button
          type="button"
          className="button button--ghost"
          onClick={onDelete}
          disabled={actionsDisabled}
          aria-label={`Delete ${entry.name || 'unnamed entry'}`}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
