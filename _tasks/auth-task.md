# Auth + Public Home Page

Adds authentication (passport-local + passport-google) and reworks the home page
so guests can browse events without an account.

---

## Status legend

| Marker | Meaning |
| --- | --- |
| ⬜ `TODO` | Not started |
| 🟦 `WIP` | In progress |
| ✅ `DONE` | Implemented and verified |
| 🚫 `BLOCKED` | Waiting on a decision or external setup |
| ⏸️ `DEFERRED` | Deliberately out of scope for this task |

## Phase status

| # | Phase | Status |
| --- | --- | --- |
| 0 | Decisions & dependencies | ✅ DONE |
| 1 | `User` model + migration | ✅ DONE |
| 2 | API — local strategy (register / login / logout / me) | ✅ DONE |
| 3 | Web — auth context, login & register forms, guest chrome | ✅ DONE |
| 4 | API + Web — Google OAuth | ✅ DONE — code complete, ⏸️ untested pending Cloud Console credentials (4.4) |
| 5 | Web — public home page | ✅ DONE |
| 6 | Web — gate the prediction action | ✅ DONE |

## Deviations from the plan as written

Five things turned out differently once the code met reality. Recorded here
because each one is a decision someone might otherwise redo:

1. **`@node-rs/argon2`, not `argon2`.** `argon2` needs a postinstall build script,
   which pnpm blocks by default (`ERR_PNPM_IGNORED_BUILDS`) and which risks a
   musl compile in the Alpine image. `@node-rs/argon2` ships prebuilt binaries —
   `@node-rs/argon2-linux-x64-musl` is in the lockfile — and needs no build step.
2. **Dependencies installed on the host, not in the container.** See the
   rewritten 0.2 — `apps/api/package.json` isn't bind-mounted, so a container
   install would have evaporated on rebuild.
3. **`proxy.ts`, not `middleware.ts`.** Next 16 renamed the convention; the
   original name builds but logs a deprecation warning.
4. **The auth-dependent blocks read the cookie server-side.** `HomeBand` and
   `Topbar` receive a `hadSessionCookie` prop from their server component
   parents. Without it the guest pitch — the entire point of the public home
   page — was a grey skeleton in the SSR HTML, invisible to crawlers and
   flashing at every first-time visitor. It picks the pre-resolve placeholder
   only and is never trusted for access control.
5. **Added `components/ui/button-link.tsx`.** Base UI's `Button` warns when
   `render` swaps in an `<a>` unless `nativeButton={false}` is passed; there were
   eight such call sites. Wrapping once beats repeating the flag eight times and
   forgetting it on the ninth.

`prisma migrate dev` also can't run here — it prompts on the `googleId` unique
constraint and the container has no TTY. The migration was generated with
`prisma migrate diff --from-config-datasource --to-schema` and applied with
`migrate deploy`. Worth knowing for the next schema change.

---

## Ground truth as of writing

Verified against the repo, not assumed:

- **No auth exists anywhere.** Nothing in `apps/web` or `apps/api/src` references
  sessions, tokens, or login.
- **`User` is a stub** — `apps/api/prisma/schema.prisma:16-22` has only
  `id / email / name / createdAt / updatedAt`. No password, no Google id, no credits.
- **Installed already**: `@nestjs/passport`, `passport`, `passport-local`,
  `passport-google-oauth20`, plus both `@types` packages.
- **NOT installed**: `@nestjs/jwt`, `passport-jwt`, `cookie-parser`, any password
  hashing library, `express-session`. Phase 0 covers these.
- **CORS is already credential-ready** — `app.enableCors({ credentials: true })`
  in `apps/api/src/main.ts:47-50`, with the comment already anticipating a session cookie.
- **Everything personal in the web app is mock data**, sourced from
  `apps/web/lib/mock-data.ts`: the credits pill and avatar in
  `apps/web/components/layout/topbar.tsx`, the whole of
  `apps/web/app/(app)/dashboard/page.tsx`, and the `Max` button in
  `apps/web/components/chakrm/prediction-slip.tsx:139`.
