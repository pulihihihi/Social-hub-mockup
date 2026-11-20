# Rejected Target QA Report

## Commands

- `npm run build` passed.
- `npm test -- tests\routes.test.js tests\sidebar-menu.test.js tests\routed-pages-migration.test.jsx`:
  - `routes.test.js` passed.
  - `sidebar-menu.test.js` passed.
  - `routed-pages-migration.test.jsx` has unrelated existing failures for several non-Rejected pages in jsdom.
- `npm test -- tests\routed-pages-migration.test.jsx -t "publishing/rejected"` passed.

## Browser QA

Target URL: `http://127.0.0.1:5173/publishing/rejected`

Captured:

- `target/screenshots/rejected-desktop.png`
- `target/screenshots/rejected-tags-menu.png`
- `target/screenshots/rejected-clear-all.png`
- `target/screenshots/rejected-filters-hidden.png`
- `target/screenshots/rejected-manage-workflows.png`
- `target/screenshots/rejected-mobile.png`

Verified:

- Page loads and title is `Rejected - Social Hub`.
- Publishing sidebar includes and highlights `Rejected`.
- Filter row shows My Approvals, Workflows, Tags, Authors, Post Types, and Clear All.
- Tags summary starts as `Problemas en el Paraiso`.
- Empty state text matches source copy.
- Desktop has no horizontal overflow.
- Tags popover opens.
- Clear All updates the filter state.
- Filters button hides the filter row.
- Manage Workflows navigates to Settings Approval Workflows.

## Known QA Note

- The mobile CDP capture shows the existing app shell navigation drawer open. Page content behind the drawer still reports no horizontal overflow. This appears to be shared shell behavior rather than a Rejected page regression.
