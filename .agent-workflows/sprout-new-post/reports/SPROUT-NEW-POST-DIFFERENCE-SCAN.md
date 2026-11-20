# Sprout New Post Difference Scan

## Scan Method

Difference Scanner Agent runs independently from the main code flow. It scans source and target in visual order: top-to-bottom, and left-to-right within each horizontal band. Unscanned areas must be treated as unknown, not matched.

## Scanner Findings

| Status | Area | Finding | Action |
|---|---|---|---|
| Fixed | Platform tabs | Target platform tabs were too tall and too widely spaced compared with source tab rects. | Compact tab strip height, button height, and gaps. |
| Deferred | Platform identity | Source artifact text mentions Threads, but current user screenshot shows Instagram. | Keep Instagram until a current source capture proves Threads is the desired selected platform. |
| Fixed | Validation dots | YouTube and TikTok error dots were only shown when video existed. Source shows red dots when video is missing too. | Always show YouTube/TikTok warning dots in per-network tab mode. |
| Fixed | Tab semantics | Source platform buttons behave as tabs with accessible labels. | Add `role="tablist"`, `role="tab"`, `aria-selected`, and `Customize post for ...` labels. |
| Fixed | Preview notice | Source preview note names the networks being previewed. | Add dynamic network-specific preview copy. |
| Fixed | YouTube validation | Source includes YouTube Terms/Community Guidelines certification copy. | Add certification copy to YouTube validation alert. |

## Next Scanner Feed

1. Recapture current Sprout source if platform set changes, especially Instagram vs Threads.
2. Continue scan below composer options: schedule, approval, validation, footer actions.
3. Compare opened upload menu, asset library button, AI action, and overflow states against target.

## Interactive Drilldown Run

Run date: 2026-05-05

Artifacts:

- `target/interactive-scan/interactive/target-new-post-interactive-candidates.json`
- `target/interactive-scan/interactive/target-new-post-interactive-clicked.json`
- `target/matrix-scan-rerun/matrix-results.json`

Coverage:

| Matrix | Result |
|---|---|
| Platform tabs: Facebook / Instagram / YouTube / TikTok | Captured no-media, image, and video states. |
| Selected channel by platform | Captured single-channel Facebook, Instagram, YouTube, and TikTok states. |
| Creative type | Captured no-media, image, and video states. |
| Clear All profiles | Captured no-profile state. |

Findings fed to main flow:

| Status | Finding | Resolution |
|---|---|---|
| Fixed | Validation section was global and showed Facebook/YouTube/TikTok errors even when those platforms were not selected. | Validation now scopes to selected profile platforms. |
| Fixed | Platform tabs and preview used fixed `NETWORKS` instead of selected profile platforms. | Tabs and preview now derive from selected channels. |
| Fixed | `Clear All` profiles still showed all-network preview fallback. | No-profile state now disables customize and prompts profile selection. |
| Fixed | `Schedule all` appeared even when only one platform remained selected. | Footer now uses `Schedule all` only when more than one platform is selected. |
| Fixed | YouTube/TikTok image-only preview implied image creative was valid. | YouTube/TikTok preview now shows video-required error when creative is image/no-video. |
| Backlog | Mixed image + video preview collapses to video treatment. | Needs a richer multi-media preview/gallery model; not fixed in this batch. |

## Batch 2 Current Source Recapture

Run date: 2026-05-05

Artifacts:

- `source/screenshots/sprout-new-post-current-top.png`
- `source/interactive/sprout-new-post-current-top.json`
- `source/interactive-scan-current/interactive/sprout-new-post-current-candidates.json`
- `source/interactive-scan-current/interactive/sprout-new-post-current-clicked.json`

Source evidence:

