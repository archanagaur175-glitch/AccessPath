# AccessPath

**Free, open-access college admissions and counseling platform.**

AccessPath helps students match with colleges they have a real shot at, track
application deadlines and work on essays, using an explainable **Admission Strength
Index** rather than an opaque score. It is built for students and advisors, and it
runs fully in demo/mock mode with zero configuration.

## Highlights

| Module | What it does |
| --- | --- |
| **College Matcher** | Explainable 0–100 Admission Strength Index with Reach/Target/Safety labels, a filterable match grid, three-way comparison and charts |
| **Application Tracker** | Kanban board (To Do → Accepted) with deadline countdowns and per-school checklists |
| **Essay Coach** | Prompt analysis, brainstorms, narrative outlines, rubric feedback and version history |
| **Resource Hub** | Searchable directory of programs, scholarships, guides and advisors |
| **Advisor Workspace** | Read-only roster of connected students with summary cards |
| **Dual auth** | Supabase Auth when credentials exist; instant mock accounts otherwise |

## Mock-data mode (zero configuration)

```bash
npm install
npm run dev
```

No database and no env file are required. When Supabase credentials are absent,
every data-access function falls back to the typed mock datasets in `lib/mock-data/`.

Seeded demo accounts at `/login` (any password of 4+ characters):

| Email | Role |
| --- | --- |
| `demo@accesspath.app` | Student |
| `advisor@accesspath.app` | Advisor |

You can also create an account at `/signup` with a Student or Advisor role.

### What is seeded

| Dataset | Count |
| --- | --- |
| Colleges | 48 |
| Applications | 11 |
| Essays | 5 |
| Resources | 12 |
| Advisors | 6 |
| Roster students | 6 |

## Tech stack

- **Framework:** Next.js 16 (App Router, React Server Components), TypeScript
  strict.
- **Styling:** Tailwind CSS v4 with a custom `@theme`, dark/light mode with a
  persisted no-flash toggle.
- **Backend:** Supabase (Postgres + Auth) behind a typed data-access layer
  (`lib/data/*`) with a mock fallback.
- **State:** React Server Components plus client components with hooks.
- **Icons / charts:** `lucide-react`, `recharts`.
- **Session refresh:** Next.js 16 `proxy.ts` (formerly `middleware.ts`).

## Project structure

```
app/
  (marketing)/       public landing page
  (auth)/            login / signup (role selection at signup)
  dashboard/         role-aware dashboard
  profile/           profile builder / onboarding
  matcher/           College Matcher
  tracker/           Kanban tracker
  essays/            Essay Coach and [essayId] detail
  resources/         Resource Hub and directory
  advisor/           advisor-only view
  api/               GET route handlers (Supabase + mock)
components/          ui, layout, and per-feature components
lib/
  supabase/          client.ts, server.ts, types.ts
  data/              typed data-access layer (Supabase → mock fallback)
  mock-data/         colleges, students, applications, essays, resources, advisors
  matching/          scoring-engine.ts (Admission Strength Index)
  essay-coach/       prompt-analyzer, outline-generator, rubric-engine (offline)
  auth/              session context + mock auth
proxy.ts             Next.js 16 session refresh
```

There are 14 page/layout files.

## API routes

All five handlers are `GET` and set `dynamic = "force-dynamic"`.

| Route | Response |
| --- | --- |
| `GET /api/colleges` | `{ colleges }`; 500 with `{ error }` on failure |
| `GET /api/advisors` | `{ advisors }` |
| `GET /api/resources` | `{ resources }` |
| `GET /api/essays` | `?student_id=` for a list or `?id=` for one; 400 when neither is supplied, 404 when missing |
| `GET /api/health` | `{ status, app, dataMode: "mock"\|"supabase", timestamp }` |

## Getting started and verification

```bash
npm install
npm run dev
```

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript strict
npm run build       # Production build
```

CI (`.github/workflows/ci.yml`) runs on push and pull request to `main`: `npm ci`,
lint, `tsc --noEmit` and `npm run build`.

There are **zero test files** and no test script; Playwright appears only in the
lockfile. No build or test was executed for this documentation.

## Connecting Supabase (optional)

1. Create `.env.local` with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
   **No `.env.example` is tracked**, despite earlier instructions to copy one.
2. Create tables matching `lib/supabase/types.ts`: `users`, `student_profiles`,
   `colleges`, `matches`, `applications`, `essays`, `resources`, `advisors`,
   `advisor_requests`.
3. Restart the dev server. The data layer switches to Supabase automatically.

No SQL, migrations or Prisma schema is committed, so the table shape exists only in
the TypeScript interfaces and README notes. Without credentials the app keeps
working in mock mode.

## Data flow

- **Supabase mode:** enabled when both public env vars exist. Server components and
  route handlers read through the Supabase clients in `lib/supabase/`.
- **Mock mode:** per-user applications, essays, advisor requests and profile persist
  to `localStorage`. The mock signed-in user key is `accesspath:mock-user`; the
  theme key is `accesspath:theme`.
- `GET /api/health` reports which mode is active.

## Deployment

Two workflows are shipped:

- **`ci.yml`** — lint, typecheck and build on every push to `main`.
- **`deploy.yml`** — on `accesspath-v*` tags or manual dispatch: lint, typecheck,
  build, then `amondnet/vercel-action`.

The deploy step is gated on `vars.VERCEL_TOKEN != ''` but reads
`secrets.VERCEL_TOKEN`, `secrets.VERCEL_ORG_ID` and `secrets.VERCEL_PROJECT_ID`.
With only repository *secrets* configured, that condition is false and the deploy
step is skipped. Configure a repository *variable* named `VERCEL_TOKEN` alongside
the secrets, or deploy through Vercel directly.

The simplest path is to import the repository in Vercel. No credentials are needed
in the repo for that.

## Known limitations

- No `.env.example` is tracked.
- The Supabase schema is not versioned; tables must be created manually from the
  type definitions.
- Essay detail pre-renders from mock essays via `generateStaticParams`, while the
  essays API is `force-dynamic`; the static/dynamic split is not explained.
- No tests.

## License

MIT. See [`LICENSE`](LICENSE).
