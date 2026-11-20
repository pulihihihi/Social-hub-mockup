---
id: "youtube-category-game-mapper"
title: "YouTube Category Game Mapper"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Operations"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://support.google.com/youtube/answer/9134402?hl=en","https://support.google.com/youtube/answer/57404?hl=en"]
tags: ["youtube","category"]
games: ["DF"]
shared_tags_team: ["Marketing"]
shared_tags_asset: ["Dashboard"]
sections_supported: ["youtubeOptions"]
required_inputs: ["media"]
outputs: ["youtubeCategory"]
depends_on_skills: ["video-context-reader"]
depends_on_knowledge: ["youtube-gaming-metadata-rules"]
---

## Objective
Map Delta Force video posts to the correct YouTube category.

## Workflow
1. Detect gameplay or game-related upload context.
2. Default to Gaming for Delta Force video posts.
3. Only suggest other categories if the asset is clearly non-game content.

## Notes
- This local pack assumes most Delta Force uploads are gaming content.
