import { BadRequestException, Injectable, Logger, RequestTimeoutException, Query } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/dtos/users/users.dto";
import { CreateManyUsers } from "./create-many-users";
import { CreateManyUsersDto } from "../dtos/create-many-users.dto";
import { PaginationQueryDto } from "src/modules/common/dtos/pagination-query.dto";
import { Paginated } from "src/modules/common/pagination/inerfaces/paginated-interface";
import { PaginationProvider } from "src/modules/common/pagination/providers/pagination-provider";
import { HashingProvider } from "src/modules/auth/providers/hashing-provider";
import { CreateUserProvider } from "./create-user-provider";
import { FindUserByEmail } from "./find-user-by-email";

/**
 * Class to connect Users table and perform business operations
 */
@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,

        private readonly createManyUsersProvider: CreateManyUsers,
        private readonly paginationProvider: PaginationProvider,
        private readonly createUserProvider: CreateUserProvider,
        private readonly findUserByEmailProvider: FindUserByEmail,
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
        return this.createUserProvider.createUser(createUserDto)
    }

    public async findUserByEmail(email: string): Promise<User> {
        return this.findUserByEmailProvider.getUserByEmail(email);
    }

}