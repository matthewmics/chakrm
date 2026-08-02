# Multi-stage build for the `api` workspace package.
# Build context is the REPO ROOT (pnpm needs the workspace lockfile), so build with:
#   docker build -f apps/api/Dockerfile --target production -t chakrm-api .
#
# Targets:
#   development -> webpack HMR, source bind-mounted by docker-compose
#   production  -> compiled dist + prod-only deps, non-root

# ---------------------------------------------------------------- base
FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH"
RUN corepack enable

WORKDIR /app

# ---------------------------------------------------------------- deps
# Only manifests are copied here so this layer stays cached until a
# dependency actually changes.
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter api... --store-dir /pnpm/store

# ---------------------------------------------------------------- development
# Used by docker-compose. Source is bind-mounted over /app/apps/api at run
# time; WEBPACK_POLL makes the watcher poll, because bind mounts do not
# forward inotify events from the host.
FROM deps AS development

ENV NODE_ENV=development \
    WEBPACK_POLL=1000

COPY apps/api ./apps/api

# Generated into src/generated (see prisma/schema.prisma) so it survives the
# docker-compose bind mount over apps/api/src; docker-compose also reruns
# this at container start since the mount hides whatever is baked in here.
RUN pnpm --filter api exec prisma generate

EXPOSE 3000
CMD ["pnpm", "--filter", "api", "start:dev"]

# ---------------------------------------------------------------- build
FROM deps AS build

COPY apps/api ./apps/api

RUN pnpm --filter api exec prisma generate

RUN pnpm --filter api build

# ---------------------------------------------------------------- prod-deps
# A second, production-only install so devDependencies never reach the
# runtime image.
FROM base AS prod-deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod --filter api... --store-dir /pnpm/store

# ---------------------------------------------------------------- production
FROM base AS production

ENV NODE_ENV=production

RUN apk add --no-cache dumb-init

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY apps/api/package.json ./apps/api/

USER node

EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "apps/api/dist/main"]