- Current Sprout composer still shows Instagram in the platform tabs. No Threads replacement was visible in this recapture.
- Active platform in the live source capture was TikTok, with a video creative preview and a visible TikTok phone-style card.
- Top composer controls include emoji, targeting/product catalog, upload media, import asset, custom variable, and disabled Send to AI Assist state when no eligible text action is active.
- Lower composer stack includes TikTok options, Publishing Workflows, Approval Workflow, Mobile Publisher, Labels, Campaign, When to post, and validation with YouTube title/audience errors plus schedule error.

## Batch 2 Target Fixes

Artifacts:

- `target/screenshots/target-new-post-batch2.png`
- `target/interactive-scan-batch2/interactive/target-new-post-batch2-candidates.json`
- `target/interactive-scan-batch2/interactive/target-new-post-batch2-clicked.json`
- `target/drilldown-batch2/screenshots/02-upload-menu.png`
- `target/drilldown-batch2/screenshots/03-mixed-media-preview.png`
- `target/drilldown-batch2/screenshots/04-asset-library-modal.png`
- `target/drilldown-batch2/screenshots/05-drive-picker.png`
- `target/drilldown-batch2/screenshots/06-ai-action.png`
- `target/drilldown-batch2/screenshots/07-tiktok-customize.png`
- `target/drilldown-batch2/drilldown-summary.json`

Fixes completed:

- Fixed mixed image + video preview/gallery parity. Facebook and Instagram now render a multi-cell media gallery and media count instead of collapsing everything to a generic video treatment; YouTube and TikTok still prioritize the video preview while preserving mixed media count.
- Replaced toast-only upload source placeholders with a real picker modal for Asset Library, Bynder, Dropbox, and Google Drive. The modal supports source switching, search chrome, mock assets, and Insert actions that add image/video media.
- Added AI Assist action behavior. Toolbar Send to AI Assist opens the AI panel with action choices; the panel now shows Sprout-like action chips and the selected prompt.
- Deepened workflow/taxonomy/schedule states with approval routing detail, TikTok mobile publisher warning, selected label chips, campaign attribution detail, schedule-by-network toggle, optimal time choices, draft calendar option, and schedule validation.
- Adjusted validation to show YouTube title and audience errors, YouTube certification warning, video subtitle warning, and schedule time error from current visible state.

Verification:

- `npm run build` passed.
- CDP target capture at `1920x900` reported `hasHorizontalOverflow: false`.
- CDP drilldown verified upload menu, source picker modal, Google Drive picker view, mixed media preview, AI action panel, and TikTok customize state.
- Full `npm test` currently fails on pre-existing non-New-Post test harness issues where shell-dependent pages are rendered without `AppShellProvider` or async page skeletons are asserted before content loads. The failing files are outside this batch.

Remaining gaps:

| Severity | Area | Gap |
|---|---|---|
| Medium | Source scanner coverage | The generic source interactive scanner still spends many clicks on background Calendar/sidebar controls because Sprout composer overlays the Calendar URL. A focused composer-only scanner would reduce noise. |
| Medium | Real upload integrations | Picker behavior is mocked; no real Bynder/Dropbox/Drive APIs are wired. |
| Medium | Platform detail parity | YouTube title/audience fields and Instagram collaborator details are still UI-only and not tied into preview captions or validation data. |
| Minor | Mobile composer | Mobile responsive composer state has not been recaptured or compared in this batch. |

Next Fix Batch:

1. Add focused composer-only scanner support so source/target clicks ignore background Calendar controls.
2. Wire YouTube title/audience fields into validation state and preview copy.
3. Add mobile publisher detail state for selected TikTok publisher and reminder timing.
4. Capture and match mobile composer layout.

## Batch 3 Validation Simplification

Run date: 2026-05-05

Artifacts:

- `target/drilldown-batch3/screenshots/01-validation-simple.png`
- `target/drilldown-batch3/validation-summary.json`

Fixes completed:

