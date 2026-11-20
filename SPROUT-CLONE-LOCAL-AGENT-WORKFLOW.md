# Sprout Social -> SocialHub Local Agent Workflow

## Muc tieu

Dung Sprout Social calendar dang login tren may local lam reference de rebuild mot giao dien tuong duong trong SocialHub, theo vong lap co kiem soat:

1. Capture source tu Sprout Social.
2. Phan tich UI va tinh nang thanh brief.
3. Code vao SocialHub.
4. QA SocialHub bang browser.
5. So sanh SocialHub voi Sprout source.
6. Tao gap report va fix tiep den khi dat muc tieu.

Luu y: khong copy token dang nhap, cookie, asset rieng, brand, icon, hoac noi dung proprietary y nguyen. Muc tieu la rebuild functional equivalent cho SocialHub.

## Kien truc agent

### 1. Source Capture Agent

Trach nhiem:

- Ket noi vao Chrome da login bang Chrome DevTools Protocol, vi du `http://127.0.0.1:9223`.
- Mo dung URL Sprout Social calendar.
- Chup screenshot o cac viewport va state can thiet.
- Lay DOM text, accessibility tree neu co, danh sach nut/link/input/dropdown co the tuong tac.
- Luu artifacts de cac agent sau khong can truy cap lai Sprout lien tuc.

Dau vao:

- Source URL: `https://app.sproutsocial.com/publishing/calendar/month/expanded`
- Debug port: `9223`
- Viewports: `1920x900`, `1440x1000`, optional mobile/tablet neu can.
- State list can capture.

Dau ra:

- `.agent-workflows/sprout-calendar/source/screenshots/*.png`
- `.agent-workflows/sprout-calendar/source/dom/*.txt`
- `.agent-workflows/sprout-calendar/source/interactive/*.json`
- `.agent-workflows/sprout-calendar/source/capture-manifest.json`

State toi thieu nen capture:

- Month expanded view mac dinh.
- Month compact view.
- List view, including the post-volume strip, day divider, schedule/add-note row, and at least one expanded feed card.
- Week view, including seven day columns, day header plus buttons, empty-day columns, and compact/expanded card density.
- Filters panel opened.
- Profiles filter opened.
- Post Types filter opened.
- Tags filter opened.
- Post card hover/focus/menu neu co.
- Post detail/media preview neu co.
- New Post entry state neu can clone luong tao post.
- New Post composer upload/media menu, including Upload Document disabled, Upload Image(s), Upload Video, Bynder, Dropbox, Google Drive, separator, and Asset Library.
- Empty/loading/error state neu co the tao dieu kien de thay.

View-mode parity gate:

- Code Agent khong duoc danh dau `List`, `Week`, hoac `Month` la xong neu chua co source screenshot/DOM rieng cho view do.
- Gap Analysis Agent phai so sanh tung view mode rieng: toolbar state, date label, body structure, card density, empty-state affordance, scroll behavior.
- Neu source view chua capture duoc, target view phai bi ghi la inferred/backlog, khong duoc goi la matched.
- Khi user yeu cau clone gan 100%, Code Agent phai giu dung information architecture cua source: hang date/view/action o tren, filter row o duoi, body view o duoi cung. Chi thay component primitive bang Ant Design/local component, khong tu y doi vi tri tinh nang.
- Post card parity bat buoc gom media/thumbnail/video affordance neu source card co media, va post-level overflow menu `...`. Text-only placeholder khong duoc coi la match cho media card.
- Composer/editor parity bat buoc click tung icon trong toolbar/editor. Neu icon mo menu/popover nhu upload media, asset library, overflow, AI action thi Source Capture Agent phai capture state do va Code Agent phai render dung nhom option, thu tu, disabled state, separator, dismiss behavior. Thieu menu cua button dang hien tren source duoc tinh la gap visible, khong duoc coi la done.
- Composer channel selector parity bat buoc kiem tra computed layout sau khi render bang Ant Design: trigger phai can thang voi editor, min-height toi thieu 48px, khong bi AntD Button default hoac `src/action-control-contract.css` ep ve 32px/inline-flex, va khong hien scrollbar ngang khi chip list chua overflow.
- Cac status sync tu platform/API, vi du Settings > Channels `Connection Status`, la read-only operational state. Khong clone thanh inline edit/dropdown/bulk edit neu source hoac local contract khong co reconnect/sync workflow ro rang.

### 2. Source Brief Agent

Trach nhiem:

- Doc screenshot, DOM text, interactive JSON.
- Bien source thanh product/UI brief co cau truc.
- Phan tach ro: layout, component, data model, interaction, state, priority.
- Khong yeu cau code. Brief la hop dong dau vao cho Code Agent.

Dau ra:

