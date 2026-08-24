import { forwardRef, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SignInDTO } from '../dtos/signin.dto';
import { UserService } from 'src/modules/users/providers/users.service';
import { HashingProvider } from './hashing-provider';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt-config';

@Injectable()
export class SigninProvider {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly hashingProvider: HashingProvider,
        private readonly jwtService: JwtService,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfigs: ConfigType<typeof jwtConfig>
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
            // return true;
            const accessToken = await this.jwtService.signAsync(
                {
                    sub: user.id,
                    email: user.email
                },
                {
                    secret: this.jwtConfigs.secret,
                    issuer: this.jwtConfigs.issuer,
                    audience: this.jwtConfigs.audience,
                    expiresIn: this.jwtConfigs.access_token_ttl
                }
            )
            return { accessToken }

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
