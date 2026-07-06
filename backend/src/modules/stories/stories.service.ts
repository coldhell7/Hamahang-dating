import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { ProfileStory } from './profile-story.entity';
import { User } from '../users/user.entity';

@Injectable()
export class StoriesService {
  constructor(
    @InjectRepository(ProfileStory)
    private storyRepository: Repository<ProfileStory>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userId: string, audioUrl: string): Promise<ProfileStory> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد.');
    }

    if (!user.isPremium) {
      throw new ForbiddenException(
        'فقط کاربران ویژه می‌توانند استوری ایجاد کنند.',
      );
    }

    // Remove any existing active story
    const existingStory = await this.storyRepository.findOne({
      where: { userId, expiresAt: MoreThan(new Date()) },
    });
    if (existingStory) {
      await this.storyRepository.remove(existingStory);
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const story = this.storyRepository.create({
      userId,
      audioUrl,
      durationSeconds: 30,
      expiresAt,
    });

    return this.storyRepository.save(story);
  }

  async getActiveStory(targetUserId: string): Promise<ProfileStory | null> {
    const now = new Date();

    // Clean up expired stories
    await this.storyRepository.delete({
      userId: targetUserId,
      expiresAt: LessThan(now),
    });

    const story = await this.storyRepository.findOne({
      where: {
        userId: targetUserId,
        expiresAt: MoreThan(now),
      },
      relations: ['user'],
    });

    return story || null;
  }
}
