"use client"

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PageSkeleton } from "@/components/loading-skeleton";
import { ErrorState } from "@/components/error-state";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { CreditCard, Pencil, Trash2, Plus, CheckCircle, XCircle } from "lucide-react";

interface Subscription {
  id: string;
  userId: string;
  user?: { phone: string; name?: string };
  plan: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  price: number;
  autoRenew: boolean;
  createdAt: string;
}

export default function SubscriptionsPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [formPlan, setFormPlan] = useState("");
  const [formPrice, setFormPrice] = useState("0");
  const [formEndDate, setFormEndDate] = useState("");
  const [formAutoRenew, setFormAutoRenew] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      const data = await api.get("/admin/subscriptions");
      setSubscriptions(Array.isArray(data) ? data : data.subscriptions || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchSubscriptions(); }, [fetchSubscriptions]);

  const toggleActive = async (sub: Subscription) => {
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      await api.put(`/admin/subscriptions/${sub.id}`, { isActive: !sub.isActive });
      toast({ title: "موفق", description: "وضعیت اشتراک تغییر کرد", variant: "success" });
      fetchSubscriptions();
    } catch {
      toast({ title: "خطا", description: "خطا در تغییر وضعیت", variant: "destructive" });
    }
  };

  const handleEdit = (sub: Subscription) => {
    setSelectedSub(sub);
    setFormPlan(sub.plan);
    setFormPrice(String(sub.price));
    setFormEndDate(sub.endDate?.split("T")[0] || "");
    setFormAutoRenew(sub.autoRenew);
    setEditDialog(true);
  };

  const saveSub = async () => {
    setSaving(true);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      const payload = { plan: formPlan, price: parseInt(formPrice) || 0, endDate: formEndDate, autoRenew: formAutoRenew };
      if (selectedSub) {
        await api.put(`/admin/subscriptions/${selectedSub.id}`, payload);
        toast({ title: "موفق", description: "اشتراک به‌روزرسانی شد", variant: "success" });
        setEditDialog(false);
      }
      fetchSubscriptions();
    } catch {
      toast({ title: "خطا", description: "خطا در ذخیره اشتراک", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selectedSub) return;
    setSaving(true);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      await api.del(`/admin/subscriptions/${selectedSub.id}`);
      toast({ title: "موفق", description: "اشتراک حذف شد", variant: "success" });
      setDeleteDialog(false);
      fetchSubscriptions();
    } catch {
      toast({ title: "خطا", description: "خطا در حذف اشتراک", variant: "destructive" });
    } finally { setSaving(false); }
  };

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState onRetry={fetchSubscriptions} />;

  const planColors: Record<string, "default" | "secondary" | "success" | "warning"> = {
    basic: "secondary",
    premium: "default",
    vip: "success",
    gold: "warning",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت اشتراک‌ها</h1>
          <p className="text-muted-foreground">مدیریت اشتراک‌های کاربران</p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>کاربر</TableHead>
              <TableHead>پلن</TableHead>
              <TableHead>قیمت</TableHead>
              <TableHead>تاریخ شروع</TableHead>
              <TableHead>تاریخ پایان</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>تمدید خودکار</TableHead>
              <TableHead className="text-left">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  اشتراکی یافت نشد
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>{sub.user?.name || sub.user?.phone || sub.userId}</TableCell>
                  <TableCell>
                    <Badge variant={planColors[sub.plan] || "default"}>{sub.plan}</Badge>
                  </TableCell>
                  <TableCell dir="ltr">{sub.price.toLocaleString()} تومان</TableCell>
                  <TableCell className="text-sm">{new Date(sub.startDate).toLocaleDateString("fa-IR")}</TableCell>
                  <TableCell className="text-sm">{new Date(sub.endDate).toLocaleDateString("fa-IR")}</TableCell>
                  <TableCell>
                    <Badge variant={sub.isActive ? "success" : "destructive"}>
                      {sub.isActive ? "فعال" : "غیرفعال"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {sub.autoRenew ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => toggleActive(sub)} title="تغییر وضعیت">
                        {sub.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(sub)} title="ویرایش">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedSub(sub); setDeleteDialog(true); }} title="حذف">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ویرایش اشتراک</DialogTitle>
            <DialogDescription>ویرایش اشتراک کاربر</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>پلن</Label>
              <Input value={formPlan} onChange={(e) => setFormPlan(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>قیمت (تومان)</Label>
              <Input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>تاریخ پایان</Label>
              <Input type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>انصراف</Button>
            <Button onClick={saveSub} disabled={saving}>{saving ? "در حال ذخیره..." : "ذخیره"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="حذف اشتراک"
        description="آیا از حذف این اشتراک اطمینان دارید؟"
        onConfirm={handleDelete}
        confirmText="حذف اشتراک"
        loading={saving}
      />
    </div>
  );
}
