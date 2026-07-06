"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">تنظیمات عمومی سیستم</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>تنظیمات OTP</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>مدت اعتبار کد (دقیقه)</Label>
                <Input type="number" defaultValue={5} />
              </div>
              <div className="space-y-2">
                <Label>حداکثر تلاش مجاز</Label>
                <Input type="number" defaultValue={5} />
              </div>
              <div className="space-y-2">
                <Label>فاصله ارسال مجدد (ثانیه)</Label>
                <Input type="number" defaultValue={90} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>تنظیمات استیکر</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>تعداد استیکر شروع (رایگان)</Label>
                <Input type="number" defaultValue={20} />
              </div>
              <div className="space-y-2">
                <Label>استیکر ماهانه VIP</Label>
                <Input type="number" defaultValue={50} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>سایر تنظیمات</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>حداکثر پیام‌های سریع</Label>
                <Input type="number" defaultValue={5} />
              </div>
              <div className="space-y-2">
                <Label>SKU اشتراک VIP</Label>
                <Input defaultValue="hamahang_vip_monthly" />
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>حالت نگهداری (Maintenance)</Label>
                <p className="text-sm text-muted-foreground">در این حالت کاربران نمی‌توانند وارد اپ شوند</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="gap-2">
            <Save className="h-4 w-4" /> ذخیره تنظیمات
          </Button>
        </div>
      </div>
    </div>
  );
}
