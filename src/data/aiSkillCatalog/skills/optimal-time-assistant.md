---
id: "optimal-time-assistant"
title: "Optimal Time Assistant"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Planning"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://www.playdeltaforce.com/en/detail/","https://store.steampowered.com/app/2507950/Delta_Force/"]
tags: ["schedule","timing"]
games: ["DF"]
shared_tags_team: ["Marketing"]
shared_tags_asset: ["Dashboard"]
sections_supported: ["schedule","validation"]
required_inputs: ["scheduledTimes"]
outputs: ["timingNotes"]
depends_on_skills: ["schedule-strategy-suggester"]
depends_on_knowledge: ["delta-force-audience-segments"]
---

## Objective
Provide a small amount of operator guidance around timing instead of pretending to know real performance data.

## Workflow
1. Confirm that a date and time exist.
2. Offer one fallback timing note when the schedule is blank.

## Notes
- This local pack does not have live analytics. Keep the advice modest.
