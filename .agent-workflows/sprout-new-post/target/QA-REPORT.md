# Sprout New Post Target QA

## Batch 2 - 2026-05-05

Viewport: `1920x900`

Artifacts:

- `target/screenshots/target-new-post-batch2.png`
- `target/drilldown-batch2/screenshots/02-upload-menu.png`
- `target/drilldown-batch2/screenshots/03-mixed-media-preview.png`
- `target/drilldown-batch2/screenshots/04-asset-library-modal.png`
- `target/drilldown-batch2/screenshots/05-drive-picker.png`
- `target/drilldown-batch2/screenshots/06-ai-action.png`
- `target/drilldown-batch2/screenshots/07-tiktok-customize.png`
- `target/drilldown-batch3/screenshots/01-validation-simple.png`

Checks:

- Page loads at `/publishing/new-post`.
- No page-level horizontal overflow detected by CDP capture.
- Upload menu opens and inserts image/video media.
- Mixed image + video preview renders as a gallery in Network Preview.
- Asset Library modal opens and source switch to Google Drive works.
- AI Assist action selection updates the AI panel prompt.
- TikTok per-network customize state opens with TikTok options and validation stack.
- Validation stack is now a compact Sprout-like grouped list, not large alert cards.
- YouTube title and audience controls now drive the matching validation errors.

Commands:

- `npm run build` passed.
- `npm run build` passed again after the validation simplification.
- `npm test` failed outside this batch due existing shell-provider/skeleton test harness failures. New Post page build path is clean.

## Batch 4 - 2026-05-06

Viewport coverage: `1920x900`, `1280x900`, and current in-app browser viewport.

Artifacts:

- `target/screenshots/target-new-post-1920x900-after-wait.png`
- `target/screenshots/target-new-post-1280x900-responsive-final.png`

Checks:

- Page opens in browser QA at `/publishing/new-post`.
- Desktop split composer at `1920x900` keeps the left composer and right Network Preview separated.
- Narrow desktop at `1280x900` keeps a tighter two-column composer instead of letting the preview skeleton overlap the editor.
- Current in-app browser narrow viewport stacks safely without preview/editor overlap.
- `Customize post per network` toggles on and off.
- Per-network mode exposes semantic tabs for Facebook, Instagram, YouTube, and TikTok.
- `Schedule by network` creates 4 network schedule rows, then collapses back to 0 network rows when toggled off.

Commands:

- `npx vitest run tests\routes.test.js tests\sidebar-menu.test.js` passed.
- `npm run build` passed.

Notes:

- `npx vitest run tests\routed-pages-migration.test.jsx` still fails in pre-existing non-New-Post jsdom coverage for Active Topics, Reports, Settings, and deprecated settings redirects.

## Batch 5 - 2026-05-07

Viewport coverage: `1920x900` and `1280x900`

Artifacts:

- `target/video-upload/screenshots/video-all-networks-1920x900.png`
- `target/video-upload/screenshots/video-facebook-customize-1920x900.png`
- `target/video-upload/screenshots/video-instagram-customize-1920x900.png`
- `target/video-upload/screenshots/video-youtube-customize-1920x900.png`
- `target/video-upload/screenshots/video-tiktok-customize-1920x900.png`
- `target/video-upload/screenshots/video-tiktok-customize-1280x900.png`
- `target/video-upload/video-qa-summary.json`

Checks:

- Page opens locally at `/publishing/new-post`.
- Mock video can be inserted from Asset Library and renders as a dedicated video composer state.
- `Customize post per network` remains reversible and exposes video-specific Facebook, Instagram, YouTube, and TikTok states.
- YouTube and TikTok previews render video-specific cards.
- All captured target states reported `hasHorizontalOverflow: false`.

Commands:

- `npm run build` passed.
- `npx vitest run tests\routes.test.js tests\sidebar-menu.test.js` passed.

Notes:

- A jsdom interaction test for the video composer was not kept because Ant Design modal/popover behavior timed out in the current unit-test harness.
- Live Sprout source capture for video upload is still pending because CDP `9222` was on Failed Posts during this batch.

## Batch 6 - 2026-05-07

Viewport coverage: `1920x900` and `1280x900`

Source artifacts:

- `source/all-networks-no-media/screenshots/source-all-networks-no-media-composer-top.png`
- `source/all-networks-no-media/screenshots/source-all-networks-no-media-composer-lower.png`
- `source/all-networks-no-media/screenshots/source-all-networks-no-media-composer-bottom.png`
- `source/all-networks-no-media/all-networks-no-media-source-scan.json`

Target artifacts:

- `target/all-networks-no-media/screenshots/target-all-networks-no-media-1920x900-top.png`
- `target/all-networks-no-media/screenshots/target-all-networks-no-media-1920x900-bottom.png`
- `target/all-networks-no-media/screenshots/target-all-networks-no-media-1280x900-top.png`
- `target/all-networks-no-media/screenshots/target-all-networks-no-media-1280x900-bottom.png`
- `target/all-networks-no-media/screenshots/target-all-networks-no-media-upload-menu-1280x900.png`
- `target/all-networks-no-media/screenshots/target-all-networks-no-media-customize-tabs-1280x900.png`
- `target/all-networks-no-media/qa-metrics.json`

