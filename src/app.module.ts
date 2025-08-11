import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesController } from './activities/activities.controller';
import { ActivitiesService } from './activities/activities.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { StravaTokenEntity } from './strava-tokens/strava-token.entity';
import { StravaTokenModule } from './strava-tokens/strava-token.module';
import { StravaTokenService } from './strava-tokens/strava-token.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        if (databaseUrl) {
          // Render
          return {
            type: 'postgres',
            url: databaseUrl,
            autoLoadEntities: true,
            synchronize: true, // ⚠️ true in production
            ssl: { rejectUnauthorized: false },
          };
        } else {
          // Local dev
          return {
            type: 'postgres',
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),
            autoLoadEntities: true,
            synchronize: true, // ⚠️ false in production
          };
        }
      },
    }),
    TypeOrmModule.forFeature([StravaTokenEntity]),
    StravaTokenModule,
  ],
  controllers: [AppController, AuthController, ActivitiesController],
  providers: [AppService, AuthService, StravaTokenService, ActivitiesService],
})
export class AppModule {}
