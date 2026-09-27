import { BadRequestException, forwardRef, Inject, Injectable, Logger, RequestTimeoutException } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/users/users.dto';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/modules/auth/providers/hashing-provider';

@Injectable()
export class CreateUserProvider {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,

        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider: HashingProvider
    ) { }

    private logger = new Logger(CreateUserProvider.name);

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
        let newUser = this.usersRepository.create({
            ...createUserDto,
            password: this.hashingProvider.hashPassword(createUserDto.password)
        });

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
