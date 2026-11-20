---
id: "video-context-reader"
title: "Video Context Reader"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Research & Analysis"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://www.playdeltaforce.com/en/detail/","https://store.steampowered.com/app/2507950/Delta_Force/","https://www.w3.org/WAI/tutorials/images/decision-tree/","https://www.w3.org/WAI/media/av/captions/","https://www.w3.org/WAI/media/av/transcripts/"]
tags: ["video","subtitles"]
games: ["DF"]
shared_tags_team: ["Marketing","Video Editor"]
shared_tags_asset: ["Video"]
sections_supported: ["subtitles","youtubeTitle","youtubeTags","previewQA"]
required_inputs: ["media"]
outputs: ["videoSummary"]
depends_on_skills: ["media-context-reader"]
depends_on_knowledge: ["subtitle-accessibility-guidelines","delta-force-game-modes"]
---

## Objective
Prepare video-focused context for subtitle, title, and metadata generation.

## Workflow
1. Read duration, ratio, source label, and visible mode cues where available.
2. Decide whether the post looks like short-form clip, feature beat, or longer gameplay package.
3. Pass a video summary to metadata and subtitle skills.

## Notes
- Do not fabricate shot-level detail in v1.
