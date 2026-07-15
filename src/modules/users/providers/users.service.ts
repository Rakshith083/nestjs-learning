import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { AuthService } from "src/modules/auth/providers/auth.service";

@Injectable()
export class UserService {

    constructor(
        //Circular Dependency with Auth
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService
    ) { }
    private logger = new Logger(UserService.name);

    public async findAllUsers(page?: number, limit?: number) {
        return [
            {
                "name": "John",
                "email": "john@gmail.com"
            },
            {
                "name": "Rakshith",
                "email": "rakshith@gmail.com"
            }
        ];
    }

    public async findUserById(id: number) {
        const isAuth = this.authService.isAuthenticated();
        this.logger.log(isAuth)
        return {
            "name": "Rakshith",
            "email": "rakshith@gmail.com"
        }
    }

}