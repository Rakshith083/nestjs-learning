import { Module } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

//TypeOrm Module
import { TypeOrmModule } from '@nestjs/typeorm';

//Custom Modules
import { UsersModule } from 'src/modules/users/users.module';
import { PostsModule } from '../posts/posts.module';
import { AuthModule } from '../auth/auth.module';
import { TagsModule } from '../tags/tags.module';
import { MetaOptionsModule } from '../meta-options/meta-options.module';
// entities will be auto-scanned by glob pattern below


@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    TagsModule,
    MetaOptionsModule,
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: (() => ({
        type: "postgres",
        autoLoadEntities: true,
        synchronize: true,
        poolSize: 20,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        // SSL config: try to load a CA bundle from ./certs/ca.pem (project root: src/modules/app/../../..)
        // If no CA is present, fall back to allowing self-signed certs (rejectUnauthorized: false).
        ssl: (() => {
          try {
            const caPath = path.join(__dirname, '..', '..', '..', 'certificates', 'db-ca.pem');
            if (fs.existsSync(caPath)) {
              return { ca: fs.readFileSync(caPath).toString() };
            }
          } catch (e) {
            // ignore and fall back
          }
          return { rejectUnauthorized: true } as any;
        })()
        // schema: "custom"
      }))
    })

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
