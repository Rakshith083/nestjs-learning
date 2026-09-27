import { Inject, Injectable } from '@nestjs/common';
import jwtConfig from '../config/jwt-config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { User } from 'src/modules/users/user.entity';

@Injectable()
export class GenerateTokensProvider {
    constructor(
        private readonly jwtService: JwtService,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfigs: ConfigType<typeof jwtConfig>
    ) { }

    public async signToken<T>(userId: number, expiresIn: number, payload?: T) {
        return await this.jwtService.signAsync(
            {
                sub: userId,
                ...payload
            } as ActiveUserData,
            {
                secret: this.jwtConfigs.secret,
                issuer: this.jwtConfigs.issuer,
                audience: this.jwtConfigs.audience,
                expiresIn: expiresIn
            }
        )
    }


    public async generateTokens(user: User) {
        const [accessToken, refreshToken] = await Promise.all([
            this.signToken<Partial<ActiveUserData>>(user.id, this.jwtConfigs.access_token_ttl, { email: user.email, userId: user.id }),
            this.signToken<Partial<ActiveUserData>>(user.id, this.jwtConfigs.refresh_token_ttl),
        ])
        return { accessToken, refreshToken }
    }
}
