---
id: "validation-fixer"
title: "Validation Fixer"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Operations"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://wiki.odp.garena.vn/doc/socialhub-AKXR7josP9","https://wiki.odp.garena.vn/doc/canonical-codebase-context-xNWrUtwWFI","https://wiki.odp.garena.vn/doc/11-canonical-module-catalog-HUWXeTn3Q1","https://support.google.com/youtube/answer/57404?hl=en","https://support.google.com/youtube/answer/9134402?hl=en","https://support.google.com/youtube/answer/146402?hl=en","https://support.google.com/youtube/answer/12948449?hl=en","https://support.google.com/youtube/answer/2950063?co=GENIE.Platform%3DDesktop&hl=en"]
tags: ["validation"]
games: ["DF"]
shared_tags_team: ["Product","Marketing"]
shared_tags_asset: ["Dashboard"]
sections_supported: ["validation"]
required_inputs: ["composerState"]
outputs: ["validationSuggestions"]
depends_on_skills: ["youtube-audience-checker","youtube-category-game-mapper"]
depends_on_knowledge: ["socialhub-new-post-module-map","youtube-audience-age-restriction-rules"]
---

## Objective
Translate obvious validation gaps into actionable fixes.

## Workflow
1. Check for missing media, title, audience, or schedule essentials.
2. Return a short fix list that points back to the affected sections.

## Notes
- This skill does not bypass existing validation logic; it only explains it.
