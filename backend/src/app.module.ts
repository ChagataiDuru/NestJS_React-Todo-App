import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/Users/user.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/nest')],
  controllers: [AppController],
  providers: [AppService],
})

@Module({
  imports: [UserModule]
})

export class AppModule {}
