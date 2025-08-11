import { Controller, Get, Query } from '@nestjs/common';

import { StravaTokenService } from '../strava-tokens/strava-token.service';
import { ActivitiesService } from './activities.service';

@Controller('activities')
export class ActivitiesController {
  constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly stravaTokenService: StravaTokenService,
  ) {}

  @Get()
  async getActivities(
    @Query('athleteId') athleteId: number,
    @Query('refresh') refresh: string,
  ) {
    let tokens = await this.stravaTokenService.findTokenByAthlete(athleteId);
    const accessToken = tokens?.accessToken;

    return this.activitiesService.getActivities(
      athleteId,
      accessToken,
      refresh === 'true',
    );
  }
}
