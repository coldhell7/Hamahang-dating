import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { RoomMessage } from '../modules/rooms/room-message.entity';
import { RoomMember } from '../modules/rooms/room-member.entity';
import { User } from '../modules/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomMessage, RoomMember, User])],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class WebSocketModule {}
