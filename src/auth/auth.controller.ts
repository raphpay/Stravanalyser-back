import { Controller, Get, Param, Query, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Redirect()
  login() {
    return this.authService.login();
  }

  @Get('callback')
  async callback(@Query('code') code: string) {
    return this.authService.callback(code);
  }

  @Get('profile/:athleteId')
  async profile(@Param('athleteId') athleteId: string) {
    return this.authService.profile(Number(athleteId));
  }
}
