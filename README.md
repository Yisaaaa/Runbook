# Runbook

> Documentation that can run.

Runbook is a polyglot notebook platform — write Markdown, embed runnable code blocks, and execute them in isolated Docker containers directly from the browser. Think Jupyter, but multi-runtime and built from scratch.

---

## Features

- **Polyglot execution** — run Python, Node.js, Bash, and Go in the same notebook
- **Isolated containers** — each session spins up a dedicated Docker container per user per runbook
- **Real-time streaming output** — execution output streams to the browser as it runs via `fetch` + readable streams (NDJSON)
- **File blocks** — seed files into the container on session start, available to all runnable blocks
- **Explicit session management** — connect and disconnect with full control over your container lifecycle
- **Auto-expiry** — sessions automatically expire after 30 minutes of inactivity via a cron job
- **Auth** — JWT-based authentication with protected routes

---

## Tech Stack

**Backend**
- NestJS
- Prisma + PostgreSQL
- Dockerode (Docker container management)

**Frontend**
- Next.js (App Router)
- Zustand (session + auth state)
- TanStack Query
- react-markdown with custom code block rendering
- shadcn/ui + Tailwind CSS

---

## Architecture

### Container model
One Docker container per user per runbook session. Containers run a single image with all runtimes installed. Resource limits are enforced at the host config level.

```
NanoCpus: 1 core
Memory:   512MB (swap disabled)
Network:  bridge (outbound only)
```

### Block types
Runbook markdown supports two code block types:

````
```runnable python
# this block has a run button
print("hello world")
```

```file python utils.py
# this file is written to /tmp/utils.py on session start
def helper(): pass
```
````

The `file` block type is seeded into the container when the session is created — making files available to all runnable blocks in the notebook.

### Execution flow

```
Connect button
  → POST /sessions/connect/:userId/:runbookId
  → creates container, seeds file blocks, returns session

Run button (per block)
  → POST /executions/exec-block { sessionId, blockIndex, runtime }
  → code written to /tmp via putArchive (tar-stream)
  → exec'd inside container
  → output streamed back as NDJSON chunks

Disconnect button
  → DELETE /sessions/end/:id
  → stops + removes container, marks session TERMINATED
```

### Streaming pipeline

The backend uses NestJS `AsyncGenerator` to yield typed JSON chunks:

```typescript
{ type: 'output', data: string }
{ type: 'exit',   exitCode: number }
{ type: 'error',  message: string }
```

Docker's exec stream is multiplexed — stdout and stderr are interleaved with 8-byte frame headers. The backend demuxes using `container.modem.demuxStream` into a single `PassThrough`, with an explicit `stream.on('end', () => combinedStream.end())` to prevent the `for await` loop from hanging.

The frontend consumes via `fetch` + `response.body.getReader()`, buffering incomplete lines across TCP chunks and splitting on newlines (NDJSON).

---

## Project Structure

```
runbook/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── auth/
│       ├── containers/       # Dockerode, RuntimeConfigService
│       ├── executions/       # ExecBlock streaming endpoint
│       ├── runbooks/         # Block parsing (runnable + file)
│       ├── sessions/         # Session lifecycle + cron expiry
│       └── users/
└── frontend/
    └── src/
        ├── app/
        │   └── dashboard/runbooks/[id]/
        ├── components/
        │   ├── runbook-markdown.tsx
        │   ├── runnable-code-block.tsx
        │   └── file-code-block.tsx
        └── store/
            ├── authStore.ts
            └── sessionStore.ts
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (running)
- PostgreSQL

### Backend

```bash
cd backend
cp .env.example .env
# fill in DATABASE_URL, JWT_SECRET, CONTAINER_IMAGE, CORS_ORIGIN

npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
# set NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

npm install
npm run dev
```

### Docker image

Build the runtime image the containers will use:

```bash
docker build -t runbook-runtime ./backend/src/common/docker/dockerfile
```

---

## Environment Variables

**Backend**

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `CONTAINER_IMAGE` | Docker image for execution containers |
| `CORS_ORIGIN` | Allowed frontend origin |
| `PORT` | Server port (default: 8000) |

**Frontend**

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL |

---

## Supported Runtimes

| Runtime | Language | Extension |
|---|---|---|
| `python` | Python 3 | `.py` |
| `node` | Node.js | `.js` |
| `bash` | Bash | `.sh` |
| `golang` | Go | `.go` |

---

## License

MIT
