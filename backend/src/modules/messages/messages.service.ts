import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { MessageQuota } from './message-quota.entity';
import { Conversation } from '../conversations/conversation.entity';
import { User } from '../users/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(MessageQuota)
    private messageQuotaRepository: Repository<MessageQuota>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async send(
    senderId: string,
    conversationId: string,
    text: string,
  ): Promise<Message> {
    if (!text || text.trim().length === 0) {
      throw new BadRequestException('متن پیام نمی‌تواند خالی باشد.');
    }

    // Verify conversation exists
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });
    if (!conversation) {
      throw new NotFoundException('مکالمه یافت نشد.');
    }

    // Verify sender is part of the conversation
    if (
      conversation.userAId !== senderId &&
      conversation.userBId !== senderId
    ) {
      throw new ForbiddenException('شما عضو این مکالمه نیستید.');
    }

    // Determine the target user (the other participant)
    const targetUserId =
      conversation.userAId === senderId
        ? conversation.userBId
        : conversation.userAId;

    // ENFORCE: if sender is male and not premium, check MessageQuota
    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    if (!sender) {
      throw new NotFoundException('کاربر یافت نشد.');
    }

    if (sender.gender === 'male' && !sender.isPremium) {
      const quota = await this.messageQuotaRepository.findOne({
        where: { userId: senderId, targetUserId },
      });

      if (quota && quota.freeMessageUsed) {
        throw new BadRequestException(
          'لطفا برای ارسال پیام بیشتر اشتراک پرمیوم تهیه کنید',
        );
      }

      // Allow the message and mark the quota as used
      if (!quota) {
        const newQuota = this.messageQuotaRepository.create({
          userId: senderId,
          targetUserId,
          freeMessageUsed: true,
        });
        await this.messageQuotaRepository.save(newQuota);
      } else if (!quota.freeMessageUsed) {
        quota.freeMessageUsed = true;
        await this.messageQuotaRepository.save(quota);
      }
    }

    // Create and return the message
    const message = this.messageRepository.create({
      conversationId,
      senderId,
      text: text.trim(),
    });
    return this.messageRepository.save(message);
  }

  async getConversationMessages(conversationId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { conversationId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }
}
