import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Song } from './song.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  async findAll(
    categoryId?: string,
    search?: string,
  ): Promise<Song[]> {
    const where: any = { isActive: true };

    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (search) {
      where.title = ILike(`%${search}%`);
    }

    return this.songRepository.find({
      where,
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Song> {
    const song = await this.songRepository.findOne({
      where: { id, isActive: true },
      relations: ['category'],
    });
    if (!song) {
      throw new NotFoundException('آهنگ یافت نشد.');
    }
    return song;
  }

  async incrementPlayCount(id: string): Promise<Song> {
    const song = await this.findById(id);
    await this.songRepository.increment({ id }, 'playCount', 1);
    return this.findById(id);
  }
}
