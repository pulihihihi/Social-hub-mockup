---
id: "instagram-feed-share-decider"
title: "Instagram Feed Share Decider"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Operations"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://www.facebook.com/help/instagram/225190788256708"]
tags: ["instagram","feed-share"]
games: ["DF"]
shared_tags_team: ["Marketing"]
shared_tags_asset: ["Dashboard"]
sections_supported: ["instagramOptions"]
required_inputs: ["videoDetails"]
outputs: ["instagramShareDecision"]
depends_on_skills: []
depends_on_knowledge: ["instagram-reel-posting-rules"]
---

## Objective
Decide whether the reel should also be shared to the profile feed.

## Workflow
1. Default to sharing to feed for broad community posts.
2. Use caution only for experimental or narrow test content.

## Notes
- This is a recommendation skill, not a hidden rule engine.
