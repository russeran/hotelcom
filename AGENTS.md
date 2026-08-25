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

### Lint / test / build
- Lint: there is no standalone lint script; ESLint (CRA config) runs as part of `npm start` and `npm run build`. `npm run build` fails the build on ESLint errors unless `CI=false` (warnings are allowed).
- Tests: `npm test` runs the CRA (Jest) test runner, but the repo currently has no test files.
- Build: `CI=false npm run build` produces the production `build/` folder.
