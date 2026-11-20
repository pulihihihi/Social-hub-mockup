# Layout Blueprint — UGC Website (Garena Creator Program Admin)

> Generated: 2026-04-05 | Last updated: 2026-05-07 (v20 - shared filter bar contract)
> Source project: ugc-website (Vite + React 19 + Ant Design 6)
> Pages scanned: 10 | Components scanned: 15+ shared

Visual/system contract: `DESIGN.md` is the local source of truth for Ant Design-first component usage.

---

## 1. App Shell

### Sidebar
- **Width**: 240px (expanded) / 48px (collapsed)
- **Collapsible**: yes (click logo to toggle)
- **Position**: static (not fixed)
- **Background**: `#001529` (T.siderBg)
- **Menu depth**: 2 levels for grouped sections (`Smart Inbox`, `Publishing`, `Settings`)
- **Menu icons**: level 1 only (Ant Design Icons)
- **Menu items**: workflow-first top level: `Active Topics`, `Smart Inbox`, `Publishing`, `Alerts`, `Reports`, `Settings`
- **Grouped children**:
  - `Smart Inbox`: `All Messages`, `Saved Messages`, `Reply Approvals`
  - `Publishing`: `New Post`, `Calendar`, `Drafts`, `Needs Approval`, `Rejected`, `Failed Posts`, `Deleted Posts`, `Asset Library`, `Campaigns`
  - `Publishing > Campaigns`: `Active Campaigns`, `Archived Campaigns`
  - `Settings`: `Channels`, `Tag Management`, `Approval Workflows`, `Notifications`, `AI Skill`, `Access`
- **Active indicator**: `background: T.colorPrimary (#1677ff), color: #fff` (full background highlight)
- **Hover style**: `background: rgba(255,255,255,0.08), color: rgba(255,255,255,0.88)`
- **Dividers**: `1px solid rgba(255,255,255,0.07)` between logo area, menu, user section
- **Bottom section**: User avatar (26px circle, T.colorError bg) + name (13px, rgba(255,255,255,0.85)) + role dropdown (10px, rgba(255,255,255,0.6))
- **Logo section**: 64px height, logo box 24px (T.colorError bg, borderRadius 4px) + "Garena Creator Program" text (14px, weight 600)
- **Mobile**: Sider hidden → Drawer left placement 240px width + bottom nav bar (56px, 5 items)

### Header
- **Height**: 64px desktop / 52px mobile
- **Position**: static
- **Background**: `#ffffff` (T.colorBgContainer)
- **Ownership model**: shell owns structure only, page owns header content
- **Content left**: page-provided top slot (`usePageTopBar`) rendered inside shell header
- **Content center**: N/A
- **Content right**: GlobalSearch + LanguageSwitcher (VI/EN flags)
- **Border bottom**: `1px solid #f0f0f0` (T.colorBorderSecondary)
- **Shadow**: `0 1px 2px rgba(0,0,0,0.03)`
- **Mobile left**: Hamburger button (MenuOutlined)
- **Mobile center**: same page-provided top slot, stacked with header actions when needed
- **Fallback rule**: shell has NO route-title fallback; every page must register its own top slot content
- **Top slot patterns**:
  - `PageTopBarTitle` for single-title pages
  - `CountTabs` or root page tabs for tabbed pages
  - page-owned fallback title for loading / expanded states instead of falling back to shell text
- **Header/filter separation**:
  - Primary shell top slot is for page identity only: title, root tabs, and page-level header actions.
  - Toolbar-only `pageControls` render in the secondary top bar, below the white header and above page body content.
  - Filter bars that live inside page content must start after a 16px vertical gap from the header.
  - Filter bars should align to the 24px page content inset on desktop and keep the first filter/control row visually separate from the header border.
  - `Publishing > Calendar` is the documented no-header exception. It sets `hidePageHeader` on `AdminPageLayout`, collapses the primary top slot to 0px, and makes its Sprout-style date navigation and right-aligned action/view controls the first visible page controls. When filters are visible, they render directly below using the shared `PublishingFilterBar` contract and spacing.
  - No other page may remove the page header unless this blueprint names it as a no-header operational surface first.
- **Header/top control action buttons**:
  - Default action button height is AntD default `T.controlHeight` / 32px, matching Active Topics `Create Topic`.
  - Do not use `size="small"` for primary page actions, header action clusters, top toolbar CTAs, or icon-only toolbar actions.
  - `size="small"` is reserved for dense row-level affordances, tiny card actions, inline table controls, and secondary micro actions.
  - Segmented controls in top toolbars should also use default size unless the entire source/reference toolbar is intentionally compact.

