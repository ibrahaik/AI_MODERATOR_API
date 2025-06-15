import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ModerationModule } from './moderation/moderation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ModerationModule,
  ],
})
export class AppModule {}
