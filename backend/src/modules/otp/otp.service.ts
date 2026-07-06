import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { OtpRequest } from './otp-request.entity';

@Injectable()
export class OtpService {
  private readonly otpExpiryMinutes: number;
  private readonly maxAttempts: number;
  private readonly resendCooldownSeconds: number;

  constructor(
    @InjectRepository(OtpRequest)
    private otpRepository: Repository<OtpRequest>,
    private configService: ConfigService,
  ) {
    this.otpExpiryMinutes = this.configService.get<number>('OTP_EXPIRY_MINUTES', 5);
    this.maxAttempts = this.configService.get<number>('OTP_MAX_ATTEMPTS', 5);
    this.resendCooldownSeconds = this.configService.get<number>('OTP_RESEND_COOLDOWN', 90);
  }

  async sendOtp(phone: string): Promise<{ message: string; expiresIn: number }> {
    // Check cooldown
    const recentRequest = await this.otpRepository.findOne({
      where: { phone, verified: false },
      order: { createdAt: 'DESC' },
    });

    if (recentRequest) {
      const elapsed = (Date.now() - recentRequest.createdAt.getTime()) / 1000;
      if (elapsed < this.resendCooldownSeconds) {
        const remaining = Math.ceil(this.resendCooldownSeconds - elapsed);
        throw new BadRequestException(
          `لطفاً ${remaining} ثانیه صبر کنید و سپس دوباره تلاش کنید.`,
        );
      }
    }

    // Generate OTP code (use 12345 in development for testing)
    const code = process.env.NODE_ENV === 'development' ? '12345' : String(10000 + Math.floor(Math.random() * 90000));

    // Hash the code for storage
    const salt = crypto.randomBytes(16).toString('hex');
    const codeHash = crypto
      .createHash('sha256')
      .update(code + salt)
      .digest('hex');

    // Save OTP request
    const otpRequest = this.otpRepository.create({
      phone,
      codeHash: `${salt}:${codeHash}`,
      expiresAt: new Date(Date.now() + this.otpExpiryMinutes * 60 * 1000),
      attemptCount: 0,
    });
    await this.otpRepository.save(otpRequest);

    // In production: send SMS via Kavenegar
    if (process.env.NODE_ENV === 'production') {
      try {
        await this.sendSms(phone, code);
      } catch (error) {
        console.error('Failed to send SMS:', error);
      }
    } else {
      console.log(`📱 OTP for ${phone}: ${code}`);
    }

    return {
      message: 'کد تایید با موفقیت ارسال شد.',
      expiresIn: this.otpExpiryMinutes * 60,
    };
  }

  async verifyOtp(phone: string, code: string): Promise<boolean> {
    const otpRequest = await this.otpRepository.findOne({
      where: { phone, verified: false },
      order: { createdAt: 'DESC' },
    });

    if (!otpRequest) {
      return false;
    }

    if (new Date() > otpRequest.expiresAt) {
      return false;
    }

    if (otpRequest.attemptCount >= this.maxAttempts) {
      return false;
    }

    // Verify code hash
    const [salt, storedHash] = otpRequest.codeHash.split(':');
    const computedHash = crypto
      .createHash('sha256')
      .update(code + salt)
      .digest('hex');

    if (computedHash !== storedHash) {
      otpRequest.attemptCount += 1;
      await this.otpRepository.save(otpRequest);
      return false;
    }

    // Mark as verified
    otpRequest.verified = true;
    await this.otpRepository.save(otpRequest);

    return true;
  }

  private async sendSms(phone: string, code: string): Promise<void> {
    // Kavenegar SMS integration
    const Kavenegar = require('kavenegar');
    const api = Kavenegar.KavenegarApi({
      apikey: this.configService.get<string>('KAVENEGAR_API_KEY', ''),
    });

    return new Promise((resolve, reject) => {
      api.Send(
        {
          receptor: phone,
          message: `هم‌آهنگ\nکد تایید شما: ${code}\nاین کد تا ${this.otpExpiryMinutes} دقیقه معتبر است.`,
        },
        (err: any) => {
          if (err) reject(err);
          else resolve();
        },
      );
    });
  }
}
