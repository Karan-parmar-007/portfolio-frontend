# Portfolio Frontend — Agent Context

> **Read this file first**, then the relevant spec in
> [docs/portfolio-rewrite/](docs/portfolio-rewrite/README.md), before changing any
> code or answering an architecture question about this repo.

## What this is

A Vite + React 19 + TypeScript SPA with two faces:

1. **Public portfolio** — a faithful clone of <https://v4.brittanychiang.com/>,
   fully driven by the portfolio API. Nothing on screen is hardcoded.
2. **Owner-only admin CMS** at `/admin`, lazily loaded, gated by SSO identity.

Styling is **Tailwind CSS v4** via `@tailwindcss/vite`, with design tokens declared
once in an `@theme` block in `src/index.css`.

## Specs — the authoritative source

| Topic | Document |
|---|---|
| Overview, phases, global rules | [README](docs/portfolio-rewrite/README.md) |
| Structure, types, data flow, routing | [05](docs/portfolio-rewrite/05-FRONTEND-ARCHITECTURE.md) |
| Palette, fonts, section-by-section spec | [06](docs/portfolio-rewrite/06-DESIGN-SYSTEM.md) |
| Admin CMS spec | [07](docs/portfolio-rewrite/07-ADMIN-PANEL.md) |
| Endpoints and response shapes | [03](docs/portfolio-rewrite/03-API-CONTRACT.md) |
| Auth model | [04](docs/portfolio-rewrite/04-AUTH-AND-STORAGE.md) |

If code and spec disagree, the spec wins — or update the spec in the same change
and say why.

The old app at [frontend/my-website-frontent](frontend/my-website-frontent) is a
**reference for visual language and the API contract only**. It is untyped JSX with
duplicated layouts and dead modules. Do not copy files from it.

## Two backends, two clients

| Client | Base URL | Purpose |
|---|---|---|
| `lib/apiClient.ts` | `${VITE_PORTFOLIO_API_URL}/v1` → `localhost:8001/api/v1` | portfolio content, public reads and admin writes |
| `lib/ssoClient.ts` | `${VITE_SSO_API_URL}/v1` → `localhost:8000/api/v1` | login, logout, refresh only |

Both use `withCredentials: true`. Tokens are HttpOnly cookies set by the SSO — this
app never sees, stores, or sends a token itself.

- `apiClient` attaches `X-CSRF-Token` from the `csrf_token` cookie on mutating
  requests, and on `401` refreshes via the **SSO** then retries once, coalescing
  concurrent refreshes.
- `ssoClient` attaches CSRF but has **no** refresh interceptor.
- `GET /auth/session` is excluded from the refresh interceptor — it returns `200`
  for anonymous callers, so retrying it would loop.

Dev ports: this app runs on **5174** (`strictPort`). 5173 belongs to the SSO
frontend. The portfolio origin must be present in the SSO's `CORS_ORIGINS`.

## Layout

```
src/
├── main.tsx        # QueryClientProvider, AuthProvider, Toaster, StrictMode
├── App.tsx         # RouterProvider
├── router.tsx      # route table; /admin is a React.lazy chunk
├── index.css       # @import tailwindcss + @theme tokens + base layer
├── types/          # one interface per API response — no any, no casts
├── lib/            # env, apiClient, ssoClient, queryKeys, mediaUrl, cn, date, csrf
├── api/            # thin typed functions, one per endpoint group
├── hooks/          # React Query hooks + UI hooks (scroll spy, reveal, reduced motion)
├── context/        # AuthContext
├── components/
│   ├── layout/     # SiteLayout, Nav, MobileMenu, SocialRail, EmailRail, Footer
│   ├── sections/   # Hero, About, Experience, Education, FeaturedProjects,
│   │               # OtherProjects, Contact — presentational, props only
│   ├── project/    # cards, filters, search
│   ├── common/     # NumberedHeading, Reveal, IntroLoader, MediaImage, states
│   ├── admin/      # OwnerGate, AdminLayout, tables, dialogs, fields
│   └── ui/         # token-styled primitives (Radix based)
└── pages/          # route components; compose sections, own routing concerns
```

