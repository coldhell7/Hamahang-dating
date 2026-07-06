"use client"

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PageSkeleton } from "@/components/loading-skeleton";
import { ErrorState } from "@/components/error-state";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Search, Plus, Pencil, Trash2, Ban, CheckCircle, Phone, Mail,
} from "lucide-react";

interface User {
  id: string;
  phone: string;
  email?: string;
  name?: string;
  username?: string;
  avatar?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  roomsCount?: number;
  subscription?: { plan: string };
}

export default function UsersPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      const data = await api.get(`/admin/users?search=${search}`);
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [token, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleActive = async (user: User) => {
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      await api.put(`/admin/users/${user.id}`, { isActive: !user.isActive });
      toast({ title: "موفق", description: `وضعیت کاربر ${user.phone} تغییر کرد`, variant: "success" });
      fetchUsers();
    } catch {
      toast({ title: "خطا", description: "خطا در تغییر وضعیت کاربر", variant: "destructive" });
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditEmail(user.email || "");
    setEditName(user.name || "");
    setEditDialog(true);
  };

  const saveEdit = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      await api.put(`/admin/users/${selectedUser.id}`, { email: editEmail, name: editName });
      toast({ title: "موفق", description: "اطلاعات کاربر به‌روزرسانی شد", variant: "success" });
      setEditDialog(false);
      fetchUsers();
    } catch {
      toast({ title: "خطا", description: "خطا در به‌روزرسانی کاربر", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      await api.del(`/admin/users/${selectedUser.id}`);
      toast({ title: "موفق", description: "کاربر حذف شد", variant: "success" });
      setDeleteDialog(false);
      fetchUsers();
    } catch {
      toast({ title: "خطا", description: "خطا در حذف کاربر", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState onRetry={fetchUsers} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت کاربران</h1>
          <p className="text-muted-foreground">مدیریت و نظارت بر کاربران پلتفرم</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="جستجوی کاربر..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 w-64"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>شماره تماس</TableHead>
              <TableHead>نام</TableHead>
              <TableHead>ایمیل</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>اشتراک</TableHead>
              <TableHead>تاریخ ثبت‌نام</TableHead>
              <TableHead className="text-left">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  کاربری یافت نشد
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium" dir="ltr">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {user.phone}
                    </span>
                  </TableCell>
                  <TableCell>{user.name || user.username || "—"}</TableCell>
                  <TableCell>
                    {user.email ? (
                      <span className="flex items-center gap-1" dir="ltr">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Badge variant={user.isActive ? "success" : "destructive"}>
                        {user.isActive ? "فعال" : "غیرفعال"}
                      </Badge>
                      {user.isVerified && (
                        <Badge variant="success">تأیید شده</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.subscription ? "default" : "secondary"}>
                      {user.subscription?.plan || "ندارد"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => toggleActive(user)} title={user.isActive ? "غیرفعال کردن" : "فعال کردن"}>
                        {user.isActive ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(user)} title="ویرایش">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedUser(user); setDeleteDialog(true); }} title="حذف">
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

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ویرایش کاربر</DialogTitle>
            <DialogDescription>ویرایش اطلاعات کاربر {selectedUser?.phone}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>نام</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>ایمیل</Label>
              <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} dir="ltr" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>انصراف</Button>
            <Button onClick={saveEdit} disabled={saving}>{saving ? "در حال ذخیره..." : "ذخیره"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="حذف کاربر"
        description={`آیا از حذف کاربر ${selectedUser?.phone} اطمینان دارید؟ این عمل قابل بازگشت نیست.`}
        onConfirm={handleDelete}
        confirmText="حذف کاربر"
        loading={saving}
      />
    </div>
  );
}
