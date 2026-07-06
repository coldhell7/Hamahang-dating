import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { SongsModule } from './modules/songs/songs.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { LikesModule } from './modules/likes/likes.module';
import { MatchesModule } from './modules/matches/matches.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { MessagesModule } from './modules/messages/messages.module';
import { StickersModule } from './modules/stickers/stickers.module';
import { VipModule } from './modules/vip/vip.module';
import { BlocksModule } from './modules/blocks/blocks.module';
import { ReportsModule } from './modules/reports/reports.module';
import { OtpModule } from './modules/otp/otp.module';
import { AdminModule } from './modules/admin/admin.module';
import { FeatureFlagsModule } from './modules/feature-flags/feature-flags.module';
import { SampleCharactersModule } from './modules/sample-characters/sample-characters.module';
import { PresetMessagesModule } from './modules/preset-messages/preset-messages.module';
import { StoriesModule } from './modules/stories/stories.module';
import { RoomOrdersModule } from './modules/room-orders/room-orders.module';
import { SponsoredRoomsModule } from './modules/sponsored-rooms/sponsored-rooms.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HealthModule } from './modules/health/health.module';
import { WebSocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'hamahang'),
        password: config.get<string>('DB_PASSWORD', 'hamahang_secret_1403'),
        database: config.get<string>('DB_DATABASE', 'hamahang'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get<string>('NODE_ENV') === 'development',
        logging: config.get<string>('NODE_ENV') === 'development' ? ['error', 'warn'] : ['error'],
        ssl: false,
      }),
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    ScheduleModule.forRoot(),
    // Feature modules
    AuthModule,
    UsersModule,
    RoomsModule,
    SongsModule,
    CategoriesModule,
    LikesModule,
    MatchesModule,
    ConversationsModule,
    MessagesModule,
    StickersModule,
    VipModule,
    BlocksModule,
    ReportsModule,
    OtpModule,
    AdminModule,
    FeatureFlagsModule,
    SampleCharactersModule,
    PresetMessagesModule,
    StoriesModule,
    RoomOrdersModule,
    SponsoredRoomsModule,
    DashboardModule,
    HealthModule,
    WebSocketModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
