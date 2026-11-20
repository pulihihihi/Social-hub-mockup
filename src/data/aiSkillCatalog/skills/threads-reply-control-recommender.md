---
id: "threads-reply-control-recommender"
title: "Threads Reply Control Recommender"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Operations"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://www.facebook.com/help/instagram/771310471063900?locale=en_GB","https://www.facebook.com/help/instagram/1217144552251333/?locale=en_GB"]
tags: ["threads","reply-control"]
games: ["DF"]
shared_tags_team: ["Community","Marketing"]
shared_tags_asset: ["Dashboard"]
sections_supported: ["threadsOptions"]
required_inputs: ["caption"]
outputs: ["threadsReplyControl"]
depends_on_skills: []
depends_on_knowledge: ["threads-reply-quote-rules"]
---

## Objective
Recommend a reply-control setting for Threads posts.

## Workflow
1. Use Anyone for open community prompts by default.
2. Use a narrower option only when the content clearly calls for controlled reply scope.

## Notes
- The recommendation should stay transparent and reversible.
