---
id: "media-context-reader"
title: "Media Context Reader"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Research & Analysis"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://www.playdeltaforce.com/en/detail/","https://store.steampowered.com/app/2507950/Delta_Force/"]
tags: ["media","context"]
games: ["DF"]
shared_tags_team: ["Marketing","Design","Video Editor"]
shared_tags_asset: ["Image","Video"]
sections_supported: ["captionBase","imageAltText","subtitles","previewQA"]
required_inputs: ["media"]
outputs: ["mediaSummary"]
depends_on_skills: []
depends_on_knowledge: ["delta-force-overview","delta-force-content-pillars"]
---

## Objective
Summarize the uploaded asset context into a form the local AI runner can use.

## Workflow
1. Read filenames, labels, duration, aspect ratio, and visible content type.
2. Infer the likely post angle from the asset metadata and current networks.
3. Pass a short asset summary to downstream generators.

## Notes
- This is metadata-based in v1 and should not pretend to do full visual understanding.
