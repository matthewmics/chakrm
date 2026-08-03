## Repository Structure

This is a pnpm monorepo (workspace defined in `pnpm-workspace.yaml`, packages under `apps/*`).

- `apps/api` — NestJS backend.
- `apps/web` — Next.js consumer frontend (port 3000).
- `apps/admin` — Next.js admin console (port 3002), internal operations tool for managing teams, events, settlements, users, and the audit log. Port 3001 was avoided because `docker-compose.yml` already maps the API's container there.
- Use `pnpm --filter <app>` to run scripts scoped to a single app (e.g. `pnpm --filter api start:dev`), or `pnpm -r <script>` to run across all workspaces.
- Install dependencies from the repo root with `pnpm install`; do not run `npm` or `yarn`.

## Tech Stack

**`apps/api`**
- NestJS, TypeScript.
- Database access via **Prisma 7** (the new `prisma-client` generator, not the classic one), with `@prisma/adapter-pg` over `pg` against PostgreSQL.
- Schema lives in a single file: `apps/api/prisma/schema.prisma` (no per-model split yet). Config: `apps/api/prisma.config.ts`.
- Generated Prisma client output goes to `apps/api/src/generated/prisma/` — auto-generated, never hand-edit.
- Prisma wiring lives in `apps/api/src/prisma/` (`prisma.module.ts` + `prisma.service.ts`, the latter extends `PrismaClient` via the `PrismaPg` adapter).
- Scripts: `db:generate` (`prisma generate`), `db:migrate` (`prisma migrate dev`), `db:deploy` (`prisma migrate deploy`), `db:studio`. No seeder convention exists yet.
- Feature modules (e.g. `src/teams`, `src/events`) have not been created yet — as of writing, `src/` only has the Nest bootstrap files plus `src/prisma/`.

**`apps/web` and `apps/admin`**
- Next.js 16 (App Router), React 19, TypeScript.
- Tailwind CSS v4 + `shadcn` (components via `@base-ui/react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`).
- `lucide-react` for icons, `recharts` for charts.
- Both apps share the same dependency set/config shape; only the dev/start port differs (`admin` runs on 3002 via `next dev -p 3002`).

## Development Environment

Only the API (`apps/api`) is Dockerized for local development. The web (`apps/web`) and admin (`apps/admin`) apps are not — run them directly with pnpm/Node on the host.

- Run the API and its dependencies (e.g. database, Redis) using Docker Compose.
- Do not assume the API's Node.js or database services are installed directly on the host machine.
- Execute API commands (package installation, migrations, seeders, tests, builds) inside the appropriate Docker container unless explicitly instructed otherwise.
- For the web and admin apps, use local `pnpm` commands directly (e.g. `pnpm dev:web`, `pnpm dev:admin`) — they do not run in Docker.

When working on this project:
- Prefer `docker compose` commands over local `npm`/`pnpm`/`yarn` for anything under `apps/api`.
- Use local `pnpm` commands for anything under `apps/web` and `apps/admin`.
- Assume API-side services (e.g. NestJS, database, Redis) communicate over the Docker network.
- If you need to inspect API logs or debug, use Docker Compose logs and container shells.