import { Module } from '@nestjs/common';
import { MailerModule,MailerOptions } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.domain.com',
          auth: {
            user: 'user@domain.com',
            pass: 'password',
          },
        },
        defaults: {
          from: '"Your Name" <you@domain.com>',
        },
      }),
    }),
  ],
  exports: [MailerModule]
})
export class MailModule {}
