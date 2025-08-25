/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LOcalAuthGuard } from './guards/auth.local-auth.guard';
import { JwtAuthGuard } from './guards/auth.jwt-auth.guard';
import { SkipAuth } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @UseGuards(LOcalAuthGuard)
  @Post('signin')
  signIn(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return req.user;
  }

  @UseGuards(LOcalAuthGuard)
  @Post('auth/logout')
  logout(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return req.logout();
  }
}
