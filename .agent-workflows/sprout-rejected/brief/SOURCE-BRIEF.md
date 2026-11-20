# Sprout Rejected Source Brief

## Source

- URL: `https://app.sproutsocial.com/publishing/rejection/`
- Viewport: 1920 x 900
- Captured states:
  - Baseline: `source/screenshots/rejected-baseline.png`
  - Filters hidden: `source/screenshots/rejected-filters-hidden.png`
  - My Approvals menu: `source/screenshots/rejected-my-approvals-menu.png`
  - Tags menu: `source/screenshots/rejected-tags-menu.png`
  - Clear All state: `source/screenshots/rejected-clear-all.png`

## Layout Inventory

- Publishing shell with left navigation.
- Page title: `Rejected`.
- Header actions, left to right: `Filters`, `Manage Workflows`, `Help`.
- Filter row with five cells:
  - My Approvals: `All of my team's approvals`
  - Workflows: `Viewing all`
  - Tags: `Problemas en el Paraiso`
  - Authors: `Viewing all`
  - Post Types: `Viewing all`
- `Clear All` is visible and enabled because a tag filter is active.
- Main content is an empty approval illustration centered in the page.
- Empty copy: `No rejected posts based on the filters you have selected.`

## Interaction Matrix

- `Filters` toggles the filter row.
- Filter cells open popovers.
- `Tags` opens a searchable checklist with reset and match-all controls.
- `Clear All` removes selected filters.
- `Manage Workflows` opens workflow management in Settings.
- `Help` opens a small help surface.

## Acceptance Criteria

- `/publishing/rejected` renders under Publishing navigation.
- Sidebar includes `Rejected` after `Needs Approval`.
- Header action order and filter row match source.
- Source active tag state is represented.
- Empty state illustration and copy match source.
- Safe interactions open or navigate without submitting data.
