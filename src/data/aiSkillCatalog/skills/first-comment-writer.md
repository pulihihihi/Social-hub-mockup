---
id: "first-comment-writer"
title: "First Comment Writer"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Creative Production"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://ads.tiktok.com/help/article/creative-best-practices?redirected=1"]
tags: ["first-comment"]
games: ["DF"]
shared_tags_team: ["Marketing","Community"]
shared_tags_asset: ["Copywrite"]
sections_supported: ["firstComment"]
required_inputs: ["caption","selectedNetworks"]
outputs: ["firstComment"]
depends_on_skills: ["caption-writer"]
depends_on_knowledge: ["delta-force-publishing-objectives"]
---

## Objective
Write a short first comment that pushes interaction without duplicating the caption.

## Workflow
1. Use a reply-driving question or a narrow CTA.
2. Avoid repeating the full caption.
3. Keep the comment safe for Instagram and Facebook support.

## Notes
- If first comment is not supported for the current network mix, return skipped.
