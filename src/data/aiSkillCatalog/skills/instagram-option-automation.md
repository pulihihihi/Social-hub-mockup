---
id: "instagram-option-automation"
title: "Instagram Option Automation"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Operations"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://www.facebook.com/help/1038071743007909","https://www.facebook.com/help/instagram/225190788256708"]
tags: ["instagram","options"]
games: ["DF"]
shared_tags_team: ["Marketing"]
shared_tags_asset: ["Video","Dashboard"]
sections_supported: ["instagramOptions"]
required_inputs: ["videoDetails"]
outputs: ["instagramOptionsPatch"]
depends_on_skills: ["instagram-feed-share-decider"]
depends_on_knowledge: ["instagram-reel-posting-rules"]
---

## Objective
Set a consistent baseline for Instagram-specific publishing options.

## Workflow
1. Keep share-to-feed enabled for most Delta Force reels.
2. Leave trial-reel style experimentation off unless the asset context implies a test cutdown.
3. Do not invent collaborator states or unsupported settings.

## Notes
- This automation respects the current local option model only.
