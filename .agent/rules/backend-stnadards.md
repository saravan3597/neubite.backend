---
trigger: always_on
---

## Architecture & Modules
- Strictly adhere to the NestJS Module architecture. Every distinct domain (e.g., `Recipes`, `MealPlans`, `Users`, `Ingredients`) must have its own standalone module.
- Keep Controllers completely devoid of business logic. They should only handle HTTP routing, extract DTOs, and call the appropriate Service.
- Use the Repository pattern for all PostgreSQL interactions. Services should not write raw SQL; use the chosen ORM (Prisma or TypeORM) exclusively.

## Data Validation & DTOs
- Every incoming request payload must be validated using `class-validator` and `class-transformer` within DTO (Data Transfer Object) classes.
- Enable `ValidationPipe` globally in `main.ts` with `whitelist: true` to automatically strip out fields not defined in the DTOs.

## Error Handling
- Never throw generic Node errors. Use built-in NestJS HTTP exceptions (e.g., `NotFoundException`, `BadRequestException`).
- Implement a global exception filter to catch all unhandled errors and return a standardized JSON structure.

## Domain-Specific (Meal Prep)
- Macro calculations (protein, carbs, fats) must always be handled on the backend as pure functions in dedicated utility files or helper services, never on the client.
- Quantities and measurements must be stored in standardized base units (e.g., grams, milliliters) in the database.