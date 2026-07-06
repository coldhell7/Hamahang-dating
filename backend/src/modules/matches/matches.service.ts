import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './match.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}

  async getMyMatches(userId: string): Promise<Match[]> {
    return this.matchRepository.find({
      where: [{ userAId: userId }, { userBId: userId }],
      relations: ['userA', 'userB'],
      order: { createdAt: 'DESC' },
    });
  }
}
