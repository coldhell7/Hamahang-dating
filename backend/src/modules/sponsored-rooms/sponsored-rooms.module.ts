import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SponsoredRoomsController } from './sponsored-rooms.controller';
import { SponsoredRoomsService } from './sponsored-rooms.service';
import { SponsoredRoomRequest } from './sponsored-room-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SponsoredRoomRequest])],
  controllers: [SponsoredRoomsController],
  providers: [SponsoredRoomsService],
  exports: [SponsoredRoomsService],
})
export class SponsoredRoomsModule {}
