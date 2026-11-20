# Settings Tag Management Target QA

Target URL: `http://localhost:5173/settings/tag-management`

## Commands

- `npm run build` passed.
- `npm test -- tests/routes.test.js tests/sidebar-menu.test.js` passed.
- `npm test -- tests/routed-pages-migration.test.jsx -t "publishing/calendar|settings/tag-management"` passed.
- `git diff --check` passed, with existing line-ending warnings only.

## Browser Captures

- Source baseline: `.agent-workflows/sprout-tag-management/source/screenshots/tag-management-baseline.png`
- Source group dropdown: `.agent-workflows/sprout-tag-management/source/screenshots/tag-management-all-tags-dropdown.png`
- Source add collection: `.agent-workflows/sprout-tag-management/source/screenshots/tag-management-add-collection.png`
- Source campaigns collection: `.agent-workflows/sprout-tag-management/source/screenshots/tag-management-campaigns-collection.png`
- Target baseline: `.agent-workflows/sprout-tag-management/target/screenshots/target-tag-management-baseline.png`
- Target add collection: `.agent-workflows/sprout-tag-management/target/screenshots/target-tag-management-add-collection.png`
- Target add tag: `.agent-workflows/sprout-tag-management/target/screenshots/target-tag-management-add-tag.png`
- Target selected tag: `.agent-workflows/sprout-tag-management/target/screenshots/target-tag-management-one-selected.png`
- Target mobile: `.agent-workflows/sprout-tag-management/target/screenshots/target-tag-management-mobile.png`

## Results

- Route renders under `Settings > Tag Management`.
- Page-level layout matches Sprout's core structure: header select/search/actions, selected bulk bar, collection panel, tag panel.
- Existing Calendar tags are linked through shared registry and show calendar usage badges.
- Calendar route still renders after moving tag options to shared registry.
- Add Collection and Add Tag dialogs are real forms with disabled submit until required text is entered.
- Selecting a tag updates the bulk count and enables Move / Archive.

## Notes

- The local shell adapts to Social Hub's Settings sidebar rather than Sprout's global settings rail.
- Tag move/archive/create are local UI state only until a persistence layer exists.
