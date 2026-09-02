import { useState } from 'react';
import { bestEfficiency, efficiencyOf, sortEntries, type Entry, type EntryInput } from '../lib/entries';
import { EntryEditRow } from './EntryEditRow';
import { EntryRow } from './EntryRow';

type Props = {
  entries: readonly Entry[];
  onUpdate: (id: string, input: EntryInput) => boolean;
  onDelete: (id: string) => void;
};

export function EntryTable({ entries, onUpdate, onDelete }: Props) {
  // Only one row edits at a time; its id lives here so the table knows which
  // row to swap for an EntryEditRow.
  const [editingId, setEditingId] = useState<string | null>(null);

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
          {sorted.map((entry) =>
            entry.id === editingId ? (
              <EntryEditRow
                key={entry.id}
                entry={entry}
                onSave={(input) => {
                  const saved = onUpdate(entry.id, input);
                  if (saved) setEditingId(null);
                  return saved;
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <EntryRow
                key={entry.id}
                entry={entry}
                isBest={best !== null && efficiencyOf(entry) === best}
                actionsDisabled={editingId !== null}
                onStartEdit={() => setEditingId(entry.id)}
                onDelete={() => onDelete(entry.id)}
              />
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
