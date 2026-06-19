# Velik — Bicycle E-Commerce Platform

A full-stack web store for bicycles and related services (repairs, installments).

## Stack

- **Frontend**: React 19, Vite 7, Tailwind CSS 4, Radix UI, TanStack Query, Wouter
- **Backend**: Express 5, Node.js (ESM)
- **Database**: MySQL 8 via Railway (connection string in `MYSQL_URL` secret), Drizzle ORM
- **Build**: esbuild (server), Vite (frontend), pnpm workspaces

## Running the app

The app runs via the **Velik** workflow (port 5000). In dev mode the Express server also serves the Vite HMR frontend on the same port.

```
pnpm install && pnpm --filter velik run dev
```

## Environment variables

| Variable    | Description                        |
|-------------|------------------------------------|
| `MYSQL_URL` | Railway MySQL connection string    |
| `PORT`      | Server port (default 5000)         |

## User preferences

- Keep MySQL on Railway — do not migrate to Replit PostgreSQL.
