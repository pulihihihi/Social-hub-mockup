# Rejected Target Implementation Notes

## Implemented

- Added `PublishingRejected` page at `/publishing/rejected`.
- Added Publishing sidebar child `Rejected` after `Needs Approval`.
- Added route manifest entry and lazy route component.
- Reused the existing approval queue visual language from Needs Approval for parity.
- Connected tag filter options to the shared managed tag registry via `getUniqueManagedTags()`.
- Preserved Sprout's captured active tag: `Problemas en el Paraiso`.
- `Manage Workflows` navigates to `/settings/approval-workflows`.

## Files

- `src/pages/PublishingRejected/index.jsx`
- `src/app/routes/routeConfig.js`
- `src/app/layout/sidebarMenu.js`
- `tests/routes.test.js`
- `tests/sidebar-menu.test.js`
- `tests/routed-pages-migration.test.jsx`
- `LAYOUT-BLUEPRINT.md`

## Notes

- The implementation avoids account-specific Sprout toast state from the source capture.
- The page uses existing local shell and Ant Design tokens instead of copying Sprout branding assets.
