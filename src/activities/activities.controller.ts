import { Controller, Get, Query } from '@nestjs/common';
import { StravaTokenService } from 'src/strava-tokens/strava-token.service';
import { AuthService } from '../auth/auth.service';
import { ActivitiesService } from './activities.service';

@Controller('activities')
export class ActivitiesController {
  constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly authService: AuthService,
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
