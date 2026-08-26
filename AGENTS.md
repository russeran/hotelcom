# HotelCom

A MERN hotel department communication app: a Create React App (CRA / `react-scripts`) frontend and an Express + MongoDB (Mongoose) API in the same repository.

- Frontend source: `src/` (CRA). Client API helpers live in `src/utilities/`.
- Backend: `server.js`, `routes/api/*`, `controllers/api/*`, `models/*`, `config/*`.
- The client talks to the API via relative `/api/...` URLs; CRA's dev proxy (`"proxy"` in `package.json`) forwards them to the backend on port 3001.

## Cursor Cloud specific instructions

### Services and how to run them (development)
Three processes are needed for full end-to-end development:

1. MongoDB — `mongod --dbpath /data/db --bind_ip 127.0.0.1 --port 27017`. There is no systemd in this VM, so start `mongod` manually (e.g. in a tmux session); do not use `systemctl`/`service`.
2. Backend API — `node server.js` (listens on `PORT`, default 3001). Requires a `.env` file (see below). There is no watcher configured, so restart it manually after backend code changes.
3. Frontend — `BROWSER=none PORT=3000 npm start` (CRA dev server on 3000, hot-reloads). Uses the `proxy` field to reach the API on 3001. Do NOT use `npm run build` + `node server.js` for development.

### Required environment (`.env`, untracked)
Copy `.env.example` to `.env` in the repo root. The backend reads `DATABASE_URL`, `SECRET`, and `PORT` via `dotenv`:

```
DATABASE_URL=mongodb://127.0.0.1:27017/hotelcom
SECRET=dev_local_secret_change_me
PORT=3001
REACT_APP_OPENWEATHER_KEY=<openweathermap key>
REACT_APP_RAPIDAPI_KEY=<rapidapi hotels-com-provider key>
```

`.env` is gitignored. `SECRET` signs/verifies JWTs; `DATABASE_URL` is the Mongo connection string. The `REACT_APP_*` keys feed the Weather widget (Home) and the "Other Hotels" search (HotelPage). Note: CRA only exposes `REACT_APP_*` vars and bakes them into the client bundle at build time, so they are visible to end users and the dev server must be restarted to pick up changes to them.

### Non-obvious gotchas
- The API server only serves the built client (`serve-favicon` + static + `/*` catch-all) when `build/index.html` exists. In development that folder is absent and the client is served by the CRA dev server on port 3000 — this is expected; hitting the backend (3001) directly on a non-`/api` route returns a plain "development mode" message, not the SPA.
- All resource routes (`/api/tasks`, `/api/notes`, `/api/complaints`, `/api/concierges`) require a valid JWT (`ensureLoggedIn`) and return `401` without an `Authorization: Bearer <token>` header. `/api/users` (signup/login) is public.
- Resource route paths use explicit subpaths: `POST /api/<resource>/create`, `GET /api/<resource>/index`, `DELETE /api/<resource>/delete/:id`, and `PUT /api/<resource>/:id` for updates (tasks, complaints). This differs from typical REST conventions — match `src/utilities/*-api.js`.
- Express is intentionally pinned to `^4`: the catch-all route uses the `'/*'` pattern, which is invalid under Express 5 / path-to-regexp v8.
- CRA is pinned to `react-scripts` 5.0.1 with React 18 and react-router 6; do not jump to React 19 / react-router 7 without migrating off CRA.
- Styling is a custom design system: `bootstrap/dist/css/bootstrap.min.css` is imported in `src/index.js` and `src/index.css` layers a dark theme via CSS variables (`--bg-*`, `--surface*`, `--primary`, `--accent`, etc.) plus shared layout utilities (`.page`, `.page-header`, `.page-card`, `.toolbar`, `.search-box`, `.filter-pills`, `.surface-card`, `.section-title`). Do not remove the Bootstrap import — react-bootstrap components depend on it. Reuse the tokens/utilities instead of hardcoding colors, and use the shared `StatusBadge` component for status pills.
- The Home route ("/") is a Dashboard that fetches counts from the resource APIs; it receives `user`/`setUser` from `App` (needed for the avatar upload).
- The client's "current user" comes entirely from the decoded JWT payload (there is no `/me` endpoint). Anything that must change the displayed user (e.g. the profile-picture upload at `POST /api/users/avatar`) re-issues a new JWT that the client stores — update the token, don't expect a separate profile fetch.
- Uploaded profile pictures are written to `uploads/` (gitignored) and served statically at `/uploads/...`; in dev the CRA proxy forwards those requests to the API on 3001.
- Notifications are auto-created (best-effort) when a task or complaint is created; the NavBar polls `/api/notifications/index` every 15s.
- Team chat (`/chat`, `/api/messages`) is polling-based (the Chat page polls every 3s) rather than websockets, to stay consistent with the rest of the app and avoid websocket-proxy issues in dev. The message author is set server-side from the JWT user's name. Messages are scoped to a `channel` (department tabs); `GET /api/messages/index?channel=` filters, and the `General` channel also includes legacy channel-less messages.
- Tasks carry a `priority` (Low/Normal/High/Urgent). The Task page sorts Urgent-first (open ahead of completed), supports a department filter, and new-task notifications are prefixed with the priority when it isn't Normal.
- Concierge supports full CRUD including edit (`PUT /api/concierges/:id`) and has `address`/`phone`/`url` fields that render as Directions/Call/Website links on each card.

