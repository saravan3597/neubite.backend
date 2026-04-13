# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run start:dev       # Watch mode with hot reload
npm run start:debug     # Debug mode with watch

# Build & Production
npm run build           # Compile TypeScript to dist/
npm run start:prod      # Run compiled dist/main.js

# Code Quality
npm run lint            # ESLint with auto-fix
npm run format          # Prettier formatting

# Testing
npm run test            # Unit tests
npm run test:watch      # Jest watch mode
npm run test:cov        # Coverage report
npm run test:e2e        # End-to-end tests
npx jest src/path/to/file.spec.ts  # Run a single test file
```

## Architecture

This is a **NestJS** (v11) backend for Neubite, an AI-assisted recipe and meal planning app. All routes are prefixed with `/api`.

### Authentication

AWS Cognito JWT authentication via `passport-jwt` with RS256. The `CognitoStrategy` fetches JWKS from Cognito and validates tokens. The `@CurrentUser()` decorator extracts `{ userId: string, email: string }` from the validated JWT payload. Apply `@UseGuards(CognitoAuthGuard)` to protect routes.

Required env vars: `COGNITO_USER_POOL_ID`, `COGNITO_REGION`

### Database

TypeORM with **PostgreSQL** (via `DATABASE_URL`) falling back to **SQLite** (`neubite-fallback.sqlite`) for local dev. `synchronize: true` in non-production environments (no explicit migrations). All entities are user-scoped — every query filters by `userId` from the JWT.

### Feature Modules

| Module | Status | Purpose |
|--------|--------|---------|
| `auth` | Complete | Cognito JWT strategy, guard, and `@CurrentUser` decorator |
| `pantry` | Complete | User pantry CRUD — supports upsert and bulk replace |
| `grocery` | Complete | Grocery list CRUD — supports upsert, bulk replace, and toggle purchased |
| `saved-recipes` | Complete | Save/retrieve/delete AI-generated recipes (stored as JSON) |
| `recipes` | Complete | AI recipe suggestions via OpenAI GPT; takes pantry items + meal constraints |
| `users` | Stub | Entity exists, service/controller are empty |
| `ingredients` | Stub | Empty placeholder |

### AI Recipe Generation (`src/recipes/recipes.service.ts`)

`RecipesService.suggestRecipes()` calls OpenAI GPT in JSON mode. Input: `timeOfDay`, `maxPrepTime`, and `pantryIngredients[]`. Returns 3 recipes with nutritional data, per-ingredient pantry deduction amounts, and an `inPantry` flag. Optimized for Indian cuisine.

### Key Patterns

- **DTOs** use `class-validator` decorators; the global `ValidationPipe` applies `whitelist: true, transform: true`
- **Exception handling**: `AllExceptionsFilter` wraps all errors into `{ statusCode, timestamp, path, message }`. Never throw generic Node errors — use NestJS HTTP exceptions (`NotFoundException`, `BadRequestException`, etc.).
- **Repository pattern**: Services receive `@InjectRepository()` and all DB access is through TypeORM repositories. Never write raw SQL.
- **Thin controllers**: Controllers must only handle HTTP routing, extract DTOs, and call the appropriate service — no business logic in controllers.
- **Module boundaries**: Every distinct domain must have its own standalone NestJS module.

### Domain Rules

- Macro calculations (protein, carbs, fats) must always be computed on the backend in dedicated utility functions or helper services — never on the client.
- Quantities and measurements must be stored in standardized base units (grams, milliliters) in the database.

### Environment Variables

```
GPT_API_KEY=           # OpenAI API key
DATABASE_URL=          # PostgreSQL connection string (optional — falls back to SQLite)
COGNITO_USER_POOL_ID=  # e.g. us-east-2_xxxxxxxxx
COGNITO_REGION=        # e.g. us-east-2
```

See `.env.example` for AWS deployment variables (ECR, RDS, ALB).
