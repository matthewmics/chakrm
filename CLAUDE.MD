## Repository Structure

This is a pnpm monorepo (workspace defined in `pnpm-workspace.yaml`, packages under `apps/*`).

- `apps/api` — NestJS backend.
- `apps/web` — Next.js consumer frontend (port 3000).
- `apps/admin` — Next.js admin console (port 3002), internal operations tool for managing teams, events, settlements, users, and the audit log. Port 3001 was avoided because `docker-compose.yml` already maps the API's container there.
- Use `pnpm --filter <app>` to run scripts scoped to a single app (e.g. `pnpm --filter api start:dev`), or `pnpm -r <script>` to run across all workspaces.
- Install dependencies from the repo root with `pnpm install`; do not run `npm` or `yarn`.

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