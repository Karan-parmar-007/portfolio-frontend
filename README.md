# Portfolio frontend

React + TypeScript + Vite app for karanparmar.in. Specs live in
[docs/portfolio-rewrite/](../../docs/portfolio-rewrite/README.md).

## Quick start

```bash
npm install
cp .env.example .env   # adjust URLs if needed
npm run dev
```

Dev server: [http://localhost:5174](http://localhost:5174) (`strictPort`).

```bash
npm run build
npm run preview   # http://localhost:4174
```

## Ports

| Service | Port |
|---|---|
| Vite dev | 5174 |
| Vite preview | 4174 |
| Portfolio API | 8001 |
| SSO API | 8000 |
| SSO frontend | 5173 |

## Environment variables

Copied from `.env.example` (all required at build/runtime via `src/lib/env.ts`):

| Variable | Example | Purpose |
|---|---|---|
| `VITE_PORTFOLIO_API_URL` | `http://localhost:8001/api` | Portfolio backend base (without `/v1`) |
| `VITE_SSO_API_URL` | `http://localhost:8000/api` | SSO API base |
| `VITE_SSO_FRONTEND_URL` | `http://localhost:5173` | SSO login/frontend origin |

Vite embeds these at **build** time. For Docker, pass them as build-args:

```bash
docker build \
  --build-arg VITE_PORTFOLIO_API_URL=https://api.example.com/api \
  --build-arg VITE_SSO_API_URL=https://sso-api.example.com/api \
  --build-arg VITE_SSO_FRONTEND_URL=https://sso.example.com \
  -t portfolio-frontend .
```

The image serves the SPA with nginx on port 80.
