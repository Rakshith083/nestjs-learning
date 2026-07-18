import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/modules/users/providers/users.service';

@Injectable()
export class AuthService {

    constructor(
        //Circular Dependency with User
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService
    ) { }
    
    private logger = new Logger(AuthService.name);
    public login(email: string, password: string) {
        const users = this.userService.findAllUsers();
        this.logger.log(users)
        return "Sample Token"
    }
    public isAuthenticated() {
        return true;
    }
}