- Replaced large tinted Ant Design validation cards with a compact Sprout-like list grouped by platform.
- Kept the validation header count and removed repeated "Video subtitles" from the validation count because that warning already appears directly under the media tile.
- Verified mixed video state now shows `3 errors and 2 warnings` with five compact validation lines and no nested alert cards.
- Wired YouTube Video Title and Audience fields into validation state, so the YouTube title/audience errors are now driven by actual form values.

Verification:

- `npm run build` passed after the simplification and after the YouTube field wiring.
- CDP validation drilldown reported `alertCards: 0`, `validationLines: 5`, and no horizontal overflow.

Updated remaining gaps:

| Severity | Area | Gap |
|---|---|---|
| Medium | Source scanner coverage | The generic source interactive scanner still spends many clicks on background Calendar/sidebar controls because Sprout composer overlays the Calendar URL. |
| Medium | Real upload integrations | Picker behavior is mocked; no real Bynder/Dropbox/Drive APIs are wired. |
| Medium | Platform detail parity | YouTube fields now affect validation, but YouTube preview title/metadata still needs a richer source-matched layout. |
| Medium | Mobile publisher | Selected TikTok publisher detail/reminder timing still needs deeper state. |
| Minor | Mobile composer | Mobile responsive composer state has not been recaptured or compared in this batch. |

## Batch 5 Video Upload Parity

Run date: 2026-05-07

Source capture status:

- CDP `9222` was checked before implementation.
- The debuggable Sprout page was still `Failed Posts | Publishing | Sprout Social` at `https://app.sproutsocial.com/publishing/failedposts/`.
- No live Sprout video upload screenshots were captured in this batch. See `source/video-upload/SOURCE-CAPTURE-BLOCKED.md`.

Target artifacts:

- `target/video-upload/screenshots/video-all-networks-1920x900.png`
- `target/video-upload/screenshots/video-facebook-customize-1920x900.png`
- `target/video-upload/screenshots/video-instagram-customize-1920x900.png`
- `target/video-upload/screenshots/video-youtube-customize-1920x900.png`
- `target/video-upload/screenshots/video-tiktok-customize-1920x900.png`
- `target/video-upload/screenshots/video-tiktok-customize-1280x900.png`
- `target/video-upload/video-qa-summary.json`

Fixes completed:

- Added explicit video composer state after video media is inserted, including thumbnail, subtitles, video metadata, and network readiness.
- Added video-specific per-network options for Facebook, Instagram, Threads, YouTube, and TikTok.
- Updated YouTube and TikTok previews to show video-specific metadata and presentation.
- Preserved existing image/mixed media paths while making video behavior distinct.

Verification:

- `npm run build` passed.
- `npx vitest run tests\routes.test.js tests\sidebar-menu.test.js` passed.
- Browser QA at `1920x900` and `1280x900` showed no horizontal overflow in all captured video states.

Updated remaining gaps:

| Severity | Area | Gap |
|---|---|---|
| Critical | Source video evidence | Live Sprout upload video source state still needs to be captured from CDP after the correct tab is opened. |
| Medium | Source-to-target parity | Video options are target-complete for the planned batch, but exact Sprout labels/order need one source recapture pass. |
| Medium | Real upload integrations | Video upload and external source selection remain mocked. |
| Medium | Mobile composer | Mobile video composer has not been recaptured or compared. |

Next Fix Batch:

1. Switch CDP `9222` to the live Sprout video upload composer and run focused source capture.
2. Compare live source labels/order against the target video option panels.
3. Adjust any mismatched video-specific controls in one small follow-up patch.
4. Capture mobile video composer if it becomes part of the accepted scope.

## Batch 6 All Networks No-media Scan

Run date: 2026-05-07

Source artifacts:

