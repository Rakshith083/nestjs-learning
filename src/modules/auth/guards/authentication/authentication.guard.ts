import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccessTokenGuard } from '../access-token.guard';
import { AuthType } from '../../enums/auth-type.enum';


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


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(this.authGuardMap)
    return true;
  }
}
