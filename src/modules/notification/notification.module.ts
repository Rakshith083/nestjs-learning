import { Global, Module } from '@nestjs/common';
import { EmailService } from './provider/email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/adapters/ejs.adapter.js';



@Global()
@Module({
  providers: [EmailService],
  exports: [EmailService],
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow<string>('smtp.mail_host'),
          port: configService.getOrThrow<number>('smtp.mail_port'),
          auth: {
            user: configService.getOrThrow<string>('smtp.mail_user'),
            pass: configService.getOrThrow<string>('smtp.mail_password'),
          },
        },
        defaults: {
          from: `My blogs <${configService.getOrThrow<string>('smtp.mail_from')}>`,
        },
        template: {
          dir: path.join(__dirname, 'templates'),
          adapter: new EjsAdapter({ inlineCssEnabled: true }),
        },
      })
    }),
  ],
})
export class NotificationModule { }
