
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from 'src/constants/jwt.constant';
import { AuthService } from './services/auth.service';
import { LoginTrackerService } from './services/login.tracker.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private loginTrackerService: LoginTrackerService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = await this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );
      const loginTracker_ID = payload.login_tracker_id
      const loginSession = await this.loginTrackerService.findOne({ login_tracker_id: loginTracker_ID })
      if (!loginSession) throw new UnauthorizedException();

      request['session_id'] = loginSession.login_tracker_id;
      request['user_id'] = loginSession.user.user_id;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private async extractTokenFromHeader(request: Request): Promise<string | undefined> {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

