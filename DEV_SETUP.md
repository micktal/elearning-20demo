Developer setup

This repository uses pnpm and Vite. Follow these steps locally to run lint, tests and build.

1. Install dependencies

   pnpm install

2. Run the dev server

   pnpm run dev

3. Run ESLint (check)

   pnpm run lint

4. Automatic fixes (where possible)

   pnpm run lint:fix

5. Build

   pnpm run build

6. Typecheck

   pnpm run typecheck

Enabling Sentry

- To enable Sentry client-side monitoring, install the package and set the DSN in your environment:

  pnpm add @sentry/browser

  Then set VITE_SENTRY_DSN in your .env or environment variables. Alternatively, load Sentry via a script tag that defines window.Sentry and set window.**SENTRY_DSN**.

Notes

- The project already includes ESLint configuration that forbids duplicate imports and unused imports.
- The GitHub Actions workflow (CI) will run lint, typecheck and client build on push/PR to main/master.
