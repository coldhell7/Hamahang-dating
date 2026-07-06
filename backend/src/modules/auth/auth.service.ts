import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, AccountStatus } from '../users/user.entity';
import { OtpService } from '../otp/otp.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private otpService: OtpService,
    private usersService: UsersService,
  ) {}

  async sendOtp(phone: string): Promise<{ message: string; expiresIn: number }> {
    // Validate Iranian phone number
    if (!/^09\d{9}$/.test(phone) && !/^\+989\d{9}$/.test(phone)) {
      throw new BadRequestException('شماره موبایل نامعتبر است. لطفاً شماره ۱۱ رقمی ایرانی وارد کنید.');
    }

    const normalizedPhone = phone.startsWith('+98') ? '0' + phone.slice(3) : phone;
    return this.otpService.sendOtp(normalizedPhone);
  }

  async verifyOtp(
    phone: string,
    code: string,
    userData?: {
      name?: string;
      gender?: string;
      city?: string;
      birthYear?: number;
      categoryIds?: string[];
    },
  ): Promise<{ accessToken: string; refreshToken: string; user: Partial<User> }> {
    const normalizedPhone = phone.startsWith('+98') ? '0' + phone.slice(3) : phone;

    // Verify OTP code
    const isValid = await this.otpService.verifyOtp(normalizedPhone, code);
    if (!isValid) {
      throw new UnauthorizedException('کد تایید نامعتبر یا منقضی شده است.');
    }

    // Find or create user
    let user = await this.userRepository.findOne({ where: { phone: normalizedPhone } });

    if (user) {
      // Update user data if provided
      if (userData) {
        const updateData: Partial<User> = {};
        if (userData.name) updateData.name = userData.name;
        if (userData.gender) updateData.gender = userData.gender;
        if (userData.city) updateData.city = userData.city;
        if (userData.birthYear) updateData.birthYear = userData.birthYear;
        if (Object.keys(updateData).length > 0) {
          await this.userRepository.update(user.id, updateData);
          user = await this.userRepository.findOne({ where: { id: user.id } }) as User;
        }
      }
    } else {
      // Create new user
      const newUser = this.userRepository.create({
        phone: normalizedPhone,
        name: userData?.name || 'کاربر',
        gender: userData?.gender,
        city: userData?.city,
        birthYear: userData?.birthYear,
        onboardingCompleted: false,
      });
      user = await this.userRepository.save(newUser);
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        gender: user.gender,
        city: user.city,
        birthYear: user.birthYear,
        avatarUrl: user.avatarUrl,
        isPremium: user.isPremium,
        premiumExpiresAt: user.premiumExpiresAt,
        onboardingCompleted: user.onboardingCompleted,
      },
    };
  }

  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      sub: user.id,
      phone: user.phone,
      isPremium: user.isPremium,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'hamahang-refresh-secret',
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'hamahang-refresh-secret',
      });

      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('کاربر یافت نشد.');
      }

      if (user.accountStatus !== AccountStatus.ACTIVE) {
        throw new UnauthorizedException('حساب کاربری شما مسدود شده است.');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('توکن نامعتبر یا منقضی شده است.');
    }
  }

  async getProfile(userId: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('کاربر یافت نشد.');

    return {
      id: user.id,
      phone: user.phone,
      name: user.name,
      gender: user.gender,
      city: user.city,
      birthYear: user.birthYear,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      isPremium: user.isPremium,
      premiumExpiresAt: user.premiumExpiresAt,
      onboardingCompleted: user.onboardingCompleted,
    };
  }
}
