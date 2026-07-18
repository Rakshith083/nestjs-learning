import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

//custom modules
import { UsersModule } from 'src/modules/users/users.module';
import { PostsModule } from '../posts/posts.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// entities will be auto-scanned by glob pattern below


@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: (() => ({
        type: "postgres",
        // scan for any files named *.entity.ts or *.entity.js under src/modules
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
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
