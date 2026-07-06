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
import { MessagesService } from './messages.service';

@ApiTags('پیام‌ها (Messages)')
@Controller()
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post('messages')
  @ApiOperation({ summary: 'ارسال پیام' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        conversationId: { type: 'string', description: 'شناسه مکالمه' },
        text: { type: 'string', description: 'متن پیام' },
      },
      required: ['conversationId', 'text'],
    },
  })
  async send(@Req() req: any, @Body() body: { conversationId: string; text: string }) {
    return this.messagesService.send(req.user.id, body.conversationId, body.text);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'دریافت پیام‌های یک مکالمه' })
  async getMessages(@Param('id') conversationId: string) {
    return this.messagesService.getConversationMessages(conversationId);
  }
}
