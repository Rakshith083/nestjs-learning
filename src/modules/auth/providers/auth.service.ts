import { Injectable, Logger } from '@nestjs/common';
import { SignInDTO } from '../dtos/signin.dto';
import { SigninProvider } from './signin-provider';

@Injectable()
export class AuthService {

    constructor(
        private readonly signInProvider: SigninProvider
    ) { }

    private logger = new Logger(AuthService.name);
    public async signIn(body: SignInDTO) {
        return await this.signInProvider.signIn(body)
    }
    public isAuthenticated() {
        return true;
    }
}
