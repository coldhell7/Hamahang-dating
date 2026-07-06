import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SponsoredRoomRequest, SponsoredRoomStatus } from './sponsored-room-request.entity';

@Injectable()
export class SponsoredRoomsService {
  constructor(
    @InjectRepository(SponsoredRoomRequest)
    private requestRepository: Repository<SponsoredRoomRequest>,
  ) {}

  async createRequest(userId: string, data: { brandName: string; goalDescription: string; preferredDate?: string }): Promise<SponsoredRoomRequest> {
    const request = this.requestRepository.create({
      brandName: data.brandName,
      goalDescription: data.goalDescription,
      preferredDate: data.preferredDate ? new Date(data.preferredDate) : undefined,
      requestedByUserId: userId,
      status: SponsoredRoomStatus.NEW,
    });
    return this.requestRepository.save(request);
  }

  async getAllRequests(): Promise<SponsoredRoomRequest[]> {
    return this.requestRepository.find({
      relations: ['requestedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: SponsoredRoomStatus, adminId?: string): Promise<SponsoredRoomRequest> {
    await this.requestRepository.update(id, {
      status,
      assignedAdminId: adminId,
    });
    return this.requestRepository.findOne({ where: { id }, relations: ['requestedBy'] }) as Promise<SponsoredRoomRequest>;
  }
}
