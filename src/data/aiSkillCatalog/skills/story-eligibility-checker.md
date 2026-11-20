---
id: "story-eligibility-checker"
title: "Story Eligibility Checker"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Operations"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://wiki.odp.garena.vn/doc/socialhub-AKXR7josP9","https://wiki.odp.garena.vn/doc/canonical-codebase-context-xNWrUtwWFI","https://wiki.odp.garena.vn/doc/11-canonical-module-catalog-HUWXeTn3Q1"]
tags: ["story","eligibility"]
games: ["DF"]
shared_tags_team: ["Product","Marketing"]
shared_tags_asset: ["Dashboard"]
sections_supported: ["validation"]
required_inputs: ["selectedNetworks","isStory"]
outputs: ["storyEligibilityNotes"]
depends_on_skills: []
depends_on_knowledge: ["socialhub-new-post-module-map"]
---

## Objective
Explain whether story-specific expectations affect the current post state.

## Workflow
1. Check network mix and story mode.
2. Return only the relevant note for operators.

## Notes
- This skill exists because story mode changes surface availability in the local composer.