- **Real API-backed pages today**: `/events` (list + sport filter + infinite scroll)
  and `/events/[id]` (detail + polling markets).
- **No form library and no toast library** in `apps/web` — the login form uses plain
  React state plus `useMutation`. No new frontend deps needed.

### What this task can and cannot make real

There are no `Prediction`, `Leaderboard`, or `Wallet` models, and no endpoints for
them. That caps what the "logged-in" experience can honestly show:

| Element | Can be real after this task? |
| --- | --- |
| Live / upcoming / settled event rails | ✅ Yes — `/api/events` already supports it |
| Sport filter chips | ✅ Yes — `/api/sports` |
| Signed-in identity (name, email, avatar) | ✅ Yes — added here |
| Credits balance | ✅ Yes — minimal `User.credits` field added here |
| Rank / accuracy / streak / win history | ❌ No — needs predictions. Stays out. |
| Leaderboard preview on home | ❌ No — no endpoint. See 5.4. |
| Actually placing a prediction | ❌ No — no endpoint. Phase 6 gates the button only. |

---

## Phase 0 — Decisions & dependencies ⬜ TODO

### 0.1 ✅ Session transport — **DECIDED: JWT in an httpOnly cookie**

Chosen over `express-session`:

- No session store exists — `docker-compose.yml` has no Redis, and an in-memory
  store dies on every HMR reload.
- A cookie scoped to `Domain=.chakrm.local` is readable by `chakrm.local`,
  `admin.chakrm.local`, and `api.chakrm.local`. `.local` is not on the Public Suffix
  List, so the browser treats these as same-site — `SameSite=Lax` works and no
  `SameSite=None; Secure` (which would require HTTPS) is needed in dev.
- httpOnly beats `localStorage` against XSS, and Next server components can forward
  the cookie for SSR'd authed pages.

**⚠️ Consequence to document:** cookie auth will **not** work when the web app is
reached at `http://localhost:3000` — that origin is cross-site to `.chakrm.local` and
the browser will drop the cookie. Developers must use `http://chakrm.local`. This
reinforces the existing CLAUDE.md rule rather than adding a new one.

### 0.2 Dependencies to add (`apps/api`)

**Install on the host, not in the container.** CLAUDE.md's "run API commands in
Docker" rule doesn't apply to dependency installs here: `docker-compose.yml` mounts
only `src`, `test`, `prisma`, and the config files — **`apps/api/package.json` is not
bind-mounted**, so a `pnpm add` inside the container would update the container's copy
and vanish on rebuild. The Dockerfile's `deps` stage also runs
`pnpm install --frozen-lockfile`, so `pnpm-lock.yaml` must be current on the host
*before* the build.

```
pnpm --filter api add @nestjs/jwt passport-jwt cookie-parser argon2
pnpm --filter api add -D @types/passport-jwt @types/cookie-parser
docker compose up -d --build   # deps changed → rebuild required
```

- `argon2` over `bcrypt`: stronger default, ships prebuilt binaries for
  `node:24-alpine` (the Dockerfile base), avoiding a native toolchain in the image.
- No new `apps/web` dependencies.

### 0.3 ✅ Google OAuth redirect URI — **DECIDED: Option A, one-time handoff code**

Google Cloud Console rejects redirect URIs that don't end in a **public top-level
domain**. `http://api.chakrm.local/api/auth/google/callback` will not be accepted.
Google permits plain `http` only for `localhost` / `127.0.0.1`.

Three ways out:

**Option A — one-time handoff code (recommended).** Register
`http://localhost:3001/api/auth/google/callback` (the compose escape-hatch port
mapping, which Google accepts). The callback runs on the `localhost` origin, so it
cannot set a `.chakrm.local` cookie directly. Instead it mints a short-lived
single-use code, redirects to `http://chakrm.local/auth/google/finish?code=…`, and
the web app exchanges that code against `api.chakrm.local` — where the cookie *can*
be set. Costs one extra endpoint and one extra page (~40 lines), and it is the same
shape production wants when web and API sit on different origins.

