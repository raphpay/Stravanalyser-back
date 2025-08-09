import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthService {
  tokens: any = {};

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

    this.tokens = res.data; // { access_token, refresh_token, expires_at, ... }
    console.log('Tokens reçus:', this.tokens);
    return { message: 'Connexion Strava réussie', tokens: this.tokens };
  }

  async profile() {
    // Rafraîchissement si expiré
    if (this.tokens.expires_at < Math.floor(Date.now() / 1000)) {
      const refresh = await axios.post('https://www.strava.com/oauth/token', {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: this.tokens.refresh_token,
      });
      this.tokens = refresh.data;
    }

    // Récupération profil Strava
    const profileRes = await axios.get(
      'https://www.strava.com/api/v3/athlete',
      {
        headers: { Authorization: `Bearer ${this.tokens.access_token}` },
      },
    );
    return profileRes.data;
  }
}
