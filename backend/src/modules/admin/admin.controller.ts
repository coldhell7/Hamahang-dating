import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { AdminUser, AdminRole } from './admin-user.entity';
import { User } from '../users/user.entity';
import { Song } from '../songs/song.entity';
import { Room } from '../rooms/room.entity';
import { MusicCategory } from '../categories/category.entity';
import { FeatureFlag } from '../feature-flags/feature-flag.entity';
import { StickerType } from '../stickers/sticker-type.entity';
import { Subscription } from '../vip/subscription.entity';
import { Report, ReportStatus } from '../reports/report.entity';
import { AdminService } from './admin.service';

@ApiTags('پنل ادمین (Admin)')
@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Song) private songRepo: Repository<Song>,
    @InjectRepository(Room) private roomRepo: Repository<Room>,
    @InjectRepository(MusicCategory) private catRepo: Repository<MusicCategory>,
    @InjectRepository(FeatureFlag) private flagRepo: Repository<FeatureFlag>,
    @InjectRepository(StickerType) private stickerRepo: Repository<StickerType>,
    @InjectRepository(Subscription) private subRepo: Repository<Subscription>,
    @InjectRepository(Report) private reportRepo: Repository<Report>,
  ) {}

  // ---- AUTH ----
  @Post('login')
  @ApiOperation({ summary: 'ورود ادمین' })
  async login(@Body() body: { email: string; password: string }) {
    return this.adminService.login(body.email, body.password);
  }

  // ---- ADMINS ----
  @Get('admins')
  @ApiOperation({ summary: 'لیست ادمین‌ها' })
  async getAdmins() { return this.adminService.getAllAdmins(); }

  @Post('register')
  @ApiOperation({ summary: 'ثبت ادمین جدید' })
  async register(@Body() body: any) {
    return this.adminService.createAdmin(body);
  }

  // ---- USERS ----
  @Get('users')
  @ApiOperation({ summary: 'لیست کاربران' })
  async getUsers(@Query('search') search?: string) {
    if (search) {
      return this.userRepo.find({ where: { name: Like(`%${search}%`) }, order: { createdAt: 'DESC' }, take: 50 });
    }
    return this.adminService.getAllUsers();
  }

  @Put('users/:id')
  @ApiOperation({ summary: 'ویرایش کاربر' })
  async updateUser(@Param('id') id: string, @Body() body: any) {
    await this.userRepo.update(id, body);
    return this.userRepo.findOne({ where: { id } });
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'حذف کاربر' })
  async deleteUser(@Param('id') id: string) {
    await this.userRepo.delete(id);
    return { message: 'کاربر حذف شد' };
  }

  @Post('users/:id/:action')
  @ApiOperation({ summary: 'تعلیق/بن/فعال‌سازی کاربر' })
  async manageUser(@Param('id') id: string, @Param('action') action: string) {
    return this.adminService.manageUser(id, action);
  }

  // ---- ROOMS ----
  @Get('rooms')
  @ApiOperation({ summary: 'لیست روم‌ها' })
  async getRooms(@Query('search') search?: string) {
    const where: any = {};
    if (search) where.title = Like(`%${search}%`);
    return this.roomRepo.find({ where, order: { createdAt: 'DESC' }, take: 50 });
  }

  @Put('rooms/:id')
  @ApiOperation({ summary: 'ویرایش روم' })
  async updateRoom(@Param('id') id: string, @Body() body: any) {
    await this.roomRepo.update(id, body);
    return this.roomRepo.findOne({ where: { id } });
  }

  @Delete('rooms/:id')
  @ApiOperation({ summary: 'حذف روم' })
  async deleteRoom(@Param('id') id: string) {
    await this.roomRepo.delete(id);
    return { message: 'روم حذف شد' };
  }

  // ---- SONGS ----
  @Get('songs')
  @ApiOperation({ summary: 'لیست آهنگ‌ها' })
  async getSongs(@Query('search') search?: string) {
    const where: any[] = [{ isActive: true }];
    if (search) {
      where[0] = [
        { title: Like(`%${search}%`), isActive: true },
        { artistName: Like(`%${search}%`), isActive: true },
      ];
    }
    const songs = await this.songRepo.find({ where, order: { createdAt: 'DESC' }, take: 100, relations: ['category'] });
    return songs;
  }

  @Post('songs')
  @ApiOperation({ summary: 'ایجاد آهنگ جدید' })
  async createSong(@Body() body: any) {
    const song = this.songRepo.create(body);
    return this.songRepo.save(song);
  }

  @Put('songs/:id')
  @ApiOperation({ summary: 'ویرایش آهنگ' })
  async updateSong(@Param('id') id: string, @Body() body: any) {
    await this.songRepo.update(id, body);
    return this.songRepo.findOne({ where: { id } });
  }

  @Delete('songs/:id')
  @ApiOperation({ summary: 'حذف آهنگ' })
  async deleteSong(@Param('id') id: string) {
    await this.songRepo.delete(id);
    return { message: 'آهنگ حذف شد' };
  }

  // ---- CATEGORIES ----
  @Get('categories')
  @ApiOperation({ summary: 'لیست دسته‌بندی‌ها (full)' })
  async getCategories(@Query('search') search?: string) {
    const where: any = {};
    if (search) where.nameFa = Like(`%${search}%`);
    return this.catRepo.find({ where, order: { type: 'ASC', nameFa: 'ASC' } });
  }

  @Post('categories')
  @ApiOperation({ summary: 'ایجاد دسته‌بندی' })
  async createCategory(@Body() body: any) {
    const cat = this.catRepo.create(body);
    return this.catRepo.save(cat);
  }

  @Put('categories/:id')
  @ApiOperation({ summary: 'ویرایش دسته‌بندی' })
  async updateCategory(@Param('id') id: string, @Body() body: any) {
    await this.catRepo.update(id, body);
    return this.catRepo.findOne({ where: { id } });
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'حذف دسته‌بندی' })
  async deleteCategory(@Param('id') id: string) {
    await this.catRepo.delete(id);
    return { message: 'دسته‌بندی حذف شد' };
  }

  // ---- FEATURE FLAGS ----
  @Get('feature-flags')
  @ApiOperation({ summary: 'لیست فیچر فلگ‌ها' })
  async getFeatureFlags() { return this.flagRepo.find(); }

  @Post('feature-flags')
  @ApiOperation({ summary: 'ایجاد فیچر فلگ' })
  async createFeatureFlag(@Body() body: any) {
    const flag = this.flagRepo.create(body);
    return this.flagRepo.save(flag);
  }

  @Put('feature-flags/:id')
  @ApiOperation({ summary: 'ویرایش فیچر فلگ' })
  async updateFeatureFlag(@Param('id') id: string, @Body() body: any) {
    await this.flagRepo.update(id, body);
    return this.flagRepo.findOne({ where: { id } });
  }

  @Delete('feature-flags/:id')
  @ApiOperation({ summary: 'حذف فیچر فلگ' })
  async deleteFeatureFlag(@Param('id') id: string) {
    await this.flagRepo.delete(id);
    return { message: 'حذف شد' };
  }

  // ---- DASHBOARD ----
  @Get('dashboard')
  @ApiOperation({ summary: 'آمار داشبورد' })
  async getDashboard() {
    const [totalUsers, totalRooms, totalSongs, activeSubscriptions, liveRooms, pendingReports] = await Promise.all([
      this.userRepo.count(),
      this.roomRepo.count(),
      this.songRepo.count({ where: { isActive: true } }),
      this.subRepo.count({ where: { status: 'active' as any } }),
      this.roomRepo.count({ where: { isLive: true } }),
      this.reportRepo.count({ where: { status: ReportStatus.PENDING } }),
    ]);
    return { totalUsers, totalRooms, totalSongs, activeSubscriptions, liveRooms, pendingReports, revenue: 0 };
  }

  // ---- SUBSCRIPTIONS ----
  @Get('subscriptions')
  @ApiOperation({ summary: 'لیست اشتراک‌ها' })
  async getSubscriptions() {
    return this.subRepo.find({ relations: ['user'], order: { purchasedAt: 'DESC' }, take: 50 });
  }

  @Put('subscriptions/:id')
  @ApiOperation({ summary: 'ویرایش اشتراک' })
  async updateSubscription(@Param('id') id: string, @Body() body: any) {
    await this.subRepo.update(id, body);
    return this.subRepo.findOne({ where: { id } });
  }

  @Delete('subscriptions/:id')
  @ApiOperation({ summary: 'حذف اشتراک' })
  async deleteSubscription(@Param('id') id: string) {
    await this.subRepo.delete(id);
    return { message: 'اشتراک حذف شد' };
  }

  // ---- REPORTS (Moderation) ----
  @Get('reports')
  @ApiOperation({ summary: 'لیست گزارش‌ها' })
  async getReports(@Query('status') status?: string) {
    const where: any = {};
    if (status && status !== 'all') where.status = status;
    return this.reportRepo.find({ where, relations: ['reporter', 'reported'], order: { createdAt: 'DESC' }, take: 50 });
  }

  @Put('reports/:id')
  @ApiOperation({ summary: 'بروزرسانی وضعیت گزارش' })
  async updateReport(@Param('id') id: string, @Body() body: any) {
    await this.reportRepo.update(id, { ...body, reviewedAt: body.status === 'reviewed' ? new Date() : undefined });
    return this.reportRepo.findOne({ where: { id } });
  }

  // ---- STICKERS ----
  @Get('stickers')
  @ApiOperation({ summary: 'لیست استیکرها' })
  async getStickers(@Query('search') search?: string) {
    const where: any = {};
    if (search) where.name = Like(`%${search}%`);
    return this.stickerRepo.find({ where, order: { name: 'ASC' } });
  }

  @Post('stickers')
  @ApiOperation({ summary: 'ایجاد استیکر' })
  async createSticker(@Body() body: any) {
    const s = this.stickerRepo.create(body);
    return this.stickerRepo.save(s);
  }

  @Put('stickers/:id')
  @ApiOperation({ summary: 'ویرایش استیکر' })
  async updateSticker(@Param('id') id: string, @Body() body: any) {
    await this.stickerRepo.update(id, body);
    return this.stickerRepo.findOne({ where: { id } });
  }

  @Delete('stickers/:id')
  @ApiOperation({ summary: 'حذف استیکر' })
  async deleteSticker(@Param('id') id: string) {
    await this.stickerRepo.delete(id);
    return { message: 'استیکر حذف شد' };
  }

  // ---- SAMPLE CHARACTERS ----
  @Get('sample-characters')
  @ApiOperation({ summary: 'لیست پروفایل‌های نمونه' })
  async getSampleCharacters(@Query('search') search?: string) {
    const where: any = { isSample: true };
    if (search) where.name = Like(`%${search}%`);
    return this.userRepo.find({ where, order: { name: 'ASC' } });
  }

  @Post('sample-characters')
  @ApiOperation({ summary: 'ایجاد پروفایل نمونه' })
  async createSampleCharacter(@Body() body: any) {
    const user = this.userRepo.create({ ...body, isSample: true, onboardingCompleted: true });
    return this.userRepo.save(user);
  }

  @Put('sample-characters/:id')
  @ApiOperation({ summary: 'ویرایش پروفایل نمونه' })
  async updateSampleCharacter(@Param('id') id: string, @Body() body: any) {
    await this.userRepo.update(id, body);
    return this.userRepo.findOne({ where: { id } });
  }

  @Delete('sample-characters/:id')
  @ApiOperation({ summary: 'حذف پروفایل نمونه' })
  async deleteSampleCharacter(@Param('id') id: string) {
    await this.userRepo.delete(id);
    return { message: 'پروفایل نمونه حذف شد' };
  }
}
