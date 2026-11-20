---
id: "hashtag-writer"
title: "Hashtag Writer"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Creative Production"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://support.google.com/youtube/answer/146402?hl=en","https://ads.tiktok.com/help/article/creative-best-practices?redirected=1"]
tags: ["hashtags"]
games: ["DF"]
shared_tags_team: ["Marketing","Community"]
shared_tags_asset: ["Copywrite"]
sections_supported: ["hashtags"]
required_inputs: ["caption","selectedNetworks"]
outputs: ["hashtags"]
depends_on_skills: ["caption-writer"]
depends_on_knowledge: ["cross-platform-hashtag-guardrails","delta-force-core-terms"]
---

## Objective
Generate a short, reusable hashtag set for Delta Force posts.

## Workflow
1. Start from the game and campaign nouns that matter most.
2. Keep the set concise and legible.
3. Drop generic filler tags that do not improve retrieval or context.

## Notes
- Prefer a small core set across platforms unless the operator requests more.
