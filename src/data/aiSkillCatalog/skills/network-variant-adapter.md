---
id: "network-variant-adapter"
title: "Network Variant Adapter"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Creative Production"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://support.google.com/youtube/answer/57404?hl=en","https://support.google.com/youtube/answer/9134402?hl=en","https://support.google.com/youtube/answer/146402?hl=en","https://support.google.com/youtube/answer/12948449?hl=en","https://support.google.com/youtube/answer/2950063?co=GENIE.Platform%3DDesktop&hl=en","https://support.tiktok.com/en/account-and-privacy/account-privacy-settings/manage-comments","https://support.tiktok.com/en/account-and-privacy/account-privacy-settings/duets","https://support.tiktok.com/en/account-and-privacy/account-privacy-settings/stitch","https://ads.tiktok.com/help/article/creative-best-practices?redirected=1","https://www.facebook.com/help/1038071743007909","https://www.facebook.com/help/instagram/225190788256708","https://www.facebook.com/help/instagram/771310471063900?locale=en_GB","https://www.facebook.com/help/instagram/1217144552251333/?locale=en_GB"]
tags: ["network","adaptation"]
games: ["DF"]
shared_tags_team: ["Marketing"]
shared_tags_asset: ["Copywrite"]
sections_supported: ["captionPerNetwork","hashtags","previewQA"]
required_inputs: ["baseCaption","selectedNetworks"]
outputs: ["networkSpecificCopy"]
depends_on_skills: ["caption-writer"]
depends_on_knowledge: ["cross-platform-hashtag-guardrails","tiktok-creative-best-practices","youtube-title-description-tag-rules"]
---

## Objective
Adapt one Delta Force idea into platform-appropriate variants.

## Workflow
1. Keep the core game angle stable.
2. Shorten or tighten copy for short-form platforms.
3. Preserve metadata-friendly phrasing for YouTube and feed-safe phrasing for Facebook.

## Notes
- The adapter should never override platform option settings. It only shapes copy.
