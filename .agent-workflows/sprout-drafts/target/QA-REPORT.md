# Publishing Drafts Target QA

Target URL: `http://localhost:5173/publishing/drafts`

## Commands

- `npm run build` passed.
- `npm test -- tests/routes.test.js tests/sidebar-menu.test.js tests/routed-pages-migration.test.jsx` partially passed: route/sidebar tests passed; existing routed-page cases for older pages still timeout in the test environment.
- `npm test -- tests/routed-pages-migration.test.jsx -t "publishing/drafts"` passed.

## Browser Captures

- 1920x900 baseline: `.agent-workflows/sprout-drafts/target/screenshots/target-drafts-baseline.png`
- 1366x768 baseline: `.agent-workflows/sprout-drafts/target/screenshots/target-drafts-desktop-1366.png`
- 390x844 mobile capture: `.agent-workflows/sprout-drafts/target/screenshots/target-drafts-mobile.png`
- Interactive scan: `.agent-workflows/sprout-drafts/target/interactive-scan`

## Results

- Desktop captures show no horizontal overflow.
- Drafts route renders in the app shell and sidebar highlights `Drafts` under `Publishing`.
- Filter bar, disabled `Clear All`, empty-state copy, CTA, and draft-card visual are present.
- `Start a draft` routes to `/publishing/new-post`.

## Notes

- The generic interactive scanner clicked the app sidebar collapse control before reaching filter cells, so several filter-cell clicks are reported as `element-not-found`. Manual component behavior is implemented with Ant Popover menus and should be covered by a targeted scanner in the next pass.
- Mobile capture inherits the current app shell behavior where the desktop sidebar remains visible; this is not specific to the Drafts page.
