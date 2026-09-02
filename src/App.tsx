import { useState } from 'react';
import { EntryForm } from './components/EntryForm';
import { EntryTable } from './components/EntryTable';
import { updateEntry, type Entry, type EntryInput } from './lib/entries';
import './App.css';

export default function App() {
  // In-memory only, by design: a reload clears the list.
  const [entries, setEntries] = useState<Entry[]>([]);

  function handleAdd(entry: Entry) {
    setEntries((current) => [...current, entry]);
  }

  /** Returns whether the edit validated and was applied, so the row knows whether to close. */
  function handleUpdate(id: string, input: EntryInput): boolean {
    const target = entries.find((entry) => entry.id === id);
    if (!target) return false;

    const updated = updateEntry(target, input);
    if (!updated) return false;

    setEntries((current) => current.map((entry) => (entry.id === id ? updated : entry)));
    return true;
  }

  function handleDelete(id: string) {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  }

  function handleClearAll() {
    if (window.confirm('Delete all entries?')) {
      setEntries([]);
    }
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>Connections Efficiency Calculator</h1>
        <p className="subtitle">
          Compare upgrades by how much stat each connection buys you. Nothing is saved —
          reloading the page clears the list.
        </p>
      </header>

      <section className="panel" aria-label="Add an entry">
        <EntryForm onAdd={handleAdd} />
      </section>

      <section className="panel" aria-label="Results">
        <div className="results-header">
          <h2>Results</h2>
          {entries.length > 0 && (
            <button type="button" className="button button--danger" onClick={handleClearAll}>
              Clear all
            </button>
          )}
        </div>
        <EntryTable entries={entries} onUpdate={handleUpdate} onDelete={handleDelete} />
      </section>
    </main>
  );
}
