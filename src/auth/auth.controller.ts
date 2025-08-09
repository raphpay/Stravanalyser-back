import { Controller, Get, Query, Redirect } from '@nestjs/common';
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

  @Get('profile')
  async profile() {
    if (!this.authService.tokens) return { error: 'Not connected' };

    return this.authService.profile();
  }
}
