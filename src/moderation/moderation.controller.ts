import { Body, Controller, Post } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { ModerationService } from './moderation.service';
import { Throttle } from '@nestjs/throttler';

@Controller('moderate')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post()
  async moderate(@Body() dto: CreateMessageDto) {
    return this.moderationService.moderateMessage(dto.message);
  }

    @Post('public')
@Throttle({ default: { limit: 10, ttl: 60000 } })
  async publicModerate(@Body('message') message: string) {
    return this.moderationService.moderateMessage(message);
  }
  
}