- `source/all-networks-no-media/screenshots/source-all-networks-no-media-composer-top.png`
- `source/all-networks-no-media/screenshots/source-all-networks-no-media-composer-lower.png`
- `source/all-networks-no-media/screenshots/source-all-networks-no-media-composer-bottom.png`
- `source/all-networks-no-media/dom/source-all-networks-no-media-composer-top.txt`
- `source/all-networks-no-media/interactive/source-all-networks-no-media-composer-top.json`
- `source/all-networks-no-media/all-networks-no-media-source-scan.json`

Source findings:

| Area | Source evidence |
|---|---|
| Profile selector | Red validation border, horizontally scrollable selected chips, disconnected red Instagram chip, and `6 more...`. |
| All Networks editor | `This is a story` switch inside the editor, italic `Start writing your post...`, compact empty media tile, toolbar icons, and `500` remaining count. |
| Post controls | `Customize post per network` and `This is a Draft` sit on the same row. |
| Lower options | First Comment, Instagram Options, TikTok Options, Publishing Workflows, Sprout Tags, Promote, When to post, and validation are all visible in that order. |
| Validation | Header is `6 errors and 2 warnings`; groups are Facebook, Instagram, YouTube, TikTok, and All Networks. |
| Preview | Empty right preview uses fixed approximation copy and skeleton card until a profile/content combination is selected. |

Target fixes completed:

| Status | Area | Resolution |
|---|---|---|
| Fixed | Profile selector | Default selected profile set now matches source-visible platforms and disconnected profile state; selector shows red border, red chip, and `6 more...`. |
| Fixed | Editor | Added story switch, compact no-media tile, source-like toolbar order, and source-like composer width at `1280x900`. |
| Fixed | Control row | Draft switch moved beside Customize control. |
| Fixed | All Networks option stack | Added global Instagram and TikTok option panels before Publishing Workflows. |
| Fixed | Schedule | Replaced single time picker with split hour/minute/period selects and source-like secondary schedule links. |
| Fixed | Validation | No-media All Networks now reports `6 errors and 2 warnings` with source-matched platform groups and copy. |
| Fixed | Interactions | Upload menu and Customize tabs were captured and verified with no horizontal overflow. |

Remaining gaps:

| Severity | Area | Gap |
|---|---|---|
| Medium | Source interaction depth | Profile selector menu, schedule dropdown, and lower option popovers were not exhaustively clicked in live Sprout during this pass. |
| Medium | Integrations | Upload sources, posting, scheduling, profile reconnect, labels, and campaigns remain local mocks. |
| Minor | Visual system | Target uses Social Hub shell and Ant Design primitives rather than Sprout's exact chrome. |

Next Fix Batch:

1. Capture opened source states for profile selector, schedule dropdown, label/campaign selector, and upload menu.
2. Compare those source menus against current target interactions.
3. Patch only interaction/menu mismatches; keep the All Networks no-media layout stable.

## Batch 7 Interaction + Polish Scan

Run date: 2026-05-07

Source interaction capture:

- `source/all-networks-no-media/interactions/interaction-manifest.json`
- Source was no longer in a clean no-media default state during this attempt: AI Assist was active and the composer contained typed caption text.
- Keep these source artifacts as supplemental interaction evidence only.

Target interaction artifacts:

- `target/all-networks-no-media/interactions/target-profile-selector-open.png`
- `target/all-networks-no-media/interactions/target-labels-menu-open.png`
- `target/all-networks-no-media/interactions/target-campaign-menu-open.png`
- `target/all-networks-no-media/interactions/target-schedule-mode-open.png`
- `target/all-networks-no-media/interactions/target-options-polished.png`
- `target/all-networks-no-media/interactions/interaction-summary.json`

Fixes completed:

| Status | Area | Resolution |
|---|---|---|
| Fixed | Accordion separation | PublishingOptions cards now have their own rounded borders and `16px` vertical gaps, matching Sprout's separated section rhythm. |
| Fixed | Instagram Options layout | Post Link, Help Center link, and Invite Collaborators button are left-aligned and no longer stretch full-width. |
| Fixed | Toolbar affordances | Toolbar now names the source-visible Branded Content sponsor and Product Catalog controls. |
| Fixed | Target menu coverage | Profile selector, Labels, Campaign, and Schedule mode opened states were captured and verified. |
| Partial | Source opened-state parity | Source opened-state capture needs a clean reset to the no-media default composer before exact menu-to-menu comparison. |