### Roles & authorization (RBAC)
- Users have a `role` (`staff` | `manager` | `admin`, default `staff`) and an optional `department`. Both travel in the signed JWT, so **role/department changes only take effect on the user's next login** (there is no `/me` refresh endpoint).
- Signup never trusts a client-provided role. Bootstrap rule: if no `admin` exists yet, the next account created becomes `admin`; otherwise `staff`.
- `config/requireRole(...roles)` guards routes (returns `403`); it runs after the global `checkToken` sets `req.user`. `config/ensureLoggedIn` still handles the `401`.
- Policy: everyone authenticated can read + create + do operational updates (task status/priority, edit complaint/concierge). Destructive deletes are gated — tasks/concierge/notifications require `manager|admin`; complaints and notes allow the **owner/author OR** `manager|admin` (ownership is checked in-controller since it needs the document). Admin user management (`GET /api/users`, `PUT /api/users/:id/role`, `DELETE /api/users/:id`) is `admin`-only.
- The notifications feed is department-scoped for `staff` (their department + department-less), while managers/admins see all.
- Client helpers `isAdmin()` / `canManage()` in `users-service` gate UI controls; the `/admin` page is admin-only (guards in-component). Do not rely on client checks for security — they mirror the server rules, which are authoritative.
- **Manager scoping**: managers are department-scoped like staff — their notifications feed is limited to their department (+ general), and they can only delete tasks in their own department (enforced in `tasks` controller). Admins are global. The Task page defaults a manager's department filter to their department.
- **Audit log**: `controllers/api/audit.js` exposes a best-effort `record({ req, action, entity, entityId, details })` used by the resource controllers on create/update/delete (and user `role_change`/delete). It must never throw. Admin-only `GET /api/audit` returns the latest 200 entries; the Admin page renders them as an Activity Log.
- **Live role propagation (client)**: `GET /api/users/refresh-token` re-issues a JWT from current DB state; `App` calls `refreshUser()` on mount, every 30s, and on window focus (and logs out if the account was deleted) so the *UI* reflects role/department changes.
- **Immediate enforcement (server, authoritative)**: `config/checkToken.js` re-hydrates `req.user` (role/department/identity) from the database on **every** request rather than trusting the JWT's claims. So server-side authorization always reflects current DB state — role/department changes and account deletions take effect on the very next request (a deleted user's token is rejected immediately). The JWT now only proves identity; never trust its role claim server-side.
- **Nearby events (Concierge)**: `GET /api/events` is a server-side proxy to the Ticketmaster Discovery API (key `TICKETMASTER_API_KEY`, kept off the client). It returns `{ configured: false, events: [] }` when no key is set (the UI shows a "connect a key" prompt), a normalized event list when configured, and a `502` with an empty list on upstream errors. The Concierge page's `EventsNearby` component auto-loads it and can "Save" an event as a curated recommendation. Add `TICKETMASTER_API_KEY` as a secret to enable live events.
- **Complaints & notes have a `department`** (complaints default to `Front Desk`; a complaint's notification is routed to that department). Their index views are **manager-scoped**: a manager sees only their department's records (+ department-less/general), while staff and admins see all. Note: legacy documents without a `department` are treated as general (Mongoose applies the complaint default `Front Desk` on read).

### Front-desk modules & platform notes
- **Reliability**: `server.js` uses `express-async-errors` + a centralized error handler + a JSON `404` for unknown `/api/*`, so async controller errors (e.g. a bad ObjectId → `CastError`) return `400/500` instead of hanging. `helmet` sets security headers (CSP/CORP relaxed for the SPA/fonts/external images). Auth routes are rate-limited (`express-rate-limit`). bcrypt cost is 12; password `minLength` is 6.
- **Rooms** (`/rooms`, `/api/rooms`): a room-status board with statuses `Vacant Clean | Vacant Dirty | Occupied | Inspected | Out of Order` (list on `models/room.js`). Delete is manager/admin.
- **Reservations** (`/reservations`, `/api/reservations`): `Booked | Checked In | Checked Out | Cancelled`. Cross-department automation on update: check-in sets the matching room `Occupied`; check-out sets it `Vacant Dirty` and notifies Housekeeping.
- **Task workflow**: statuses `Open → Acknowledged → In Progress → Done`; `PUT /api/tasks/:id/acknowledge` stamps `acknowledgedAt/By` server-side; per-priority SLA (Urgent 1h/High 4h/Normal 24h/Low 72h) drives a client-side `OVERDUE` badge. Assignee dropdown comes from `GET /api/users/directory` (name+department, any signed-in user).
- **Guest requests**: the Dashboard "Log a Guest Request" form creates a routed, department-tagged task (which notifies that department).
- **Reports** (`/reports`, managers/admins): KPIs + bar breakdowns + CSV export (client-side via `src/utilities/csv.js`).
- **Global search** (`/search?q=`): client-side aggregation across tasks/complaints/reservations/rooms/notes/concierge, launched from the NavBar search box.
- **Notifications** are per-user via `readBy[]` (no shared read state). **Client error toasts**: `send-request` surfaces server error messages through `src/utilities/toast.js` + `ToastHost` (401s are suppressed and handled by logout).
- **Admin lockout guards**: an admin can't change their own role or remove the last admin.

### Lint / test / build
- Lint: there is no standalone lint script; ESLint (CRA config) runs as part of `npm start` and `npm run build`. `npm run build` fails the build on ESLint errors unless `CI=false` (warnings are allowed).
- Tests: `npm test` runs the CRA (Jest) test runner, but the repo currently has no test files.
- Build: `CI=false npm run build` produces the production `build/` folder.
