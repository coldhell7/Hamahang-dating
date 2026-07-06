import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Block } from './block.entity';

@Injectable()
export class BlocksService {
  constructor(
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
  ) {}

  async blockUser(blockerUserId: string, blockedUserId: string): Promise<Block> {
    const existing = await this.blockRepository.findOne({
      where: { blockerUserId, blockedUserId },
    });
    if (existing) return existing;

    const block = this.blockRepository.create({ blockerUserId, blockedUserId });
    return this.blockRepository.save(block);
  }

  async unblockUser(blockerUserId: string, blockedUserId: string): Promise<void> {
    await this.blockRepository.delete({ blockerUserId, blockedUserId });
  }

  async getBlockedUsers(userId: string): Promise<Block[]> {
    return this.blockRepository.find({
      where: { blockerUserId: userId },
      relations: ['blocked'],
    });
  }

  async isBlocked(blockerUserId: string, blockedUserId: string): Promise<boolean> {
    const count = await this.blockRepository.count({
      where: { blockerUserId, blockedUserId },
    });
    return count > 0;
  }
}
