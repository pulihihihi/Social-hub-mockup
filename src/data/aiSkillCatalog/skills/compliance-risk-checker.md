---
id: "compliance-risk-checker"
title: "Compliance Risk Checker"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Operations"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://support.google.com/youtube/answer/2950063?co=GENIE.Platform%3DDesktop&hl=en","https://ads.tiktok.com/help/article/creative-best-practices?redirected=1"]
tags: ["compliance","risk"]
games: ["DF"]
shared_tags_team: ["Marketing","Product"]
shared_tags_asset: ["Dashboard","Report"]
sections_supported: ["validation","previewQA"]
required_inputs: ["caption","videoDetails"]
outputs: ["riskNotes"]
depends_on_skills: []
depends_on_knowledge: ["youtube-audience-age-restriction-rules","delta-force-revenue-event-taxonomy"]
---

## Objective
Surface obvious safety or compliance review risks from the visible post fields.

## Workflow
1. Look for adult-only framing, reward overclaiming, or metadata gaps that create review risk.
2. Recommend review rather than auto-fixing ambiguous cases.

## Notes
- This skill is conservative and should prefer warnings over hard decisions.
