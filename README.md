# Business Card Monorepo

This repository now contains both the mobile app and the API server.

## Workspace Structure

- `apps/mobile`: Expo app (SDK 54)
- `apps/api`: Express API server

## Install

```bash
npm install
```

## Run Mobile App

```bash
npm run dev:mobile
```

For phone testing on the same network:

```bash
npm run dev:mobile -- --host lan
```

## Run API Server

```bash
npm run dev:api
```

API defaults to `http://localhost:4000`.

## SQL Server Test

The API route `GET /api/sql-test` lives in `apps/api/src/routes/sql-test.js`.

Create `apps/api/.env` from `apps/api/.env.example` and set:

- `PORT` (optional, defaults to `4000`)
- `SQL_SERVER_USER`
- `SQL_SERVER_PASSWORD`
- `SQL_SERVER_HOST`
- `SQL_SERVER_DATABASE`
- `SQL_SERVER_PORT` (optional, defaults to `1433`)
- `SQL_SERVER_ENCRYPT` (optional, defaults to `true`)
- `SQL_SERVER_TRUST_CERT` (optional, defaults to `false`)

In the mobile app, set this before starting Expo (native testing):

- `EXPO_PUBLIC_API_BASE_URL=http://YOUR_COMPUTER_IP:4000`

The API test page in the app (`/api-test`) calls this endpoint.

## Useful Scripts

- `npm run dev:mobile`
- `npm run dev:api`
- `npm run start:mobile`
- `npm run start:api`
