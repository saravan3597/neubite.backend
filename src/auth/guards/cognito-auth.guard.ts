import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CognitoAuthGuard extends AuthGuard('cognito') {
  private readonly logger = new Logger(CognitoAuthGuard.name);

  // passport-jwt swallows verification errors and just returns 401 with no log.
  // Override handleRequest to surface the real reason so we can diagnose it.
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      const reason = info?.message ?? (typeof info === 'string' ? info : JSON.stringify(info)) ?? err?.message ?? 'unknown';
      this.logger.error(`Auth failed — reason="${reason}" info=${JSON.stringify(info)} err=${err?.message ?? err}`);
      throw err || new UnauthorizedException(reason);
    }
    return user;
  }
}
