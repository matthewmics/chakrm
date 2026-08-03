## Prompt

When i say "give me suggestions" dont make any edits

## Product

**This is not a betting/gambling platform — it is a prediction system.** Users predict outcomes of sporting/esports events using **virtual credits**, not real money. Results feed a **leaderboard/rankings** system, not cash payouts. There is no house rake/commission anywhere in the domain model — the credit pool for a market redistributes entirely to whoever predicted the winning option.

Don't default to gambling-industry assumptions (regulatory/compliance framing, real-money payment rails, KYC, rake/commission fields, etc.) — they don't apply here.

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
- Scripts: `db:generate` (`prisma generate`), `db:migrate` (`prisma migrate dev`), `db:deploy` (`prisma migrate deploy`), `db:studio`, `db:seed` (`tsx prisma/seed.ts`, also wired as `migrations.seed` in `prisma.config.ts` so `prisma db seed` / `prisma migrate reset` pick it up). The seeder wipes and reseeds `Sport`/`Tournament`/`Team`/`TeamSport`/`Event`/`Market`/`MarketOption` with fixed ids — local dev only, never run against real data.
- Feature modules (e.g. `src/teams`, `src/events`) have not been created yet — as of writing, `src/` only has the Nest bootstrap files plus `src/prisma/`.

**`apps/web` and `apps/admin`**
- Next.js 16 (App Router), React 19, TypeScript.
- Tailwind CSS v4 + `shadcn` (components via `@base-ui/react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`).
- `lucide-react` for icons, `recharts` for charts.
- Both apps share the same dependency set/config shape; only the dev/start port differs (`admin` runs on 3002 via `next dev -p 3002`).

## Domain Model

The prediction domain shape (`apps/api/prisma/schema.prisma` is the source of truth for exact fields — this section is about conventions and non-obvious rules, not a field list):

`Sport` → `Tournament` → `Event` → `Market` → `MarketOption`, plus `Team` linked to sports via a `TeamSport` pivot, and `Event` holding three separate FKs to `Team` (`teamA`, `teamB`, `winnerTeam`).

- **`Sport` is normalized, not a string.** `isEsport` lives on `Sport`, not on `Tournament` — a given sport (e.g. Dota 2) can't be esports in one tournament and not another, since it's defined once per sport.
- **`Team` is sport-agnostic.** A team has no `sportId` of its own — orgs like "Team Spirit" field rosters across multiple games (Dota 2 and CS2 in the seed data). Which sports a team competes in is tracked via the `TeamSport` pivot table, independent of whether it's actually been scheduled into any `Event` yet.
- **Status is entirely admin-driven — no scheduler, cron, or auto-lock. This applies to `Event.status` and `Market.status` alike.** `startDate` on both models is purely informational (drives a UI countdown) and never automatically changes a status. Multiple markets on the same event can be in different states (`upcoming`/`open`/`live`/`suspended`/`settled`/`cancelled`) purely because an admin set them that way — there's no built-in rule sequencing one market's availability against another or against the parent `Event`'s status. Don't add auto-locking logic without an explicit product decision to do so.
- **Corollary: no "override" fields.** Because status is set directly rather than derived, there is nothing to override. `Event.adminOverrideLive` existed for exactly this reason and was dropped (migration `20260803123018_drop_event_admin_override_live`) — it was never read by application code and merely duplicated `status: 'live'`. Don't reintroduce a flag of this shape; if an admin wants an event live, they set `status`.
- **No rake/commission anywhere** — ties to the Product framing above. `MarketOption.totalCredits` is the only stored pool value; implied payout ratios are always computed live (`pool ÷ option.totalCredits`), never cached or frozen on the option itself.
- For a concrete example of how all of this composes together (a full tournament → event → market → option tree, including a market opened before its sibling has even started), read `apps/api/prisma/seed.ts`.

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

Avoid checking the _prototypes folder in the root unless I said so. This is just UI prototype and we used this as reference to create our layout for admin and the consumer app.