---
id: "facebook-video-option-automation"
title: "Facebook Video Option Automation"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Operations"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://www.facebook.com/help/instagram/225190788256708"]
tags: ["facebook","video-options"]
games: ["DF"]
shared_tags_team: ["Marketing"]
shared_tags_asset: ["Video","Dashboard"]
sections_supported: ["facebookVideoOptions"]
required_inputs: ["videoDetails"]
outputs: ["facebookVideoPatch"]
depends_on_skills: ["facebook-category-recommender"]
depends_on_knowledge: ["facebook-video-posting-rules"]
---

## Objective
Fill the Facebook video settings for Delta Force posts with a consistent baseline.

## Workflow
1. Default gameplay video posts to standard post unless the asset clearly behaves like a reel cutdown.
2. Use Video Games category when the category field is visible.
3. Preserve existing operator changes where present.

## Notes
- This automation works only against the current local composer model.
