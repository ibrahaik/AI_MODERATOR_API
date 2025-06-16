import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ModerationModule } from './moderation/moderation.module';
import { DatabaseModule } from './database/database.module';
import { ApiKeyMiddleware } from './common/middleware/api-key.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ModerationModule,
    DatabaseModule,
    TypeOrmModule.forRootAsync({})
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware)
      .forRoutes('*');  
  }
}