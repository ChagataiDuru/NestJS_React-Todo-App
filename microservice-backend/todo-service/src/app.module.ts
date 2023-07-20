import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [TodoModule,
    RedisModule.forRoot({
      config: {
        name: 'TODO_SERVICE',
        host: process.env.REDIS_HOST,
        port: 6379,
        onClientCreated(client) {
          client.on('error', err => {});
          client.on('ready', () => {});
        },
      }
    }),
    MongooseModule.forRoot(process.env.DATABASE_URI, 
      {
        dbName: process.env.DATABASE_NAME,
      }),
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
