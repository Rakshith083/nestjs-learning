import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDTO } from '../dtos/refresh-token';
import jwtConfig from '../config/jwt-config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UserService } from 'src/modules/users/providers/users.service';

@Injectable()
export class RefreshTokensProvider {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly jwtService: JwtService,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfigs: ConfigType<typeof jwtConfig>,

        private readonly generateTokensProvider: GenerateTokensProvider
    ) { }
    public async refreshTokens(refreshTokenDto: RefreshTokenDTO): Promise<{ accessToken: string, refreshToken: string }> {
        try {
            const { refreshToken } = refreshTokenDto;
            const claims = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.jwtConfigs.secret,
                issuer: this.jwtConfigs.issuer,
                audience: this.jwtConfigs.audience
            })
            const user = await this.userService.findUserById(claims.sub);
            if (!user) {
                throw new NotFoundException("User not found", {
                    cause: "User not found",
                    description: "User not found"
                });
            }
            return await this.generateTokensProvider.generateTokens(user);
        }
        catch (e: any) {
            throw new UnauthorizedException(e.message, {
                cause: e.message,
                description: e
            });
        }
    }
}
