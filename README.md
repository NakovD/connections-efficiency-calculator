# Connections Efficiency Calculator

**Live app:** https://nakovd.github.io/connections-efficiency-calculator/

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
- Rows can be edited in place — click **Edit**, change the fields, then **Save** (or
  **Cancel**). Enter saves, Escape cancels. Only one row edits at a time.
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
| `npm run build:standalone` | Build a single self-contained HTML file into `standalone/`. |
| `npm run preview` | Serve the production build locally. |
| `npm test` | Run the unit tests once. |
| `npm run test:watch` | Run the tests in watch mode. |
| `npm run lint` | Lint the source with oxlint. |

## Offline standalone build

For using the calculator without a dev server or an internet connection:

```bash
npm run build:standalone
```

This writes `standalone/connections-efficiency-calculator.html` — one file with the
JavaScript, CSS and favicon inlined. Double-click it and it opens in the browser.
It can be moved anywhere or copied to another machine on its own; no Node.js
installation is needed to run it.

Rerun the command after changing the source to refresh the file.

## Input rules

Connections and stat are both **whole numbers greater than zero**. Both fields group
digits by thousands as you type (e.g. `120000` displays as `120 000`); anything that
isn't a digit, including decimal points, is dropped as you type rather than
validated afterwards. Decimals, zero and negative values are rejected with an inline
message. Name is picked from a fixed
dropdown list and is optional; entries left without one show as *Unnamed*. To add a
new upgrade name to the dropdown, add it to `NAME_OPTIONS` in
[src/lib/nameOptions.ts](src/lib/nameOptions.ts).

## Project structure

```
src/
  App.tsx                  Page layout and the in-memory entry list
  components/
    EntryForm.tsx          Input form and validation feedback
    EntryTable.tsx         Sorted results table; tracks which row is being edited
    EntryRow.tsx           A results row in its normal, read-only display
    EntryEditRow.tsx       The same row swapped into edit mode
    NumericField.tsx       Whole-number input with thousands grouping, used by both
  lib/
    entries.ts             Pure logic: parsing, validation, sorting, formatting
    entries.test.ts        Unit tests for the above
    numberInput.ts         Digit grouping and caret-position helpers behind NumericField
    numberInput.test.ts    Unit tests for the above
```

The logic in `src/lib/entries.ts` is free of React so it can be tested directly.

## Tech stack

React 19, TypeScript, Vite, Vitest. No runtime dependencies beyond React.

## License

[MIT](LICENSE)
