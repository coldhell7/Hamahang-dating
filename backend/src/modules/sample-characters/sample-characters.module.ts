import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SampleCharactersController } from './sample-characters.controller';
import { SampleCharactersService } from './sample-characters.service';
import { User } from '../users/user.entity';
import { AdminGuard } from './admin.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule,
  ],
  controllers: [SampleCharactersController],
  providers: [SampleCharactersService, AdminGuard],
  exports: [SampleCharactersService],
})
export class SampleCharactersModule {}
