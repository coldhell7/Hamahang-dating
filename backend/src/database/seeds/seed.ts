import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'hamahang',
    password: process.env.DB_PASSWORD || 'hamahang_secret_1403',
    database: process.env.DB_DATABASE || 'hamahang',
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('📦 Connected to database for seeding...');

  // Seed Admin Users
  const adminRepo = dataSource.getRepository('AdminUser');
  const adminCount = await adminRepo.count();
  if (adminCount === 0) {
    const passwordHash = await bcrypt.hash('admin@1403', 12);
    await adminRepo.save([
      {
        email: 'super@hamahang.app',
        passwordHash,
        role: 'super_admin',
        name: 'مدیر سیستم',
        isActive: true,
      },
      {
        email: 'content@hamahang.app',
        passwordHash: await bcrypt.hash('content@1403', 12),
        role: 'content_manager',
        name: 'مدیر محتوا',
        isActive: true,
      },
      {
        email: 'support@hamahang.app',
        passwordHash: await bcrypt.hash('support@1403', 12),
        role: 'support',
        name: 'پشتیبانی',
        isActive: true,
      },
    ]);
    console.log('✅ Admin users seeded');
  }

  // Seed Music Categories
  const categoryRepo = dataSource.getRepository('MusicCategory');
  const catCount = await categoryRepo.count();
  if (catCount === 0) {
    await categoryRepo.save([
      // Genres
      { nameFa: 'پاپ', type: 'genre', isActive: true },
      { nameFa: 'راک', type: 'genre', isActive: true },
      { nameFa: 'هیپ هاپ', type: 'genre', isActive: true },
      { nameFa: 'الکترونیک', type: 'genre', isActive: true },
      { nameFa: 'کلاسیک', type: 'genre', isActive: true },
      { nameFa: 'سنتی ایرانی', type: 'genre', isActive: true },
      { nameFa: 'جاز', type: 'genre', isActive: true },
      { nameFa: 'محلی', type: 'genre', isActive: true },
      // Moods
      { nameFa: 'آرامش‌بخش', type: 'mood', isActive: true },
      { nameFa: 'شاد', type: 'mood', isActive: true },
      { nameFa: 'ورزشی', type: 'mood', isActive: true },
      { nameFa: 'غمگین', type: 'mood', isActive: true },
      { nameFa: 'رمانتیک', type: 'mood', isActive: true },
      { nameFa: 'انگیزشی', type: 'mood', isActive: true },
      { nameFa: 'مهمانی', type: 'mood', isActive: true },
      // Artists
      { nameFa: 'محسن یگانه', type: 'artist', isActive: true },
      { nameFa: 'علیرضا قربانی', type: 'artist', isActive: true },
      { nameFa: 'حمید هیراد', type: 'artist', isActive: true },
      { nameFa: 'محمدرضا شجریان', type: 'artist', isActive: true },
      { nameFa: 'محمد اصفهانی', type: 'artist', isActive: true },
    ]);
    console.log('✅ Music categories seeded');
  }

  // Seed Sample Characters
  const userRepo = dataSource.getRepository('User');
  const sampleCount = await userRepo.count({ where: { isSample: true } });
  if (sampleCount === 0) {
    await userRepo.save([
      {
        name: 'سارا محمدی',
        gender: 'female',
        city: 'تهران',
        birthYear: 1998,
        bio: 'عاشق موسیقی پاپ و سنتی | کتاب‌خوان | قهوه تلخ',
        isSample: true,
        onboardingCompleted: true,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara1',
      },
      {
        name: 'نیما رحیمی',
        gender: 'male',
        city: 'اصفهان',
        birthYear: 1996,
        bio: 'نوازنده گیتار | عاشق راک و بلوز',
        isSample: true,
        onboardingCompleted: true,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nima1',
      },
      {
        name: 'زهرا حسینی',
        gender: 'female',
        city: 'شیراز',
        birthYear: 2000,
        bio: 'دانشجوی موسیقی | پیانیست | عاشق شب‌های بارونی',
        isSample: true,
        onboardingCompleted: true,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zahra1',
      },
      {
        name: 'امیر کریمی',
        gender: 'male',
        city: 'مشهد',
        birthYear: 1997,
        bio: 'آهنگساز | تولیدکننده موسیقی الکترونیک',
        isSample: true,
        onboardingCompleted: true,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amirk1',
      },
      {
        name: 'مریم احمدی',
        gender: 'female',
        city: 'تهران',
        birthYear: 1995,
        bio: 'عاشق موسیقی کلاسیک و جاز | معلم موسیقی',
        isSample: true,
        onboardingCompleted: true,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maryam1',
      },
      {
        name: 'کیان راد',
        gender: 'male',
        city: 'رشت',
        birthYear: 1999,
        bio: 'خواننده | عاشق طبیعت و موسیقی محلی',
        isSample: true,
        onboardingCompleted: true,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kian1',
      },
    ]);
    console.log('✅ Sample characters seeded');
  }

  // Seed Feature Flags
  const flagRepo = dataSource.getRepository('FeatureFlag');
  const flagCount = await flagRepo.count();
  if (flagCount === 0) {
    await flagRepo.save([
      { key: 'affiliate_program', isEnabled: false, description: 'برنامه افیلیت (فاز دوم)' },
      { key: 'mini_games', isEnabled: false, description: 'بازی‌های مینی (فاز دوم)' },
      { key: 'ai_chat_assistant', isEnabled: false, description: 'دستیار هوشمند مکالمه (فاز دوم)' },
      { key: 'free_chat_for_all', isEnabled: false, description: 'چت آزاد برای همه کاربران' },
      { key: 'voice_rooms', isEnabled: false, description: 'روم‌های صوتی زنده (LiveKit)' },
      { key: 'story_feature', isEnabled: true, description: 'ویژگی استوری موزیک' },
    ]);
    console.log('✅ Feature flags seeded');
  }

  // Seed Room Plans
  const planRepo = dataSource.getRepository('RoomPlan');
  const planCount = await planRepo.count();
  if (planCount === 0) {
    await planRepo.save([
      {
        name: 'روم کوچک (تا ۵۰ نفر)',
        maxCapacity: 50,
        price: 500000, // 50,000 Toman = 500,000 Rials
        sku: 'room_plan_small',
        isActive: true,
      },
      {
        name: 'روم بزرگ (تا ۱۵۰ نفر)',
        maxCapacity: 150,
        price: 1200000, // 120,000 Toman = 1,200,000 Rials
        sku: 'room_plan_large',
        isActive: true,
      },
    ]);
    console.log('✅ Room plans seeded');
  }

  // Seed Sticker Types
  const stickerRepo = dataSource.getRepository('StickerType');
  const stickerCount = await stickerRepo.count();
  if (stickerCount === 0) {
    await stickerRepo.save([
      { name: 'گل', imageUrl: '🌸', isActive: true, isStarterPackItem: true, defaultStarterQuantity: 5 },
      { name: '❤️', imageUrl: '❤️', isActive: true, isStarterPackItem: true, defaultStarterQuantity: 5 },
      { name: '🔥', imageUrl: '🔥', isActive: true, isStarterPackItem: true, defaultStarterQuantity: 3 },
      { name: '🎵', imageUrl: '🎵', isActive: true, isStarterPackItem: true, defaultStarterQuantity: 3 },
      { name: '👍', imageUrl: '👍', isActive: true, isStarterPackItem: true, defaultStarterQuantity: 5 },
      { name: '😂', imageUrl: '😂', isActive: true, isStarterPackItem: false, defaultStarterQuantity: 0 },
      { name: '😍', imageUrl: '😍', isActive: true, isStarterPackItem: false, defaultStarterQuantity: 0 },
    ]);
    console.log('✅ Sticker types seeded');
  }

  // Seed Subscription SKU
  const subscriptionSku = process.env.VIP_SKU || 'hamahang_vip_monthly';
  console.log(`📋 VIP SKU configured: ${subscriptionSku}`);

  // Seed Songs
  const songRepo = dataSource.getRepository('Song');
  const songCount = await songRepo.count();
  if (songCount === 0) {
    const categories = await dataSource.getRepository('MusicCategory').find();
    const popCat = categories.find(c => c.nameFa === 'پاپ');
    const rockCat = categories.find(c => c.nameFa === 'راک');
    const electronicCat = categories.find(c => c.nameFa === 'الکترونیک');
    const classicCat = categories.find(c => c.nameFa === 'کلاسیک');
    const traditionalCat = categories.find(c => c.nameFa === 'سنتی ایرانی');
    const happyMood = categories.find(c => c.nameFa === 'شاد');
    const relaxMood = categories.find(c => c.nameFa === 'آرامش‌بخش');

    const songs = [
      { title: 'حال دلم', artistName: 'گروه هم‌آهنگ', categoryId: popCat?.id, durationSeconds: 210, coverUrl: 'https://picsum.photos/seed/song1/400/400', isActive: true, audioUrl: '' },
      { title: 'شب بارونی', artistName: 'علیرضا فلاح', categoryId: popCat?.id, durationSeconds: 195, coverUrl: 'https://picsum.photos/seed/song2/400/400', isActive: true, audioUrl: '' },
      { title: 'آتش و باد', artistName: 'گروه راک ایران', categoryId: rockCat?.id, durationSeconds: 245, coverUrl: 'https://picsum.photos/seed/song3/400/400', isActive: true, audioUrl: '' },
      { title: 'رقص نور', artistName: 'الکترو بند', categoryId: electronicCat?.id, durationSeconds: 280, coverUrl: 'https://picsum.photos/seed/song4/400/400', isActive: true, audioUrl: '' },
      { title: 'سونات مهتاب', artistName: 'ارکستر تهران', categoryId: classicCat?.id, durationSeconds: 360, coverUrl: 'https://picsum.photos/seed/song5/400/400', isActive: true, audioUrl: '' },
      { title: 'نوای دل', artistName: 'استاد شجریان', categoryId: traditionalCat?.id, durationSeconds: 320, coverUrl: 'https://picsum.photos/seed/song6/400/400', isActive: true, audioUrl: '' },
      { title: 'جشن', artistName: 'گروه شادمانه', categoryId: happyMood?.id, durationSeconds: 180, coverUrl: 'https://picsum.photos/seed/song7/400/400', isActive: true, audioUrl: '' },
      { title: 'آرامش', artistName: 'موسیقی بی کلام', categoryId: relaxMood?.id, durationSeconds: 300, coverUrl: 'https://picsum.photos/seed/song8/400/400', isActive: true, audioUrl: '' },
      { title: 'پرواز', artistName: 'حمید هیراد', categoryId: popCat?.id, durationSeconds: 225, coverUrl: 'https://picsum.photos/seed/song9/400/400', isActive: true, audioUrl: '' },
      { title: 'بی قرار', artistName: 'محسن یگانه', categoryId: popCat?.id, durationSeconds: 200, coverUrl: 'https://picsum.photos/seed/song10/400/400', isActive: true, audioUrl: '' },
      { title: 'ساحل', artistName: 'گروه ساحلی', categoryId: relaxMood?.id, durationSeconds: 240, coverUrl: 'https://picsum.photos/seed/song11/400/400', isActive: true, audioUrl: '' },
      { title: 'انرژی', artistName: 'فیتنس بند', categoryId: electronicCat?.id, durationSeconds: 195, coverUrl: 'https://picsum.photos/seed/song12/400/400', isActive: true, audioUrl: '' },
    ];

    for (const song of songs) {
      song.audioUrl = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${Math.floor(Math.random() * 16) + 1}.mp3`;
    }

    await songRepo.save(songs);
    console.log(`✅ ${songs.length} songs seeded`);
  }

  // Seed Rooms
  const roomRepo = dataSource.getRepository('Room');
  const roomCount = await roomRepo.count();
  if (roomCount === 0) {
    const categories = await dataSource.getRepository('MusicCategory').find();
    const songs = await songRepo.find();
    const sampleUsers = await dataSource.getRepository('User').find({ where: { isSample: true } });

    const rooms = [
      { title: 'شب پاپ', categoryId: categories.find(c => c.nameFa === 'پاپ')?.id, isLive: true, isPublic: true, listenerCount: 24, coverUrl: 'https://picsum.photos/seed/room1/400/200', currentSongId: null as string | null, ownerUserId: null as string | null },
      { title: 'آرامش و مدیتیشن', categoryId: categories.find(c => c.nameFa === 'آرامش‌بخش')?.id, isLive: true, isPublic: true, listenerCount: 18, coverUrl: 'https://picsum.photos/seed/room2/400/200', currentSongId: null, ownerUserId: null },
      { title: 'راک ایرانی', categoryId: categories.find(c => c.nameFa === 'راک')?.id, isLive: true, isPublic: true, listenerCount: 31, coverUrl: 'https://picsum.photos/seed/room3/400/200', currentSongId: null, ownerUserId: null },
      { title: 'موسیقی سنتی', categoryId: categories.find(c => c.nameFa === 'سنتی ایرانی')?.id, isLive: true, isPublic: true, listenerCount: 15, coverUrl: 'https://picsum.photos/seed/room4/400/200', currentSongId: null, ownerUserId: null },
      { title: 'انرژی مثبت', categoryId: categories.find(c => c.nameFa === 'شاد')?.id, isLive: true, isPublic: true, listenerCount: 42, coverUrl: 'https://picsum.photos/seed/room5/400/200', currentSongId: null, ownerUserId: null },
      { title: 'کافه کلاسیک', categoryId: categories.find(c => c.nameFa === 'کلاسیک')?.id, isLive: true, isPublic: true, listenerCount: 9, coverUrl: 'https://picsum.photos/seed/room6/400/200', currentSongId: null, ownerUserId: null },
    ];

    for (const room of rooms) {
      if (songs.length > 0) {
        room.currentSongId = songs[Math.floor(Math.random() * songs.length)].id;
      }
      if (sampleUsers.length > 0) {
        room.ownerUserId = sampleUsers[Math.floor(Math.random() * sampleUsers.length)].id;
      }
    }

    await roomRepo.save(rooms);
    console.log(`✅ ${rooms.length} rooms seeded`);
  }

  await dataSource.destroy();
  console.log('🎉 Seeding completed successfully!');
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
