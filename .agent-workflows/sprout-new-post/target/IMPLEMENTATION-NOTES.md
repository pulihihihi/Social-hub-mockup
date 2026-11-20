# Sprout New Post Target Implementation Notes

## Batch 2 - 2026-05-05

Changed files:

- `src/pages/PublishingNewPost/index.jsx`
- `src/pages/PublishingNewPost/PublishingNewPost.css`
- `.agent-workflows/sprout-new-post/reports/SPROUT-NEW-POST-DIFFERENCE-SCAN.md`

Implemented:

- Mixed image + video gallery preview for Facebook and Instagram.
- Video-first mixed media handling for YouTube and TikTok with media count context.
- Asset source picker modal for Asset Library, Bynder, Dropbox, and Google Drive.
- AI Assist action chips and toolbar handoff into the AI panel.
- Deeper publishing workflow, mobile publisher, label, campaign, schedule-by-network, optimal-time, and validation states.

Notes:

- External media integrations remain mocked by design for this frontend parity batch.
- Current source recapture confirms Instagram remains present in Sprout platform tabs; Threads was not visible.

## Batch 3 - 2026-05-05

Implemented:

- Simplified the validation block to match Sprout's compact grouped list instead of large alert cards.
- Removed duplicate video subtitle warning from validation count.
- Wired YouTube Video Title and Audience fields into validation state.

Verification:

- `npm run build` passed.
- CDP validation drilldown captured `target/drilldown-batch3/screenshots/01-validation-simple.png`.

## Batch 4 - 2026-05-06

Implemented:

- Tightened the New Post responsive grid below `1280px` so the composer and preview remain two columns on narrow desktop widths.
- Added a true single-column fallback below `1024px` with page-level scrolling and sticky footer behavior.

Verification:

- Browser QA confirmed New Post opens locally at `/publishing/new-post`.
- Headless Chrome captures at `1920x900` and `1280x900` confirmed no preview/editor overlap.
- Browser interaction checks confirmed customize-per-network and schedule-by-network remain reversible.
- `npm run build` passed.

## Batch 5 - 2026-05-07

Implemented:

- Promoted video to a first-class composer state with explicit `videoDetails`, media content type detection, and mock video metadata on inserted video assets.
- Added a video upload details panel below the media tile with thumbnail, subtitles, per-network readiness rows, and subtitle warning state.
- Expanded per-network customize behavior for video: Facebook video placement/title/category, Instagram Reel settings, Threads video reply/alt text, YouTube thumbnail/subtitle/privacy/category, and TikTok privacy/cover options.
- Updated video previews for YouTube and TikTok so the preview reflects video title/privacy and video-specific presentation instead of using the generic image/mixed layout only.

Notes:

- Source video capture was blocked because CDP `9222` was still on Sprout Failed Posts, not the live upload video composer.
- No real upload, posting, scheduling, or external media integration was added.

## Batch 6 - 2026-05-07

Implemented:

- Captured live Sprout All Networks/no-media composer from CDP `9222` and used it as the source for this pass.
- Matched the no-media All Networks profile selector state: selected profiles include disconnected Instagram/YouTube profiles, red profile selector border, visible disconnected chip, `6 more...`, and compact horizontal chip row.
- Added the Sprout-like `This is a story` row inside the editor and moved `This is a Draft` onto the same row as `Customize post per network`.
- Adjusted the empty media tile, editor toolbar icon order, character counters, and empty Network Preview copy/skeleton to match the captured no-media state more closely.
- Added global All Networks `Instagram Options` and `TikTok Options` panels before Publishing Workflows, while preserving per-network/video-specific options.
- Updated schedule UI to use split hour/minute/period selects, dashed Promote CTA, empty Sprout Tags default, and source-matched validation grouping/count (`6 errors and 2 warnings`).
- Tightened the New Post split grid so the composer width at `1280x900` matches the captured Sprout modal proportions more closely.

Notes:

- Target still uses the Social Hub app shell and Ant Design primitives, but the composer content, order, labels, and validation state now follow the live Sprout All Networks/no-media source.
- Real upload/post/schedule integrations remain mocked.

## Batch 7 - 2026-05-07

Implemented:

