---
id: "campaign-recommender"
title: "Campaign Recommender"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Data & Automation"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://www.playdeltaforce.com/en/detail/","https://store.steampowered.com/app/2507950/Delta_Force/","https://wiki.odp.garena.vn/doc/socialhub-AKXR7josP9","https://wiki.odp.garena.vn/doc/canonical-codebase-context-xNWrUtwWFI","https://wiki.odp.garena.vn/doc/11-canonical-module-catalog-HUWXeTn3Q1"]
tags: ["campaign"]
games: ["DF"]
shared_tags_team: ["Marketing"]
shared_tags_asset: ["Dashboard"]
sections_supported: ["campaign"]
required_inputs: ["activeCampaigns","caption","media"]
outputs: ["campaignId"]
depends_on_skills: ["new-post-context-router"]
depends_on_knowledge: ["delta-force-public-season-event-patterns","delta-force-labels-and-campaign-usage"]
---

## Objective
Recommend one existing campaign when the post angle maps cleanly to an active campaign.

## Workflow
1. Use active campaigns from the local store only.
2. Prefer AirDrop or Operation Densho style mapping when the post looks gameplay- or event-linked.
3. Leave campaign empty when no clear fit exists.

## Notes
- The recommendation should be conservative rather than over-attaching content to campaigns.
