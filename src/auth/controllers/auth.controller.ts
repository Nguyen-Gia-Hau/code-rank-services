import { Headers, Controller, Get, Post, Body, HttpStatus, HttpCode, UseGuards, Request, Ip } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignInAuthDto } from '../dto/signIn-auth.dto';
import { AuthGuard } from '../auth.guard';
import { RegisterAuthDto } from '../dto/register-auth.dto';
import { LogoutAuthDto } from '../dto/logout.auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInAuthDto: SignInAuthDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string
  ) {
    return this.authService.signIn(signInAuthDto, userAgent, ipAddress);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(
    @Body() registerAuthDto: RegisterAuthDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string,
  ) {
    return this.authService.register(registerAuthDto, userAgent, ipAddress);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return {
      session: req.session_id,
      user: req.user_id
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Request() req) {
    return this.authService.logout(req.session_id)
  }
}

//

// }
