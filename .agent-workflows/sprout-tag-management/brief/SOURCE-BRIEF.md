# Sprout Settings Tag Management Source Brief

Captured: 2026-05-06
Source URL: `https://app.sproutsocial.com/settings/tagging`

## Baseline Page

- Page title: `Tag Management`
- Settings secondary nav has `Global Features > Tag Management` selected.
- Header controls: group scope select (`All Tags`), `Find tags...`, `Help`, `Export`.
- Bulk bar: `0 Selected`, disabled `Move`, disabled `Archive`.
- Main card uses a two-panel manager:
  - Left panel: `Tags`, `Add Collection`, collection count, collection list.
  - Right panel: selected collection title, `Add Tag`, checkbox list of tags.
- Baseline selected collection: `Tags (unclassified)`.
- Visible source collections include `Campaigns`, `Always On`, `AOV`, `Campaign`, `Country`, `Delta Force VN`, `Esports`, `KOLs`, `LATAM`, `Regional`, `Tags (unclassified)`, `Archived`.
- Visible unclassified tags: `announcement`, `LATAM / [Product] We heard you`, `Livestream`.

## Captured Interactions

- `All Tags` select opens a searchable dropdown with `All Tags`, `All Groups`, and individual group names.
- `Add Collection` opens a centered modal with icon select, `Collection name *`, `Reset`, `Cancel`, and disabled `Create collection`.
- Collection rows select the right panel; `Campaigns` shows a long tag list and `Add Campaign`.
- Row overflow controls exist for collection and tag actions.
- Selecting a tag updates the bulk bar from `0 Selected` to a non-zero state and enables `Move` / `Archive`.

## Acceptance Criteria

- Local page must live under Settings as `Tag Management`.
- Collection and tag manager should use the same tag names currently visible in Calendar where applicable.
- Calendar tag filters must read from the same managed tag registry rather than independently deriving unrelated options.
- Add Collection and Add Tag should open real local forms, not toast placeholders.
- Bulk selected state must enable Move/Archive affordances.
