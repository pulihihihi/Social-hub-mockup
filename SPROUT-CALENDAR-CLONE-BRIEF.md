# Brief: Clone Sprout Social Calendar Into SocialHub

## Goal

Rebuild the Sprout Social **Publishing Calendar** experience as a SocialHub-native page. The target should be a functional equivalent for planning and reviewing scheduled social posts, not a pixel-perfect copy of Sprout branding.

Use the local skill:

```text
$clone-reference-ui
```

Recommended supporting skills:

```text
$build-frontend
$test-website
$analyze-gap
```

## Source Reference

Source app:

```text
https://app.sproutsocial.com/publishing/calendar/month/expanded
```

Known captured screenshot:

```text
C:\Users\Hai Son\Desktop\Claude\SocialHub\sprout-calendar-source.png
```

Chrome debug setup already worked previously with:

```text
http://127.0.0.1:9223
```

The page was readable after manual login and showed:

- Title: `Calendar | Publishing | Sprout Social`
- URL: `/publishing/calendar/month/expanded`
- Navigation: Publishing, New Post, Calendar, Sprout Queue, Drafts, Needs Approval, Rejected, Campaigns, Asset Library, Instagram Grid Planner, SproutLink in bio, Mobile Reminders, Find Content, Failed Posts, Deleted Posts
- Toolbar: Today, current month `May 2026`, calendar month view
- View controls: Compact, Expanded, List, Week, Month
- AI Assist entry
- Filters: Profiles, Post Types, Tags, Clear All
- Calendar grid: Monday to Sunday columns
- Day cells with scheduled post cards
- Post cards containing time, caption text, media action, team conversation action, and metric values such as percentages or N/A

## Requested Workflow For New Session

Start the new session with this instruction:

```text
Use $clone-reference-ui to clone Sprout Social Publishing Calendar into SocialHub.

Source:
- Logged-in Sprout Social page: https://app.sproutsocial.com/publishing/calendar/month/expanded
- Use Chrome DevTools Protocol port 9223 if available.
- Existing source screenshot: C:\Users\Hai Son\Desktop\Claude\SocialHub\sprout-calendar-source.png

Target:
- Current repo: C:\Users\Hai Son\Desktop\Claude\SocialHub
- Build a SocialHub-native Publishing Calendar page.

Process:
1. Capture fresh Sprout source artifacts into .agent-workflows/sprout-calendar/source.
2. Create .agent-workflows/sprout-calendar/brief/SOURCE-BRIEF.md.
3. Inspect SocialHub project structure and existing design/layout rules.
4. Implement the Calendar page using existing project patterns.
5. Run the app locally and capture target screenshots.
6. QA filters, view switches, calendar grid, post cards, and detail interactions.
7. Run source-vs-target gap analysis.
8. Fix the next batch of high-impact visible gaps.

Do not ask for Sprout credentials. If the Sprout session is expired, ask me to log in manually in the debug browser.
Do not copy Sprout proprietary branding/assets verbatim; rebuild functional equivalence in SocialHub design language.
```

## Target Page Scope

Build the Calendar page only. Do not expand into full Sprout Publishing unless needed for navigation context.

Required areas:

| Area | Requirement |
|---|---|
| App navigation context | SocialHub should expose a Publishing/Calendar location using the repo's existing shell/nav pattern. |
| Top action bar | Include `New Post`, `Today`, month label, previous/next controls if appropriate, and view mode controls. |
| View modes | At minimum implement Month + Expanded density. Compact/List/Week can be implemented or visibly stubbed if out of scope. |
| Filter rail/panel | Profiles, Post Types, Tags, Clear All. Filters must open or have clear local behavior. |
| Calendar grid | Monday-Sunday columns, month cells, previous/next month spillover days. |
| Post cards | Time, platform/profile indicator, caption preview, media indicator/action, conversation/action row, metric/status value. |
| Dense day handling | Multiple posts in one day should stack cleanly and show a "View more" style affordance when needed. |
| Detail interaction | Clicking a post should open a detail drawer/modal or selected state with full caption and actions. |
| Empty state | Days without posts should remain readable and balanced. |

## Inferred Data Model

Use mock data if backend is not available.

```ts
type CalendarPost = {
  id: string;
  scheduledAt: string;
  date: string;
  timeLabel: string;
  profileName: string;
  platform: "facebook" | "instagram" | "tiktok" | "youtube" | "x" | "other";
  postType: "image" | "video" | "text" | "link" | "reel" | "story";
  status: "scheduled" | "draft" | "needs_approval" | "failed" | "published";
  caption: string;
  mediaCount: number;
  tags: string[];
  metricLabel?: string;
  hasConversation?: boolean;
};
```

Seed examples should include:

- Multiple posts on the same day.
- Long Vietnamese captions with hashtags.
- Posts with media.
- Posts with metric values like `3%`, `7%`, `N/A`.
- At least one day with "View more" behavior.

## UX And Visual Direction

Adapt, do not copy:

- Dense internal-tool layout.
- Clear calendar hierarchy.
- Compact post cards optimized for scanning.
- Muted borders and subtle status indicators.
- Controls should feel native to SocialHub's existing design system.

Avoid:

- Marketing landing-page layout.
- Oversized hero sections.
- Sprout logo/brand colors/assets copied 1:1.
- Decorative visuals that reduce calendar density.

## QA Checklist

Validate at viewport:

```text
1920x900 first
1440x1000 second
```

Checks:

- Page loads with real calendar content.
- No blank screen.
- No broken text wrapping in post cards.
- No unexpected horizontal page overflow.
- Toolbar controls are aligned and readable.
- Calendar has 7 columns.
- Month spillover days are visually distinct.
- Filters open/close and selected filters affect visible cards or clear state.
- View controls either switch views or clearly show implemented scope.
- Post detail opens and closes.
- Long captions do not break layout.
- Dense days remain usable.

## Gap Analysis Requirements

Create:

```text
.agent-workflows/sprout-calendar/reports/SPROUT-CALENDAR-GAP-ANALYSIS.md
```

Compare:

- Sprout source screenshot/DOM/interactive inventory.
- SocialHub target screenshot.
- SocialHub code render path.
- SOURCE-BRIEF acceptance criteria.

Classify:

- Critical: missing main calendar, post cards, filters, or detail interaction.
- Medium: simplified view modes, partial dense-day handling, incomplete filter behavior.
- Minor: spacing, copy, icon polish, small visual mismatches.
- Match: verified equivalent target behavior.

End with a next fix batch of no more than 5 items.

## Definition Of Done

The clone is done when:

- `SOURCE-BRIEF.md` exists.
- SocialHub Calendar page is implemented and reachable locally.
- QA report exists.
- Gap report exists.
- No Critical gaps remain.
- Remaining Medium gaps are either fixed or explicitly accepted as backlog.

