---
id: "schedule-by-network-adapter"
title: "Schedule By Network Adapter"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Planning"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://www.playdeltaforce.com/en/detail/","https://store.steampowered.com/app/2507950/Delta_Force/"]
tags: ["schedule","network"]
games: ["DF"]
shared_tags_team: ["Marketing"]
shared_tags_asset: ["Dashboard"]
sections_supported: ["schedule"]
required_inputs: ["selectedNetworks","scheduleByNetwork"]
outputs: ["networkSchedules"]
depends_on_skills: ["schedule-strategy-suggester"]
depends_on_knowledge: ["delta-force-audience-segments"]
---

## Objective
Translate one default schedule suggestion into per-network slots when needed.

## Workflow
1. Only split schedules when the composer is already in schedule-by-network mode.
2. Keep the generated slots coherent and easy to review.

## Notes
- Do not force network-specific schedule mode.
