---
id: "youtube-age-restriction-checker"
title: "YouTube Age Restriction Checker"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Operations"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://support.google.com/youtube/answer/2950063?co=GENIE.Platform%3DDesktop&hl=en"]
tags: ["youtube","age-restriction"]
games: ["DF"]
shared_tags_team: ["Marketing"]
shared_tags_asset: ["Dashboard"]
sections_supported: ["youtubeOptions","validation"]
required_inputs: ["videoDetails"]
outputs: ["ageRestrictionRecommendation"]
depends_on_skills: []
depends_on_knowledge: ["youtube-audience-age-restriction-rules"]
---

## Objective
Check whether the current YouTube age restriction state needs attention.

## Workflow
1. Default to not restricted unless the content clearly requires otherwise.
2. Return a warning instead of silently flipping the setting when content looks risky.
3. Keep the rule simple and transparent for operators.

## Notes
- The local runner does not inspect real video frames deeply enough to make aggressive safety decisions.
