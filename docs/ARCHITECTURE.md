# Architecture

Static description of AccessPath. No install, build or network call was performed.

## App Router layout

```
app/
  layout.tsx              root layout
  (marketing)/page.tsx    public landing page
  (auth)/                 login and signup
  dashboard/              role-aware dashboard
  profile/                profile builder
  matcher/                College Matcher
  tracker/                Kanban tracker
  essays/                 Essay Coach + [essayId]
  resources/              Resource Hub
  advisor/                advisor-only view
  api/                    five GET handlers
```

14 page/layout files in total. Essay detail is pre-rendered from mock essays with
`generateStaticParams`, while the essays API is `force-dynamic`.

## Route handlers

All five are `GET` with `export const dynamic = "force-dynamic"`:

| Route | Contract |
| --- | --- |
| `/api/colleges` | `{ colleges }`; 500 `{ error }` on failure |
| `/api/advisors` | `{ advisors }` |
| `/api/resources` | `{ resources }` |
| `/api/essays` | `?student_id=` list or `?id=` single; 400 if neither; 404 if missing |
| `/api/health` | `{ status, app, dataMode, timestamp }`, where data mode is `mock` or `supabase` |

There is no CLI, IPC, WebSocket or GraphQL surface.

## Supabase vs mock data flow

`lib/data/*` is the typed data-access layer. Each function follows the same shape:

```
request
  ├─ Supabase credentials present → Supabase client query
  └─ credentials absent           → typed mock dataset
```

- Supabase clients: `lib/supabase/client.ts` (browser), `lib/supabase/server.ts`
  (server), with session refresh in `proxy.ts`.
- The switch is based on the presence of `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `lib/supabase/types.ts` defines User, StudentProfile, College, Match,
  Application, Essay, Resource, Advisor and AdvisorRequest.
- No SQL, migration or Prisma schema is tracked.

Mock mode persists mutable state in `localStorage`:

| Key / area | Contents |
| --- | --- |
| `accesspath:mock-user` | Signed-in mock user |
| profile storage | Student profile edits |
| applications client | Applications |
| essays client | Essays and versions |
| advisors client | Advisor requests |
| `accesspath:theme` | Theme preference |

## Auth modes

Dual-mode authentication:

| Mode | Behaviour |
| --- | --- |
| Supabase | Used when both public env vars exist |
| Mock | Seeded accounts persisted in `localStorage`; any password of 4+ characters |

Demo accounts: `demo@accesspath.app` (Student) and `advisor@accesspath.app`
(Advisor). Signup allows choosing Student or Advisor.

The mock auth path is a local-only fallback, not a security boundary.

## Admission Strength Index

`lib/matching/scoring-engine.ts` produces a 0–100 score plus Reach/Target/Safety
labels. The scoring inputs are the typed `College` and student profile data; the
matcher UI, comparison view and charts consume the result.

## Styling and theming

- Tailwind CSS v4 via `@tailwindcss/postcss`, brand tokens in a custom `@theme`.
- No-flash theme script plus provider; preference stored under `accesspath:theme`.

## Build and CI

| Script | Purpose |
| --- | --- |
| `dev` | Dev server |
| `build` | Production build |
| `start` | Production server |
| `lint` | ESLint |
| `typecheck` | `tsc --noEmit` |
| `format`, `format:check` | Prettier |

`ci.yml`: `npm ci`, lint, `tsc --noEmit`, `npm run build` on push/PR to `main`.
`deploy.yml`: tag `accesspath-v*` or manual dispatch; lint/typecheck/build then
`amondnet/vercel-action`.

Deploy gating reads `vars.VERCEL_TOKEN` while the action receives
`secrets.VERCEL_TOKEN`, `secrets.VERCEL_ORG_ID` and `secrets.VERCEL_PROJECT_ID`.

## Unknowns

- Exact Supabase column types and constraints (only TypeScript interfaces exist).
- Whether a live Vercel deployment has Supabase credentials configured.
- Whether the Playwright lockfile entry is a leftover.
