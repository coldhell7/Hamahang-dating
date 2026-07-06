import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room, RoomStatus } from './room.entity';
import { RoomMember, RoomMemberRole } from './room-member.entity';
import { RoomMessage } from './room-message.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(RoomMember)
    private roomMemberRepository: Repository<RoomMember>,
    @InjectRepository(RoomMessage)
    private roomMessageRepository: Repository<RoomMessage>,
  ) {}

  async findAll(categoryId?: string): Promise<Room[]> {
    const where: any = { isPublic: true, status: RoomStatus.LIVE };
    if (categoryId) {
      where.categoryId = categoryId;
    }
    return this.roomRepository.find({
      where,
      relations: ['owner', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: ['owner', 'category'],
    });
    if (!room) {
      throw new NotFoundException('اتاق یافت نشد.');
    }
    return room;
  }

  async create(data: Partial<Room>, userId: string): Promise<Room> {
    const room = this.roomRepository.create({
      ...data,
      ownerUserId: userId,
      status: RoomStatus.LIVE,
    });
    const saved = await this.roomRepository.save(room);

    // Auto-join creator as host
    await this.roomMemberRepository.save(
      this.roomMemberRepository.create({
        roomId: saved.id,
        userId,
        role: RoomMemberRole.HOST,
      }),
    );

    return this.findById(saved.id);
  }

  async join(roomId: string, userId: string): Promise<{ message: string }> {
    const room = await this.findById(roomId);

    if (room.status !== RoomStatus.LIVE) {
      throw new BadRequestException('این اتاق دیگر فعال نیست.');
    }

    const existing = await this.roomMemberRepository.findOne({
      where: { roomId, userId },
    });
    if (existing) {
      return { message: 'شما قبلاً عضو این اتاق هستید.' };
    }

    await this.roomMemberRepository.save(
      this.roomMemberRepository.create({
        roomId,
        userId,
        role: RoomMemberRole.LISTENER,
      }),
    );

    // Increment listener count
    await this.roomRepository.increment({ id: roomId }, 'listenerCount', 1);

    return { message: 'با موفقیت به اتاق پیوستید.' };
  }

  async leave(roomId: string, userId: string): Promise<{ message: string }> {
    const membership = await this.roomMemberRepository.findOne({
      where: { roomId, userId },
    });
    if (!membership) {
      throw new BadRequestException('شما عضو این اتاق نیستید.');
    }

    if (membership.role === RoomMemberRole.HOST) {
      throw new ForbiddenException('میزبان نمی‌تواند اتاق را ترک کند.');
    }

    await this.roomMemberRepository.delete(membership.id);

    // Decrement listener count
    await this.roomRepository.decrement({ id: roomId }, 'listenerCount', 1);

    return { message: 'اتاق را با موفقیت ترک کردید.' };
  }

  async getMessages(roomId: string): Promise<RoomMessage[]> {
    await this.findById(roomId);

    return this.roomMessageRepository.find({
      where: { roomId },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  async sendMessage(
    roomId: string,
    userId: string,
    text: string,
  ): Promise<RoomMessage> {
    await this.findById(roomId);

    const membership = await this.roomMemberRepository.findOne({
      where: { roomId, userId },
    });
    if (!membership) {
      throw new ForbiddenException('شما عضو این اتاق نیستید.');
    }

    const message = this.roomMessageRepository.create({
      roomId,
      userId,
      text,
    });
    return this.roomMessageRepository.save(message);
  }

  async getMembers(roomId: string): Promise<RoomMember[]> {
    await this.findById(roomId);

    return this.roomMemberRepository.find({
      where: { roomId },
      relations: ['user'],
      order: { joinedAt: 'ASC' },
    });
  }
}
