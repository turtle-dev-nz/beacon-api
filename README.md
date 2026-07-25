# Beacon API

Express API server for Beacon business card data.

## Requirements

- Node.js 20+
- PostgreSQL reachable via `DATABASE_URL`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local env file:

```bash
copy .env.example .env
```

3. Update `.env` with real values, especially `DATABASE_URL`.

## Run

Development (watch mode):

```bash
npm run dev
```

Build and start:

```bash
npm run build
npm start
```

Or run start with an implicit build:

```bash
npm run build && npm start
```

API default: `http://localhost:4000`

## Seed Dev User

```bash
npm run build
npm run seed
```

This creates/uses `dev@local.test` and writes `DEV_USER_ID` into `.env`.

For local development without a build, you can also run:

```bash
npm run seed:dev
```

## Routes

- `GET /api/health`
- `GET /api/cards`
- `GET /api/contacts`
- `GET /api/contacts/:id`
- `POST /api/contacts`
- `PUT /api/contacts/:id`
- `DELETE /api/contacts/:id`
- `POST /api/scan`
- `GET /api/sql-test`
