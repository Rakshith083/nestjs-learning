import { Module } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { appConfig } from '../../config/app.config';
import { UsersModule } from 'src/modules/users/users.module';
import { PostsModule } from '../posts/posts.module';
import { AuthModule } from '../auth/auth.module';
import { TagsModule } from '../tags/tags.module';
import { MetaOptionsModule } from '../meta-options/meta-options.module';
import { PaginationModule } from '../common/pagination.module';

const ENV = process.env.NODE_ENV;

const getBoolean = (configService: ConfigService, key: string): boolean => {
  const value = configService.get<string | boolean | undefined>(key);

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();

    if (['true', '1', 'yes', 'on'].includes(normalized)) {
      return true;
    }

    if (['false', '0', 'no', 'off', ''].includes(normalized)) {
      return false;
    }
  }

  return false;
};

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    TagsModule,
    PaginationModule,
    MetaOptionsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath:[
      //   '.env.development'
      // ]
      envFilePath: !ENV ? '.env' : `.env.${ENV}`.toLocaleLowerCase(),
      load: [appConfig]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const isSslEnabled = getBoolean(configService, 'IS_SSL_DB');
        const rejectUnauthorized = getBoolean(configService, 'REJECT_UNAUTHORIZED');

        return {
          type: (configService.get<string>('DB_TYPE') ?? 'postgres') as 'postgres',
          autoLoadEntities: getBoolean(configService, 'AUTO_LOAD_ENTITIES'),
          synchronize: getBoolean(configService, 'DB_SYNC'),
          poolSize: configService.get<number>('POOL_SIZE') ?? 20,
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          host: configService.get<string>('DB_HOST'),
          database: configService.get<string>('DB_NAME'),
          ssl: isSslEnabled
            ? (() => {
              try {
                const caPath = path.join(__dirname, '..', '..', '..', 'certificates', 'db-ca.pem');
                if (fs.existsSync(caPath)) {
                  return { ca: fs.readFileSync(caPath, 'utf8') };
                }
              } catch(e) {
                console.error(e)
                // ignore and fall back
              }
              return { rejectUnauthorized } as any;
            })()
            : false,
        };
      },
    }),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
