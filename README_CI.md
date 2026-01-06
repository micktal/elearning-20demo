CI and linting

A GitHub Actions workflow was added (.github/workflows/ci.yml) to run on push and PR to main/master. It will:

- install dependencies using pnpm
- run typecheck
- run lint
- build the client

Notes:
- ESLint and necessary plugins were added to devDependencies in package.json. After pulling changes, run `pnpm install` locally to install them.
- If you prefer another CI provider, replicate the same steps (install, typecheck, lint, build).
