import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt-config';
import { Request } from 'express';
import { REQ_USER_KEY } from '../constatnts/auth-constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfigs: ConfigType<typeof jwtConfig>,
  ) { }
  private readonly logger = new Logger(AccessTokenGuard.name)
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    //extract req from ExecutionContext
    const req = context.switchToHttp().getRequest<Request>();

    const token = this.fetchTokenFromRequest(req);
    if (!token) {
      throw new UnauthorizedException("Unauthorized request")
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, this.jwtConfigs);
      req[REQ_USER_KEY] = payload;
    }
    catch (e: any) {
      this.logger.error(e)
      throw new UnauthorizedException("Unauthorized request", { cause: e.message, description: e })
    }
    
    return true;
  }

  private fetchTokenFromRequest(req: Request): string | undefined {
    const [_, token] = req.headers?.authorization?.split(' ') ?? [];
    return token;
  }
}
