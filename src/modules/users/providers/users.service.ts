import { BadRequestException, forwardRef, Inject, Injectable, Logger, RequestTimeoutException, HttpException, HttpStatus, Query } from "@nestjs/common";
import { AuthService } from "src/modules/auth/providers/auth.service";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/dtos/users/users.dto";
import { CreateManyUsers } from "./create-many-users";
import { CreateManyUsersDto } from "../dtos/create-many-users.dto";
import { PaginationQueryDto } from "src/modules/common/dtos/pagination-query.dto";
import { Paginated } from "src/modules/common/pagination/inerfaces/paginated-interface";
import { PaginationProvider } from "src/modules/common/pagination/providers/pagination-provider";

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
        private readonly usersRepository: Repository<User>,

        private readonly createManyUsersProvider: CreateManyUsers,
        private readonly paginationProvider: PaginationProvider,
    ) { }
    /**
     * Initialize private logger object
     */
    private logger = new Logger(UserService.name);

    /**
     * Method to fetch all users from the database
     * @param page 
     * @param limit 
     * @returns 
     */


    public async findAllUsers(@Query() query?: PaginationQueryDto): Promise<Paginated<User>> {
        const page = query?.page ?? 1;
        const limit = query?.limit ?? 10;
        const users = await this.paginationProvider.paginateQuery({ page, limit }, this.usersRepository)
        return users
    }

    /**
     * Method to fetch single user by the userId
     * @param id 
     * @returns 
     */
    public async findUserById(id: number) {
        let user: any = null;
        try {
            user = await this.usersRepository.findOneBy({ id });
        }
        catch (ex) {
            this.logger.error("Error occurred while fetching user", ex)
            throw new RequestTimeoutException("Error occurred while fetching user", {
                description: "Error occurred while fetching user",
                cause: ex
            });
        }

        if (!user) {
            throw new BadRequestException("User not found", {
                description: "User not found",
                cause: new Error("User not found")
            });
        }
        return user;
    }

    public async createMany(createManyUsersDto: CreateManyUsersDto) {
        return this.createManyUsersProvider.createMany(createManyUsersDto);
    }

    public async createUser(createUserDto: CreateUserDto) {
        let user: User | null = null;
        try {
            user = await this.usersRepository.findOne({
                where: { email: createUserDto.email }
            });
        }
        catch (ex) {
            this.logger.error("Error occurred while creating user", ex)
            throw new RequestTimeoutException("Error occurred while creating user", {
                description: "Error occurred while creating user",
                cause: ex
            });
        }

        if (user) {
            throw new BadRequestException("User already exists", {
                description: "User already exists",
                cause: new Error("User already exists")
            });
        }
        let newUser = this.usersRepository.create(createUserDto);

        try {
            newUser = await this.usersRepository.save(newUser);
            return newUser
        }
        catch (ex) {
            this.logger.error("Error occurred while saving user", ex)
            throw new RequestTimeoutException("Unable to save user", {
                description: "Error occurred while saving user",
                cause: ex
            });
        }
    }

}