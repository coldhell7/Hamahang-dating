import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PresetMessage } from './preset-message.entity';
import { PresetMessageSendLog } from './preset-message-send-log.entity';

@Injectable()
export class PresetMessagesService {
  private readonly MAX_PRESET_MESSAGES = 5;

  constructor(
    @InjectRepository(PresetMessage)
    private presetMessageRepository: Repository<PresetMessage>,
    @InjectRepository(PresetMessageSendLog)
    private sendLogRepository: Repository<PresetMessageSendLog>,
  ) {}

  async findMyMessages(userId: string): Promise<PresetMessage[]> {
    return this.presetMessageRepository.find({
      where: { userId },
      order: { sortOrder: 'ASC' },
    });
  }

  async create(
    userId: string,
    text: string,
    sortOrder?: number,
  ): Promise<PresetMessage> {
    const count = await this.presetMessageRepository.count({
      where: { userId },
    });

    if (count >= this.MAX_PRESET_MESSAGES) {
      throw new BadRequestException(
        `شما حداکثر می‌توانید ${this.MAX_PRESET_MESSAGES} پیام از پیش تعیین شده داشته باشید.`,
      );
    }

    const maxOrder = await this.presetMessageRepository
      .createQueryBuilder('pm')
      .where('pm.userId = :userId', { userId })
      .select('MAX(pm.sortOrder)', 'max')
      .getRawOne();

    const message = this.presetMessageRepository.create({
      userId,
      text,
      sortOrder: sortOrder ?? ((maxOrder?.max ?? -1) + 1),
    });

    return this.presetMessageRepository.save(message);
  }

  async update(
    userId: string,
    id: string,
    text?: string,
    sortOrder?: number,
  ): Promise<PresetMessage> {
    const message = await this.presetMessageRepository.findOne({
      where: { id, userId },
    });

    if (!message) {
      throw new NotFoundException('پیام از پیش تعیین شده یافت نشد.');
    }

    if (text !== undefined) {
      message.text = text;
    }
    if (sortOrder !== undefined) {
      message.sortOrder = sortOrder;
    }

    return this.presetMessageRepository.save(message);
  }

  async remove(userId: string, id: string): Promise<void> {
    const message = await this.presetMessageRepository.findOne({
      where: { id, userId },
    });

    if (!message) {
      throw new NotFoundException('پیام از پیش تعیین شده یافت نشد.');
    }

    await this.presetMessageRepository.remove(message);
  }

  async send(
    userId: string,
    presetId: string,
    roomId: string,
    targetUserId: string,
  ): Promise<PresetMessageSendLog> {
    const message = await this.presetMessageRepository.findOne({
      where: { id: presetId, userId },
    });

    if (!message) {
      throw new NotFoundException('پیام از پیش تعیین شده یافت نشد.');
    }

    const log = this.sendLogRepository.create({
      presetMessageId: presetId,
      senderId: userId,
      roomId,
      targetUserId,
    });

    return this.sendLogRepository.save(log);
  }
}
