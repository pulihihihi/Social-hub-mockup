# Sprout Tag Management Gap Scan

## Scan Method

Source was captured at 1920x900 for baseline plus safe interactions: group scope dropdown, add collection, add tag/empty state, collection action affordances, tag action affordances, selected tag state, and `Campaigns` collection selection. Target was captured at 1920x900 and 390x844 after implementation.

## Findings

| Severity | Area | Source Behavior | Target Behavior | Status |
|---|---|---|---|---|
| Match | Settings route | `Tag Management` under Settings > Global Features. | `Tag Management` under local Settings menu. | Implemented with shell adaptation. |
| Match | Header controls | Group select, search, Help, Export. | Group select, search, Help, Export. | Implemented. |
| Match | Two-panel layout | Collections left, tags right. | Collections left, tags right. | Implemented. |
| Match | Add collection | Opens form with icon, collection name, reset/cancel/create. | Opens local fixed dialog with same core fields. | Implemented. |
| Match | Bulk select | Selecting a tag enables Move/Archive. | Selecting a tag updates selected count and enables Move/Archive. | Implemented. |
| Medium | Exact tenant data | Sprout has tenant-specific collections/tags. | Target uses shared mock registry seeded from Sprout + Calendar tags. | Accepted until API exists. |
| Medium | Persistence | Sprout persists tag management changes. | Target updates local state only. | Needs backend/store later. |
| Low | Source action menus | Source overflow menu did not reliably open in coordinate capture. | Target implements edit/move/archive/delete menu locally. | Good enough for first parity batch. |

## Calendar Link Verification

- Calendar tags now come from `src/data/tagManagement.js` via `getCalendarTagOptions(CALENDAR_POSTS)`.
- Tag Management shows calendar usage badges from `getTagUsageByName(CALENDAR_POSTS)`.
- This keeps the existing Calendar tags and the Settings Tag Management page aligned on one source of tag metadata.

## Next Fix Batch

1. Add persistent tag store/API integration when available.
2. Implement exact Move dialog once Sprout move modal is captured cleanly.
3. Add edit/rename behavior for existing collection and tag rows.
4. Add archived filter behavior matching Sprout if archived tag data becomes available.