- `.agent-workflows/sprout-calendar/brief/SOURCE-BRIEF.md`

Brief format:

```markdown
# Sprout Calendar Source Brief

## Page Purpose
Mo ta ngan trang nay dung de lam gi.

## Layout Inventory
| Area | Description | Required |
|---|---|---|
| Left navigation | Publishing menu, selected Calendar | Yes |
| Top toolbar | Today, month label, view switches, AI Assist | Yes |
| Filter rail | Profiles, Post Types, Tags, Clear All | Yes |
| Calendar grid | Monday-Sunday month cells | Yes |
| Post cards | Time, caption, media action, conversation action, metric | Yes |

## Component Inventory
| Component | Behavior | Data Needed | Priority |
|---|---|---|---|

## Interaction Matrix
| Action | Expected Result | Screenshot Reference |
|---|---|---|

## Visual Rules
- Density, spacing, border, typography, color intent.
- Khong copy exact brand styling neu khong phu hop SocialHub.

## Acceptance Criteria
- Cac dieu kien target phai dat de coi la match.
```

### 3. Difference Scanner Agent

Trach nhiem:

- Chay doc lap va song song voi luong Code Agent/Fix Loop.
- Quet source theo thu tu nhin that: tu tren xuong duoi, trong moi hang quet tu trai qua phai.
- Moi viewport slice phai duoc ghi nhan truoc khi scroll tiep; chi dung khi da toi cuoi page hoac cuoi scroll container.
- Voi panel long, composer, preview side panel, drawer, menu, popover, phai quet lai theo cung quy tac trong tung container.
- Click tung element an toan co tac dung nhu function, filter, button, tab, menu, dropdown, toolbar icon, upload source, overflow action, toggle, checkbox, radio, profile/channel selector, creative-type selector, view switch.
- Sau moi click phai capture state vua mo ra: menu, popover, drawer, option list, disabled item, selected state, validation message, preview/layout thay doi.
- Dismiss popover/modal va restore state truoc khi qua control tiep theo neu co the.
- Voi composer publishing, phai chay matrix rieng: selected profile/channel theo platform, active platform tab, creative type text/image/video/link, upload source menu, asset/library menu, validation theo platform va creative type.
- Ghi ro tat ca label, button, icon, active state, disabled state, badge, counter, tab underline, media thumbnail, overflow menu, separator, hover affordance neu source co.
- Feed danh sach gap cho Code Agent theo dung vi tri visual de tranh bo sot phan nho nhu hang platform tabs, notification dot, hoac menu option.
- Khong sua code trong role nay.

Dau ra:

- `.agent-workflows/sprout-calendar/reports/SPROUT-CALENDAR-DIFFERENCE-SCAN.md`
- `.agent-workflows/sprout-new-post/reports/SPROUT-NEW-POST-DIFFERENCE-SCAN.md` khi clone New Post.

Nguyen tac:

- Phan chua quet xong phai ghi la `unknown`, khong duoc ghi la matched.
- Neu target co component nhung khong render ra dung route/state, van tinh la gap.
- Scanner phai tiep tuc den cuoi trang, khong dung sau khi tim thay mot vai gap dau tien.
- Khong click destructive/irreversible/outbound/billing/publish/send/schedule/delete/disconnect/logout/account-management action neu user chua authorize. Neu hien confirmation modal thi capture roi dismiss.

### 4. Code Agent

Trach nhiem:

- Doc `SOURCE-BRIEF.md`.
- Doc project contracts neu co: `PROJECT-INSTRUCTIONS.md`, `CLAUDE.md`, `AGENTS.md`, `DESIGN.md`, `LAYOUT-BLUEPRINT.md`.
- Implement trong SocialHub theo style san co.
- Tao mock data neu backend chua san sang, nhung phai de data shape ro rang.
- Khong sua deploy/build config neu khong can.

Dau vao:

- `SOURCE-BRIEF.md`
- Existing SocialHub codebase
- Optional gap report tu vong lap truoc

Dau ra:

- Code changes
- `.agent-workflows/sprout-calendar/target/IMPLEMENTATION-NOTES.md`

Nguyen tac:

- Build giao dien SocialHub theo layout/tinh nang cua Sprout khi source da capture; khong clone brand/token/assets 1:1.
- Dung Ant Design/Ant Design component cua SocialHub de render control, nhung khong thay doi thu tu/vi tri/tinh nang so voi source neu khong co ly do tu app shell.
- Neu Ant Design co san primitive hoac icon tuong duong thi bat buoc dung AntD: checkbox/tick mark, radio, switch, icon-only button, dropdown/menu, modal/drawer, alert, validation/status icon, table, form, tabs, tooltip, popover. Khong tu ve checkmark, status circle, hoac button icon bang span/CSS tru khi local contract ghi ro exception.
- Filter rows trong Calendar, Publishing, va Smart Inbox phai dung shared SocialHub filter contract `src/components/PublishingFilterBar.jsx`; khong tao page-local filter cell/button/chevron/clear action, va khong override height, typography, border, radius cua shared filter bar bang CSS rieng.
- Neu Sprout co behavior nhung SocialHub chua co data/API, implement UI state + mock adapter rieng.
- Tach component theo local pattern cua repo, khong tao abstraction lon neu chua can.

