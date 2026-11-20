---
id: "youtube-description-keyword-writer"
title: "YouTube Description Keyword Writer"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Creative Production"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://support.google.com/youtube/answer/12948449?hl=en","https://support.google.com/youtube/answer/146402?hl=en"]
tags: ["youtube","keywords"]
games: ["DF"]
shared_tags_team: ["Marketing"]
shared_tags_asset: ["Copywrite"]
sections_supported: ["youtubeTags"]
required_inputs: ["caption"]
outputs: ["keywordPlan"]
depends_on_skills: ["youtube-title-writer"]
depends_on_knowledge: ["youtube-title-description-tag-rules"]
---

## Objective
Extract the small keyword set that should influence YouTube metadata even when description is not editable in this UI.

## Workflow
1. Identify one core game phrase, one content-type phrase, and one event or mode phrase.
2. Keep the set compact.
3. Pass the output into tags and title guidance.

## Notes
- This skill produces metadata guidance, not a long description block.
