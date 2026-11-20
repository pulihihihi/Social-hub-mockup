# Sprout Needs Approval Source Brief

Captured: 2026-05-05
Source URL: `https://app.sproutsocial.com/publishing/approval/`

## Baseline

- Page title: `Needs Approval`
- Header actions: `Filters`, `Manage Workflows`, `Help`
- Filter bar: `My Approvals`, `Workflows`, `Tags`, `Authors`, `Post Types`, `Clear All`
- Default filter summaries:
  - `My Approvals`: `All of my team's approvals`
  - Other filters: `Viewing all`
- Empty state headline: `Streamline post approvals for your team`
- Empty state body explains that approval workflows must be built before posts appear here.
- Template actions: `Content approval`, `Legal approval`, `Content needed`, `A second set of eyes`
- Secondary CTA: `Create a custom workflow`

## After Workflow Exists

Captured again after a Sprout workflow was created in the tenant.

- Header actions remain `Filters`, `Manage Workflows`, `Help`.
- Filter bar remains `My Approvals`, `Workflows`, `Tags`, `Authors`, `Post Types`, `Clear All`.
- Empty state changes from onboarding/template creation to a simple centered state:
  - illustration
  - `No posts need approval based on the filters you have selected.`
- Template buttons and `Create a custom workflow` are no longer shown in this state.
- Source also shows a profile reauthorization toast in the bottom-right; this is account-specific and not cloned into the page state.

## Safe Interaction Inventory

- `Filters` toggles the filter bar visibility.
- `Clear All` is disabled by default.
- Template buttons and custom workflow button are visible workflow creation entry points.
- `Manage Workflows` and `Help` are header-level workflow support actions.

## Source Coverage Gaps

- The source has no pending approval posts, so list-row approval/rejection behavior is still uncaptured.
- Profile reauthorization toast is account-specific and excluded from page-level parity.
