import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StravaTokenEntity } from 'src/strava-tokens/strava-token.entity';
import { StravaTokenService } from 'src/strava-tokens/strava-token.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([StravaTokenEntity])],
  controllers: [AuthController],
  providers: [AuthService, StravaTokenService],
})
export class AuthModule {}
