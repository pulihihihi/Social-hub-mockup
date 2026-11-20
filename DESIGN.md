# Social Hub Design Contract

> Last updated: 2026-05-07

## Foundation

- Social Hub is an Ant Design project. Use `antd` and `@ant-design/icons` as the default UI foundation for all new work and all UI fixes.
- `@ant-design/pro-components` may be used selectively for data-heavy tables, forms, descriptions, and admin flows when it reduces custom scaffolding.
- Local wrappers are allowed only as thin business composition over Ant Design primitives. They must preserve AntD sizing, state, accessibility, and token behavior.

## Mandatory Component Rule

- Buttons, tabs, segmented controls, menus, dropdowns, popovers, date pickers, filters, checkboxes, radio groups, switches, tables, cards, drawers, modals, empty states, alerts, and notifications must come from Ant Design unless this file or `LAYOUT-BLUEPRINT.md` documents a specific exception.
- Do not create native `<button>`, custom select, custom date range, custom dropdown, custom checkbox, or custom tab controls for normal product UI.
- Selected-state ticks, checkbox squares, radio dots, switches, status/validation icons, icon-only actions, and alert treatments must use Ant Design primitives or `@ant-design/icons`. Do not hand-roll checkmarks, filled status circles, or icon buttons with custom spans/CSS when AntD provides an equivalent.
- User/team-member identity UI must use Ant Design `Avatar`, `Avatar.Group`, `Tooltip`, and `Popover`. Do not render user initials as custom colored square spans.
- If cloning a reference UI such as Sprout, clone the information architecture and interaction order, then render the target with Ant Design components and Social Hub tokens.
- Visual parity is not permission to build a parallel UI system. Source screenshots guide placement and behavior; Ant Design owns rendering primitives.

## User And Team Member Contract

- Settings > Access > User at `/settings/system` owns the user directory.
- Every feature that displays or assigns users/team members must consume `src/data/userManagement.js` and stay synchronized with `useManagedUsers()`.
- Channel and Channel Group membership is derived from user access fields: `channelIds` and `channelGroupIds`. Feature modules must not keep a second static team-member roster.

## Channel Management Contract

- `Connection Status` shows API/platform sync health and is display-only. Render it as an Ant Design status badge/tag, not as an editable select, inline edit cell, or bulk action.

## System Tag Contract

- Settings > Tag Management > System Tag owns auto-generated operational tags.
- System tags are enabled by default, may originate from Social Hub or connected systems such as Social Listening, and can apply to Messages, Posts, or both.
- User enable/disable control must use Ant Design `Switch`; do not model system tags as user-created editable tag collections.
- Switches must follow the global unlabeled switch contract: do not pass `checkedChildren` or `unCheckedChildren`. Put state text beside the switch only when a workflow needs an explicit label.
- Features that need quick filters for system-generated signals should consume `useManagedSystemTags()` from `src/data/tagManagementStore.js` so enabled state remains synchronized.

## Filter Bar Contract

- Shared operational filter rows must use `PublishingFilterBar` and `PublishingFilterCell` from `src/components/PublishingFilterBar.jsx`.
- The shared contract owns row height, border/radius, typography, clear/reset action area, chevron, and AntD `Popover` trigger behavior. Page-level CSS may only set outer placement such as top margin.
- Do not create page-local filter cell classes or clone the shared filter row markup for Calendar, Publishing, or Smart Inbox pages.

## New Post Composer Contract

- The channel selector summary trigger must visually align with the composer width and keep a stable hit area of at least 48px tall. When rendered through Ant Design `Button`, scoped CSS must beat the global `src/action-control-contract.css` 32px action-button rule and override computed `display`, `height`, padding, and wrapping; browser QA must verify the trigger is not compressed to the default 32px button height.

## Allowed Exceptions

- Bespoke media previews, chart marks, canvas-like visualizations, and platform logo glyphs may use custom markup when Ant Design has no equivalent primitive.
- A business wrapper such as `PublishingFilterBar` is acceptable only when it composes AntD components internally and stays documented in the layout contract.
- Any new exception must be added here before implementation.

## Calendar Contract

- Publishing Calendar is a no-header operational surface documented in `LAYOUT-BLUEPRINT.md`.
- Calendar header follows the Sprout-style operational layout: date navigation on the top-left, action/view controls on the top-right, and filters below it using the shared filter bar contract.
- Calendar header controls must use AntD: `Button`, `Segmented`, `Dropdown`, `Space`, `Flex`, and `Divider`.
- Calendar action/view controls such as Filters, density, List/Week/Month, AI Assist, open, and overflow must stay in the top-right action cluster on desktop.
- Calendar schedule affordances must use AntD `Button type="dashed"` instead of custom dashed boxes.

## Implementation Checklist

- Before handoff, scan touched UI files for native controls that duplicate AntD components.
- Before handoff on cloned or refreshed UI, scan for custom replacements of AntD checkbox/radio/switch/status icon/button primitives and replace them unless they are documented exceptions.
- Run build/tests for changed pages.
- Browser-verify that AntD controls render without clipping or overlap at the desktop baseline.
