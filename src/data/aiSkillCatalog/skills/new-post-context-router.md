---
id: "new-post-context-router"
title: "New Post Context Router"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Planning"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://wiki.odp.garena.vn/doc/socialhub-AKXR7josP9","https://wiki.odp.garena.vn/doc/canonical-codebase-context-xNWrUtwWFI","https://wiki.odp.garena.vn/doc/11-canonical-module-catalog-HUWXeTn3Q1"]
tags: ["routing","composer"]
games: ["DF"]
shared_tags_team: ["Product","Marketing"]
shared_tags_asset: ["Dashboard"]
sections_supported: ["captionBase","captionPerNetwork","labels","campaign","schedule","validation"]
required_inputs: ["composerState","selectedChannels","media"]
outputs: ["contextSummary","networkMode","sectionPriorities"]
depends_on_skills: []
depends_on_knowledge: ["socialhub-new-post-module-map","delta-force-workstream-scope"]
---

## Objective
Translate raw composer state into a clean context package for downstream skills.

## Workflow
1. Identify selected networks, content type, schedule mode, and workflow context.
2. Flag sections that depend on video-only or image-only inputs.
3. Pass a normalized context object to content and metadata skills.

## Notes
- Do not infer sections that do not exist in the visible composer state.
