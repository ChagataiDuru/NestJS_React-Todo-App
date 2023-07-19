import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [TodoModule,
    RedisModule.forRoot({
      config: {
        name: 'TODO_SERVICE',
        host: 'redis://localhost:6379',
        port: 6379,
        onClientCreated(client) {
          client.on('error', err => {});
          client.on('ready', () => {});
        },
      }
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
