import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {

    constructor(private readonly mailerService: MailerService) { }

    async sendEmail(to: string, subject: string, template: string, context: Record<string, unknown>): Promise<void> {
        await this.mailerService.sendMail({
            to: to,
            subject: subject,
            template: `./${template}`, // Assuming templates are in the 'templates' directory
            context: context,
        });
    }
}
