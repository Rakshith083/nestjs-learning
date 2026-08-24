import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInDTO } from './dtos/signin.dto';
import { AuthService } from './providers/auth.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('signIn')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        description: "API for signIn"
    })
    public async signIn(@Body() body: SignInDTO) {
        return await this.authService.signIn(body);
    }
}
