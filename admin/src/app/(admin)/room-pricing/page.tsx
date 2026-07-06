"use client";

import { useState, useEffect } from 'react';
import { useAuth, apiClient } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function RoomPricingPage() {
  const { token } = useAuth();
  const [api] = useState(() => apiClient(token));
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/room-orders/plans').then(setPlans).finally(() => setLoading(false));
  }, []);

  const formatPrice = (price: number) => {
    return (price / 10).toLocaleString('fa-IR') + ' تومان';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">قیمت‌گذاری روم اختصاصی</h1>
        <Button><Plus className="ml-2 h-4 w-4" /> افزودن پلن جدید</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>پلن‌های قیمتی روم</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-48" /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام پلن</TableHead>
                  <TableHead>ظرفیت</TableHead>
                  <TableHead>قیمت</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan: any) => (
                  <TableRow key={plan.id}>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>{plan.maxCapacity} نفر</TableCell>
                    <TableCell>{formatPrice(plan.price)}</TableCell>
                    <TableCell>
                      <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                        {plan.isActive ? 'فعال' : 'غیرفعال'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon"><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                      </div>
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
