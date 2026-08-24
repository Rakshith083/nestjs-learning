import { forwardRef, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SignInDTO } from '../dtos/signin.dto';
import { UserService } from 'src/modules/users/providers/users.service';
import { HashingProvider } from './hashing-provider';

@Injectable()
export class SigninProvider {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly hashingProvider: HashingProvider,

    ) {

    }
    private readonly logger = new Logger(SigninProvider.name);
    public async signIn(body: SignInDTO) {
        try {
            const user = await this.userService.findUserByEmail(body.email);
            let pwdMatched: boolean = this.hashingProvider.comparePassword(body.password, user.password);;
            if (!pwdMatched) {
                throw new UnauthorizedException("Incorrect username or password", {
                    cause: "Incorrect username or password"
                })
            }
            return true;
        }
        catch (e: any) {
            this.logger.log(e)
            throw new UnauthorizedException(e.message, {
                cause: e.message,
                description: e
            })
        }
    }
}
