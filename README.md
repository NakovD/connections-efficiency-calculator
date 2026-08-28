# Connections Efficiency Calculator

A tiny single-page calculator for comparing browser-game upgrades by how much stat
each spent "connection" buys you.

Enter the connections an upgrade costs and the stat it grants, and the table ranks
every entry by **stat per connection** — best value first.

## What it does

- Add entries with an optional name, a connections cost, and a stat gain.
- Efficiency is computed as `stat / connections`, shown with two decimals.
- The list is sorted by efficiency, highest first. Ties break towards the cheaper
  entry, then towards whichever was added first.
- Every row tied for the highest efficiency is highlighted and marked **Best value**.
- Rows can be deleted individually, or the whole list can be cleared at once.

## What it deliberately does not do

- **No persistence.** All state lives in React state only; reloading the page clears
  the list. There is no localStorage, no database, and no backend.
- **No game data.** It knows nothing about real prices, item tables, or any specific game.
- **No optimisation.** It is a row-by-row comparison, not a budget solver.
- **No accounts.**

## Requirements

Node.js 20 or newer.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (by default http://localhost:5173).

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Type-check and build for production into `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm test` | Run the unit tests once. |
| `npm run test:watch` | Run the tests in watch mode. |
| `npm run lint` | Lint the source with oxlint. |

## Input rules

Connections and stat are both **whole numbers greater than zero**. Decimals, zero and
negative values are rejected with an inline message. The name is optional; entries
without one show as *Unnamed*.

## Project structure

```
src/
  App.tsx                  Page layout and the in-memory entry list
  components/
    EntryForm.tsx          Input form and validation feedback
    EntryTable.tsx         Sorted results table
  lib/
    entries.ts             Pure logic: parsing, validation, sorting, formatting
    entries.test.ts        Unit tests for the above
```

The logic in `src/lib/entries.ts` is free of React so it can be tested directly.

## Tech stack

React 19, TypeScript, Vite, Vitest. No runtime dependencies beyond React.

## License

[MIT](LICENSE)
