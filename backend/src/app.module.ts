import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsModule } from './modules/rooms/rooms.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/nest'), RoomsModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
