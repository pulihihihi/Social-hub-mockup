---
id: "labels-recommender"
title: "Labels Recommender"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Data & Automation"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://www.playdeltaforce.com/en/detail/","https://store.steampowered.com/app/2507950/Delta_Force/","https://wiki.odp.garena.vn/doc/socialhub-AKXR7josP9","https://wiki.odp.garena.vn/doc/canonical-codebase-context-xNWrUtwWFI","https://wiki.odp.garena.vn/doc/11-canonical-module-catalog-HUWXeTn3Q1"]
tags: ["labels","taxonomy"]
games: ["DF"]
shared_tags_team: ["Marketing"]
shared_tags_asset: ["Dashboard"]
sections_supported: ["labels"]
required_inputs: ["tagCollections","caption","media"]
outputs: ["labels"]
depends_on_skills: ["new-post-context-router"]
depends_on_knowledge: ["delta-force-labels-and-campaign-usage","delta-force-dau-event-taxonomy"]
---

## Objective
Recommend existing local labels that fit the current Delta Force post.

## Workflow
1. Use the managed local tag collections as the allowed vocabulary.
2. Prioritize Delta Force VN, Video, Community, Event, and Campaign when relevant.
3. Keep the label list short and immediately usable.

## Notes
- Do not create new labels in v1.