Remaining gaps:

| Severity | Area | Gap |
|---|---|---|
| Medium | Clean source interaction states | Need a fresh Sprout no-media default state before capturing upload/profile/labels/campaign menus as golden source. |
| Medium | Upload source parity | Target upload menu is functional and mocked, but exact Sprout menu order/disabled states still need clean source capture. |
| Medium | Real integrations | Profile reconnect, upload, label/campaign persistence, schedule/publish remain mocked. |

Next Fix Batch:

1. Reset Sprout to All Networks/no-media with Network Preview active.
2. Recapture opened source profile selector, upload menu, labels, campaign, and schedule mode.
3. Patch only any remaining exact menu-order or disabled-state mismatches.

## Batch 8 Schedule Parity Fix

Run date: 2026-05-07

User-provided source evidence:

- Sprout schedule screenshot showing `Promote`, then `When to post` with the mode select inline beside the title.
- Sprout schedule screenshot showing Date, split Time selects, `Use Optimal Times`, delete icon, expanded `Advanced Scheduling`, and `Time zone`.

Target artifact:

- `target/all-networks-no-media/target-schedule-sprout-polish-1280x900.png`

Fixes completed:

| Status | Area | Resolution |
|---|---|---|
| Fixed | Schedule header | Moved the schedule mode Select into the `When to post` label row, keeping the collapse arrow at the far right. |
| Fixed | Extra All Networks rows | Removed `Show draft on calendar (optional)` and hid `Schedule by network` outside customize/per-network mode. |
| Fixed | Advanced Scheduling | Added expanded state with `Time zone` and the source-visible `Bangkok, Hanoi, Jakarta (UTC +07:00)` option. |
| Fixed | 1280 layout | Tightened Date/Time/Optimal Times/delete grid so the controls render inside the card without visible clipping. |

Verification:

- Header schedule dropdown opens.
- `Advanced Scheduling` toggles closed and open.
- Target page has no document-level horizontal overflow at `1280x900`.
- `npm run build` passed.
- `npx vitest run tests\routes.test.js tests\sidebar-menu.test.js` passed.

Remaining gaps:

| Severity | Area | Gap |
|---|---|---|
| Medium | Exact source menu state | Need clean live Sprout capture for the schedule mode dropdown item order/disabled states. |
| Medium | Integrations | Real scheduling and optimal time calculation remain mocked. |

Next Fix Batch:

1. Recapture clean Sprout schedule dropdown and optimal-time popover states.
2. Compare source menu item order/disabled states against the target.
3. Patch only schedule menu/popover mismatches.

## Batch 9 Uploaded One Video Scan

Run date: 2026-05-07

Source evidence:

- `source/video-uploaded-one/screenshots/source-video-uploaded-top.png`
- `source/video-uploaded-one/screenshots/source-video-uploaded-editor-media.png`
- `source/video-uploaded-one/screenshots/source-video-uploaded-youtube-options.png`
- `source/video-uploaded-one/screenshots/source-video-uploaded-preview-mid.png`
- `source/video-uploaded-one/screenshots/source-video-uploaded-bottom-validation.png`
- `source/video-uploaded-one/source-video-uploaded-scan.json`

Target evidence:

- `target/video-uploaded-one/screenshots/target-video-uploaded-top-1280x900.png`
- `target/video-uploaded-one/screenshots/target-video-uploaded-mid-1280x900.png`
- `target/video-uploaded-one/screenshots/target-video-uploaded-bottom-1280x900.png`
- `target/video-uploaded-one/screenshots/target-video-uploaded-top-1920x900.png`
- `target/video-uploaded-one/screenshots/target-video-uploaded-mid-1920x900.png`
- `target/video-uploaded-one/target-video-uploaded-qa-metrics.json`

