import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { UserModule } from './user/user.module'
import { MongooseModule } from '@nestjs/mongoose'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({ limit: 10, ttl: 60 }),
    MongooseModule.forRoot(process.env.DATABASE_URI, {
      dbName: process.env.DATABASE_NAME,
    }),

    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