### 5. Target QA Agent

Trach nhiem:

- Chay app local.
- Mo page SocialHub vua build.
- Chup screenshot cung viewport voi source.
- Click toolbar, filters, tabs/view modes, post cards, media/detail actions.
- Bao bug bang ngon ngu nhin thay duoc, kem screenshot.

Dau ra:

- `.agent-workflows/sprout-calendar/target/screenshots/*.png`
- `.agent-workflows/sprout-calendar/target/QA-REPORT.md`

Checklist QA:

- Trang co hien dung noi dung, khong blank.
- Header/sidebar/content khong chong len nhau.
- Cac control/status co primitive AntD phai render bang AntD: checkbox/radio/switch/status icon/button/menu/modal/table/form. Neu thay custom tick/check/status circle thi ghi gap va yeu cau Code Agent sua.
- Filter bar phai render tu shared `PublishingFilterBar` contract: cell height/typography/spacing dong nhat giua Calendar, Publishing, va Smart Inbox; neu thay class page-local nhu `smart-inbox-filter-cell` hoac override `publishing-calendar-filterbar`, tinh la gap.
- Calendar grid co 7 cot va du ngay.
- Nhieu post trong mot ngay khong lam vo cell.
- Expanded card co time, caption, actions, metric/status.
- Filters mo/dong duoc.
- View switches doi state duoc hoac hien ro neu chua implement.
- Khong co horizontal overflow ngoai y muon o viewport baseline `1920x900`.

### 6. Gap Analysis Agent

Trach nhiem:

- So sanh source artifacts voi target artifacts.
- So sanh brief voi implementation.
- Check ca render path trong code de tranh tinh trang component co ton tai nhung khong duoc render.
- Xep gap theo Critical, Medium, Minor.

Dau vao:

- `SOURCE-BRIEF.md`
- Difference Scanner report neu co
- Source screenshots/DOM
- Target screenshots
- Target code
- QA report

Dau ra:

- `.agent-workflows/sprout-calendar/reports/SPROUT-CALENDAR-GAP-ANALYSIS.md`

Gap report format:

```markdown
# Sprout Calendar Gap Analysis

## Summary
| Category | Count |
|---|---:|
| Critical |  |
| Medium |  |
| Minor |  |
| Matched |  |

## Critical Gaps
### GAP-001: Missing filter popover behavior
Source: screenshot/source reference
Target: file/path + screenshot
Impact:
Fix:

## Medium Gaps

## Minor Gaps

## Matched Areas

## Next Fix Batch
1. Fix-1
2. Fix-2
3. Fix-3
```

### 7. Fix Loop Controller

Trach nhiem:

- Doc gap report.
- Chon mot batch fix nho, uu tien visible/critical gap.
- Giao cho Code Agent sua.
- Chay QA lai.
- Cap nhat gap report.

Dung vong lap:

```text
Capture source -> Brief -> Code -> QA target -> Gap -> Fix batch -> QA -> Gap -> Done
```

Dung lai khi:

- Tat ca Critical gap da het.
- Medium gap con lai duoc chap nhan.
- UI dat muc tieu functional equivalent cho SocialHub.

## Folder de xuat

```text
.agent-workflows/
  sprout-calendar/
    source/
      screenshots/
      dom/
      interactive/
      capture-manifest.json
    brief/
      SOURCE-BRIEF.md
    target/
      screenshots/
      QA-REPORT.md
      IMPLEMENTATION-NOTES.md
    reports/
      SPROUT-CALENDAR-GAP-ANALYSIS.md
    prompts/
      01-source-capture.md
      02-source-brief.md
      03-code.md
      04-target-qa.md
      05-gap-analysis.md
    scripts/
      capture-sprout.mjs
      capture-target.mjs
```

## Local setup

### 1. Mo Chrome rieng cho Sprout

```powershell
$profile = Join-Path $env:TEMP 'codex-sprout-profile'
New-Item -ItemType Directory -Force -Path $profile | Out-Null
Start-Process -FilePath "$env:LocalAppData\Google\Chrome\Application\chrome.exe" -ArgumentList @(
  '--remote-debugging-port=9223',
  "--user-data-dir=$profile",
  '--new-window',
  'https://app.sproutsocial.com/publishing/calendar/month/expanded'
)
```

