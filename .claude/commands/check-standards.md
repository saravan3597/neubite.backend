Audit the file or module specified in $ARGUMENTS for compliance with Neubite's backend standards. Ask which file or module to audit if not provided.

Check every item below and report pass/fail with exact file and line for each failure:

**Auth & Security**
- [ ] Every controller class has `@UseGuards(CognitoAuthGuard)` — no unprotected routes (except intentional public endpoints)
- [ ] `userId` always comes from `@CurrentUser()` decorator — never from request body or query params
- [ ] Every repository query includes a `userId` filter — no cross-user data leakage possible

**Controller design**
- [ ] Controllers are thin: they only extract DTOs and call service methods
- [ ] No business logic, no direct repository access, no `if/else` branching in controllers

**Service design**
- [ ] All DB access goes through injected TypeORM repositories — no raw SQL
- [ ] Errors thrown are NestJS HTTP exceptions (`NotFoundException`, `BadRequestException`, etc.) — no generic `Error` throws
- [ ] Macro/nutritional calculations happen in service layer — never delegated to the client

**DTOs**
- [ ] All DTOs use `class-validator` decorators
- [ ] No `userId` field in any DTO
- [ ] Optional fields use `@IsOptional()` and `string | null | undefined` types

**TypeScript**
- [ ] No `any` types or `@ts-ignore`
- [ ] All service method return types are explicitly typed
- [ ] No Node.js-specific error objects leaked to HTTP responses

**Data integrity**
- [ ] Quantities stored in base units (grams, millilitres) — no mixed units in the same column
- [ ] Nullable columns use `@Column({ nullable: true, default: null })` — no missing defaults

After the audit, list all failures grouped by category with the exact fix for each.
