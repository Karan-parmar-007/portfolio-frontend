/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORTFOLIO_API_URL: string
  readonly VITE_SSO_FRONTEND_URL: string
  readonly VITE_STUDIO_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
