Scaffold a complete NestJS module for the domain specified in $ARGUMENTS. Ask for the domain name if not provided.

Create the following files under `src/[domain]/`:

1. **`entities/[domain]-item.entity.ts`**
   - Extend `BaseEntity` or use standard TypeORM decorators
   - Always include `@Column() userId: string` — every entity is user-scoped
   - Use `string | null` for optional date/nullable columns with `@Column({ nullable: true, default: null })`
   - Quantities must be stored in standardized base units (grams, millilitres)

2. **`dto/create-[domain]-item.dto.ts`** and **`dto/update-[domain]-item.dto.ts`**
   - Use `class-validator` decorators: `@IsString()`, `@IsOptional()`, `@IsNotEmpty()`, etc.
   - Never include `userId` in DTOs — it always comes from the JWT via `@CurrentUser()`
   - `UpdateDto` should use `PartialType(CreateDto)`

3. **`[domain].service.ts`**
   - Inject repository via `@InjectRepository([Entity])`
   - Every query must filter by `userId` — never return data across users
   - Use NestJS HTTP exceptions (`NotFoundException`, `BadRequestException`) — never throw generic errors
   - No business logic in controllers — all logic goes here

4. **`[domain].controller.ts`**
   - Apply `@UseGuards(CognitoAuthGuard)` at controller level
   - Extract user via `@CurrentUser() user: { userId: string; email: string }`
   - Thin controllers only — extract DTO, call service, return result
   - No business logic here

5. **`[domain].module.ts`**
   - Import `TypeOrmModule.forFeature([Entity])`
   - Register controller and service

6. Register the new module in `src/app.module.ts` imports array.

After creating all files, run `npm run lint` to catch any issues.
