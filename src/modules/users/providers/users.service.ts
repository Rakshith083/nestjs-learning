import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { AuthService } from "src/modules/auth/providers/auth.service";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/dtos/users/users.dto";

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
        private readonly authService: AuthService,

        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
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
        let user = await this.usersRepository.findOneBy({ id })
        return user
    }

    public async createUser(createUserDto: CreateUserDto) {
        const user = await this.usersRepository.findOne({
            where: { email: createUserDto.email }
        });
        // if (!user) {
        let newUser = this.usersRepository.create(createUserDto);
        newUser = await this.usersRepository.save(newUser);
        return newUser
        // }
    }

}