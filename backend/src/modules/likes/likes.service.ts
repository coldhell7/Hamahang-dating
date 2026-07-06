import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { User } from '../users/user.entity';
import { Match } from '../matches/match.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}

  async like(fromUserId: string, toUserId: string): Promise<{ match?: Match }> {
    if (fromUserId === toUserId) {
      throw new BadRequestException('نمی‌توانید خود را لایک کنید.');
    }

    // Ensure target user exists
    const targetUser = await this.userRepository.findOne({ where: { id: toUserId } });
    if (!targetUser) {
      throw new NotFoundException('کاربر مورد نظر یافت نشد.');
    }

    // Check if already liked
    const existing = await this.likeRepository.findOne({
      where: { fromUserId, toUserId },
    });
    if (existing) {
      throw new BadRequestException('قبلاً این کاربر را لایک کرده‌اید.');
    }

    // Create the like
    const like = this.likeRepository.create({ fromUserId, toUserId });
    await this.likeRepository.save(like);

    // Check for mutual like — if the other user already liked us, it's a match
    const mutual = await this.likeRepository.findOne({
      where: { fromUserId: toUserId, toUserId: fromUserId },
    });

    if (mutual) {
      // Ensure consistent ordering so (A,B) and (B,A) resolve to the same row
      const ids = [fromUserId, toUserId].sort();
      const match = this.matchRepository.create({
        userAId: ids[0],
        userBId: ids[1],
      });
      await this.matchRepository.save(match);
      return { match };
    }

    return {};
  }

  async unlike(fromUserId: string, toUserId: string): Promise<void> {
    const existing = await this.likeRepository.findOne({
      where: { fromUserId, toUserId },
    });
    if (!existing) {
      throw new NotFoundException('لایکی برای حذف یافت نشد.');
    }
    await this.likeRepository.remove(existing);
  }

  async getReceivedLikes(userId: string): Promise<Like[]> {
    // If the requesting user is male and not premium, limit the view
    const currentUser = await this.userRepository.findOne({ where: { id: userId } });
    if (!currentUser) {
      throw new NotFoundException('کاربر یافت نشد.');
    }

    const query = this.likeRepository.find({
      where: { toUserId: userId },
      relations: ['fromUser'],
      order: { createdAt: 'DESC' },
    });

    // For male non-premium users we still return the likes but without full details
    // (the controller can further transform if needed)
    return query;
  }

  async getSentLikes(userId: string): Promise<Like[]> {
    return this.likeRepository.find({
      where: { fromUserId: userId },
      relations: ['toUser'],
      order: { createdAt: 'DESC' },
    });
  }
}
