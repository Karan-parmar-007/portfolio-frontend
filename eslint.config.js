import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // UI primitives and contexts export helpers alongside components.
      'react-refresh/only-export-components': 'off',
      // React Compiler lint: setState in effects is intentional for scroll/reveal/auth boot.
      'react-hooks/set-state-in-effect': 'off',
      // react-hook-form watch() is incompatible with the compiler memoization check.
      'react-hooks/incompatible-library': 'off',
    },
  },
])
