# Docket

Turn your docs into an embeddable, doc-grounded chat widget.

## Getting started

```bash
cp .env.example .env.local
# edit .env.local — set ADMIN_USERNAME, ADMIN_PASSWORD, and a random JWT_SECRET
# generate a secret with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

npm install
npm run dev
```

Open http://localhost:3000 for the landing page, or http://localhost:3000/dashboard
(you'll be redirected to `/login` if you're not signed in).

## Routes

| Route | What it is | Protected? |
|---|---|---|
| `/` | Marketing landing page | No |
| `/login` | Sign in | No |
| `/dashboard` | Projects list | Yes |
| `/dashboard/[id]/documents` | Upload docs for one project | Yes |
| `/dashboard/[id]/chat` | Test the bot (preview only for now) | Yes |
| `/dashboard/[id]/leads` | Leads captured by that project's bot | Yes |
| `/dashboard/[id]/embed` | Copyable embed snippet | Yes |
| `/embed/[projectId]` | The actual widget, rendered inside the iframe | No — visitors need this |
| `/api/projects`, `/api/projects/[id]/documents` | Backing API routes | Yes |

"Protected" means `src/middleware.js` checks for a valid session cookie and
redirects to `/login` (or returns 401 for API calls) if it's missing or expired.

## Project structure

```
public/                 Static assets, including widget.js (the embeddable loader script)
src/
  app/                  Routing only — layouts, pages, API route handlers
  components/           Small, generic, reusable UI (Modal, Logo)
  features/             Domain-specific UI, grouped by feature
    auth/                 Login form, logout button
    projects/             Project list, create form, tab nav
    documents/             Upload UI
    chat/                  Test chat preview
    leads/                 Leads table
    embed/                 Embed snippet + copy button
    widget/                The public-facing chat widget itself
  hooks/                 Shared React hooks (useCopyToClipboard)
  lib/                   Server-side helpers (auth signing, the mock data store)
  utils/                 Small pure helper functions (formatRelativeTime)
middleware.js            Guards /dashboard and /api/projects
```

## Auth

Single admin user, no signup, no user table. Credentials are checked against
`ADMIN_USERNAME` / `ADMIN_PASSWORD` in your env file. On success, a signed
session cookie is set (HMAC-SHA256 over an expiry timestamp, using
`JWT_SECRET`) and `src/middleware.js` checks it on every request to
`/dashboard/*` and `/api/projects/*`.

This is intentionally simple for a single-user project — not a general auth
system. If you ever add more users, swap this for real sessions (or NextAuth)
backed by a database.

## The mock data store

`src/lib/mockStore.js` holds projects, documents, and leads in a plain
in-memory array — no database yet. It's written with the same function
shapes a real DB-backed version would have (`listProjects()`, `getProject(id)`,
`createProject()`, etc.), so swapping it for real Postgres queries later
shouldn't require touching any of the pages or components that call it.

Two things to know about it:
- Data resets whenever the dev server restarts or hot-reloads.
- It only works as a single Node process — it will not survive a
  serverless/edge deployment. Replace it before shipping for real.

## Not wired up yet — next steps

1. **Postgres + pgvector** — `projects`, `documents`, `chunks`, `leads`
   tables (`chunks` stores `project_id` + `embedding vector(768)` for
   `nomic-embed-text`), replacing `mockStore.js`
2. **Ollama helpers** — `embed()` and `generate()` wrapper functions hitting
   `OLLAMA_BASE_URL`
3. **Real ingestion** — wire `src/app/api/projects/[id]/documents/route.js`
   to parse an actual file upload (multipart, not JSON filenames), chunk it,
   embed each chunk, and insert rows scoped to `project_id`
4. **Chat route** — `/api/chat/[projectId]` — embed the query, vector search
   filtered by `project_id`, stream a response — this is what
   `TestChatPanel` and `ChatWidget` will call once it exists
5. **Lead submission** — wire the widget's "Talk to a human" form to a real
   `POST /api/projects/[id]/leads` route
