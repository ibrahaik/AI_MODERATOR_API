// src/moderation/moderation.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { ModerationService } from './moderation.service';

@Controller('moderate')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post()
  async moderate(@Body() dto: CreateMessageDto) {
    return this.moderationService.moderateMessage(dto.message);
  }
}
