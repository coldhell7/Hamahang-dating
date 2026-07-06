import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'hamahang',
      password: process.env.DB_PASSWORD || 'hamahang_secret_1403',
      database: process.env.DB_DATABASE || 'hamahang',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    }),
  ],
})
export class DatabaseModule {}
