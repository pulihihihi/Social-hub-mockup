---
id: "subtitle-generator"
title: "Subtitle Generator"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Creative Production"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://www.w3.org/WAI/media/av/captions/","https://www.w3.org/WAI/media/av/transcripts/"]
tags: ["subtitles","srt"]
games: ["DF"]
shared_tags_team: ["Video Editor","Marketing"]
shared_tags_asset: ["Video"]
sections_supported: ["subtitles"]
required_inputs: ["media","caption"]
outputs: ["subtitleText"]
depends_on_skills: ["video-context-reader"]
depends_on_knowledge: ["subtitle-accessibility-guidelines"]
---

## Objective
Generate an editable subtitle draft for the selected video.

## Workflow
1. Use short caption-aligned phrases as the draft text in v1.
2. Return an editable subtitle file body rather than a locked final result.
3. Preserve enough timing structure to be useful for manual review.

## Notes
- This is a deterministic draft generator, not a speech-to-text system.
