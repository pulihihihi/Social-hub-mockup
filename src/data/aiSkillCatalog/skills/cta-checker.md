---
id: "cta-checker"
title: "CTA Checker"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Campaign Execution"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://ads.tiktok.com/help/article/creative-best-practices?redirected=1","https://support.google.com/youtube/answer/12948449?hl=en"]
tags: ["cta","qa"]
games: ["DF"]
shared_tags_team: ["Marketing"]
shared_tags_asset: ["Copywrite"]
sections_supported: ["captionBase","firstComment","previewQA"]
required_inputs: ["copy"]
outputs: ["ctaFeedback"]
depends_on_skills: ["caption-writer"]
depends_on_knowledge: ["delta-force-publishing-objectives"]
---

## Objective
Check whether the generated content actually tells the audience what to do next.

## Workflow
1. Detect whether a clear action exists.
2. Flag weak, vague, or missing CTA language.
3. Suggest one tighter CTA if needed.

## Notes
- The checker should be advisory and should not invent a second goal for the post.
