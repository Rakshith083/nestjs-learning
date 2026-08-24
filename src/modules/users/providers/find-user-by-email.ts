import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindUserByEmail {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }

    public async getUserByEmail(email: string): Promise<User> {
        try {
            const user = await this.userRepo.findOneBy({ email: email });
            if (!user) {
                throw new NotFoundException("User Not found", {
                    cause: "User not found"
                })
            }
            return user;
        }
        catch (e) {
            throw e;
        }
    }
}
