import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { MusicCategory } from './category.entity';
import { UserCategoryPreference } from './user-category-preference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MusicCategory, UserCategoryPreference])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
