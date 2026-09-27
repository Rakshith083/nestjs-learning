import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccessTokenGuard } from '../access-token.guard';
import { AuthType } from '../../enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '../../constatnts/auth-constants';


@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) { }

  private get authGuardMap() {
    return {
      [AuthType.BEARER]: this.accessTokenGuard,
      [AuthType.NONE]: {
        canActivate: () => true,
      },
    };
  }


  private static readonly defaultAuthType = AuthType.BEARER;


  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()]
    ) ?? [AuthenticationGuard.defaultAuthType];
    // console.log(authTypes)
    const guards = authTypes.map(type => this.authGuardMap[type]).flat();
    // console.log(guards);
    let error = new UnauthorizedException();
    for (const inst of guards) {
      const canActivate = await Promise.resolve(inst.canActivate(context))
        .catch(er => { error = er })
      if (canActivate) {
        return true
      }
    }
    throw error;
  }
}