**Option B — localhost end-to-end for Google testing only.** Test the Google flow at
`localhost:3000` → `localhost:3001`. Cheapest, but diverges from the CLAUDE.md
hostname rule and means two different dev configurations.

**Option C — public dev domain** via ngrok / Cloudflare Tunnel. Cleanest flow, but
adds an external dependency and a rotating URL to re-register.

> **Decision: Option A.** Phase 4 is unblocked.

### 0.4 Environment variables to add

`apps/api/.env.example` and the `api` service in `docker-compose.yml`:

```
JWT_SECRET=dev-only-change-me
JWT_EXPIRES_IN=7d
AUTH_COOKIE_DOMAIN=.chakrm.local
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
WEB_APP_URL=http://chakrm.local
```

---

## Phase 1 — `User` model + migration ⬜ TODO

Extend `User` in `apps/api/prisma/schema.prisma`:

| Field | Type | Notes |
| --- | --- | --- |
| `passwordHash` | `String?` | Nullable — Google-only accounts have no password |
| `googleId` | `String? @unique` | Null for password-only accounts |
| `avatarUrl` | `String?` | Google supplies one; local signups don't |
| `credits` | `Int @default(1000)` | Starting balance. Minimal on purpose — see below |
| `role` | `UserRole @default(member)` | New enum `{ member, admin }` |
| `deletedAt` | `DateTime?` | Matches the soft-delete convention used by every other model |

Notes:

- `credits` as a plain column is deliberately the *minimum* that makes the topbar and
  the member band truthful. A proper ledger (`CreditTransaction`, balance derived from
  entries) belongs with the predictions work — ⏸️ DEFERRED.
- `role` is added now purely to avoid a second migration later; `apps/admin` gating is
  ⏸️ DEFERRED and out of this task.
- **At least one of `passwordHash` / `googleId` must be set.** Prisma can't express
  this — enforce it in the service layer and note it as a schema comment.

Then:

```
docker compose exec api pnpm --filter api db:migrate --name add_user_auth_fields
```

Also extend `apps/api/prisma/seed.ts` with two dev users (one password-based, one
Google-linked) so the login form has something to log into. The seeder already wipes
and reseeds with fixed ids — follow that pattern.

---

## Phase 2 — API: local strategy ⬜ TODO

### 2.1 Files to create (`apps/api/src/auth/`)

```
auth.module.ts
auth.controller.ts
auth.service.ts
strategies/local.strategy.ts        passport-local, validates email + password
strategies/jwt.strategy.ts          passport-jwt, reads the token from the cookie
guards/local-auth.guard.ts
guards/jwt-auth.guard.ts            the strict guard — 401 when absent
guards/optional-jwt-auth.guard.ts   attaches user if present, never throws
decorators/current-user.decorator.ts
dto/register.dto.ts                 email, password (min 8), name
dto/login.dto.ts                    email, password
dto/auth-user-response.dto.ts       id, email, name, avatarUrl, credits, role
```

Plus `apps/api/src/users/` (`users.module.ts`, `users.service.ts`) so `AuthService`
isn't reaching into Prisma for user lookups directly — matches how `events`/`markets`
are already split.

### 2.2 Endpoints

| Method | Path | Guard | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | — | Create account, hash password, set cookie, return user |
| `POST` | `/api/auth/login` | `LocalAuthGuard` | Verify credentials, set cookie, return user |
| `POST` | `/api/auth/logout` | — | Clear the cookie |
| `GET` | `/api/auth/me` | `JwtAuthGuard` | Current user; 401 when signed out |

### 2.3 Implementation notes

- Register `cookie-parser` in `apps/api/src/main.ts` before the Nest app listens —
  `passport-jwt`'s cookie extractor depends on it.
