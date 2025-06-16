import { Module } from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { ModerationController } from './moderation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModerationRecord } from 'src/database/entities/moderation-record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModerationRecord]),
  ],
  providers: [ModerationService],
  controllers: [ModerationController]
})
export class ModerationModule {}
