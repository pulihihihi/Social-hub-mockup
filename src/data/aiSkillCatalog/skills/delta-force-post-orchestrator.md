---
id: "delta-force-post-orchestrator"
title: "Delta Force Post Orchestrator"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Planning"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://www.playdeltaforce.com/en/detail/","https://store.steampowered.com/app/2507950/Delta_Force/","https://wiki.odp.garena.vn/doc/socialhub-AKXR7josP9","https://wiki.odp.garena.vn/doc/canonical-codebase-context-xNWrUtwWFI","https://wiki.odp.garena.vn/doc/11-canonical-module-catalog-HUWXeTn3Q1"]
tags: ["orchestration","new-post","delta-force"]
games: ["DF"]
shared_tags_team: ["Product","Marketing"]
shared_tags_asset: ["Dashboard"]
sections_supported: ["captionBase","captionPerNetwork","hashtags","firstComment","imageAltText","subtitles","youtubeTitle","youtubeTags","facebookVideoOptions","instagramOptions","threadsAltText","threadsOptions","youtubeOptions","tiktokOptions","approvalWorkflow","mobilePublisher","labels","campaign","schedule","validation","previewQA"]
required_inputs: ["selectedNetworks","media","composerState"]
outputs: ["sectionResults","patches","warnings"]
depends_on_skills: ["new-post-context-router","network-variant-adapter","media-context-reader"]
depends_on_knowledge: ["socialhub-new-post-module-map","delta-force-overview","delta-force-publishing-objectives"]
---

## Objective
Coordinate section-level skills so one AI Assist run can complete the New Post surface in a safe order.

## Workflow
1. Read media and composer context first.
2. Route the request into the exact section skills selected by the operator.
3. Return patch-ready output, warnings, and provenance for each section.

## Notes
- Auto-apply only into empty fields.
- Non-empty fields should return preview-only output until the operator applies it.
