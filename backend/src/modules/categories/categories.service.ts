import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MusicCategory } from './category.entity';
import { UserCategoryPreference } from './user-category-preference.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(MusicCategory)
    private categoryRepository: Repository<MusicCategory>,
    @InjectRepository(UserCategoryPreference)
    private userCategoryPreferenceRepository: Repository<UserCategoryPreference>,
  ) {}

  async findAll(type?: string): Promise<MusicCategory[]> {
    const where: any = { isActive: true };
    if (type) {
      where.type = type;
    }
    return this.categoryRepository.find({
      where,
      order: { nameFa: 'ASC' },
    });
  }

  async findById(id: string): Promise<MusicCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id, isActive: true },
    });
    if (!category) {
      throw new NotFoundException('دسته‌بندی یافت نشد.');
    }
    return category;
  }

  async setUserPreferences(
    userId: string,
    categoryIds: string[],
  ): Promise<MusicCategory[]> {
    // Validate all categories exist
    const categories = await this.categoryRepository.find({
      where: categoryIds.map((id) => ({ id, isActive: true })),
    });
    if (categories.length !== categoryIds.length) {
      throw new NotFoundException('یک یا چند دسته‌بندی نامعتبر است.');
    }

    // Remove existing preferences
    await this.userCategoryPreferenceRepository.delete({ userId });

    // Insert new preferences
    const preferences = categoryIds.map((categoryId) =>
      this.userCategoryPreferenceRepository.create({ userId, categoryId }),
    );
    await this.userCategoryPreferenceRepository.save(preferences);

    return categories;
  }

  async getUserPreferences(userId: string): Promise<MusicCategory[]> {
    const preferences = await this.userCategoryPreferenceRepository.find({
      where: { userId },
      relations: ['category'],
    });
    return preferences
      .filter((p) => p.category?.isActive)
      .map((p) => p.category);
  }
}
