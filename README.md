# Social Hub

Internal social media publishing and management tool for Garena Vietnam.

## Stack

- Vite 6 + React 19
- Ant Design 6 + selective Ant Design Pro Components
- React Router 7
- Vitest + Testing Library

## Commands

```bash
npm install
npm run dev
npm run verify
```

`npm run verify` runs lint, import graph validation, deadcode/dependency checks, unit tests, and production build.

## Delivery Agent Mode

For longer Codex sessions, start from `DELIVERY-WORKFLOW.md`.

The durable agent state lives in:

```text
.agent-workflows/delivery-agent/
  CURRENT-STATE.md
  TASK-QUEUE.md
  SESSION-TEMPLATE.md
```

Use this mode when you want Codex to choose the next ready batch, implement it, verify it, and hand off with updated workflow notes.

## Project Shape

```text
src/
  app/          app shell, routing, layout, Pro wrappers
  components/   shared UI components and badges
  data/         mock repositories and localStorage-backed stores
  domain/       pure domain selectors/reducers/contracts used by tests and pages
  features/     feature adapters and reusable feature logic
  pages/        routed page modules
  shared/       cross-feature formatting helpers
  theme/        Ant Design token bridge and shared style constants
```

## Guardrails

- Keep routes in `src/app/routes/routeConfig.js`.
- Do not import mock seeds directly from page modules; go through data stores, repositories, or feature/domain adapters.
- Keep `.gitlab-ci.yml` on the shared template include unless the deployment contract changes.
- Use `npm run check:imports` after moving files.
- Use `npm run check:deadcode` before committing large cleanup/refactor work.

## Public mockup (GitHub Pages)

Pushing to `main` runs `.github/workflows/deploy-pages.yml`, which builds the app and publishes it to
`https://<user>.github.io/<repo-name>/`. In the repo, set **Settings → Pages → Source: GitHub Actions**.
The base path follows the repository name (override locally with `VITE_BASE_PATH`).
