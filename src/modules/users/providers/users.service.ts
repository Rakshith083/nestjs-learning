import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { AuthService } from "src/modules/auth/providers/auth.service";

/**
 * Class to connect Users table and perform business operations
 */
@Injectable()
export class UserService {
    /**
     * constructor class to inject authservice
     * @param authService 
     */
    constructor(
        //Circular Dependency with Auth
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService
    ) { }
    /**
     * Initialize private logger object
     */
    private logger = new Logger(UserService.name);

    /**
     * Method to fetch all users from thr database
     * @param page 
     * @param limit 
     * @returns 
     */
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

    /**
     * Method to fetch single user by the userId
     * @param id 
     * @returns 
     */
    public async findUserById(id: number) {
        const isAuth = this.authService.isAuthenticated();
        this.logger.log(isAuth)
        return {
            "name": "Rakshith",
            "email": "rakshith@gmail.com"
        }
    }

}