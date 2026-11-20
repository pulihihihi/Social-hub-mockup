# Sprout Needs Approval Gap Scan

## Scan Method

Source and target were captured at 1920x900. After a workflow was created in Sprout, the source was recaptured to verify the post-workflow empty state. Target was additionally captured at 1366x768 and 390x844. Source and target safe interactive scans were run with destructive/navigation actions treated as advisory or skipped.

## Source Evidence

- Baseline URL: `https://app.sproutsocial.com/publishing/approval/`
- Baseline screenshot: `.agent-workflows/sprout-needs-approval/source/screenshots/needs-approval-baseline.png`
- After-workflow screenshot: `.agent-workflows/sprout-needs-approval/source/screenshots/needs-approval-after-workflow.png`
- DOM text: `.agent-workflows/sprout-needs-approval/source/dom/needs-approval-baseline.txt`
- After-workflow DOM text: `.agent-workflows/sprout-needs-approval/source/dom/needs-approval-after-workflow.txt`
- Interactive scan: `.agent-workflows/sprout-needs-approval/source/interactive-scan`

## Target Evidence

- Target URL: `http://localhost:5173/publishing/needs-approval`
- Baseline screenshot: `.agent-workflows/sprout-needs-approval/target/screenshots/target-needs-approval-baseline.png`
- After-workflow screenshot: `.agent-workflows/sprout-needs-approval/target/screenshots/target-needs-approval-after-workflow.png`
- After-workflow mobile screenshot: `.agent-workflows/sprout-needs-approval/target/screenshots/target-needs-approval-after-workflow-mobile.png`
- Interactive scan: `.agent-workflows/sprout-needs-approval/target/interactive-scan`

## Findings

| Severity | Area | Source Behavior | Target Behavior | Action |
|---|---|---|---|---|
| Low | Shell chrome | Sprout uses its global icon rail plus secondary Publishing nav. | Social Hub uses the existing dark sidebar and adds Needs Approval under Publishing. | Accepted adaptation to local shell. |
| Low | Workflow persistence | Sprout saves workflow configuration to the tenant. | Target builder is local UI state only. | Wire to real workflow persistence when the app has an approval data source. |
| Low | Filter data | Sprout uses tenant workflows, tags, authors, and post type data. | Target uses stable mock options. | Replace with store/API when approvals data exists. |
| Low | Source filter dropdown evidence | Generic source scan did not capture every filter menu after global controls changed state. | Target implements all visible filter controls. | Run a targeted source filter scan if exact dropdown menu ordering becomes critical. |
| Match | After-workflow empty state | Source shows only illustration and `No posts need approval based on the filters you have selected.` | Target now uses the same simplified empty state and removes onboarding templates. | Implemented. |

## Interaction Coverage

| Control | Source Evidence | Target Evidence | Status |
|---|---|---|---|
| Filters | Visible and toggles filter region. | Toggles filter bar visibility. | Implemented. |
| Manage Workflows | Visible header action. | Opens full-screen workflow builder. | Implemented. |
| Help | Visible header action. | Opens help popover. | Implemented simple behavior. |
| My Approvals | Visible filter with team approvals default. | Opens scope options. | Implemented. |
| Workflows | Visible filter. | Opens workflow template options. | Implemented. |
| Tags | Visible filter. | Opens search, reset, grouped tags, match-all. | Implemented. |
| Authors | Visible filter. | Opens author checkbox list with initials. | Implemented. |
| Post Types | Visible filter. | Opens post type options. | Implemented. |
| Clear All | Disabled by default. | Disabled by default, enabled after selection. | Implemented. |
| Template buttons | Visible only in pre-workflow onboarding source state. | Removed from the current after-workflow target state. | Updated to current source. |
| Create custom workflow | Visible only in pre-workflow onboarding source state. | Removed from the current after-workflow target state. | Updated to current source. |
| Workflow Name | Full-screen builder has name input and remaining character count. | Implemented with 100-character limit and remaining count. | Implemented. |
| Workflow steps | Builder has step name, approver input, requirement selector, delete icon, and add-step action. | Implemented with dynamic steps and approver tags. | Implemented. |
| Workflow settings | Builder has skip-step toggle and explanatory copy. | Implemented. | Implemented. |

## Remaining Unknowns

- Exact workflow save behavior is not cloned yet because the target has no approval workflow API/store.
- Approval list state with real posts is not captured because the source tenant has no posts needing approval.
- Source profile reauthorization toast is account-specific and intentionally excluded from the target page state.
