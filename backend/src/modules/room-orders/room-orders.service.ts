import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomPlan } from './room-plan.entity';
import { RoomOrder, RoomOrderStatus } from './room-order.entity';
import { Room } from '../rooms/room.entity';

@Injectable()
export class RoomOrdersService {
  constructor(
    @InjectRepository(RoomPlan)
    private roomPlanRepository: Repository<RoomPlan>,
    @InjectRepository(RoomOrder)
    private roomOrderRepository: Repository<RoomOrder>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async getPlans(): Promise<RoomPlan[]> {
    return this.roomPlanRepository.find({ where: { isActive: true } });
  }

  async getPlanById(id: string): Promise<RoomPlan> {
    const plan = await this.roomPlanRepository.findOne({ where: { id } });
    if (!plan) throw new NotFoundException('پلن روم یافت نشد.');
    return plan;
  }

  async createPlan(data: Partial<RoomPlan>): Promise<RoomPlan> {
    const plan = this.roomPlanRepository.create(data);
    return this.roomPlanRepository.save(plan);
  }

  async updatePlan(id: string, data: Partial<RoomPlan>): Promise<RoomPlan> {
    await this.roomPlanRepository.update(id, data);
    return this.getPlanById(id);
  }

  async deletePlan(id: string): Promise<void> {
    await this.roomPlanRepository.delete(id);
  }

  async createOrder(
    userId: string,
    planId: string,
    purchaseToken: string,
  ): Promise<RoomOrder> {
    const plan = await this.getPlanById(planId);

    const order = this.roomOrderRepository.create({
      userId,
      roomPlanId: planId,
      bazaarPurchaseToken: purchaseToken,
      status: RoomOrderStatus.PENDING,
    });

    return this.roomOrderRepository.save(order);
  }

  async verifyOrder(orderId: string): Promise<RoomOrder> {
    const order = await this.roomOrderRepository.findOne({
      where: { id: orderId },
      relations: ['roomPlan'],
    });

    if (!order) throw new NotFoundException('سفارش روم یافت نشد.');

    // Verify with Cafe Bazaar (simplified)
    order.status = RoomOrderStatus.VERIFIED;
    order.verifiedAt = new Date();

    // Create the room
    const room = this.roomRepository.create({
      title: `روم ${order.roomPlan.name}`,
      ownerUserId: order.userId,
      isLive: true,
      isPublic: true,
    });
    const savedRoom = await this.roomRepository.save(room);
    order.roomId = savedRoom.id;

    return this.roomOrderRepository.save(order);
  }

  async getUserOrders(userId: string): Promise<RoomOrder[]> {
    return this.roomOrderRepository.find({
      where: { userId },
      relations: ['roomPlan', 'room'],
      order: { createdAt: 'DESC' },
    });
  }
}
