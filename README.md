# Docket

Turn your docs into an embeddable, document-grounded chat widget.

Upload PDFs, text files, or Markdown to a project. Docket chunks them, embeds each chunk using a local Ollama model, and stores the vectors in Supabase with pgvector. When a visitor asks a question, the chat widget retrieves the most relevant chunks and uses a local LLM to answer — strictly from your documents, with source citations.

---

## Tech stack

| Layer | What's used |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database + vectors | Supabase (Postgres + pgvector) |
| Embeddings model | `nomic-embed-text` via Ollama |
| Chat model | `qwen3:8b` via Ollama |
| Text splitting | LangChain `RecursiveCharacterTextSplitter` |
| PDF parsing | `unpdf` |
| Styling | Tailwind CSS |

---

## Prerequisites

- [Node.js](https://nodejs.org) 18+
- [Ollama](https://ollama.com) running locally with the required models pulled:
  ```bash
  ollama pull nomic-embed-text
  ollama pull qwen3:8b
  ```
- A [Supabase](https://supabase.com) project with pgvector enabled and the schema below applied

---

## Supabase schema

Run this in your Supabase SQL editor before starting:

```sql
-- Enable the pgvector extension
create extension if not exists vector;

-- Projects
create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  created_at timestamptz default now()
);

-- Documents (one row per uploaded file)
create table documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

-- Chunks (one row per text chunk, with its embedding)
create table chunks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  document_id uuid references documents(id) on delete cascade,
  content text not null,
  embedding vector(768)  -- nomic-embed-text produces 768-dimensional vectors
);

-- Vector similarity search function (used by /api/chat)
create or replace function match_chunks(
  query_embedding vector(768),
  filter_project_id text,
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  document_name text,
  similarity float
)
language sql stable
as $$
  select
    chunks.id,
    chunks.content,
    documents.name as document_name,
    1 - (chunks.embedding <=> query_embedding) as similarity
  from chunks
  join documents on chunks.document_id = documents.id
  where chunks.project_id::text = filter_project_id
    and 1 - (chunks.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
```

---

## Getting started

```bash
cp .env.example .env.local
# Fill in the values — see Environment variables below

npm install
npm run dev
```

Open http://localhost:3000 for the landing page, or http://localhost:3000/dashboard
(redirects to `/login` if you're not signed in).

---

## Environment variables

```env
# Admin credentials — no user table, single user only
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_password

# Random secret for signing session cookies
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_secret_here

# Supabase — from your project's API settings
DATABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key

# Ollama — defaults to localhost if not set
OLLAMA_BASE_URL=http://localhost:11434
```

---

## Routes

| Route | What it is | Auth required |
|---|---|---|
| `/` | Marketing landing page | No |
| `/login` | Sign in | No |
| `/dashboard` | Projects list | Yes |
| `/dashboard/[id]/documents` | Upload & view docs for a project | Yes |
| `/dashboard/[id]/chat` | Test the RAG chat bot (preview) | Yes |
| `/dashboard/[id]/embed` | Copyable embed snippet | Yes |
| `/embed/[projectId]` | The widget rendered inside an iframe | No (visitors use this) |
| `POST /api/projects` | Create a project | Yes |
| `GET /api/projects/[id]` | Fetch a project with its documents | Yes |
| `POST /api/projects/[id]/documents` | Upload, chunk, embed & store documents | Yes |
| `POST /api/chat/[projectId]` | RAG chat — query → embed → vector search → LLM | No (widget uses this) |
| `POST /api/auth/login` | Authenticate and set session cookie | No |
| `POST /api/auth/logout` | Clear session cookie | No |

---

## How RAG works in this project

```
User question
    │
    ▼
/api/chat/[projectId]
    │
    ├─ 1. Embed the question using nomic-embed-text (via Ollama)
    │
    ├─ 2. Run match_chunks() in Supabase — vector similarity search
    │      filtered by project_id (threshold 0.15, top 2 chunks)
    │
    ├─ 3. Inject retrieved chunks into the system prompt as context
    │      (see src/lib/systemPrompt.js)
    │
    └─ 4. Send messages array to qwen3:8b (via Ollama)
           The model answers strictly from the retrieved context
           and cites sources like (Source 1), (Source 2)
```

The system prompt uses few-shot examples and explicit grounding rules to prevent hallucination — the model is instructed never to use information outside the provided context.

---

## Document ingestion pipeline

When you upload a file on `/dashboard/[id]/documents`:

```
File upload (multipart/form-data)
    │
    ├─ PDF → text extracted with unpdf
    ├─ .txt / .md → read as plain text
    │
    ├─ Text split into 500-char chunks (50-char overlap)
    │    using LangChain RecursiveCharacterTextSplitter
    │
    ├─ Each chunk embedded with nomic-embed-text → vector(768)
    │
    └─ Chunks + embeddings inserted into Supabase chunks table
         scoped to project_id and document_id
```

---

## Project structure

```
public/
  widget.js               Embeddable loader script (drop on any site)

src/
  app/                    Routing only — layouts, pages, API route handlers
    api/
      auth/               login + logout endpoints
      projects/           CRUD for projects and document ingestion
      chat/[projectId]/   RAG chat endpoint
    dashboard/            Protected dashboard pages
    embed/                Public widget iframe page

  components/             Small reusable UI (Logo, Modal)

  context/
    ProjectContext.js     Provides current project to client components

  features/               Domain UI grouped by feature
    auth/                 Login form, logout button
    projects/             Project list, create modal, tab nav
    documents/            Upload drop-zone, document list
    chat/                 Test chat preview panel
    embed/                Embed snippet + copy button
    widget/               Public-facing chat widget

  hooks/                  Shared React hooks
  lib/
    auth.js               Session cookie signing/verification (HMAC-SHA256)
    embeddings.js         Ollama nomic-embed-text wrapper
    generateChat.js       Ollama qwen3:8b chat wrapper
    supabase.js           Supabase client (server-side, stateless)
    systemPrompt.js       RAG system prompt builder (few-shot + grounding rules)
  utils/
    ollama.js             Text chunking via LangChain

middleware.js             Guards /dashboard/* and /api/projects/*
```

---

## Auth

Single admin user — no signup, no user table. Credentials are set in `.env.local` as `ADMIN_USERNAME` and `ADMIN_PASSWORD`. On successful login, a signed session cookie is issued (HMAC-SHA256 over an expiry timestamp using `JWT_SECRET`). `middleware.js` verifies this cookie on every request to `/dashboard/*` and `/api/projects/*`.

Not a general-purpose auth system — if you need multiple users, replace this with NextAuth or a proper session library backed by the database.

---

## Embedding widget on your site

Go to `/dashboard/[id]/embed` to get your project's embed snippet. It looks like:

```html
<script
  src="https://your-docket-domain.com/widget.js"
  data-project-id="your-project-id"
  defer
></script>
```

Drop it anywhere in your site's `<body>`. It injects a floating chat button that opens an iframe pointing at `/embed/[projectId]` — the widget only knows about documents uploaded to that specific project.
