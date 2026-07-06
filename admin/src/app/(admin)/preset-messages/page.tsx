"use client";

import { useState, useEffect } from 'react';
import { useAuth, apiClient } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Music, Radio, TrendingUp, DollarSign, Activity } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function PresetMessagesPage() {
  const { token } = useAuth();
  const [api] = useState(() => apiClient(token));
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/preset-messages').then(setMessages).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">مدیریت پیام‌های سریع</h1>
      <Card>
        <CardHeader><CardTitle>تنظیمات پیام‌های از پیش تعیین‌شده</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-32" /> : (
            <p className="text-muted-foreground">حداکثر تعداد پیام‌های سریع برای هر کاربر: ۵</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