- Polished All Networks option sections so each PublishingOptions item renders as its own rounded card with a `16px` gap, matching Sprout's separated accordion stack instead of an attached Ant Design list.
- Fixed Instagram Options alignment: Post Link and Collaborators links are left-aligned, and `Invite Collaborators` no longer stretches full width.
- Updated TikTok checkbox styling and toolbar affordance naming to better match Sprout's dark checked boxes, Branded Content, and Product Catalog controls.
- Captured safe interaction states for target profile selector, labels menu, campaign menu, schedule mode menu, upload menu, and polished option stack.

Notes:

- CDP source interaction capture was attempted, but the live Sprout session had moved into a non-default state with AI Assist active and typed caption text. Those artifacts are retained as supplemental evidence, not as the default source baseline.

## Batch 8 - 2026-05-07

Implemented:

- Reworked the All Networks `When to post` header so `Specific Days & Times` sits inline beside the section title, matching the Sprout schedule header instead of floating as a right-side extra.
- Removed the All Networks-only schedule rows that were not visible in the source screenshot: `Show draft on calendar (optional)` and `Schedule by network`.
- Preserved `Schedule by network` for `Customize post per network`, where the deeper per-network scheduling interaction still belongs.
- Added expanded `Advanced Scheduling` state with a `Time zone` select defaulted to `Bangkok, Hanoi, Jakarta (UTC +07:00)`.
- Tightened the schedule row grid at `1280x900` so Date, Time, `Use Optimal Times`, and delete icon stay inside the Sprout-like card.

Verification:

- Captured `target/all-networks-no-media/target-schedule-sprout-polish-1280x900.png`.
- Confirmed schedule mode dropdown opens from the collapse header.
- Confirmed `Advanced Scheduling` collapses and expands without losing the time zone control.
- `npm run build` passed.
- `npx vitest run tests\routes.test.js tests\sidebar-menu.test.js` passed.

## Batch 9 - 2026-05-07

Implemented:

- Captured the live Sprout All Networks composer after one video had already been uploaded via CDP `9222`.
- Replaced the custom blue editor video details panel with the source-like compact uploaded-video tile, warning badge, edit affordance, second add-media tile, subtitle link, and missing-subtitle note.
- Added source-visible All Networks video sections for Facebook Video Options and YouTube Video Options, while keeping Instagram Options and TikTok Options in the captured order.
- Tightened Facebook Video Options to `Publish video as` plus `Category (Facebook Only)`.
- Reworked YouTube Video Options to match source: Shorts info notice, tags, required title, Privacy, Category, Playlist, Audience, Age restriction, and `Show Advanced Settings`.
- Simplified video TikTok Options to the three source-visible checkboxes.
- Updated uploaded-video validation to `5 errors and 2 warnings`, including Instagram video width, disconnected profiles, YouTube title, YouTube certification, and schedule errors.
- Updated video previews to use vertical video mock previews for Facebook, Instagram, YouTube Shorts, TikTok, and Threads without copying the private source media asset.

Verification:

- Captured target screenshots in `target/video-uploaded-one/screenshots/`.
- `target/video-uploaded-one/target-video-uploaded-qa-metrics.json` reports no document, composer, or preview horizontal overflow.
- `npm run build` passed.
- `npx vitest run tests\routes.test.js tests\sidebar-menu.test.js` passed.

## Batch 10 - 2026-05-07

Implemented:

- Fixed the YouTube Audience and Age restriction radio layout in the uploaded-video state.
- Scoped an override for `.publishing-new-post-youtube-radio-block .ant-radio-wrapper` so Ant Design radio labels are no longer affected by the generic option-grid `label` rule.

Verification:

- Captured `target/video-uploaded-one/screenshots/target-youtube-radio-polish-audience-1280x900.png`.
- Browser metrics confirm all YouTube radio labels share the same row as their radio control.
- `npm run build` passed.
- `npx vitest run tests\routes.test.js tests\sidebar-menu.test.js` passed.

## Batch 11 - 2026-05-07

Implemented:

- Captured deeper live Sprout interaction states from CDP `9222` under `source/video-uploaded-one/deep-interactions/`.
- Added a source-like `Video Options` modal that opens from both the video tile pencil and `Add video subtitles`.
- Added mock subtitle actions inside the modal: `Upload` marks subtitles as uploaded, and `Generate by AI Assist` marks subtitles as generated.
- Added the source-visible modal structure: video preview frame, scrubber, frame pager, `Video Title (Required)`, `Subtitle Files`, and Save/Cancel footer.
- Made `Show Advanced Settings` functional for YouTube Video Options with License, embedding, subscriber notification, and paid-promotion controls.
- Adjusted draft polish: top bar changes to `New Draft` when draft mode is enabled, and All Networks draft footer uses `Save` instead of `Save all`.

Notes:

- Subtitle upload and AI generation remain local mock state only.
- Sprout source confirmed `Add video subtitles` opens `Video Options`; exact YouTube advanced opened source state still needs a cleaner source capture because the live Sprout session was already in a customized draft/viewport state.

Verification:

- Captured target deep interaction screenshots in `target/video-uploaded-one/deep-interactions/screenshots/`.
- Browser metrics at `1280x900` and `1920x900` report no document or body horizontal overflow for video modal, subtitle generation, YouTube advanced, and Facebook/YouTube/TikTok customize tabs.
- `npm run build` passed.
- `npx vitest run tests\routes.test.js tests\sidebar-menu.test.js` passed.

## Batch 12 - 2026-05-08

Implemented:

- Preserved the correct reversible `Customize post per network` behavior and corrected stale delivery notes that described it as one-way.
- Locked the composer AI Assist toolbar action to the source-visible 10-character threshold. The action now remains disabled for empty or short captions and enables once the caption has at least 10 non-whitespace characters.
- Added a New Post route interaction regression covering the disabled, short-caption, and enabled AI Assist states.

Verification:

- `npx vitest run tests\publishing-new-post-interactions.test.jsx tests\publishing-new-post-composer-state.test.js` passed.

## Batch 13 - 2026-05-08

Implemented:

- Added `SH-NP-002` source-target gap report from existing New Post evidence and used it to choose the next frontend-only fix batch.
- Tightened `Use Optimal Times`: it is disabled until a schedule date exists, carries an accessible label, and applies selected optimal times onto the selected date instead of an unrelated current date.
- Added accessible labels for All Networks and Instagram First Comment text areas, then covered All Networks editing with a route-level interaction test.
- Moved TikTok `Allow comments`, `Allow duets`, and `Allow stitches` into controlled composer state so values persist and participate in unsaved-change detection.
- Added accessible remove labels for selected channel chips and covered removing the selected Facebook channel from the composer trigger.
- Moved schedule optimal-time helpers into `publishingScheduleUtils.js` to keep component exports clean.

Verification:

- `npx vitest run tests\publishing-new-post-composer-state.test.js tests\publishing-new-post-interactions.test.jsx` passed.
- `npm run verify` passed: lint, import graph, deadcode, 36 Vitest files / 133 tests, and production build.
- Browser QA via Edge CDP at `1280x900` passed for AI threshold, First Comment focus/edit, TikTok controlled toggle, disabled optimal-time state, selected channel removal, and no horizontal overflow.
- Browser QA artifacts: `target/batch13-interactions/browser-qa-summary.json`, `target/batch13-interactions/screenshots/01-baseline.png`, `target/batch13-interactions/screenshots/02-after-interactions.png`, `target/batch13-interactions/screenshots/03-channel-removed-confirmed.png`.

## Batch 14 - 2026-05-08

Implemented:

- Connected Instagram `Invite Collaborators` to a safe local Publishing Resources drawer so the source-visible action is no longer a dead control.
- Added Instagram collaborators resource content that explicitly marks the invite flow as a safe mock until API contracts exist.
- Added route-level regression coverage for opening the collaborators resource state.

Verification:

- `npx vitest run tests\publishing-new-post-interactions.test.jsx tests\publishing-new-post-composer-state.test.js` passed.
- `npm run verify` passed: lint, import graph, deadcode, 36 Vitest files / 134 tests, and production build.
- Browser QA via Edge CDP at `1280x900` confirmed the collaborators drawer opens, safe mock copy is visible, and no horizontal overflow is introduced.
- Browser QA artifacts: `target/batch14-collaborators/browser-qa-summary.json`, `target/batch14-collaborators/screenshots/01-instagram-collaborators-drawer.png`.