- Cookie flags: `httpOnly: true`, `sameSite: 'lax'`,
  `secure: process.env.NODE_ENV === 'production'`, `domain: AUTH_COOKIE_DOMAIN`,
  `path: '/'`, `maxAge` matching `JWT_EXPIRES_IN`.
- **Login failures must not leak which half was wrong** — return the same
  `UnauthorizedException` for unknown email and bad password.
- A user with `passwordHash === null` (Google-only) attempting password login gets that
  same generic failure. Still run a dummy argon2 verify first so response timing
  doesn't distinguish the cases.
- JWT payload stays minimal: `{ sub: userId }`. Everything else is read fresh, so a
  credits change or a soft-delete takes effect immediately rather than at token expiry.
- `JwtStrategy.validate` must re-check `deletedAt: null` on every request.
- Existing public endpoints (`/events`, `/markets`, `/sports`) stay **unguarded** —
  guest read access is the entire point of this task. Do not add a global
  `APP_GUARD`; opt in per route instead.
- Add `.addCookieAuth('access_token')` to the Swagger `DocumentBuilder` in `main.ts`.

---

## Phase 3 — Web: auth context, forms, guest chrome ⬜ TODO

### 3.1 `apps/web/lib/api/client.ts` — extend

Currently GET-only with no credentials. Needs:

- `credentials: "include"` on every request (without it the cookie is never sent).
- Optional `method` / `body` so `POST` calls work.
- Keep the existing `ApiError` shape — the login form reads `.status` to tell a 401
  (wrong credentials) from a 500 (show a generic failure).

### 3.2 New files

```
apps/web/lib/api/auth.ts                 login, register, logout, getMe
apps/web/components/auth/auth-provider.tsx   context over useQuery(["me"])
apps/web/hooks/use-auth.ts               { user, isLoading, isAuthenticated }
apps/web/app/(auth)/layout.tsx           centered card, no sidebar/topbar
apps/web/app/(auth)/login/page.tsx
apps/web/app/(auth)/register/page.tsx
apps/web/components/auth/login-form.tsx
apps/web/components/auth/register-form.tsx
```

Mount `AuthProvider` inside `apps/web/app/providers.tsx`, under the existing
`QueryClientProvider`.

### 3.3 Login form spec

Built from components that already exist (`input`, `label`, `button`, `card`) — no new
deps. Plain `React.useState` + `useMutation`.

- Fields: email, password. Submit disabled while pending.
- Inline error above the submit button. 401 → "Incorrect email or password."
  Anything else → generic message plus a retry.
- On success: `queryClient.setQueryData(["me"], user)`, then
  `router.push(next ?? "/")` and `router.refresh()`.
- Honours a `?next=` query param, but **only accepts same-origin relative paths** —
  reject anything starting with `//` or a scheme, or it's an open redirect.
- "Continue with Google" button sits above a divider, links to
  `${API_BASE}/auth/google`. Rendered from Phase 4 onward; until then it's hidden
  behind an env flag rather than shipped dead.
- Link across to `/register`, and back the other way.

### 3.4 Guest chrome

**`apps/web/components/layout/topbar.tsx`** — currently hardcodes `CURRENT_USER`:

- Signed out → "Log in" (ghost) + "Sign up" (primary) where the credits pill and
  avatar sit; hide the notification bell entirely.
- Signed in → real name, real `avatarUrl`, real credits; wire "Sign out" in the
  dropdown to the logout mutation.
- While `isLoading` → render a skeleton the same width as the signed-in cluster, so
  the header doesn't jump.

**`apps/web/lib/nav.ts`** — add `Home → /`. Mark `My Predictions`, `Wallet`, `Profile`
as `requiresAuth`. Keep them **visible** to guests but route them to
`/login?next=<href>` — visible-but-redirecting converts better than hidden, and `next`
softens the dead end.

**`apps/web/lib/nav.ts:12`** currently imports `getEventById` from `mock-data` to build
the topbar title, so real event ids render as "Match". Fix while this file is open:
have `/events/[id]` set its own title rather than having nav guess.

---

## Phase 4 — Google OAuth ⬜ TODO

