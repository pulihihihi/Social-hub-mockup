---
id: "subtitle-reviewer"
title: "Subtitle Reviewer"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Campaign Execution"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://www.w3.org/WAI/media/av/captions/","https://www.w3.org/WAI/media/av/transcripts/"]
tags: ["subtitle","qa"]
games: ["DF"]
shared_tags_team: ["Video Editor"]
shared_tags_asset: ["Video"]
sections_supported: ["subtitles","validation"]
required_inputs: ["subtitleText"]
outputs: ["subtitleFeedback"]
depends_on_skills: ["subtitle-generator"]
depends_on_knowledge: ["subtitle-accessibility-guidelines"]
---

## Objective
Check subtitle drafts for completeness and obvious formatting gaps.

## Workflow
1. Look for missing timestamps or empty lines.
2. Flag overlong text blocks.
3. Return simple review guidance before save.

## Notes
- This is a QA helper, not a replacement for human subtitle review.
