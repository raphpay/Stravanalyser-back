import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { StravaTokenService } from '../strava-tokens/strava-token.service';

@Injectable()
export class AuthService {
  constructor(private readonly stravaTokenService: StravaTokenService) {}

  login(): { url: string } {
    const url = `https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&redirect_uri=${process.env.STRAVA_REDIRECT_URI}&response_type=code&scope=read,activity:read_all`;
    return { url };
  }

  async callback(code: string) {
    const res = await axios.post('https://www.strava.com/oauth/token', {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    });

    const data = res.data;
    console.log('Tokens reçus');

    // Sauvegarde en base via StravaTokenService
    await this.stravaTokenService.upsertToken({
      athleteId: data.athlete.id,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_at,
    });

    return { athleteId: data.athlete.id };
  }

  async profile(athleteId: number) {
    let tokens = await this.stravaTokenService.findTokenByAthlete(athleteId);
    if (!tokens) throw new Error('Aucun token trouvé');

    // Rafraîchissement si expiré
    if (tokens.expiresAt < Math.floor(Date.now() / 1000)) {
      const refresh = await axios.post('https://www.strava.com/oauth/token', {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: tokens.refreshToken,
      });

      tokens = await this.stravaTokenService.upsertToken({
        athleteId,
        accessToken: refresh.data.access_token,
        refreshToken: refresh.data.refresh_token,
        expiresAt: refresh.data.expires_at,
      });
    }

    const profileRes = await axios.get(
      'https://www.strava.com/api/v3/athlete',
      {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      },
    );

    return profileRes.data;
  }
}
