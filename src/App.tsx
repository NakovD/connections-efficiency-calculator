import { useState } from 'react';
import { EntryForm } from './components/EntryForm';
import { EntryTable } from './components/EntryTable';
import type { Entry } from './lib/entries';
import './App.css';

export default function App() {
  // In-memory only, by design: a reload clears the list.
  const [entries, setEntries] = useState<Entry[]>([]);

  function handleAdd(entry: Entry) {
    setEntries((current) => [...current, entry]);
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
        <EntryTable entries={entries} onDelete={handleDelete} />
      </section>
    </main>
  );
}
