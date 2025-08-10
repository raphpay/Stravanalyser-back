import { Controller, Get, Param, Query, Redirect, Res } from '@nestjs/common';
import * as dotenv from 'dotenv';
import type { Response } from 'express';
import { AuthService } from './auth.service';

dotenv.config();

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Redirect()
  login() {
    return this.authService.login();
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    const { athleteId } = await this.authService.callback(code);
    const url = `${process.env.FRONT_END_URL}/auth/success/${athleteId}`;
    res.redirect(url);
  }

  @Get('profile/:athleteId')
  async profile(@Param('athleteId') athleteId: string) {
    return this.authService.profile(Number(athleteId));
  }
}
