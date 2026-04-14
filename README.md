# Neubite — Backend

Neubite's NestJS backend powers AI recipe suggestions, pantry and grocery list management, and saved recipes. It authenticates via AWS Cognito (RS256 JWT) and connects to PostgreSQL in production, with an automatic SQLite fallback for local development.

---

## Tech Stack

- NestJS v11 + TypeScript
- TypeORM (PostgreSQL / SQLite fallback)
- AWS Cognito — RS256 JWT validation via `passport-jwt` + `jwks-rsa`
- OpenAI GPT — recipe suggestion generation

---

## Prerequisites

- Node.js ≥ 20, npm ≥ 10
- PostgreSQL (optional — SQLite is used automatically if `DATABASE_URL` is not set)
- An OpenAI API key (optional — frontend falls back to mock data if the AI endpoint is slow or unavailable)
- AWS Cognito User Pool (optional — only needed for real authentication; frontend demo mode bypasses auth)

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

`.env` values:

```env
# OpenAI — required for live AI recipe suggestions
GPT_API_KEY=sk-...

# PostgreSQL connection string — omit to use SQLite fallback
DATABASE_URL=postgresql://user:password@localhost:5432/neubite

# AWS Cognito — required for real authentication
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
COGNITO_REGION=us-east-1
```

### 3. Seed the JWKS cache (first-time Cognito setup only)

When running locally without reliable network access to Cognito's JWKS endpoint, seed the local cache once:

```bash
curl https://cognito-idp.<COGNITO_REGION>.amazonaws.com/<COGNITO_USER_POOL_ID>/.well-known/jwks.json \
  -o .cognito-jwks-raw.json
```

The strategy will automatically build `.cognito-jwks-cache.json` from this file on first startup and fall back to it if the Cognito endpoint is unreachable.

### 4. Start the server

```bash
npm run start:dev
```

The API is available at `http://localhost:3000/api`.

No database migrations are needed — `synchronize: true` is enabled in non-production environments and TypeORM creates the schema automatically on startup.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Watch mode with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start:prod` | Run compiled `dist/main.js` |
| `npm run lint` | ESLint with auto-fix |
| `npm run format` | Prettier formatting |
| `npm run test` | Unit tests |
| `npm run test:e2e` | End-to-end tests |
| `npm run test:cov` | Test coverage report |

---

## API Overview

All routes are prefixed with `/api` and require a valid Cognito Bearer token (except health checks).

| Module | Base path | Description |
|--------|-----------|-------------|
| `recipes` | `/api/recipes` | AI recipe suggestions — takes pantry + meal constraints |
| `pantry` | `/api/pantry` | CRUD for user pantry items |
| `grocery` | `/api/grocery` | CRUD for grocery list, toggle purchased |
| `saved-recipes` | `/api/saved-recipes` | Save, fetch, and delete AI-generated recipes |

---

## Project Structure

```
src/
  auth/         # Cognito JWT strategy, guard, @CurrentUser decorator
  recipes/      # OpenAI integration, prompt builder, response parsing
  pantry/       # Pantry entity, controller, service, DTOs
  grocery/      # Grocery entity, controller, service, DTOs
  saved-recipes/# Saved recipe entity, controller, service
  common/       # Global exception filter, validation pipe config
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `GPT_API_KEY` | For AI routes | OpenAI API key |
| `DATABASE_URL` | No | PostgreSQL URL — falls back to SQLite if unset |
| `COGNITO_USER_POOL_ID` | For auth | e.g. `us-east-1_xxxxxxxxx` |
| `COGNITO_REGION` | For auth | e.g. `us-east-1` |
| `ALLOWED_ORIGINS` | No | Comma-separated CORS origins (defaults include `localhost:5173`, `capacitor://localhost`) |
