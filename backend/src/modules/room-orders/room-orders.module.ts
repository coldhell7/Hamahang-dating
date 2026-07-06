import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomOrdersController } from './room-orders.controller';
import { RoomOrdersService } from './room-orders.service';
import { RoomPlan } from './room-plan.entity';
import { RoomOrder } from './room-order.entity';
import { Room } from '../rooms/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomPlan, RoomOrder, Room])],
  controllers: [RoomOrdersController],
  providers: [RoomOrdersService],
  exports: [RoomOrdersService],
})
export class RoomOrdersModule {}
