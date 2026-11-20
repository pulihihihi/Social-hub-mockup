---
id: "preview-qa-checker"
title: "Preview QA Checker"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Campaign Execution"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://wiki.odp.garena.vn/doc/socialhub-AKXR7josP9","https://wiki.odp.garena.vn/doc/canonical-codebase-context-xNWrUtwWFI","https://wiki.odp.garena.vn/doc/11-canonical-module-catalog-HUWXeTn3Q1","https://www.facebook.com/help/1038071743007909","https://www.facebook.com/help/instagram/225190788256708","https://www.facebook.com/help/instagram/771310471063900?locale=en_GB","https://www.facebook.com/help/instagram/1217144552251333/?locale=en_GB","https://support.google.com/youtube/answer/57404?hl=en","https://support.google.com/youtube/answer/9134402?hl=en","https://support.google.com/youtube/answer/146402?hl=en","https://support.google.com/youtube/answer/12948449?hl=en","https://support.google.com/youtube/answer/2950063?co=GENIE.Platform%3DDesktop&hl=en"]
tags: ["preview","qa"]
games: ["DF"]
shared_tags_team: ["Marketing","QA"]
shared_tags_asset: ["Dashboard"]
sections_supported: ["previewQA"]
required_inputs: ["composerState"]
outputs: ["previewNotes"]
depends_on_skills: ["network-variant-adapter"]
depends_on_knowledge: ["socialhub-new-post-module-map","cross-platform-hashtag-guardrails"]
---

## Objective
Check whether the generated content still looks coherent once it reaches network preview.

## Workflow
1. Look for obvious duplication, overlong metadata, or empty critical fields.
2. Return only operator-relevant notes.

## Notes
- Use this after generation and again after manual refinement if needed.