Implements **Option A** from 0.3 (decided).

### 4.1 API

- `strategies/google.strategy.ts` — `passport-google-oauth20`, scope `['email', 'profile']`.
- `GET /api/auth/google` — `@UseGuards(AuthGuard('google'))`, empty body; the guard redirects.
- `GET /api/auth/google/callback` — receives the profile, resolves the user, mints a
  one-time handoff code, redirects to `${WEB_APP_URL}/auth/google/finish?code=…`.
- `POST /api/auth/google/exchange` — swaps a valid unused code for the session cookie.
  Codes are single-use and expire in ~60s. In-memory `Map` is acceptable for dev;
  note in a comment that production needs shared storage.

### 4.2 Account linking rules

This is where OAuth work usually goes wrong. Explicit rules:

- `googleId` matches an existing user → sign them in.
- No `googleId` match, but the **Google-verified** email matches an existing user →
  link `googleId` onto that account and sign in. Only trust `email_verified` from the
  profile; without it, refuse rather than link.
- Neither matches → create a new user with `passwordHash: null` and the Google avatar.
- A linked user can later set a password via account settings — ⏸️ DEFERRED.

### 4.3 Web

- `apps/web/app/auth/google/finish/page.tsx` — reads `?code=`, POSTs to `/auth/google/exchange`,
  invalidates `["me"]`, redirects home. Shows a spinner, and a real error state with a
  link back to `/login` if the exchange fails.
- Reveal the "Continue with Google" button on both forms.

### 4.4 Google Cloud Console setup (manual, one-off)

OAuth consent screen (External, testing mode) → Web application credential →
authorised redirect URI `http://localhost:3001/api/auth/google/callback` → copy the
client id/secret into `.env`. **Not** committed.

---

## Phase 5 — Public home page ⬜ TODO

`apps/web/app/page.tsx` currently just `redirect("/dashboard")`, and
`/dashboard` is entirely personal and entirely mock — so today a guest lands on a page
where nothing is true and nothing is actionable.

**Approach:** make `/` a real public home inside the `(app)` layout, and keep
`/dashboard` as the authed-only personal page. One page, one auth-dependent block.

```
┌─ band ───────────────────────────────────┐
│ guest:  value prop + "Create account"    │  ← the only auth-dependent block
│ member: welcome back + credits + CTA     │
├─ Live now ───────────────────────────────┤  status=live · hidden when empty
├─ Sport chips ────────────────────────────┤  reuse FilterButton from /events
├─ Starting soon ──────────────────────────┤  status=upcoming · 6 + "View all"
└─ Recently settled ───────────────────────┘  status=settled · shows winners
```

Both band states occupy the same slot, so nothing shifts when auth resolves.

### 5.1 Move `/` out of the redirect

Delete the redirect, add `apps/web/app/(app)/page.tsx`. Server component, so the rails
are SSR'd and indexable — the guest shell is fully cacheable and only the band hydrates
client-side.

### 5.2 Rails

`GET /api/events?status=live|upcoming|settled&limit=…`. No API changes needed:
`EventsService.findMany` (`apps/api/src/events/events.service.ts:31-35`) already orders
`live → upcoming → settled` off the enum declaration order, with soonest-first inside
each group.

Reuse `EventListCard` as-is. **Every rail must collapse entirely — header included —
when it returns nothing.** Seed data may well have no live events, and a guest's first
impression should not be three empty section headers.

### 5.3 The band

