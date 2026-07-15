import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/modules/users/providers/users.service';


@Injectable()
export class PostsService {
    constructor(private readonly userService: UserService) { }

    private logger = new Logger(PostsService.name);
    public async findUserPosts(userId: number) {
        const user = await this.userService.findUserById(userId)
        return [
            {
                ...{ user },
                title: "Test Title",
                content: "test content"
            },
            {
                ...{ user },
                title: "Test Title1",
                content: "test content1"
            }
        ]
    }
}
