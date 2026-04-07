import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RecipesModule } from './recipes/recipes.module';
import { IngredientsModule } from './ingredients/ingredients.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        if (dbUrl) {
          return {
            type: 'postgres',
            url: dbUrl,
            autoLoadEntities: true,
            synchronize: process.env.NODE_ENV !== 'production',
          };
        }
        
        // Fallback to SQLite if no Postgres URL is provided
        return {
          type: 'sqlite',
          database: 'neubite-fallback.sqlite',
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    UsersModule, 
    AuthModule, 
    RecipesModule, 
    IngredientsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
