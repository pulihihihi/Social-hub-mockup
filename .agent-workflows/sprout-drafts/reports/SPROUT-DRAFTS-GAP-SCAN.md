# Sprout Drafts Gap Scan

## Scan Method

Source and target were captured at 1920x900. Target was also captured at 1366x768 and 390x844. Source safe filter interactions came from the targeted source scan; target interactions came from the local generic safe scanner plus implementation review.

## Source Evidence

- Baseline URL: `https://app.sproutsocial.com/publishing/drafts/`
- Baseline screenshot: `.agent-workflows/sprout-drafts/source/screenshots/drafts-baseline.png`
- Targeted safe controls: `.agent-workflows/sprout-drafts/source/interactive-scan/targeted/interactive/targeted-safe-controls.json`

## Target Evidence

- Target URL: `http://localhost:5173/publishing/drafts`
- Baseline screenshot: `.agent-workflows/sprout-drafts/target/screenshots/target-drafts-baseline.png`
- Interactive scan: `.agent-workflows/sprout-drafts/target/interactive-scan`

## Findings

| Severity | Area | Source Behavior | Target Behavior | Action |
|---|---|---|---|---|
| Low | Secondary nav depth | Sprout has many more Publishing children: Queue, Needs Approval, Rejected, Campaigns, Asset Library, Mobile Reminders, Failed/Deleted Posts. | Local scope currently has `New Post`, `Calendar`, `Drafts`. | Add remaining Publishing pages as separate clone batches. |
| Low | Filter menu data | Sprout uses real account/profile/tag/author names from the tenant. | Target uses stable mock profile/tag/author names. | Replace with real app data when API/store exists. |
| Low | Generic scanner coverage | Source targeted scan opens all four filter menus. | Generic target scan becomes stale after clicking sidebar collapse, so filter-cell click evidence is incomplete. | Add targeted local filter scan or teach scanner to skip sidebar collapse. |
| Low | Mobile shell | Sprout app shell and local shell differ on narrow viewport behavior. | Target Drafts content is responsive, but the existing desktop sidebar dominates 390px capture. | Address app-shell mobile behavior in a separate layout batch. |

## Interaction Coverage

| Control | Source Evidence | Target Evidence | Status |
|---|---|---|---|
| Filters button | Clicked safely; toggles filter visibility in source body text. | Opens summary popover. | Acceptable simple clone. |
| Draft Types filter | Opens post type and draft status choices. | Opens matching post type/draft choices. | Implemented. |
| Profiles filter | Opens platform-grouped profiles. | Opens platform-grouped profiles. | Implemented with mock accounts. |
| Tags filter | Opens search, grouped tags, reset, match-all. | Opens search, grouped tags, reset, match-all. | Implemented. |
| Authors filter | Opens avatar initials and names. | Opens avatar initials and names. | Implemented with mock authors. |
| Clear All | Disabled by default. | Disabled by default, enabled after filter selection. | Implemented. |
| Start a draft | Present; not clicked in source. | Routes to `/publishing/new-post`. | Implemented. |

## Remaining Unknowns

- Behavior after saving a real draft from the composer is still local-state/mock-only. There is no shared draft persistence layer yet.
- Needs Approval, Rejected, Queue, and related Publishing child pages are not cloned in this batch.
