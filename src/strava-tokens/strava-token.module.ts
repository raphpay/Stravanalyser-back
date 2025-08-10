import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StravaTokenEntity } from './strava-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StravaTokenEntity])],
  controllers: [],
  providers: [StravaTokenEntity],
})
export class StravaTokenModule {}
