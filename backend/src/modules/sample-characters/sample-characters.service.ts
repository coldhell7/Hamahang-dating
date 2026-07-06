import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, AccountStatus } from '../users/user.entity';

@Injectable()
export class SampleCharactersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      where: { isSample: true, accountStatus: AccountStatus.ACTIVE },
      select: [
        'id',
        'name',
        'gender',
        'city',
        'birthYear',
        'avatarUrl',
        'bio',
        'isSample',
        'createdAt',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async create(data: {
    name: string;
    gender?: string;
    city?: string;
    birthYear?: number;
    avatarUrl?: string;
    bio?: string;
  }): Promise<User> {
    const sampleUser = this.userRepository.create({
      name: data.name,
      gender: data.gender,
      city: data.city,
      birthYear: data.birthYear,
      avatarUrl: data.avatarUrl,
      bio: data.bio,
      isSample: true,
      accountStatus: AccountStatus.ACTIVE,
      onboardingCompleted: true,
    });

    return this.userRepository.save(sampleUser);
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      gender: string;
      city: string;
      birthYear: number;
      avatarUrl: string;
      bio: string;
      accountStatus: AccountStatus;
    }>,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, isSample: true },
    });
    if (!user) {
      throw new NotFoundException('کاربر نمونه یافت نشد.');
    }

    await this.userRepository.update(id, data);
    return this.userRepository.findOne({ where: { id } }) as Promise<User>;
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id, isSample: true },
    });
    if (!user) {
      throw new NotFoundException('کاربر نمونه یافت نشد.');
    }

    await this.userRepository.remove(user);
  }
}
