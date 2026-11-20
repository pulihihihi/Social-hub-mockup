---
id: "image-context-reader"
title: "Image Context Reader"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Research & Analysis"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://www.w3.org/WAI/tutorials/images/decision-tree/"]
tags: ["image","alt-text"]
games: ["DF"]
shared_tags_team: ["Design","Marketing"]
shared_tags_asset: ["Image"]
sections_supported: ["imageAltText"]
required_inputs: ["media"]
outputs: ["imageSummary"]
depends_on_skills: ["media-context-reader"]
depends_on_knowledge: ["alt-text-guidelines"]
---

## Objective
Prepare image-focused context for alt text generation.

## Workflow
1. Identify whether the image is likely promotional, informational, or decorative.
2. Capture the most relevant visible or named subject.
3. Return only the detail needed for accessibility text.

## Notes
- Prefer concise summaries over exhaustive scene descriptions.
