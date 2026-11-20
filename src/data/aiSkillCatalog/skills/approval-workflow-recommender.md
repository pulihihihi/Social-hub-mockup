---
id: "approval-workflow-recommender"
title: "Approval Workflow Recommender"
type: "skill"
author: "Delta Force AI Pack"
version: "1.0"
category: "Operations"
trigger: "manual"
domain: "delta-force"
verified_on: "2026-05-09"
status: "active"
research_basis_urls: ["https://wiki.odp.garena.vn/doc/socialhub-AKXR7josP9","https://wiki.odp.garena.vn/doc/canonical-codebase-context-xNWrUtwWFI","https://wiki.odp.garena.vn/doc/11-canonical-module-catalog-HUWXeTn3Q1"]
tags: ["approval","workflow"]
games: ["DF"]
shared_tags_team: ["Product","Marketing"]
shared_tags_asset: ["Dashboard"]
sections_supported: ["approvalWorkflow"]
required_inputs: ["workflowOptions","contentType"]
outputs: ["approvalWorkflowId"]
depends_on_skills: []
depends_on_knowledge: ["delta-force-approval-mobile-publisher-rules","delta-force-workstream-scope"]
---

## Objective
Pick the most suitable approval workflow from the available local options.

## Workflow
1. Prefer marketing review as the baseline for broad publishing content.
2. Escalate to heavier workflow only if the visible content looks higher risk or more cross-functional.

## Notes
- Never invent workflow IDs that do not exist in the local store.
