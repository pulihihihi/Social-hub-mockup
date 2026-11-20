---
id: "schedule-strategy-suggester"
title: "Schedule Strategy Suggester"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Planning"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://www.playdeltaforce.com/en/detail/","https://store.steampowered.com/app/2507950/Delta_Force/"]
tags: ["schedule"]
games: ["DF"]
shared_tags_team: ["Marketing"]
shared_tags_asset: ["Dashboard"]
sections_supported: ["schedule"]
required_inputs: ["selectedNetworks","scheduleMode"]
outputs: ["scheduledTimes"]
depends_on_skills: []
depends_on_knowledge: ["delta-force-public-season-event-patterns","delta-force-audience-segments"]
---

## Objective
Provide a simple default schedule suggestion when the operator has not chosen one.

## Workflow
1. Use a near-term evening publish time as the default for gaming content in this local pack.
2. Return one clean slot rather than a large timing matrix.

## Notes
- The suggestion is a starting point and should not overwrite a filled schedule automatically.
