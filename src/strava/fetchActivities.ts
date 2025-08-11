// src/strava/fetch-activities.ts
import axios from 'axios';

export default async function fetchActivities(accessToken: string) {
  const res = await axios.get(
    'https://www.strava.com/api/v3/athlete/activities',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { per_page: 50 },
    },
  );
  return res.data;
}
