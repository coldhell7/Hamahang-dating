"use client";

import { useState, useEffect } from 'react';
import { useAuth, apiClient } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export default function SponsoredRoomsPage() {
  const { token } = useAuth();
  const [api] = useState(() => apiClient(token));
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/sponsored-rooms/requests').then(setRequests).finally(() => setLoading(false));
  }, []);

  const statusColors: Record<string, string> = {
    new: 'default',
    in_negotiation: 'secondary',
    approved: 'success',
    rejected: 'destructive',
  };

  const statusLabels: Record<string, string> = {
    new: 'جدید',
    in_negotiation: 'در حال مذاکره',
    approved: 'تایید شده',
    rejected: 'رد شده',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">درخواست‌های روم اسپانسری</h1>
      <Card>
        <CardHeader><CardTitle>لیست درخواست‌ها</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-48" /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>برند</TableHead>
                  <TableHead>هدف</TableHead>
                  <TableHead>تاریخ</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req: any) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.brandName}</TableCell>
                    <TableCell className="max-w-xs truncate">{req.goalDescription}</TableCell>
                    <TableCell>{req.preferredDate || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[req.status] as any}>
                        {statusLabels[req.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">بررسی</Button>
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
