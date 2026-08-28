import { Body, Controller, HttpCode, HttpStatus, Post, SetMetadata } from '@nestjs/common';
import { SignInDTO } from './dtos/signin.dto';
import { AuthService } from './providers/auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('signIn')
    @Auth(AuthType.NONE)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        description: "API for signIn"
    })
    public async signIn(@Body() body: SignInDTO) {
        return await this.authService.signIn(body);
    }
}
