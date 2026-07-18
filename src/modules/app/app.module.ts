import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

//custom modules
import { UsersModule } from 'src/modules/users/users.module';
import { PostsModule } from '../posts/posts.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    // TypeOrmModule.forRoot({
    //   type: "postgres",
    //   entities: [],
    //   synchronize: true,
    //   poolSize: 20,
    //   port: 5432,
    //   username: "postgres",
    //   password: "postgres",
    //   host: "RXT083",
    //   database: "nestjs-blog",
    //   schema: "custom"
    // })

    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: (() => ({
        type: "postgres",
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // auto-scan,
        synchronize: true,
        poolSize: 20,
        port: 5432,
        username: "postgres",
        password: "postgres",
        host: "localhost",
        database: "nestjs-blog",
        // schema: "custom"
      }))
    })

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