### Action Control Contract
- **Source of truth**: `src/action-control-contract.css` plus Ant Design component tokens in `src/theme/tokens.js`.
- **Ant Design requirement**: all action controls must be AntD `Button`, `Dropdown`, `Segmented`, `Switch`, `DatePicker`, or another AntD primitive unless `DESIGN.md` documents an exception.
- **Default action button**: 32px height, 14px horizontal padding, 6px radius, 14px font, no shadow. Use this for page CTAs, header actions, toolbar actions, modal form actions, and card/table actions that represent the primary interaction for that surface.
- **Small action button**: 24px height, 10px horizontal padding, 4px radius, 12px font. Use only for dense row/card micro actions, selection bars, popover reset links, and cramped inline controls.
- **Icon-only default action**: 32px by 32px. **Icon-only small action**: 24px by 24px.
- **Switch default**: 44px by 24px track, 20px handle, 2px track padding, primary blue checked state. Use default switch size across normal settings, cards, composer options, and list controls.
- **Switch labels**: Global switches are unlabeled inside the track. Do not use AntD `checkedChildren` or `unCheckedChildren` with the default 44px switch; use adjacent text outside the switch if state copy is required.
- **Small switch**: 28px by 16px only for true micro controls inside dense tables or tiny inline rows. Do not use small switches for settings cards, AI Skill cards, composer options, or page-level controls.
- **Implementation rule**: do not override AntD Button/Switch height in page-local CSS. If a new exception is needed, document it here before adding page-local CSS.

### Breadcrumb
- **Enabled**: no
- **Position**: N/A
- **Format**: none in shell header; page may add breadcrumb only for true drill-down

### Content Area
- **Padding**: 20px all sides (desktop) / 10px 8px + bottom 68px (mobile)
- **Background**: `#f5f5f5` (T.colorBgLayout)
- **Max width**: none (full width)
- **Min height**: flex: 1, minHeight: 0
- **Overflow**: hidden (each page handles own scroll)
- **Display**: flex, flexDirection: column

### Footer
- **Enabled**: no (desktop) / yes (mobile — bottom nav bar)
- **Mobile bottom nav**: 56px fixed, 5 buttons, active state: 2px top border T.colorPrimary

---

## 2. Page Patterns

