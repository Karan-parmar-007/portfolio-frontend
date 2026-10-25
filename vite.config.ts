import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      '/api/auth': { target: process.env.AUTH_API_PROXY || 'http://127.0.0.1:8002', changeOrigin: true },
      '/api/portfolio': { target: process.env.PORTFOLIO_API_PROXY || 'http://127.0.0.1:8004', changeOrigin: true },
    },
  },
  preview: {
    port: 4174,
    strictPort: true,
  },
})
