import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeatureFlag } from './feature-flag.entity';

@Injectable()
export class FeatureFlagsService {
  constructor(
    @InjectRepository(FeatureFlag)
    private flagRepository: Repository<FeatureFlag>,
  ) {}

  async getAll(): Promise<FeatureFlag[]> {
    return this.flagRepository.find();
  }

  async getByKey(key: string): Promise<FeatureFlag | null> {
    return this.flagRepository.findOne({ where: { key } });
  }

  async isEnabled(key: string): Promise<boolean> {
    const flag = await this.flagRepository.findOne({ where: { key } });
    return flag?.isEnabled ?? false;
  }

  async setFlag(key: string, isEnabled: boolean, description?: string): Promise<FeatureFlag> {
    let flag = await this.flagRepository.findOne({ where: { key } });
    if (flag) {
      flag.isEnabled = isEnabled;
      if (description) flag.description = description;
      return this.flagRepository.save(flag);
    }
    flag = this.flagRepository.create({ key, isEnabled, description });
    return this.flagRepository.save(flag);
  }

  async toggle(key: string): Promise<FeatureFlag> {
    const flag = await this.flagRepository.findOne({ where: { key } });
    if (!flag) {
      return this.setFlag(key, true);
    }
    flag.isEnabled = !flag.isEnabled;
    return this.flagRepository.save(flag);
  }
}
