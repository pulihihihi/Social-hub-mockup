---
id: "mobile-publisher-recommender"
title: "Mobile Publisher Recommender"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Operations"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://wiki.odp.garena.vn/doc/socialhub-AKXR7josP9","https://wiki.odp.garena.vn/doc/canonical-codebase-context-xNWrUtwWFI","https://wiki.odp.garena.vn/doc/11-canonical-module-catalog-HUWXeTn3Q1"]
tags: ["mobile-publisher"]
games: ["DF"]
shared_tags_team: ["Product","Marketing"]
shared_tags_asset: ["Dashboard"]
sections_supported: ["mobilePublisher"]
required_inputs: ["publisherOptions","selectedNetworks"]
outputs: ["mobilePublisherId"]
depends_on_skills: []
depends_on_knowledge: ["delta-force-approval-mobile-publisher-rules"]
---

## Objective
Recommend a mobile publisher from the existing local options.

## Workflow
1. Pick the first publishing-capable operator when no value exists.
2. Bias toward a stable publisher for TikTok or story-like flows.

## Notes
- This is a convenience default, not an ownership rule.
