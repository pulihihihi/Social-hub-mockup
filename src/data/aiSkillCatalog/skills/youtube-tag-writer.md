---
id: "youtube-tag-writer"
title: "YouTube Tag Writer"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Creative Production"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://support.google.com/youtube/answer/146402?hl=en","https://support.google.com/youtube/answer/12948449?hl=en"]
tags: ["youtube","tags"]
games: ["DF"]
shared_tags_team: ["Marketing"]
shared_tags_asset: ["Video","Dashboard"]
sections_supported: ["youtubeTags"]
required_inputs: ["media","caption"]
outputs: ["youtubeTags"]
depends_on_skills: ["youtube-description-keyword-writer"]
depends_on_knowledge: ["youtube-title-description-tag-rules","delta-force-core-terms"]
---

## Objective
Generate a small YouTube tag set that complements title and description intent.

## Workflow
1. Include Delta Force, one mode or content noun, and one or two retrieval helpers.
2. Prefer useful keywords over long spam-like tag stacks.
3. Avoid repeating the same meaning with many spelling variants unless needed.

## Notes
- Tags are secondary metadata and should stay concise.