Fixes completed:

| Status | Area | Resolution |
|---|---|---|
| Fixed | Uploaded media tile | Target now uses a compact video thumbnail tile with warning state, edit affordance, second add-media tile, subtitle link, and missing-subtitle note. |
| Fixed | All Networks video section order | Target now includes Facebook Video Options, Instagram Options, YouTube Video Options, and TikTok Options in the source-visible video order. |
| Fixed | Facebook video options | Target reduced the panel to `Publish video as` and `Category (Facebook Only)`. |
| Fixed | YouTube video options | Target added Shorts notice, tags, required title, privacy/category row, playlist, audience radios, age restriction radios, and advanced settings button. |
| Fixed | TikTok options | Target removed the prior mock privacy/cover controls from All Networks and keeps the three source-visible checkboxes. |
| Fixed | Validation | Target one-video state now reports `5 errors and 2 warnings`, including Instagram width and YouTube title requirements. |
| Fixed | Preview | Target renders vertical video mock previews for source-visible networks without copying private source media. |

Remaining gaps:

| Severity | Area | Gap |
|---|---|---|
| Medium | Source media asset | Target uses a safe mock thumbnail instead of copying the private uploaded video still. |
| Medium | Opened edit/subtitle states | Source edit-video and subtitle upload panels were not clicked in this pass. |
| Medium | Real integrations | Upload, subtitles, optimal times, scheduling, and publishing remain mocked. |

Next Fix Batch:

1. Safely capture source opened states for the video edit affordance and `Add video subtitles`.
2. Patch local mocked edit/subtitle panels if those source states are in scope.
3. Recheck per-network customize mode after one uploaded video.

## Batch 10 YouTube Radio Polish

Run date: 2026-05-07

Target evidence:

- `target/video-uploaded-one/screenshots/target-youtube-radio-polish-audience-1280x900.png`
- `target/video-uploaded-one/youtube-radio-polish-metrics.json`

Fix completed:

| Status | Area | Resolution |
|---|---|---|
| Fixed | YouTube Audience/Age restriction radio layout | Scoped radio wrapper CSS so Ant Design radio labels stay inline with their radio controls, matching the Sprout source block. |

Verification:

- Browser metrics reported `allSameRow: true`.
- `npm run build` passed.
- `npx vitest run tests\routes.test.js tests\sidebar-menu.test.js` passed.

## Batch 11 Deep Video Interactions

Run date: 2026-05-07

Source evidence:

- `source/video-uploaded-one/deep-interactions/screenshots/after-click-add-video-subtitles.png`
- `source/video-uploaded-one/deep-interactions/screenshots/customize-tab-customize-post-for-facebook.png`
- `source/video-uploaded-one/deep-interactions/screenshots/customize-tab-customize-post-for-youtube.png`
- `source/video-uploaded-one/deep-interactions/screenshots/customize-tab-customize-post-for-tiktok.png`
- DOM text and interactive inventories are stored beside those screenshots.

Target evidence:

- `target/video-uploaded-one/deep-interactions/screenshots/video-options-modal-1280x900.png`
- `target/video-uploaded-one/deep-interactions/screenshots/subtitles-generated-1280x900.png`
- `target/video-uploaded-one/deep-interactions/screenshots/video-edit-modal-1280x900.png`
- `target/video-uploaded-one/deep-interactions/screenshots/youtube-advanced-1280x900.png`
- `target/video-uploaded-one/deep-interactions/screenshots/facebook-video-tab-1280x900.png`
- `target/video-uploaded-one/deep-interactions/screenshots/tiktok-video-tab-1280x900.png`
- Matching `1920x900` target screenshots and metrics are in `target/video-uploaded-one/deep-interactions/`.

