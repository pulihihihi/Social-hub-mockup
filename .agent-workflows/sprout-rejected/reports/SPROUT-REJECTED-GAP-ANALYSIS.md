# Sprout Rejected Gap Analysis

## Match

- Publishing navigation placement includes `Rejected` after `Needs Approval`.
- Page title, header actions, filter row order, active tag summary, and empty state copy match the captured source.
- Safe interactions for filters, tag menu, clear all, help, and workflow management are covered.

## Minor Gaps

- Local shell styling differs from Sprout's exact dark green sidebar because Social Hub uses its own app shell.
- Empty illustration is rebuilt with local CSS/icons, not Sprout's exact asset.
- Source account-specific reauthorization toast was intentionally not cloned.

## Residual Risk

- No real rejected post list state was visible in source, so the target currently covers the filtered empty state only.
- Mobile screenshot includes an existing app shell drawer state; no Rejected-specific overflow was detected.

## Next Fix Batch

1. Capture a source state with actual rejected posts if data becomes available.
2. Add list/card rejected-post rows if source evidence shows non-empty behavior.
3. Recheck mobile shell drawer behavior in a broader navigation QA pass.