Checks:

- Page opens locally at `/publishing/new-post`.
- All Networks/no-media state shows profile selector issue styling, story toggle, draft toggle, First Comment, Instagram Options, TikTok Options, Publishing Workflows, Sprout Tags, Promote, schedule, and validation sections.
- Validation count is `6 errors and 2 warnings`, with Facebook, Instagram, YouTube, TikTok, and All Networks groups matching source order.
- Upload menu opens and shows disabled Upload Document plus Upload Image(s), Upload Video, Bynder, Dropbox, Google Drive, and Asset Library options.
- `Customize post per network` exposes selected-source-visible tabs for Facebook, Instagram, YouTube, and TikTok.
- Captures at `1920x900` and `1280x900` reported `hasHorizontalOverflow: false`.

Commands:

- `npm run build` passed.
- `npx vitest run tests\routes.test.js tests\sidebar-menu.test.js` passed.

## Batch 7 - 2026-05-07

Viewport coverage: `1280x900`

Target artifacts:

- `target/all-networks-no-media/interactions/target-profile-selector-open.png`
- `target/all-networks-no-media/interactions/target-upload-menu-open.png`
- `target/all-networks-no-media/interactions/target-labels-menu-open.png`
- `target/all-networks-no-media/interactions/target-campaign-menu-open.png`
- `target/all-networks-no-media/interactions/target-schedule-mode-open.png`
- `target/all-networks-no-media/interactions/target-options-polished.png`
- `target/all-networks-no-media/interactions/interaction-summary.json`

Source supplemental artifacts:

- `source/all-networks-no-media/interactions/interaction-manifest.json`

Checks:

- Option sections are now separated cards, not a single attached collapse stack.
- Instagram Options links and Invite Collaborators button align left and keep Sprout-like width.
- Labels and Campaign menus open with visible options.
- Schedule mode menu opens with Immediately, Auto-schedule with Sprout Queue, and Specific Days & Times.
- Profile selector opens with selected chips, profile collections, platform groups, selected rows, and disabled/disconnected profile styling.
- Captured target metrics report no horizontal overflow.

Commands:

- `npm run build` passed.
- `npx vitest run tests\routes.test.js tests\sidebar-menu.test.js` passed.

## Batch 8 - 2026-05-07

Viewport coverage: `1280x900`

Target artifacts:

- `target/all-networks-no-media/target-schedule-sprout-polish-1280x900.png`

Checks:

- `When to post` header now keeps `Specific Days & Times` inline beside the title and the collapse chevron at the far right.
- All Networks schedule no longer shows `Show draft on calendar (optional)` or `Schedule by network`, matching the provided Sprout screenshot.
- Date, split Time selects, `Use Optimal Times`, and delete icon stay visually inside the schedule card at `1280x900`.
- `Advanced Scheduling` is expanded by default and exposes `Time zone` with `Bangkok, Hanoi, Jakarta (UTC +07:00)`.
- Schedule mode dropdown opens from the header, and `Advanced Scheduling` toggles closed/open successfully.
- Document-level QA reported no horizontal page overflow.

Commands:

- `npm run build` passed.
- `npx vitest run tests\routes.test.js tests\sidebar-menu.test.js` passed.

## Batch 9 - 2026-05-07

Viewport coverage: `1280x900` and `1920x900`

Source artifacts:

- `source/video-uploaded-one/screenshots/source-video-uploaded-top.png`
- `source/video-uploaded-one/screenshots/source-video-uploaded-preview-mid.png`
- `source/video-uploaded-one/screenshots/source-video-uploaded-bottom-validation.png`

Target artifacts:

- `target/video-uploaded-one/screenshots/target-video-uploaded-top-1280x900.png`
- `target/video-uploaded-one/screenshots/target-video-uploaded-mid-1280x900.png`
- `target/video-uploaded-one/screenshots/target-video-uploaded-bottom-1280x900.png`
- `target/video-uploaded-one/screenshots/target-video-uploaded-top-1920x900.png`
- `target/video-uploaded-one/screenshots/target-video-uploaded-mid-1920x900.png`
- `target/video-uploaded-one/target-video-uploaded-qa-metrics.json`

Checks:

- Mock `Upload Video` creates the source-like uploaded-video composer state.
- Editor shows video tile, warning badge, edit affordance, add-media tile, `Add video subtitles`, and missing-subtitle note.
- The old custom blue video-details panel is no longer shown in the editor.
- All Networks video sections include Facebook Video Options, Instagram Options, YouTube Video Options, and TikTok Options.
- Validation label is `5 errors and 2 warnings`.
- Instagram video-width validation appears.
- TikTok Options only shows the three source-visible checkboxes.
- Captures at `1280x900` and `1920x900` reported no horizontal overflow.

