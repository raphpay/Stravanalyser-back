import { Injectable } from '@nestjs/common';
import fetchActivities from '../strava/fetchActivities';

@Injectable()
export class ActivitiesService {
  private cache: Record<number, any[]> = {}; // { athleteId: activities[] }

  async getActivities(
    athleteId: number,
    accessToken: string | undefined,
    shouldRefresh = false,
  ) {
    if (accessToken) {
      if (
        shouldRefresh ||
        !this.cache[athleteId] ||
        this.cache[athleteId].length === 0
      ) {
        console.log('📡 Fetching activities from Strava...');
        const activities = await fetchActivities(accessToken);
        this.cache[athleteId] = activities;
        return activities;
      }
      console.log('✅ Returning cached activities');
      return this.cache[athleteId];
    } else {
      throw new Error('No access token');
    }
  }
}