- Guest: one-line value prop ("Predict matches with virtual Credits. Climb the
  rankings.") + "Create account" → `/register` + "Browse events" → `/events`.
- Member: name, real credits, and a link into `/events`. **Rank, accuracy, and streak
  are omitted** — there is no predictions data behind them and inventing numbers on the
  signed-in home page is worse than showing fewer.

### 5.4 ⏸️ DEFERRED — leaderboard preview

A top-5 leaderboard is the strongest argument for a guest to sign up, since rankings
are the whole product. But there's no `Prediction` model, no leaderboard endpoint, and
no data — it would be pure mock on the most prominent page in the app. Pick it up with
the predictions work.

### 5.5 Extracting from `/dashboard`

`/dashboard` keeps the charts, activity feed, and stat grid, and becomes auth-only
(guests hitting it get `/login?next=/dashboard`). It stays mock-backed until
predictions exist — flagged here so it isn't mistaken for real.

---

## Phase 6 — Gate the prediction action ⬜ TODO

**Rule: gate the write, never the read.** Pool bars, implied ratios, and the market
list stay fully visible to guests on `/events/[id]` — the pool split *is* the reason to
sign up, and hiding it removes the hook.

In `apps/web/components/chakrm/prediction-slip.tsx`:

- Guests see the slip fully rendered and interactive. "Confirm prediction" stays
  **enabled**; clicking pushes `/login?next=/events/{id}`. A disabled button with no
  explanation is the worst version of this.
- Replace `CURRENT_USER.credits` (line 139, the `Max` button) with the real balance;
  hide `Max` entirely for guests.
- Signed in, stake > balance → inline "Not enough Credits" and disable confirm.

**Still no predictions endpoint** — `Confirm prediction` continues to only set local
state (`setConfirmed(true)`). This phase makes the *auth* boundary correct; actually
persisting a prediction is ⏸️ DEFERRED to the predictions task.

---

## Verification

Run in a real headless Chrome against `http://chakrm.local` (hostnames mapped
via `--host-resolver-rules`, since this machine has no hosts-file entries yet).

- [x] `pnpm --filter web build` clean; `tsc --noEmit` clean on web and API
- [x] `pnpm -r lint` clean — one pre-existing `no-floating-promises` warning on
      `main.ts:91` (`bootstrap()`), untouched by this work
- [x] **Zero browser-reported errors or warnings** across the whole flow
- [x] Swagger at `http://api.chakrm.local/api/docs` lists all `/auth` routes
- [x] Register → cookie set on `.chakrm.local` → `/auth/me` 200
- [x] `GET /api/auth/me` returns 401 signed out, 200 signed in
- [x] Logout clears the cookie; `/dashboard` then redirects to
      `/login?next=%2Fdashboard`
- [x] `/events` and `/events/[id]` fully usable signed out
- [x] `/` renders real events signed out; the "Live now" rail vanished entirely
      with no live events seeded, exactly as intended
- [x] Guest sees the full slip with pool bars and odds, and "Log in to predict"
      routes to `/login?next=/events/{id}`
- [x] Wrong password and unknown email both return "Incorrect email or password"
- [x] Google-only account attempting password login returns the same message
- [x] Duplicate email → 409, including at different case
- [x] `?next=//evil.example.com` → lands on `http://chakrm.local/`
- [x] Stake over balance → inline warning, confirm disabled
- [ ] ⏸️ Google: new account, existing-email link, repeat sign-in — needs
      credentials from 4.4 before it can be exercised

### Dev accounts (from the seeder)

| Email | Password | Notes |
| --- | --- | --- |
| `demo@chakrm.dev` | `password123` | 12,480 Credits |
| `admin@chakrm.dev` | `password123` | `role: admin`, 50,000 Credits |
| `google-user@chakrm.dev` | — | `passwordHash: null`, exercises the Google-only branch |

### ⚠️ This machine has no hosts-file entries

`chakrm.local`, `admin.chakrm.local`, `api.chakrm.local` and
`pgadmin.chakrm.local` are not in `C:\Windows\System32\drivers\etc\hosts`. They
all need to point at `127.0.0.1` (CLAUDE.md documents this). **Cookie auth will
not work at `localhost:3000`** — that origin is cross-site to the cookie's
`.chakrm.local` domain, so the browser drops it and every request reads as
signed out.

## Out of scope

⏸️ Password reset / email verification · credit ledger and transactions ·
`apps/admin` auth and role gating · rate limiting on login · refresh-token rotation ·
predictions persistence · leaderboard.
