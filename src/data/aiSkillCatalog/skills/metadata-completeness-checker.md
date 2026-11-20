---
id: "metadata-completeness-checker"
title: "Metadata Completeness Checker"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Operations"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://support.google.com/youtube/answer/57404?hl=en","https://support.google.com/youtube/answer/9134402?hl=en","https://support.google.com/youtube/answer/146402?hl=en","https://support.google.com/youtube/answer/12948449?hl=en","https://support.google.com/youtube/answer/2950063?co=GENIE.Platform%3DDesktop&hl=en","https://support.tiktok.com/en/account-and-privacy/account-privacy-settings/manage-comments","https://support.tiktok.com/en/account-and-privacy/account-privacy-settings/duets","https://support.tiktok.com/en/account-and-privacy/account-privacy-settings/stitch","https://ads.tiktok.com/help/article/creative-best-practices?redirected=1"]
tags: ["metadata","qa"]
games: ["DF"]
shared_tags_team: ["Marketing"]
shared_tags_asset: ["Dashboard"]
sections_supported: ["youtubeOptions","tiktokOptions","validation"]
required_inputs: ["composerState"]
outputs: ["metadataChecklist"]
depends_on_skills: ["youtube-audience-checker","youtube-tag-writer"]
depends_on_knowledge: ["youtube-gaming-metadata-rules","tiktok-post-option-rules"]
---

## Objective
Check whether metadata-heavy sections are complete enough to publish.

## Workflow
1. Review title, tags, category, audience, and platform option essentials.
2. Return a compact completeness checklist.

## Notes
- This skill supports validation, not long-form reporting.
