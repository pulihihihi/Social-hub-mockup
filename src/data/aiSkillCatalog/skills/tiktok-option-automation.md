---
id: "tiktok-option-automation"
title: "TikTok Option Automation"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Operations"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://support.tiktok.com/en/account-and-privacy/account-privacy-settings/manage-comments","https://support.tiktok.com/en/account-and-privacy/account-privacy-settings/duets","https://support.tiktok.com/en/account-and-privacy/account-privacy-settings/stitch"]
tags: ["tiktok","options"]
games: ["DF"]
shared_tags_team: ["Marketing"]
shared_tags_asset: ["Video","Dashboard"]
sections_supported: ["tiktokOptions"]
required_inputs: ["videoDetails"]
outputs: ["tiktokOptionsPatch"]
depends_on_skills: []
depends_on_knowledge: ["tiktok-post-option-rules"]
---

## Objective
Apply the default TikTok interaction options for Delta Force publishing.

## Workflow
1. Enable comments, duets, and stitches by default.
2. Only change these when the operator or campaign context explicitly requires it.

## Notes
- This is the internal standard automation requested for TikTok posts.
