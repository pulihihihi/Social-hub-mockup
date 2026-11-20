---
id: "subtitle-translator"
title: "Subtitle Translator"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Creative Production"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://www.w3.org/WAI/media/av/captions/"]
tags: ["subtitle","translate"]
games: ["DF"]
shared_tags_team: ["Video Editor"]
shared_tags_asset: ["Video"]
sections_supported: ["subtitles"]
required_inputs: ["subtitleText","targetLanguage"]
outputs: ["translatedSubtitleText"]
depends_on_skills: ["subtitle-generator"]
depends_on_knowledge: ["subtitle-accessibility-guidelines"]
---

## Objective
Translate subtitle text while keeping timing structure editable.

## Workflow
1. Preserve timestamp rows.
2. Translate line content only.
3. Keep the draft easy to edit after translation.

## Notes
- Use only when a follow-up workflow asks for translation.
