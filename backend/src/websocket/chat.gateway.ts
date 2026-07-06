import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomMessage } from '../modules/rooms/room-message.entity';
import { RoomMember } from '../modules/rooms/room-member.entity';
import { User } from '../modules/users/user.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/ws',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');
  private userSockets = new Map<string, string[]>(); // userId -> socketIds

  constructor(
    @InjectRepository(RoomMessage)
    private messageRepository: Repository<RoomMessage>,
    @InjectRepository(RoomMember)
    private memberRepository: Repository<RoomMember>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      const existing = this.userSockets.get(userId) || [];
      existing.push(client.id);
      this.userSockets.set(userId, existing);
      
      // Join all rooms the user is a member of
      const memberships = await this.memberRepository.find({
        where: { userId },
        relations: ['room'],
      });
      memberships.forEach((m) => client.join(`room:${m.roomId}`));
      
      client.join(`user:${userId}`);
      this.logger.log(`User ${userId} connected (${client.id})`);
    }
  }

  handleDisconnect(client: Socket) {
    // Clean up user sockets
    for (const [userId, socketIds] of this.userSockets.entries()) {
      const filtered = socketIds.filter((id) => id !== client.id);
      if (filtered.length === 0) {
        this.userSockets.delete(userId);
      } else {
        this.userSockets.set(userId, filtered);
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join:room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    client.join(`room:${data.roomId}`);
    this.server.to(`room:${data.roomId}`).emit('user:joined', {
      userId: client.handshake.query.userId,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('leave:room')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    client.leave(`room:${data.roomId}`);
    this.server.to(`room:${data.roomId}`).emit('user:left', {
      userId: client.handshake.query.userId,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('room:chat')
  async handleRoomChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; text: string },
  ) {
    const userId = client.handshake.query.userId as string;
    
    const message = this.messageRepository.create({
      roomId: data.roomId,
      userId,
      text: data.text,
    });
    const saved = await this.messageRepository.save(message);

    this.server.to(`room:${data.roomId}`).emit('room:message', {
      id: saved.id,
      userId,
      text: data.text,
      createdAt: saved.createdAt,
    });
  }

  @SubscribeMessage('room:sticker')
  async handleRoomSticker(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; toUserId: string; stickerTypeId: string },
  ) {
    const fromUserId = client.handshake.query.userId as string;
    
    this.server.to(`room:${data.roomId}`).emit('room:sticker', {
      fromUserId,
      toUserId: data.toUserId,
      stickerTypeId: data.stickerTypeId,
    });
  }

  @SubscribeMessage('match:notification')
  async handleMatchNotification(
    @MessageBody() data: { userId: string; matchUserId: string },
  ) {
    this.server.to(`user:${data.userId}`).emit('match:new', {
      matchUserId: data.matchUserId,
      message: 'شما یک مچ جدید دارید! 🎉',
    });
    this.server.to(`user:${data.matchUserId}`).emit('match:new', {
      matchUserId: data.userId,
      message: 'شما یک مچ جدید دارید! 🎉',
    });
  }
}