Commands:

- `npm run build` passed.
- `npx vitest run tests\routes.test.js tests\sidebar-menu.test.js` passed.

## Batch 10 - 2026-05-07

Viewport coverage: `1280x900`

Target artifacts:

- `target/video-uploaded-one/screenshots/target-youtube-radio-polish-audience-1280x900.png`
- `target/video-uploaded-one/youtube-radio-polish-metrics.json`

Checks:

- YouTube Audience radio labels now render inline with the radio controls.
- YouTube Age restriction radio labels now render inline with the radio controls.
- Browser metrics reported `allSameRow: true`.
- Document-level QA reported no horizontal page overflow.

Commands:

- `npm run build` passed.
- `npx vitest run tests\routes.test.js tests\sidebar-menu.test.js` passed.

## Batch 11 - 2026-05-07

Viewport coverage: `1280x900` and `1920x900`

Source artifacts:

- `source/video-uploaded-one/deep-interactions/screenshots/after-click-add-video-subtitles.png`
- `source/video-uploaded-one/deep-interactions/screenshots/customize-tab-customize-post-for-facebook.png`
- `source/video-uploaded-one/deep-interactions/screenshots/customize-tab-customize-post-for-youtube.png`
- `source/video-uploaded-one/deep-interactions/screenshots/customize-tab-customize-post-for-tiktok.png`

Target artifacts:

- `target/video-uploaded-one/deep-interactions/screenshots/video-options-modal-1280x900.png`
- `target/video-uploaded-one/deep-interactions/screenshots/subtitles-generated-1280x900.png`
- `target/video-uploaded-one/deep-interactions/screenshots/video-edit-modal-1280x900.png`
- `target/video-uploaded-one/deep-interactions/screenshots/youtube-advanced-1280x900.png`
- `target/video-uploaded-one/deep-interactions/screenshots/facebook-video-tab-1280x900.png`
- `target/video-uploaded-one/deep-interactions/screenshots/tiktok-video-tab-1280x900.png`
- Matching `1920x900` screenshots and metrics are in the same folder.

Checks:

- `Upload Video` creates the uploaded-video composer state.
- `Add video subtitles` opens `Video Options`.
- The video tile edit button opens the same `Video Options` modal.
- `Generate by AI Assist` changes the subtitle status to ready and closes cleanly after Save.
- `Show Advanced Settings` expands YouTube advanced controls.
- Facebook, YouTube, and TikTok customize tabs render their own video/options/preview states.
- Browser metrics report no document or body horizontal overflow at both tested viewports.

Commands:

- `npm run build` passed.
- `npx vitest run tests\routes.test.js tests\sidebar-menu.test.js` passed.

## Batch 12 - 2026-05-08

Checks:

- `Customize post per network` remains the reversible mode toggle defined in `LAYOUT-BLUEPRINT.md`.
- AI Assist starts disabled on a clean composer.
- AI Assist remains disabled for a short caption below 10 characters.
- AI Assist enables when the caption reaches 10 non-whitespace characters.

Commands:

- `npx vitest run tests\publishing-new-post-interactions.test.jsx tests\publishing-new-post-composer-state.test.js` passed.

## Batch 13 - 2026-05-08

Viewport coverage: `1280x900`

Artifacts:

- `target/batch13-interactions/browser-qa-summary.json`
- `target/batch13-interactions/screenshots/01-baseline.png`
- `target/batch13-interactions/screenshots/02-after-interactions.png`
- `target/batch13-interactions/screenshots/03-channel-removed-confirmed.png`

Checks:

- AI Assist is disabled on a clean composer and with short caption text, then enables at 10 non-whitespace characters.
- All Networks First Comment can be focused and edited through an accessible text area.
- TikTok `Allow comments` checkbox toggles off and back on through controlled composer state.
- `Use Optimal Times` is disabled when the schedule row has no date.
- Selected channel chip removal works for the selected Facebook channel.
- Browser metrics reported `hasHorizontalOverflow: false` and `bodyOverflow: false` at `1280x900`.

Commands:

- `npx vitest run tests\publishing-new-post-composer-state.test.js tests\publishing-new-post-interactions.test.jsx` passed.
- `npm run verify` passed.

## Batch 14 - 2026-05-08

Viewport coverage: `1280x900`

Artifacts:

- `target/batch14-collaborators/browser-qa-summary.json`
- `target/batch14-collaborators/screenshots/01-instagram-collaborators-drawer.png`

Checks:

- `Invite Collaborators` opens the Instagram collaborators Publishing Resources drawer.
- Drawer copy clearly marks the collaborator flow as a safe mock state pending API contracts.
- Browser metrics reported `hasHorizontalOverflow: false` and `bodyOverflow: false`.

Commands:

- `npx vitest run tests\publishing-new-post-interactions.test.jsx tests\publishing-new-post-composer-state.test.js` passed.
- `npm run verify` passed.
