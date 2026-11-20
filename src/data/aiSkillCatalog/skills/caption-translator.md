---
id: "caption-translator"
title: "Caption Translator"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Creative Production"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://www.playdeltaforce.com/en/detail/","https://store.steampowered.com/app/2507950/Delta_Force/"]
tags: ["translate","caption"]
games: ["DF"]
shared_tags_team: ["Marketing"]
shared_tags_asset: ["Copywrite"]
sections_supported: ["captionBase","captionPerNetwork"]
required_inputs: ["caption","targetLanguage"]
outputs: ["translatedCaption"]
depends_on_skills: ["caption-writer"]
depends_on_knowledge: ["delta-force-core-terms"]
---

## Objective
Translate caption copy while preserving Delta Force nouns and CTA clarity.

## Workflow
1. Preserve operator names, game names, and branded nouns.
2. Avoid over-localizing proper game terms.
3. Keep the call to action natural in the target language.

## Notes
- Use only when the operator or a downstream workflow explicitly needs translation.
