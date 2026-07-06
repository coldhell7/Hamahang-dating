import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createOrGet(userId: string, otherUserId: string): Promise<Conversation> {
    if (userId === otherUserId) {
      throw new BadRequestException('نمی‌توانید با خودتان مکالمه داشته باشید.');
    }

    // Ensure the other user exists
    const otherUser = await this.userRepository.findOne({ where: { id: otherUserId } });
    if (!otherUser) {
      throw new NotFoundException('کاربر مورد نظر یافت نشد.');
    }

    // Look for existing conversation between these two users
    const existing = await this.conversationRepository.findOne({
      where: [
        { userAId: userId, userBId: otherUserId },
        { userAId: otherUserId, userBId: userId },
      ],
    });

    if (existing) {
      return existing;
    }

    // Create new conversation with consistent ordering
    const ids = [userId, otherUserId].sort();
    const conversation = this.conversationRepository.create({
      userAId: ids[0],
      userBId: ids[1],
    });
    return this.conversationRepository.save(conversation);
  }

  async getMyConversations(userId: string): Promise<Conversation[]> {
    return this.conversationRepository.find({
      where: [{ userAId: userId }, { userBId: userId }],
      relations: ['userA', 'userB', 'match'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      relations: ['userA', 'userB', 'match'],
    });
    if (!conversation) {
      throw new NotFoundException('مکالمه یافت نشد.');
    }
    return conversation;
  }
}
