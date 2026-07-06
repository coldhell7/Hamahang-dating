import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PresetMessagesController } from './preset-messages.controller';
import { PresetMessagesService } from './preset-messages.service';
import { PresetMessage } from './preset-message.entity';
import { PresetMessageSendLog } from './preset-message-send-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PresetMessage, PresetMessageSendLog]),
  ],
  controllers: [PresetMessagesController],
  providers: [PresetMessagesService],
  exports: [PresetMessagesService],
})
export class PresetMessagesModule {}
