import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [TodoModule,
    MongooseModule.forRoot(process.env.DATABASE_URI, 
      {
        dbName: process.env.DATABASE_NAME,
      }),
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
