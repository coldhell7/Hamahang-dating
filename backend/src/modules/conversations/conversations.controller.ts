import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ConversationsService } from './conversations.service';

@ApiTags('مکالمات (Conversations)')
@Controller('conversations')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}

  @Post()
  @ApiOperation({ summary: 'ایجاد یا دریافت مکالمه با یک کاربر' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'شناسه کاربر مقصد' },
      },
    },
  })
  async createOrGet(@Req() req: any, @Body() body: { userId: string }) {
    return this.conversationsService.createOrGet(req.user.id, body.userId);
  }

  @Get()
  @ApiOperation({ summary: 'لیست مکالمات من' })
  async getMyConversations(@Req() req: any) {
    return this.conversationsService.getMyConversations(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جزئیات یک مکالمه' })
  async getById(@Param('id') id: string) {
    return this.conversationsService.findById(id);
  }
}