### 2.1 Dashboard
- **Wrapper**: No card wrapper for full page
- **Top slot**: `PageTopBarTitle("Dashboard")`
- **Page header/body intro**: Info bar (date + status indicators + update time), flex space-between, marginBottom: 16
- **Stat cards**: CSS Grid, responsive 5→3→2 cols, gap 8-12px, marginBottom: 24
  - Card: 1.5px border, borderRadiusLG, padding 14px 16px, top accent bar 3px
  - Hover: translateY(-1px), boxShadow 0 4px 12px rgba(0,0,0,0.08)
  - Empty state: opacity 0.65
  - **Colors**: ALL stat cards use antd design tokens or standard antd palette colors:
    - New Application: T.colorPrimary (#1677ff), T.colorPrimaryBg, T.colorPrimaryBorder
    - Rank Change: T.colorSuccess (#52c41a), T.colorSuccessBg, T.colorSuccessBorder
    - Mission Approval: T.colorWarning (#faad14), T.colorWarningBg, T.colorWarningBorder
    - Mission Post: C.purple (#722ed1 = purple-6), C.purpleBg (#f9f0ff), C.purpleBorder (#d3adf7)
    - Reward Request: C.cyan (#13c2c2 = cyan-6), C.cyanBg (#e6fffb), C.cyanBorder (#87e8de)
- **Action Center**: Card container (colorBgContainer, 1px border, borderRadiusLG, overflow hidden)
  - Header: title + custom tabs (underline 2px, dynamic colors matching stat cards)
  - List: grid rows (5px indicator + 44px icon + 1fr content + auto badge + 120px CTA)
  - Items: borderBottom 1px, hover bg by priority (T.colorErrorBg for urgent)
  - Footer: summary text + warning count
- **Color rule**: ALL colors in Dashboard must come from antd design tokens (T.*) or antd standard palette (C.purple, C.cyan). NO custom non-antd colors (old C.amber, C.teal replaced).

### 2.2 List Page (Creator Profile, System Admin, Shop Config)
- **Wrapper**: antd Card (via DataTable component)
- **Card padding**: CARD_BODY_NOPAD (no body padding, table fills card)
- **Top slot / page header**:
  - root list navigation, when present, lives in the page-owned shell top slot
  - tabbed list pages often use `CountTabs` with count badges
  - simple single-surface list pages may use a compact title instead of tabs
- **Filter bar**:
  - Component: SmartFilter (popover-based, button trigger)
  - Style: Popover, width 340px desktop / 80vw mobile
  - Position: above content, left-aligned
- **Quick filter**: QuickFilterPills, flex wrap, gap 6, marginBottom 10
  - Pill: padding 4px 12px, borderRadiusXL, fontSizeSM
  - Active: filled color bg + white text
  - Inactive: white bg + colored border + colored text
- **View toggle**: Card/Table switch (button group, right-aligned)
- **Table**: DataTable component (wraps antd Table/AntTable)
  - **Fit-in-one-screen**: All tables use `scroll={{ y: "calc(100vh - Xpx)" }}` — table body scrolls vertically, header stays sticky, pagination always visible without scrolling
  - Toolbar: Column customizer + Freeze columns + Save View + Export
  - Row selection: checkbox column (fixed left)
  - Selection toolbar: ActionToolbar — only renders when rows selected, shows "X selected" + action buttons (Edit, Delete, etc.) + Deselect link. Background: T.colorPrimaryBg.
  - Pagination: antd Pagination, pageSize 20/50/100, max 500 pages
  - **Row actions**: NO inline action buttons (Edit/Delete) in table rows. All actions via:
    1. **Click row** → opens edit modal/detail
    2. **Select rows (checkbox)** → ActionToolbar appears above table with batch actions
    3. Pattern source: Manage Mission Post (DataTable `actions` prop)
  - **Table component rule**: ALL data tables MUST use antd Table (AntTable) or DataTable wrapper. NO custom CSS grid tables allowed for data display.
- **Card grid**: gridTemplateColumns repeat(auto-fill, minmax(260px, 1fr)), gap 14
  - Pagination: CardPaginator, pageSize 20

### 2.3 Approval Page (Creator Approval, Mission Approval, Reward Request)
- **Wrapper**: No card wrapper
- **Top slot / page header**:
  - approval pages with root navigation use tabs in the page-owned shell top slot
  - `CountTabs` is the common component when counts matter
  - single-surface approval pages may use `PageTopBarTitle`
- **Filter bar**: SmartFilter (same pattern as list page)
- **Quick filter**: QuickFilterPills for status (Pending, Approved, Rejected...)
- **View toggle**: Card/Table switch
- **Card grid**: gridTemplateColumns repeat(auto-fill, minmax(260px, 1fr)), gap 14
  - Creator card: Platform-colored header (TikTok teal, Facebook blue, YouTube red)
  - Metrics: pass/fail indicators (✓/✗ with color)
  - Action buttons: Approve (primary) + Reject (outlined)
  - Status badge: top-right corner
- **Table alternative**: DataTable with same columns

### 2.4 Config Page (Notification, Website, UGC Config, Shop Config)
- **Top slot / page navigation**: root config navigation lives in the shell top slot; this project currently uses `CountTabs` for that root layer
- **Sub-tabs within a tab**: CountTabs (e.g. Contract > Templates/Assignments/Contracts, Condition Types > Hashtag/Join Duration)
- **Tab content padding**: 0 (tabs directly above content)
- **Per-tab structure**: varies — table, form, or custom layout
- **Stat cards**: NOT used in config pages — config tabs go straight to SmartFilter + DataTable or form
- **Quick filter in sub-content**: QuickFilterPills (e.g. Contract Instances status filter)
- **Small config tables** (< 15 rows, no pagination): antd Table (AntTable) with `scroll={{ y: "calc(100vh - 400px)" }}`. Use `onRow` click to open edit modal (no inline Edit button).
- **Article tab, Sub-page tab**: Now use AntTable with rowSelection, onRow click, scroll.y. NO more custom CSS grids.
- **Contract Templates/Assignments/Instances**: Now use AntTable with scroll.y and onRow. NO more custom CSS grids.
- **Card-based config** (Mission Template, Rank, Program): click card → opens edit modal. No inline Edit/Delete buttons on card.
- **Special layouts** (Workflow sidebar+canvas, RegConfig sidebar+grid): intentional — documented as accepted variations
- **Action pattern rule**: ALL pages follow same pattern — NO inline action buttons visible in rows/cards. Actions only via (1) click item → edit modal, (2) select checkbox → toolbar with batch actions.
- **Save button**: per tab (not global)

### 2.5 Workflow Page (UGC Config > Workflow)
- **Master-detail**: Workflow list left + detail right
- **List panel**: Scrollable list with active indicator
- **Detail panel**: Flow diagram (vertical steps) + tabs (Flow, History)
- **Step cards**: Numbered steps with status badges, drag handles

### 2.6 Website Page (4 tabs: Banner Config, Article, Media Library, Sub-page)
- **Top slot / page navigation**: `CountTabs` (4 items, no SEO tab)
- **All tabs**: SmartFilter (popover) + useFilters hook — NO custom `<input>/<select>`, NO stat cards
- **Banner Config**:
  - Warning alert: antd `<Alert type="warning">` for position conflict
  - Filter: SmartFilter (search, position, sort)
  - Quick filter: QuickFilterPills for status (Live, Scheduled, Expired, Draft)
  - Table: DataTable (thumbnail, title, position, status, schedule, clicks, actions)
- **Article**:
  - Filter: SmartFilter (search, status, sort)
  - Quick filter: QuickFilterPills for section (All, News, Guide, etc.)
  - Content: AntTable with rowSelection, onRow click, scroll.y + calendar toggle
- **Media Library**:
  - Filter: SmartFilter (search, type, tag)
  - Content: Grid/List toggle, file cards with selection
- **Sub-page**:
  - Filter: SmartFilter (search, status, type)
  - Content: AntTable with tree-like indentation, rowSelection, scroll.y + Nav Preview

---

## 3. Sub-page / Tab Patterns

### Tab container
- **Component**: `CountTabs` for count-bearing tab navigation, otherwise antd Tabs
- **Tab bar padding**: 0
- **Tab content padding**: 0
- **Tab + content gap**: 16px for the root tab container used on the page
- **Tab count badge**: fontSizeXS, fontWeight 700, padding 0 6px
  - Active: colorPrimary bg, white text
  - Pending highlight: colorError bg, white text
  - Default: colorFillSecondary bg, colorTextSecondary text

### Tab content patterns

| Pattern | Pages using it | Structure |
|---------|---------------|-----------|
| Tab -> SmartFilter + Pills + Card Grid | Creator Approval, Mission | Filter + pills + grid + CardPaginator |
| Tab -> SmartFilter + Pills + DataTable | Creator Profile, System Admin | Filter + pills + table |
| Tab -> SmartFilter + DataTable | UGC Config Supported Metrics | Filter + table (no stat cards) |
| Tab -> nested count tabs -> Small AntTable | UGC Config Condition Types (Hashtag/Join) | Sub-CountTabs + small config table |
| Tab -> nested count tabs -> QuickFilterPills + AntTable | UGC Config Contract Instances | Sub-CountTabs + status pills + AntTable |
| Tab -> Table only | Shop Config tabs | Direct DataTable |
| Tab -> Form/Config | Notification Preferences | Custom config UI |
| Tab -> Master-detail | UGC Config Workflow | List + detail panel |

### Sibling consistency rules
- All root tab containers in a page use same marginBottom (16px)
- SmartFilter + QuickFilterPills always appear together if present
- Card grid gap = 14 everywhere
- DataTable pagination = same options (20/50/100) everywhere
- View toggle (card/table) position = same (right of filter bar)

### Publishing subpage contract
- Publishing subpages must share the same compact filter bar language as Active Topics and Publishing Calendar.
- Use `src/components/PublishingFilterBar.jsx` for Publishing filter bars. Do not create page-local raw button filter cells, custom chevrons, or one-off `Clear All` behavior.
- Publishing list/status subpages with visible filters must render the page title/actions in the white header and the filter bar in the grey content/secondary band with 16px top spacing.
- Calendar is the Publishing no-header exception. It must not render a white page title header; its first visible surface is a compact Sprout-style header row with date navigation on the left and Filters, density, List/Week/Month, AI Assist, open, and overflow controls right-aligned on the same row. The filter row renders below that header through `PublishingFilterBar`; do not override the shared filter row border, height, radius, typography, or action area from Calendar CSS.
- Filter bars must compose Ant Design primitives such as `Button`, `Popover`, `Checkbox.Group`, `Input`, `Select`, `Segmented`, `Table`, and selective Ant Design Pro components for heavier table/form flows.
- Filter reset behavior is locked: show `Clear All` only when at least one filter is active, and clear every control in that bar.
- Primary button hierarchy is locked: each Publishing page gets at most one primary CTA, usually `New Post`, `Create Campaign`, or `Save`. Filter toggles, view switches, search, sort, and utility controls must not use primary styling.
- Calendar is the Publishing control reference for view switches, filter dropdown density, and AntD-first controls. If a Publishing page intentionally diverges, document that exception here before implementing it.
- Native styled `<button>` controls are allowed only for semantic item cards where AntD has no equivalent; toolbar, filter, table, menu, and form actions must use AntD or AntD Pro components.

### Publishing composer interaction contract
- Composer mode controls must be verified as interactions, not copied from a static screenshot. Required states: default all-network post, customized-per-network post, global schedule, and schedule-by-network.
- `Customize post per network` is a reversible mode toggle. When enabled, it must expose per-network tabs and copy the shared post text into each selected network. When disabled, it must clearly return to one shared editor without leaving stale per-network controls.
- `Schedule by network` must not visually own or wrap the normal global date/time fields when the toggle is off. Global schedule fields and per-network schedule overrides are separate states.

### Smart Inbox subpage contract
- `Smart Inbox` is a top-level workflow group, sibling to `Publishing`, and routes under `/messages/*` auto-open that group.
- Current implemented children: `All Messages` at `/messages/smart`, `Saved Messages` at `/messages/saved`, and `Reply Approvals` at `/messages/reply-approvals`.
- Compatibility aliases may redirect `/messages`, `/smart-inbox/all-messages`, `/smart-inbox/saved-messages`, and `/smart-inbox/reply-approvals` to their local route equivalents.
- Smart Inbox streams use a Sprout-like operational surface: page-owned title in the shell header, dark `Filters` utility button, search, metric/date utility controls, a full-width segmented filter bar, centered message stream, and optional right-side guidance panel.
- Smart Inbox filter bars must use `src/components/PublishingFilterBar.jsx` with `PublishingFilterCell`. Page-local Smart Inbox filter cell/button classes are not allowed; spacing can be set with an outer class only.
- Filter popovers must use Ant Design primitives (`Popover`, `Checkbox`, `Input`, `Switch`, `Button`) and keep source/reference DOM as evidence only. Local content must use safe mock SocialHub data, not tenant post copy or captured media.
- Message cards may use bespoke stream layout when an Ant Design table would be the wrong shape. Toolbar and filter controls still stay Ant Design-first.
- Saved Messages is the lightweight saved/bookmarked inbox view. It uses the Smart Inbox filter shell plus `Tags`, `More Filters`, search, date, share, and an empty state when no saved messages exist.
- Reply Approvals is an approval-status workflow view. It uses `Approval Status`, `Authors`, and `Approvers` filters and may render as an empty audit surface until real reply approval records exist.
- Scheduling sections should keep one clear primary path: global date/time rows when schedule-by-network is off, per-network rows when it is on, and secondary links grouped below the active schedule rows.
- Before handoff, browser QA for New Post must click `Customize post per network` and `Schedule by network` at least once and capture the resulting states.

---

## 4. Overlay Patterns

### Modal
- **Sizes**: 400px (info/error) / 420px (small form) / 480-540px (medium form) / 580px (large form) / ~900px (mission builder)
- **Title style**: antd Modal default + sometimes ModalTitle helper (icon + text)
- **Body padding**: antd default (24px)
- **Footer**: `flexEnd()` — Cancel (left of group) + Primary action (right), gap 8
  - `<div style={{display:'flex', justifyContent:'flex-end', gap:8}}>`
- **Close behavior**: X button + click outside (destroyOnHidden: true)
- **Scroll**: antd default (body scroll)
- **Form layout**: vertical (label above input)

### Drawer
- **Default width**: `max(700, 50% of viewport)` desktop / `100vw` mobile
- **Placement**: right
- **Header**: Title (bold) + close X
- **Content**: Tabs or sections with dividers
- **Footer**: Action buttons (Approve/Reject) fixed at bottom
- **Scroll**: Body scroll (content overflow auto)

### Popover
- **SmartFilter popover**: 340px desktop / 80vw mobile
- **Column customizer**: auto width
- **Freeze selector**: auto width
- **Save view**: auto width with text input
- **Shadow**: antd default

---

## 5. Spacing Rules

### Vertical rhythm

| Between | Spacing | Source |
|---------|---------|-------|
| Page container padding | 20px | AdminPageLayout Content |
| Stat cards → Action Center | 24px | marginBottom on stat grid (Dashboard only) |
| CountTabs → tab content | 16px | marginBottom on CountTabs |
| Header → first filter bar | 16px | secondary top bar / first content row |
| SmartFilter → QuickFilterPills | 10px | marginBottom on filter area |
| QuickFilterPills → content | 10px | marginBottom on pills |
| Card → Card (grid) | 14px | gap in CSS grid |
| Table row borders | 1px solid #f0f0f0 | T.tableBorderColor |
| Section dividers | 16px | SP.lg |
| Modal footer gap | 8px | gap in flexEnd |

### Horizontal rhythm

| Context | Spacing | Source |
|---------|---------|-------|
| Content padding | 20px | AdminPageLayout |
| Card padding (DataTable) | 0 (no body pad) | CARD_BODY_NOPAD |
| Card padding (standard) | 24px | T.paddingLG |
| Grid gutter | 14px | gap |
| Button group gap | 8px | SP.sm |
| Top action button height | 32px | AntD default `Button`; match Active Topics `Create Topic` |
| Filter field gap | 8px | gap in SmartFilter |
| Pill gap | 6px | gap in QuickFilterPills |
| Header padding | 0 24px | AdminPageLayout Header |

### Navigation Hierarchy

- Parent groups own related workflow surfaces instead of flattening all pages into the first sidebar level.
- `Smart Inbox` is a top-level group with `All Messages`, `Saved Messages`, and `Reply Approvals`; routes under `/messages/*` auto-open the parent group.
- `Publishing` is a top-level group with `New Post`, `Calendar`, `Drafts`, `Needs Approval`, `Rejected`, `Failed Posts`, `Deleted Posts`, `Asset Library`, and `Campaigns` children; routes under `/publishing/*` auto-open the parent group.
- `Settings` remains a top-level group with admin/config children; routes under `/settings/*` auto-open the parent group.

---

## 6. Consistency Score

| Layer | Assessment | Score |
|-------|-----------|-------|
| Shell | Single instance, consistent | 10/10 |
| Page headers | All pages register page-owned shell top slot; header content depends on page type rather than one universal tab component | 10/10 |
| Filter bars | SmartFilter used everywhere | 10/10 |
| Quick filters | QuickFilterPills everywhere | 10/10 |
| Table patterns | DataTable shared component | 10/10 |
| Card grid | Same grid template + gap | 9/10 |
| Tab patterns | Count-bearing tab navigation is used consistently where that pattern is intended | 10/10 |
| Modal patterns | Footer flexEnd consistent | 8/10 |
| Spacing | Mostly token-based, some hardcoded | 8/10 |
| Status colors | StatusPill shared (30+ statuses) | 10/10 |
| **Overall** | | **9.5/10** |

### Inconsistencies found

| # | Layer | Issue | Severity |
|---|-------|-------|----------|
| 1 | Spacing | Card grid gap is 14px (not 8/16 token-aligned) | 🟢 Minor |
| 2 | Modal | Width varies widely (400-900px) without clear size tiers | 🟡 Medium |
| 3 | Header | No real breadcrumb — text-based path, not interactive | 🟢 Minor (intentional) |
| 4 | Website Sub-page | ~~Custom tree table~~ → Now uses AntTable with tree-like indentation | ✅ Fixed (v6) |
| 5 | Website Article | ~~Custom article list~~ → Now uses AntTable with rowSelection | ✅ Fixed (v6) |
| 6 | UGC Config Contract | ~~Custom CSS grid tables~~ → Now uses AntTable | ✅ Fixed (v6) |
| 7 | Dashboard Colors | ~~Used non-antd C.amber/C.teal~~ → Now uses T.colorWarning/C.cyan | ✅ Fixed (v6) |

---

## 7. Design Token Reference

### Key tokens used across layouts

| Token | Value | Usage |
|-------|-------|-------|
| T.colorPrimary | #1677ff | Active states, links, primary buttons |
| T.colorBgContainer | #ffffff | Cards, modals, header |
| T.colorBgLayout | #f5f5f5 | Content background |
| T.colorBorderSecondary | #f0f0f0 | Subtle borders, dividers |
| T.borderRadiusLG | 8px | Cards, containers |
| T.borderRadiusXL | 12px | Pills (via borderRadiusXXL?) |
| T.fontSizeSM | 12px | Secondary text, pills |
| T.fontSize | 14px | Body text |
| T.fontSizeXL | 20px | Page titles |
| T.fontWeightStrong | 600 | Headings, bold labels |
| SP.sm | 8px | Button gaps |
| SP.lg | 16px | Section padding |
| SP.xxl | 24px | Large spacing |
| MOTION.std | 0.15s | Standard transitions |