Sections receive data as **props** and never fetch. Pages fetch. `HomePage` issues
exactly one request (`GET /portfolio/overview`) and should stay under 80 lines —
the old `home.jsx` was 617.

## Non-negotiable rules

**TypeScript**
- `strict` on. No `any`, no `@ts-ignore`, no non-null assertions on API data.
- Every API response has an interface in `src/types/`, written from
  [03](docs/portfolio-rewrite/03-API-CONTRACT.md) field for field.

**Content**
- Nothing user-facing is hardcoded. Not the skills list, not the bio, not the
  section titles' data, not project names, not social links, not dashboard counts.
  The About skills come from `about_skills` (`show_in_about`); the old app inlined
  them.
- Section numbers (`01.`, `02.`, ...) are **computed** from which sections have
  data, and the same computed list feeds both the nav and the headings.

**Styling**
- No hex literal outside `src/index.css`. Use the `@theme` tokens.
- Every interactive element has a visible `focus-visible` ring in
  `--color-green`. Never `outline-none` without a replacement.
- Every animation is gated by `usePrefersReducedMotion`.

**Data**
- React Query owns all server state. No `useEffect` + `fetch`.
- Every query uses a key from `lib/queryKeys.ts`.
- Every admin mutation invalidates its granular key **and** `queryKeys.overview`,
  because the home page is served from the aggregate endpoint.
- Archive filters live in the URL search params so they are shareable.

**States**
- Every data surface has loading (layout-matched skeleton), empty, and error
  states. The old site rendered nothing on failure; that is a bug, not a pattern.
- `IntroLoader` is a non-blocking overlay: queries start immediately, it runs once
  per session, and it is skipped under reduced motion.

**Uploads**
- Build a `FormData` and pass it as the body. **Never set `Content-Type`** — the
  browser must add the multipart boundary. The old app hardcoded it and broke it.

**Admin**
- Exactly one `AdminLayout` and one sidebar item array. The old admin duplicated
  its sidebar across seven pages.
- `react-hook-form` + `zod` for every form. No uncontrolled `FormData(e.target)`.
- `sonner` toasts for all feedback. **Never `alert()`.**
- No public auth links anywhere in the site chrome. `/admin/login` is reachable
  only by typing it.

**Dependencies**
- Every installed package is used. An unused dependency is a review failure.
- Do not add `framer-motion` (use `motion`), `tw-animate-css`, or a drag-and-drop
  library (reordering uses move-up/move-down buttons).

## Environment

```
VITE_PORTFOLIO_API_URL=http://localhost:8001/api
VITE_SSO_API_URL=http://localhost:8000/api
VITE_SSO_FRONTEND_URL=http://localhost:5173
```

Read them only through `lib/env.ts`, which throws on a missing value at startup
rather than producing `undefined` in a URL.

## Commands

```bash
npm run dev       # localhost:5174
npm run build     # tsc -b && vite build — must be clean
npm run lint      # must be clean
npm run preview   # localhost:4174
```

Requires the portfolio backend on 8001 and the SSO backend on 8000 to be running.

## Common pitfalls

1. Running on 5173 and colliding with the SSO frontend.
2. Forgetting `withCredentials`, so cookies are never sent and admin calls 401.
3. Setting `Content-Type` on a multipart request.
4. Letting the refresh interceptor fire on `GET /auth/session`, causing a loop.
5. Fetching inside a section component instead of the page.
6. Hardcoding section numbers so removing Education leaves a gap.
7. Rendering admin chrome before `OwnerGate` resolves, briefly exposing it.
8. Hex colours in components instead of tokens.
9. Building the experience section as an accordion — v4 uses vertical tabs with a
   sliding green indicator, and that is the spec.
10. Reintroducing base64 image handling. Images are URLs from
    `GET /api/v1/media/{id}` via `mediaUrl()`.
11. Forgetting to invalidate `queryKeys.overview` after an admin write, so the home
    page shows stale content.
12. Adding a public login or signup link. There is none.