Fixes completed:

| Status | Area | Resolution |
|---|---|---|
| Fixed | Subtitle interaction | `Add video subtitles` now opens a `Video Options` modal instead of directly flipping hidden state. |
| Fixed | Video tile edit | The uploaded video pencil now opens the same `Video Options` modal. |
| Fixed | Modal parity | Target modal includes preview frame, scrubber, frame pager, required title, subtitle actions, and Save/Cancel footer. |
| Fixed | Subtitle actions | `Upload` and `Generate by AI Assist` update local subtitle status without opening private file pickers. |
| Fixed | YouTube advanced | `Show Advanced Settings` now expands functional YouTube controls instead of being a dead button. |
| Fixed | Draft label polish | Draft mode now switches the header to `New Draft` and All Networks footer action to `Save`. |

Remaining gaps:

| Severity | Area | Gap |
|---|---|---|
| Medium | Exact YouTube advanced source | Need a clean Sprout source capture with `Show Advanced Settings` opened; current source session had customized draft state and blocked one click path. |
| Medium | Source media asset | Target continues to use a safe mock video still rather than copying private source media. |
| Medium | Real integrations | Upload file picker, subtitle parsing, AI generation, scheduling, and publishing remain mocked. |

Verification:

- Target interaction metrics reported no document or body horizontal overflow at `1280x900` and `1920x900`.
- `npm run build` passed.
- `npx vitest run tests\routes.test.js tests\sidebar-menu.test.js` passed.

## Batch 12 AI Assist Threshold And Customize Clarification

Run date: 2026-05-08

Fixes completed:

| Status | Area | Resolution |
|---|---|---|
| Fixed | AI Assist threshold | Toolbar AI Assist now follows the source-visible disabled copy: it requires at least 10 non-whitespace caption characters before enabling. |
| Clarified | Customize mode | `Customize post per network` remains reversible. The stale queue wording that described one-way behavior was corrected. |

Verification:

- `npx vitest run tests\publishing-new-post-interactions.test.jsx tests\publishing-new-post-composer-state.test.js` passed.

## Batch 13 SH-NP-002 Follow-up

Run date: 2026-05-08

Fixes completed:

| Status | Area | Resolution |
|---|---|---|
| Fixed | Source-target gap report | Added `SH-NP-002-SOURCE-TARGET-GAP-REPORT.md` using existing New Post evidence. |
| Fixed | Schedule optimal times | `Use Optimal Times` now stays disabled until a schedule date exists and applies selected optimal times to the chosen date. |
| Fixed | First Comment accessibility | All Networks and Instagram First Comment text areas now have explicit accessible labels; All Networks edit behavior has route-level coverage. |
| Fixed | TikTok option state | TikTok comments, duets, and stitches controls are now controlled by composer state instead of uncontrolled defaults. |
| Fixed | Selected channel removal | Selected channel chips now expose accessible remove labels and have route/browser coverage. |

Verification:

- `npx vitest run tests\publishing-new-post-composer-state.test.js tests\publishing-new-post-interactions.test.jsx` passed.
- `npm run verify` passed.
- Browser QA summary: `target/batch13-interactions/browser-qa-summary.json`.

## Batch 14 Collaborators Mock Resource

Run date: 2026-05-08

Fixes completed:

| Status | Area | Resolution |
|---|---|---|
| Fixed | Instagram Collaborators | `Invite Collaborators` now opens a safe local Publishing Resources drawer instead of acting as a static/dead control. |
| Documented blocker | Real collaborator invites | Drawer copy states that real collaborator selection, validation, and submission require API contracts. |

Verification:

- `npx vitest run tests\publishing-new-post-interactions.test.jsx tests\publishing-new-post-composer-state.test.js` passed.
- `npm run verify` passed.
- Browser QA summary: `target/batch14-collaborators/browser-qa-summary.json`.
