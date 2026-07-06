import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpService } from './otp.service';
import { OtpRequest } from './otp-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OtpRequest])],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
