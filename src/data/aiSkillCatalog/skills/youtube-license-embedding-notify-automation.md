---
id: "youtube-license-embedding-notify-automation"
title: "YouTube License Embedding Notify Automation"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Operations"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://support.google.com/youtube/answer/57404?hl=en"]
tags: ["youtube","advanced-settings"]
games: ["DF"]
shared_tags_team: ["Marketing"]
shared_tags_asset: ["Dashboard"]
sections_supported: ["youtubeOptions"]
required_inputs: ["videoDetails"]
outputs: ["youtubeAdvancedSettingsPatch"]
depends_on_skills: []
depends_on_knowledge: ["youtube-gaming-metadata-rules"]
---

## Objective
Keep YouTube advanced settings aligned to a sensible default for Delta Force publishing.

## Workflow
1. Use standard license unless there is a clear reason to change it.
2. Keep embedding and subscriber notification enabled by default.
3. Return a simple metadata patch that the operator can inspect.

## Notes
- This skill only touches advanced fields that already exist locally.
