---
id: "youtube-audience-checker"
title: "YouTube Audience Checker"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Operations"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://support.google.com/youtube/answer/2950063?co=GENIE.Platform%3DDesktop&hl=en","https://support.google.com/youtube/answer/57404?hl=en"]
tags: ["youtube","audience"]
games: ["DF"]
shared_tags_team: ["Marketing"]
shared_tags_asset: ["Dashboard"]
sections_supported: ["youtubeOptions","validation"]
required_inputs: ["youtubeAudience"]
outputs: ["audienceRecommendation"]
depends_on_skills: []
depends_on_knowledge: ["youtube-audience-age-restriction-rules"]
---

## Objective
Keep YouTube audience selection explicit and safe.

## Workflow
1. Flag missing audience selection.
2. Recommend not-made-for-kids by default for Delta Force gameplay content.
3. Preserve manual override when the operator has already chosen a value.

## Notes
- Do not auto-change a user-selected value without preview.
