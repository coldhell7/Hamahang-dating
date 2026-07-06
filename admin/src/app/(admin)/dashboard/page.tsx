"use client"

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardGridSkeleton } from "@/components/loading-skeleton";
import { ErrorState } from "@/components/error-state";
import {
  Users,
  Music2,
  Music,
  CreditCard,
  TrendingUp,
  DollarSign,
  Activity,
  AlertTriangle,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalRooms: number;
  totalSongs: number;
  totalSubscriptions: number;
  activeRooms: number;
  revenue: number;
  newUsersToday: number;
  pendingReports: number;
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    setError(false);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      const data = await api.get("/admin/dashboard");
      setStats(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  if (loading) return <CardGridSkeleton count={8} />;
  if (error) return <ErrorState onRetry={fetchStats} />;

  const statCards = [
    { title: "کاربران کل", value: stats?.totalUsers ?? 0, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "کاربران جدید امروز", value: stats?.newUsersToday ?? 0, icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
    { title: "اتاق‌های فعال", value: stats?.activeRooms ?? 0, icon: Activity, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "کل اتاق‌ها", value: stats?.totalRooms ?? 0, icon: Music2, color: "text-indigo-600", bg: "bg-indigo-100" },
    { title: "آهنگ‌ها", value: stats?.totalSongs ?? 0, icon: Music, color: "text-pink-600", bg: "bg-pink-100" },
    { title: "اشتراک‌ها", value: stats?.totalSubscriptions ?? 0, icon: CreditCard, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "درآمد", value: `${(stats?.revenue ?? 0).toLocaleString()} تومان`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "گزارشات", value: stats?.pendingReports ?? 0, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">داشبورد</h1>
        <p className="text-muted-foreground">خلاصه آمار و اطلاعات پلتفرم هم‌آهنگ</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`rounded-lg ${card.bg} p-2`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
