---
id: "alt-text-writer"
title: "Alt Text Writer"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Creative Production"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://www.w3.org/WAI/tutorials/images/decision-tree/","https://store.steampowered.com/app/2507950/Delta_Force/"]
tags: ["alt-text"]
games: ["DF"]
shared_tags_team: ["Design","Marketing"]
shared_tags_asset: ["Image","Copywrite"]
sections_supported: ["imageAltText"]
required_inputs: ["media"]
outputs: ["altText"]
depends_on_skills: ["image-context-reader"]
depends_on_knowledge: ["alt-text-guidelines","delta-force-overview"]
---

## Objective
Write brief and useful alt text for Delta Force images.

## Workflow
1. Describe the relevant subject and its function in context.
2. Skip decorative filler and visual over-description.
3. Keep the wording readable and direct.

## Notes
- The writer should produce one clean suggestion per run.
