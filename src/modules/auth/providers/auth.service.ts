import { Injectable, Logger } from '@nestjs/common';
import { SignInDTO } from '../dtos/signin.dto';
import { SigninProvider } from './signin-provider';
import { RefreshTokensProvider } from './refresh-tokens.provider';

@Injectable()
export class AuthService {

    constructor(
        private readonly signInProvider: SigninProvider,
        private readonly refreshTokensProvider: RefreshTokensProvider
    ) { }

    private logger = new Logger(AuthService.name);
    public async signIn(body: SignInDTO) {
        return await this.signInProvider.signIn(body)
    }
   
    public async refreshTokens(body: { refreshToken: string }) {
        return await this.refreshTokensProvider.refreshTokens(body)
    }
}
