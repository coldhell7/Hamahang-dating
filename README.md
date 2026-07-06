# هم‌آهنگ (Hamahang) — Music Social App

<div dir="rtl">

> **اپلیکیشن موزیک‌محور برای کشف افراد از طریق سلیقه موسیقی**  
> Native Android + NestJS Backend + Next.js Admin Panel

</div>

---

## 📋 فهرست مطالب

- [معرفی](#-معرفی)
- [ویژگی‌ها](#-ویژگی‌ها)
- [Tech Stack](#-tech-stack)
- [ساختار پروژه](#-ساختار-پروژه)
- [راه‌اندازی سریع (Local)](#-راه‌اندازی-سریع-local)
- [راه‌اندازی با Docker](#-راه‌اندازی-با-docker)
- [API Endpoints](#-api-endpoints)
- [پنل ادمین](#-پنل-ادمین)
- [اپ اندروید](#-اپ-اندروید)
- [ساختار دیتابیس](#-ساختار-دیتابیس)
- [دپلوی روی سرور](#-دپلوی-روی-سرور)
- [مسیر توسعه (فاز دوم)](#-مسیر-توسعه-فاز-دوم)

---

## 🎵 معرفی

**هم‌آهنگ** یک پلتفرم موسیقی اجتماعی است که به کاربران امکان می‌دهد:

- موسیقی مورد علاقه خود را در **روم‌های زنده** با دیگران گوش دهند
- بر اساس **سلیقه موسیقی** با دیگران ارتباط برقرار کنند
- پروفایل بسازند، **لایک** کنند و **مچ** شوند
- **استیکر** هدیه بدهند و پیام‌های سریع ارسال کنند
- با اشتراک **VIP** از چت آزاد و استوری موزیک استفاده کنند
- **روم اختصاصی** پولی با پلی‌لیست شخصی بسازند

> این پروژه برای بازار ایران طراحی شده و از **کافه بازار IAB** برای پرداخت درون برنامه‌ای، **کاوه نگار** برای پیامک OTP، و **آروان کلود** برای ذخیره‌سازی فایل استفاده می‌کند.

---

## ✨ ویژگی‌ها

### کاربران
| سطح | قابلیت‌ها |
|---|---|
| **مهمان (Guest)** | ورود بدون ثبت‌نام، گوش دادن به موسیقی در روم‌های عمومی |
| **رایگان (Free)** | استیکر رایگان اولیه، ارسال استیکر و پیام‌های آماده، لایک کردن |
| **VIP (پریمیوم)** | چت آزاد، استوری موزیک ۳۰ ثانیه‌ای، استیکر ماهانه، مشاهده همه لایک‌ها |

### قابلیت‌های اصلی
- ✅ Onboarding چندمرحله‌ای با انتخاب سبک/حس‌وحال موسیقی
- ✅ احراز هویت با OTP پیامکی (کد ۵ رقمی)
- ✅ روم‌های زنده گوش دادن مشترک با چت و استیکر
- ✅ سیستم لایک و مچ متقابل
- ✅ محدودیت پیام برای مردان غیرپریمیوم (enforce سمت سرور)
- ✅ کیف پول استیکر با خرید بسته
- ✅ استوری موزیک ۳۰ ثانیه‌ای (فقط VIP)
- ✅ روم اختصاصی پولی با پلن‌های قیمتی پویا
- ✅ روم اسپانسری (درخواست برندها)
- ✅ بلاک و ریپورت کاربر
- ✅ WebSocket برای چت زنده روم
- ✅ فیچر فلگ برای فعال/غیرفعال کردن ماژول‌ها

---

## 🛠 Tech Stack

| لایه | فناوری |
|---|---|
| **اپ اندروید** | Kotlin, Jetpack Compose, Material 3, MVVM, Hilt |
| **بک‌اند API** | NestJS, TypeScript, TypeORM, PostgreSQL |
| **پنل ادمین** | Next.js 14, Tailwind CSS, shadcn/ui |
| **دیتابیس** | PostgreSQL 16, Redis 7 |
| **WebSocket** | Socket.IO |
| **احراز هویت** | JWT (Access + Refresh Token) |
| **پیامک OTP** | Kavenegar (کاوه نگار) |
| **پرداخت درون برنامه‌ای** | Cafe Bazaar IAB (Poolakey) |
| **ذخیره‌سازی فایل** | S3-compatible (Arvan Cloud) |
| **Container** | Docker, Docker Compose |

---

## 📁 ساختار پروژه

```
hamahang/
├── backend/                    # NestJS API (97 فایل TypeScript)
│   ├── src/
│   │   ├── modules/            # 20 ماژول API
│   │   │   ├── auth/           # احراز هویت JWT + OTP
│   │   │   ├── users/          # کاربران
│   │   │   ├── rooms/          # روم‌ها
│   │   │   ├── songs/          # آهنگ‌ها
│   │   │   ├── categories/     # دسته‌بندی‌ها
│   │   │   ├── likes/          # لایک
│   │   │   ├── matches/        # مچ
│   │   │   ├── conversations/  # مکالمات
│   │   │   ├── messages/       # پیام‌ها (با محدودیت)
│   │   │   ├── stickers/       # استیکر
│   │   │   ├── vip/            # اشتراک پریمیوم
│   │   │   ├── blocks/         # بلاک
│   │   │   ├── reports/        # ریپورت
│   │   │   ├── admin/          # پنل ادمین API
│   │   │   ├── feature-flags/  # فیچر فلگ
│   │   │   ├── dashboard/      # داشبورد
│   │   │   ├── stories/        # استوری موزیک
│   │   │   ├── room-orders/    # سفارش روم
│   │   │   ├── sponsored-rooms/ # روم اسپانسری
│   │   │   ├── preset-messages/ # پیام‌های سریع
│   │   │   └── sample-characters/ # پروفایل نمونه
│   │   ├── websocket/          # Socket.IO Gateway
│   │   └── database/seeds/     # seed data
│   ├── Dockerfile
│   └── .env
│
├── admin/                      # Next.js Admin Panel (41 فایل React)
│   ├── src/
│   │   ├── app/(admin)/        # 16 صفحه مدیریت
│   │   ├── components/         # 20 کامپوننت UI
│   │   └── lib/                # Auth Context + API Client
│   └── Dockerfile
│
├── android/                    # Kotlin + Jetpack Compose (27 فایل)
│   ├── app/src/main/java/com/hamahang/
│   │   ├── ui/screens/         # 19 صفحه
│   │   ├── ui/theme/           # Material 3 تم
│   │   ├── data/api/           # Retrofit API
│   │   └── di/                 # Hilt DI
│   └── build.gradle.kts
│
├── docker/
│   ├── docker-compose.yml      # Production compose
│   ├── nginx.conf              # Nginx reverse proxy
│   └── env.production          # نمونه متغیرهای محیطی
│
├── deploy.sh                   # اسکریپت دپلوی
├── setup.sh                    # اسکریپت راه‌اندازی
└── start.sh                    # اسکریپت اجرای محلی
```

---

## 🚀 راه‌اندازی سریع (Local)

### پیش‌نیازها
- Node.js 20+
- PostgreSQL 16 (یا Docker)
- Redis 7 (یا Docker)
- Android Studio (برای اپ اندروید)

### 1️⃣ دیتابیس (PostgreSQL + Redis)

با Docker:
```bash
cd docker
docker compose up -d postgres redis
```

یا با Homebrew (macOS):
```bash
brew install postgresql@16 redis
brew services start postgresql@16 redis
createdb hamahang
psql -d postgres -c "CREATE ROLE hamahang WITH LOGIN PASSWORD 'hamahang_secret_1403' CREATEDB;"
psql -d postgres -c "ALTER DATABASE hamahang OWNER TO hamahang;"
```

### 2️⃣ بک‌اند (NestJS)
```bash
cd backend
cp .env .env.local   # ویرایش در صورت نیاز
npm install
npm run start:dev
```

### 3️⃣ سید دیتابیس
```bash
npx ts-node src/database/seeds/seed.ts
```

### 4️⃣ پنل ادمین
```bash
cd admin
cp .env.local .env.local   # ویرایش در صورت نیاز
npm install
npm run dev
```

### 5️⃣ اپ اندروید
فولدر `android/` را در Android Studio باز کنید و Run کنید.

---

## 🐳 راه‌اندازی با Docker

### بیلد و اجرای همه سرویس‌ها
```bash
cd docker
docker compose -p hamahang build
docker compose -p hamahang up -d
```

### لاگین
```bash
docker compose -p hamahang logs -f
```

###停止
```bash
docker compose -p hamahang down
```

### با Nginx Proxy
```bash
docker compose -p hamahang --profile with-proxy up -d
```

---

## 🌐 API Endpoints

### مستندات Swagger
```
http://localhost:3000/api/docs
```

### Endpoints اصلی

| Method | Endpoint | توضیح | Auth |
|--------|----------|-------|------|
| POST | `/api/auth/send-otp` | ارسال کد OTP | - |
| POST | `/api/auth/verify-otp` | تایید کد و ورود | - |
| POST | `/api/auth/refresh` | تجدید توکن | - |
| GET | `/api/auth/profile` | پروفایل کاربر | JWT |
| GET | `/api/users/profile` | پروفایل من | JWT |
| PUT | `/api/users/profile` | ویرایش پروفایل | JWT |
| GET | `/api/rooms` | لیست روم‌ها | - |
| POST | `/api/rooms` | ساخت روم | JWT |
| POST | `/api/rooms/:id/join` | ورود به روم | JWT |
| GET | `/api/rooms/:id/messages` | پیام‌های روم | JWT |
| GET | `/api/songs` | لیست آهنگ‌ها | - |
| GET | `/api/categories` | لیست دسته‌بندی‌ها | - |
| POST | `/api/likes/:userId` | لایک کاربر | JWT |
| GET | `/api/matches` | لیست مچ‌ها | JWT |
| POST | `/api/messages` | ارسال پیام | JWT* |
| POST | `/api/vip/subscribe` | اشتراک پریمیوم | JWT |
| GET | `/api/vip/status` | وضعیت اشتراک | JWT |
| POST | `/api/blocks/:userId` | بلاک کاربر | JWT |
| POST | `/api/reports` | ریپورت کاربر | JWT |
| GET | `/api/stickers/types` | انواع استیکر | JWT |
| POST | `/api/stickers/gift` | هدیه استیکر | JWT |
| GET | `/api/stickers/wallet` | کیف استیکر | JWT |
| POST | `/api/stories` | ایجاد استوری | JWT† |
| GET | `/api/room-orders/plans` | پلن‌های قیمتی | - |
| GET | `/api/feature-flags` | فیچر فلگ‌ها | - |
| GET | `/api/dashboard/stats` | آمار سیستم | - |
| GET | `/api/health` | سلامت سرویس | - |

> \* محدودیت: مردان غیرپریمیوم فقط ۱ پیام می‌توانند ارسال کنند  
> † فقط کاربران VIP می‌توانند استوری بسازند

### Admin Endpoints

| Method | Endpoint | توضیح |
|--------|----------|-------|
| POST | `/api/admin/login` | ورود ادمین |
| GET | `/api/admin/users` | لیست کاربران |
| GET | `/api/admin/rooms` | لیست روم‌ها |
| GET | `/api/admin/songs` | لیست آهنگ‌ها |
| GET | `/api/admin/categories` | لیست دسته‌بندی‌ها |
| GET | `/api/admin/subscriptions` | لیست اشتراک‌ها |
| GET | `/api/admin/stickers` | لیست استیکرها |
| GET | `/api/admin/reports` | لیست ریپورت‌ها |
| GET | `/api/admin/feature-flags` | فیچر فلگ‌ها |
| GET | `/api/admin/sample-characters` | پروفایل‌های نمونه |
| GET | `/api/admin/dashboard` | آمار داشبورد |
| GET | `/api/admin/admins` | لیست ادمین‌ها |

---

## 🔐 پنل ادمین

### ورود
آدرس: `http://localhost:3001`

| نقش | ایمیل | رمز عبور |
|---|---|---|
| **مدیر ارشد** | super@hamahang.app | admin@1403 |
| **مدیر محتوا** | content@hamahang.app | content@1403 |
| **پشتیبانی** | support@hamahang.app | support@1403 |

### صفحات مدیریت
1. **داشبورد** — آمار کلی کاربران، روم‌ها، آهنگ‌ها
2. **کاربران** — لیست، جستجو، مسدودسازی
3. **روم‌ها** — مدیریت روم‌های فعال
4. **آهنگ‌ها** — کاتالوگ آهنگ‌ها
5. **دسته‌بندی‌ها** — ژانر، حس‌وحال، هنرمند
6. **اشتراک‌ها** — مدیریت VIP
7. **استیکرها** — انواع و بسته‌ها
8. **گزارش‌ها** — صف بررسی (Moderation)
9. **فیچر فلگ‌ها** — فعال/غیرفعال ماژول‌ها
10. **پروفایل نمونه** — پروفایل‌های فیک
11. **قیمت‌گذاری روم** — پلن‌های قیمتی
12. **روم اسپانسری** — درخواست‌های برندها
13. **ادمین‌ها** — مدیران سیستم
14. **تنظیمات** — تنظیمات عمومی

> پنل ادمین کاملاً **RTL** و با فونت **وزیرمتن** طراحی شده است.

---

## 📱 اپ اندروید

### صفحات
| صفحه | توضیح |
|------|-------|
| Splash | لوگو و انیمیشن ورود |
| Genre Selection | انتخاب سبک موسیقی (چیپ) |
| Mood Selection | انتخاب حس‌وحال (چیپ) |
| Profile Setup | نام، جنسیت، شهر، سال تولد |
| OTP Login | ورود با شماره موبایل |
| OTP Verify | تایید کد ۵ رقمی |
| Home | روم‌های زنده + دسته‌بندی‌ها |
| Explore | کاوش روم‌ها با فیلتر |
| Room Detail | پخش موسیقی + چت + استیکر |
| Search | جستجوی روم/آهنگ/کاربر |
| Discover | کشف کاربران (Swipe) |
| Likes | لایک‌های دریافتی/ارسالی |
| Matches | مچ‌ها |
| Chat | پیام خصوصی |
| Premium | خرید اشتراک VIP |
| Sticker Wallet | کیف استیکر |
| Create Room | ساخت روم اختصاصی |
| Profile | پروفایل کاربری |
| Settings | تنظیمات و خروج |

### معماری
- **MVVM** + **Clean Architecture**
- **Hilt** برای Dependency Injection
- **Kotlin Flow** + **Coroutines**
- **Retrofit** + **OkHttp** برای شبکه
- **Room** برای کش محلی
- **DataStore** برای توکن و تنظیمات
- **Media3 ExoPlayer** برای پخش موسیقی
- **Coil** برای لود تصاویر

---

## 💾 ساختار دیتابیس

پروژه شامل **۲۸ جدول** اصلی است:

```
User, MusicCategory, UserCategoryPreference, Song, Room, RoomMember,
RoomMessage, Like, Match, Conversation, Message, MessageQuota,
Block, Report, OtpRequest, Subscription, StickerType, UserStickerWallet,
StickerGiftTransaction, StickerPackProduct, StickerPackPurchase,
PresetMessage, PresetMessageSendLog, ProfileStory, RoomPlan, RoomOrder,
SponsoredRoomRequest, FeatureFlag, AdminUser
```

> جداول با `synchronize: true` در محیط توسعه به صورت خودکار ساخته می‌شوند.  
> در محیط production از migration استفاده کنید.

---

## 🚢 دپلوی روی سرور

### پیش‌نیاز سرور
- Docker & Docker Compose
- حداقل ۲GB RAM
- ۱۰GB فضای ذخیره‌سازی

### مراحل دپلوی

```bash
# 1. نصب وابستگی‌ها روی سرور
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 2. انتقال پروژه
rsync -avz --exclude 'node_modules' --exclude '.next' \
  ./hamahang user@server:~/hamahang

# 3. تنظیم متغیرهای محیطی
cd ~/hamahang/docker
cp env.production .env
nano .env   # ویرایش با مقادیر واقعی

# 4. بیلد و اجرا
cd ~/hamahang
chmod +x deploy.sh
./deploy.sh production
```

### متغیرهای محیطی ضروری
| متغیر | توضیح |
|-------|-------|
| `DB_PASSWORD` | رمز دیتابیس PostgreSQL |
| `JWT_SECRET` | کلید رمزنگاری JWT |
| `JWT_REFRESH_SECRET` | کلید رمزنگاری Refresh Token |
| `KAVENEGAR_API_KEY` | API Key کاوه نگار |
| `FRONTEND_URL` | آدرس پنل ادمین (برای CORS) |
| `API_URL` | آدرس API برای پنل ادمین |

### معماری دپلوی (Docker)
```
Internet
    │
    ▼
Nginx (80/443) — reverse proxy
    │
    ├── /api/* → Backend (port 3000)
    ├── /ws    → Backend WebSocket
    └── /*     → Admin Panel (port 3001)
```

---

## 🗺 مسیر توسعه (فاز دوم)

قابلیت‌های زیر برای فاز دوم برنامه‌ریزی شده و معماری پروژه از ابتدا برای اضافه شدن آن‌ها آماده است:

- [ ] **برنامه افیلیت** — دعوت دوستان و دریافت پاداش
- [ ] **بازی‌های مینی** — بازی‌های داخل روم
- [ ] **دستیار هوشمند مکالمه** — پیشنهاد پیام با AI
- [ ] **روم‌های صوتی زنده** — LiveKit یا Agora SDK
- [ ] **سیستم Recommendation** — پیشنهاد هوشمند آهنگ و کاربر
- [ ] **Moderation خودکار** — تشخیص محتوای نامناسب

> فیچر فلگ‌های مربوط به فاز دوم (`affiliate_program`, `mini_games`, `ai_chat_assistant`, `voice_rooms`) از قبل در دیتابیس سید شده‌اند و با تغییر یک flag در پنل ادمین فعال می‌شوند.

---

## 📝 نکات توسعه

### OTP تست
در محیط توسعه (`NODE_ENV=development`)، کد OTP همیشه `12345` است.

### احراز هویت ادمین
برای تست لاگین ادمین:
- **ایمیل:** `super@hamahang.app`
- **رمز:** `admin@1403`

### API Health
```
GET /api/health
→ { "status": "ok", "timestamp": "...", "service": "hamahang-api", "version": "1.0.0" }
```

### سید دیتابیس
داده‌های پیش‌فرض شامل:
- ۳ مدیر سیستم
- ۲۰ دسته‌بندی موسیقی (ژانر، حس‌وحال، هنرمند)
- ۶ پروفایل نمونه (۳ زن، ۳ مرد)
- ۶ فیچر فلگ
- ۲ پلن قیمتی روم
- ۷ نوع استیکر
- ۱۲ آهنگ نمونه
- ۶ روم زنده

---

## 📄 لایسنس

این پروژه برای استفاده تجاری در بازار ایران طراحی شده است.

---

## 👥 تیم توسعه

- **امیرحسین ثقل الاسلامی** — Product Manager & Developer

---

<div dir="rtl">

> **هم‌آهنگ** — موسیقی، سلیقه‌ها، ارتباطات 🎵

</div>
