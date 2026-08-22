import { ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { User } from '../user.entity';
import { CreateUserDto } from 'src/dtos/users/users.dto';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class CreateManyUsers {

    constructor(
        private readonly dataSource: DataSource,
    ) {

    }

    public async createMany(createManyUsersDto: CreateManyUsersDto) {
        let newUsers: User[] = [];
        const queryRunner = this.dataSource.createQueryRunner();


        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
        }
        catch (ex:any) {
            throw new RequestTimeoutException('Failed to start transaction', {
                cause: new Error('Failed to start transaction'),
                description: 'Failed to start transaction'
            });
        }

        try {
            for (const user of createManyUsersDto.users) {
                const newUser = queryRunner.manager.create(User, user);
                await queryRunner.manager.save(newUser);
                newUsers.push(newUser);
            }
            await queryRunner.commitTransaction();
        }
        catch (ex:any) {
            await queryRunner.rollbackTransaction();
            throw new ConflictException('Could not complete transaction', {
                cause: new Error('Failed to create users'),
                description: String(ex)
            });
        }
        finally {
            try{
                await queryRunner.release();
            }
            catch(ex:any){
                throw new RequestTimeoutException('Failed to release connection', {
                    cause: new Error('Failed to release connection'),
                    description: 'Failed to release connection'
                });
            }
        }
        return newUsers;
    }
}
