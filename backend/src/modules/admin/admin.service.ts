import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AdminUser, AdminRole } from './admin-user.entity';
import { User, AccountStatus } from '../users/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminUser)
    private adminRepository: Repository<AdminUser>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<{ accessToken: string; admin: Partial<AdminUser> }> {
    const admin = await this.adminRepository.findOne({ where: { email, isActive: true } });
    if (!admin) {
      throw new UnauthorizedException('ایمیل یا رمز عبور اشتباه است.');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('ایمیل یا رمز عبور اشتباه است.');
    }

    const token = this.jwtService.sign({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      isAdmin: true,
    });

    return {
      accessToken: token,
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        name: admin.name,
      },
    };
  }

  async createAdmin(data: { email: string; password: string; role: AdminRole; name?: string }): Promise<AdminUser> {
    const existing = await this.adminRepository.findOne({ where: { email: data.email } });
    if (existing) {
      throw new ConflictException('این ایمیل قبلاً ثبت شده است.');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const admin = this.adminRepository.create({
      email: data.email,
      passwordHash,
      role: data.role,
      name: data.name,
    });
    return this.adminRepository.save(admin);
  }

  async getAllAdmins(): Promise<AdminUser[]> {
    return this.adminRepository.find({ select: ['id', 'email', 'role', 'name', 'isActive', 'createdAt'] });
  }

  async manageUser(userId: string, action: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('کاربر یافت نشد.');

    switch (action) {
      case 'suspend':
        user.accountStatus = AccountStatus.SUSPENDED;
        break;
      case 'ban':
        user.accountStatus = AccountStatus.BANNED;
        break;
      case 'activate':
        user.accountStatus = AccountStatus.ACTIVE;
        break;
      default:
        throw new UnauthorizedException('عملیات نامعتبر.');
    }
    await this.userRepository.save(user);
  }

  async getAllUsers(page = 1, limit = 20): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { users, total };
  }
}
