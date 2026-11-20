# Sprout Settings Approval Workflows Source Brief

Captured: 2026-05-05
Source URL: `https://app.sproutsocial.com/settings/approval/`

## Baseline Page

- Page title: `Approval Workflows`
- Settings secondary nav has `Global Features > Approval Workflows` selected.
- Info banner: external approvers can be added, with `Learn more about external approvers`.
- Main card title: `Approval Workflows for kien-test`
- Group label: `Current Group - kien-test`
- Body explains step-by-step approval workflows and links to the Help Center.
- Actions: `Go to Needs Approval`, `Create New Workflow`
- Populated workflow table columns: `Default`, `Workflow Name`, `Last Edited`, `External Approvers`, `Steps`, `Actions`, `Enabled`
- Current source row:
  - Workflow Name: `testt`
  - Last Edited: `5 May 2026`
  - External Approvers: `0`
  - Steps: `1`
  - Actions: edit, duplicate, delete icon buttons
  - Enabled: on

## Populated Row Detail Capture

The `Edit` action on the `testt` row was clicked after the workflow was created.

Opened state:

- Full-screen `Edit Approval Workflow` builder.
- Workflow Name input prefilled with `testt`, remaining count `95`, and active `Save`.
- Step card:
  - `Step 1 Name` value `Step 1 - test`, remaining count `87`
  - `Approver(s)` contains `Hai-Son Tran`
  - approval requirement defaults to `Any`
- `Workflow settings` skip-steps toggle is off.

## Detail CTA Capture

`Create New Workflow` was clicked and captured before implementation while the source was still in an empty workflow state.

Opened state:

- Full-screen `Create Approval Workflow` builder.
- Header: `esc to go back`, close icon.
- Workflow Name input with remaining `100` character count and disabled `Save`.
- `Workflow steps and approvers` area with Step 1 timeline dot.
- Step card:
  - `Step 1 Name`, input value `Step 1`, remaining count `94`
  - delete icon
  - `Approver(s)` section and empty approver input
  - `Require approval from Any of these approvers.`
- `Add Another Step`
- `Workflow settings` with skip-steps toggle and explanatory copy.

## Acceptance Criteria

- Settings page must live under local Settings navigation.
- Create and edit buttons must open the detailed builder, not a placeholder.
- Existing workflows must render as a row with default star, metadata, action icons, and enabled switch.
- Builder must include the same core fields, disabled Save state, add-step control, close/escape affordance, and settings toggle.
- Source evidence must include parent settings page, populated workflow row, and opened create/edit builder states.
