# Settings Tag Management Implementation Notes

Target URL: `http://localhost:5173/settings/tag-management`

## Implemented

- Added `SettingsTagManagement` page under Settings navigation.
- Added shared tag registry in `src/data/tagManagement.js`.
- Updated Publishing Calendar tag filter to use `getCalendarTagOptions(CALENDAR_POSTS)` from the shared registry.
- Implemented Sprout-like two-panel layout:
  - collection list
  - selected collection tag list
  - group scope select
  - search
  - Help / Export actions
  - bulk selected bar with Move / Archive
  - row overflow menus
  - Add Collection and Add Tag dialogs
- Tag rows show calendar usage badges for tags used by existing Calendar posts.

## Local Data Scope

This batch uses local state and mock data only. It does not persist collections/tags to an API yet.
