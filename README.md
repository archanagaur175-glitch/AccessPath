# AccessPath

**Free, open-access college admissions & counseling platform.**

AccessPath helps students match with colleges they have a real shot at, track every
application deadline, and write stronger essays — with an explainable **Admission
Strength Index** instead of an opaque algorithm. It's built for students _and_ advisors,
and it runs **fully in demo/mock mode with zero configuration**.

![Next.js](https://img.shields.io/badge/Next.js_16-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_v4-38BDF8?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![Deploy Ready](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)

---

## Highlights

| Module                  | What it does                                                                                                                       |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **College Matcher**     | Explainable 0–100 Admission Strength Index + Reach/Target/Safety labels, filterable match grid, 3-way comparison, analytics charts |
| **Application Tracker** | Kanban board (To Do → Accepted) with animated deadline countdowns and per-school checklists                                        |
| **Essay Coach**         | Prompt analysis, coaching brainstorms, narrative outlines, rubric feedback, and version history                                    |
| **Resource Hub**        | Searchable directory of programs, scholarships, and guides, plus a human advisor directory                                         |
| **Advisor Workspace**   | Read-only roster of connected students with summary cards                                                                          |
| **Dual auth**           | Supabase Auth when credentials exist; instant mock accounts otherwise                                                              |

## Mock-data mode (zero configuration)

Run `npm install && npm run dev` and everything works — no database, no env file.
When Supabase credentials are absent, every data-access function falls back to the typed
mock datasets in [`lib/mock-data/`](./lib/mock-data).

Try the seeded demo accounts at `/login` (any password of 4+ characters):

| Email                    | Role    |
| ------------------------ | ------- |
| `demo@accesspath.app`    | Student |
| `advisor@accesspath.app` | Advisor |

You can also create a fresh account at `/signup` with a Student/Advisor role.

## Tech stack

- **Framework:** Next.js 16 (App Router, React Server Components), TypeScript (strict)
- **Styling:** Tailwind CSS v4 with a custom `@theme` for AccessPath brand tokens; full
  dark/light mode with a persisted, no-flash toggle
- **Backend:** Supabase (Postgres + Auth) behind a typed data-access layer
  (`lib/data/*`) with graceful mock fallback
- **State:** React Server Components + client components with hooks
- **Icons / charts:** `lucide-react`, `recharts`
- **Proxy:** session refresh wired through Next.js 16's `proxy.ts` (formerly `middleware.ts`)

## Project structure

```
app/
  (marketing)/       → public landing page
  (auth)/            → login / signup (role selection at signup)
  dashboard/         → role-aware dashboard (student vs advisor)
  profile/           → profile builder / onboarding
  matcher/           → College Matcher Engine
  tracker/           → Kanban Milestone Tracker
  essays/            → Essay Coach & [essayId] detail
  resources/         → Resource Hub & Directory
  advisor/           → Advisor-only view
  api/               → route handlers (Supabase + mock)
components/
  ui/                → shared design-system primitives
  matcher/ tracker/ essays/ resources/ layout/
lib/
  supabase/          → client.ts, server.ts, types.ts
  data/              → typed data-access layer (Supabase → mock fallback)
  mock-data/         → colleges, students, essays, resources
  matching/          → scoring-engine.ts (Admission Strength Index)
  auth/              → session context + mock auth
types/               → shared types
proxy.ts             → Next.js 16 session refresh
```

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Verification commands (all must pass):

```bash
npm run lint        # ESLint
npx tsc --noEmit    # TypeScript
npm run build       # Production build
```

## Connecting Supabase (optional)

1. Copy `.env.example` → `.env.local` and fill in:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

2. Create the tables matching [`lib/supabase/types.ts`](./lib/supabase/types.ts)
   (`users`, `student_profiles`, `colleges`, `matches`, `applications`, `essays`,
   `resources`, `advisors`, `advisor_requests`). See the schema notes in the types file.
3. Restart the dev server. The data layer switches to Supabase automatically.

Without any credentials the app keeps working in mock mode.

## Deployment

The repository ships two GitHub Actions workflows:

- **`ci.yml`** — runs lint, typecheck, and build on every push to `main`.
- **`deploy.yml`** — deploys to Vercel, triggered only by a release tag
  (`accesspath-v*`) or manual `workflow_dispatch`. This keeps deployment as the
  deliberate final step of any build cycle.

Two ways to go live:

1. **One-click (recommended):** import this repository on [vercel.com](https://vercel.com)
   — "Add New → Project". No credentials are needed in this repo.
2. **Automated:** add the `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`
   repository secrets, then push a tag:

   ```bash
   git tag accesspath-v1.0.0
   git push origin accesspath-v1.0.0
   ```

## License

Open access, that's the point. Use it, adapt it, share it.
