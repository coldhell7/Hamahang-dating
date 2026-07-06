"use client";

import { useState, useEffect } from 'react';
import { useAuth, apiClient } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Shield, ShieldOff } from 'lucide-react';

export default function AdminsPage() {
  const { token, admin } = useAuth();
  const [api] = useState(() => apiClient(token));
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/admins').then(setAdmins).finally(() => setLoading(false));
  }, []);

  const roleLabels: Record<string, string> = {
    super_admin: 'مدیر ارشد',
    content_manager: 'مدیر محتوا',
    support: 'پشتیبانی',
  };

  const roleColors: Record<string, string> = {
    super_admin: 'destructive',
    content_manager: 'default',
    support: 'secondary',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت ادمین‌ها</h1>
        <Button>افزودن ادمین جدید</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>لیست مدیران سیستم</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-48" /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام</TableHead>
                  <TableHead>ایمیل</TableHead>
                  <TableHead>نقش</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((a: any) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.name || '-'}</TableCell>
                    <TableCell>{a.email}</TableCell>
                    <TableCell>
                      <Badge variant={roleColors[a.role] as any}>
                        {roleLabels[a.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {a.isActive ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <Shield className="h-4 w-4" /> فعال
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1">
                          <ShieldOff className="h-4 w-4" /> غیرفعال
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">ویرایش</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
