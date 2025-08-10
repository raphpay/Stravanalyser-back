import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [StravaTokenEntity],
      // synchronize: false, // Toujours false en production !
      autoLoadEntities: true,
      synchronize: true, // /!\ uniquement pour dev
    }),
    TypeOrmModule.forFeature([StravaTokenEntity]),
    StravaTokenModule,
  ],
  controllers: [AppController, AuthController, ActivitiesController],
  providers: [AppService, AuthService, StravaTokenService, ActivitiesService],
})
export class AppModule {}
