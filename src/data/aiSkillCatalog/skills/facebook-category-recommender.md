---
id: "facebook-category-recommender"
title: "Facebook Category Recommender"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Operations"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://www.facebook.com/help/instagram/225190788256708"]
tags: ["facebook","category"]
games: ["DF"]
shared_tags_team: ["Marketing"]
shared_tags_asset: ["Dashboard"]
sections_supported: ["facebookVideoOptions"]
required_inputs: ["media"]
outputs: ["facebookCategory"]
depends_on_skills: []
depends_on_knowledge: ["facebook-video-posting-rules"]
---

## Objective
Recommend the local Facebook video category for Delta Force uploads.

## Workflow
1. Use Video Games when the asset is gameplay or game promo content.
2. Avoid category churn when the operator already chose a category.

## Notes
- This skill intentionally stays simple.
