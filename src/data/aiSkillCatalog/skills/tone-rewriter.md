---
id: "tone-rewriter"
title: "Tone Rewriter"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Creative Production"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://www.playdeltaforce.com/en/detail/","https://store.steampowered.com/app/2507950/Delta_Force/","https://ads.tiktok.com/help/article/creative-best-practices?redirected=1"]
tags: ["tone","rewrite"]
games: ["DF"]
shared_tags_team: ["Marketing","Community"]
shared_tags_asset: ["Copywrite"]
sections_supported: ["captionBase","captionPerNetwork","firstComment"]
required_inputs: ["copy","refinementPrompt"]
outputs: ["rewrittenCopy"]
depends_on_skills: ["caption-writer"]
depends_on_knowledge: ["delta-force-publishing-objectives","delta-force-audience-segments"]
---

## Objective
Re-shape caption tone without changing the underlying post intent.

## Workflow
1. Read the requested refinement tone.
2. Keep the tactical shooter vocabulary consistent.
3. Return one cleaner version, not a large option set.

## Notes
- Do not introduce slang unless the prompt explicitly requests it.