Dang nhap bang tay trong cua so Chrome do. Khong dua password vao prompt.

### 2. Kiem tra ket noi

```powershell
Invoke-RestMethod -Uri 'http://127.0.0.1:9223/json/list'
```

Can thay tab co title gan voi `Calendar | Publishing | Sprout Social`.

### 3. Capture source

Nen viet script `capture-sprout.mjs` dung CDP:

- `Page.captureScreenshot`
- `Runtime.evaluate` de lay `document.body.innerText`
- `Runtime.evaluate` de lay danh sach button/link/input:

```javascript
[...document.querySelectorAll('button,a,input,textarea,[role=\"button\"],[role=\"menuitem\"],[aria-label]')]
  .map((el) => ({
    tag: el.tagName,
    role: el.getAttribute('role'),
    label: el.getAttribute('aria-label') || el.innerText || el.value || '',
    text: (el.innerText || '').slice(0, 200),
    disabled: el.disabled || el.getAttribute('aria-disabled') === 'true'
  }))
```

### 4. Capture target

Dung Playwright hoac CDP voi SocialHub local:

- Start dev server.
- Navigate den page calendar.
- Set cung viewport voi source.
- Capture screenshot va interactive elements.

## Prompt mau cho tung agent

### Source Brief Agent

```text
Ban la Source Brief Agent. Doc cac artifacts trong .agent-workflows/sprout-calendar/source.
Hay tao SOURCE-BRIEF.md cho Sprout Calendar.
Khong viet code. Khong copy brand/assets noi bo.
Output phai gom: page purpose, layout inventory, component inventory, interaction matrix,
data model inferred, visual rules, acceptance criteria, va state coverage gaps neu capture con thieu.
```

### Code Agent

```text
Ban la Code Agent cho SocialHub. Doc SOURCE-BRIEF.md va project contracts.
Implement calendar publishing page theo functional equivalent.
Uu tien existing project patterns. Neu thieu backend, tao mock data adapter ro rang.
Phai implement view mode theo captured source:
- Month: 7-column month grid, spillover dates, dense post cards.
- Week: 7-column week board with day headers, plus affordances, compact/expanded card density.
- List: centered feed/timeline with post-volume strip, day divider, Schedule Post/Add Note row, and large feed cards.
Sau khi code, chay typecheck/build/test neu repo co script. Ghi IMPLEMENTATION-NOTES.md.
```

### QA Agent

```text
Ban la QA Agent. Test SocialHub calendar page tren browser.
Dung viewport 1920x900 truoc, sau do 1440x1000 neu can.
Click tat ca controls chinh: view switch, filters, post cards, new post.
Chup screenshot moi loi. Viet QA-REPORT.md bang ngon ngu PM doc duoc.
Khong sua code.
```

### Gap Analysis Agent

```text
Ban la Gap Analysis Agent. So sanh Sprout source artifacts voi SocialHub target artifacts va code.
Phai check ca visual, feature, interaction, data density, va render path trong code.
Tao SPROUT-CALENDAR-GAP-ANALYSIS.md, phan loai Critical/Medium/Minor/Matched.
De xuat next fix batch toi da 5 item.
```

### Fix Loop Controller

```text
Ban la Fix Loop Controller. Doc gap report moi nhat.
Chon batch fix nho nhat co tac dong cao nhat.
Giao viec cho Code Agent, sau do yeu cau QA Agent va Gap Analysis Agent chay lai.
Dung khi khong con Critical gap.
```

## Cach ap dung trong Codex hien tai

Trong mot turn thuc te, goi Codex theo thu tu:

1. `Hay capture Sprout Calendar source artifacts vao .agent-workflows/sprout-calendar/source`
2. `Hay tao SOURCE-BRIEF.md tu artifacts vua capture`
3. `Hay build SocialHub calendar page theo SOURCE-BRIEF.md`
4. `Hay QA page vua build bang browser va luu QA-REPORT.md`
5. `Hay chay gap-analysis source Sprout vs target SocialHub va tao report`
6. `Hay fix batch gap tiep theo, roi QA va gap-analysis lai`

Neu muon tu dong hon, tao mot skill rieng ten `clone-reference-ui` co workflow tren, va cac script capture nam trong `scripts/`.

## Definition of Done

Mot vong clone duoc coi la xong khi:

- Source artifacts co du cac state da dinh nghia.
- `SOURCE-BRIEF.md` co acceptance criteria ro rang.
- SocialHub page build thanh cong.
- QA khong con loi layout/function critical.
- Gap report khong con Critical gap.
- Medium gap con lai duoc ghi ro la accepted hoac backlog.
- Tat ca artifact duoc luu trong `.agent-workflows/sprout-calendar/`.
