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
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PageSkeleton } from "@/components/loading-skeleton";
import { ErrorState } from "@/components/error-state";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Pencil, Trash2, Lock, Unlock, Users, Eye } from "lucide-react";

interface Room {
  id: string;
  title: string;
  description?: string;
  creatorId: string;
  creator?: { phone: string; name?: string };
  categoryId?: string;
  category?: { name: string };
  isActive: boolean;
  isPrivate: boolean;
  memberCount: number;
  maxMembers: number;
  createdAt: string;
  isSponsored?: boolean;
}

export default function RoomsPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      const data = await api.get(`/admin/rooms?search=${search}`);
      setRooms(Array.isArray(data) ? data : data.rooms || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [token, search]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const toggleActive = async (room: Room) => {
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      await api.put(`/admin/rooms/${room.id}`, { isActive: !room.isActive });
      toast({ title: "موفق", description: `وضعیت اتاق ${room.title} تغییر کرد`, variant: "success" });
      fetchRooms();
    } catch {
      toast({ title: "خطا", description: "خطا در تغییر وضعیت اتاق", variant: "destructive" });
    }
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setEditTitle(room.title);
    setEditDesc(room.description || "");
    setEditDialog(true);
  };

  const saveEdit = async () => {
    if (!selectedRoom) return;
    setSaving(true);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      await api.put(`/admin/rooms/${selectedRoom.id}`, { title: editTitle, description: editDesc });
      toast({ title: "موفق", description: "اتاق به‌روزرسانی شد", variant: "success" });
      setEditDialog(false);
      fetchRooms();
    } catch {
      toast({ title: "خطا", description: "خطا در به‌روزرسانی اتاق", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRoom) return;
    setSaving(true);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      await api.del(`/admin/rooms/${selectedRoom.id}`);
      toast({ title: "موفق", description: "اتاق حذف شد", variant: "success" });
      setDeleteDialog(false);
      fetchRooms();
    } catch {
      toast({ title: "خطا", description: "خطا در حذف اتاق", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState onRetry={fetchRooms} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت اتاق‌ها</h1>
          <p className="text-muted-foreground">مدیریت و نظارت بر اتاق‌های گفتگوی صوتی</p>
        </div>
        <div className="relative">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="جستجوی اتاق..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9 w-64" />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>عنوان</TableHead>
              <TableHead>سازنده</TableHead>
              <TableHead>دسته‌بندی</TableHead>
              <TableHead>اعضا</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>نوع</TableHead>
              <TableHead>تاریخ ساخت</TableHead>
              <TableHead className="text-left">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  اتاقی یافت نشد
                </TableCell>
              </TableRow>
            ) : (
              rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.title}</TableCell>
                  <TableCell className="text-muted-foreground">{room.creator?.name || room.creator?.phone || "—"}</TableCell>
                  <TableCell>{room.category?.name || "—"}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {room.memberCount}/{room.maxMembers}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={room.isActive ? "success" : "destructive"}>
                      {room.isActive ? "فعال" : "غیرفعال"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {room.isPrivate ? <Badge variant="warning">خصوصی</Badge> : <Badge variant="secondary">عمومی</Badge>}
                    {room.isSponsored && <Badge variant="default" className="mr-1">ویژه</Badge>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(room.createdAt).toLocaleDateString("fa-IR")}
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => toggleActive(room)} title={room.isActive ? "غیرفعال کردن" : "فعال کردن"}>
                        {room.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(room)} title="ویرایش">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedRoom(room); setDeleteDialog(true); }} title="حذف">
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
            <DialogTitle>ویرایش اتاق</DialogTitle>
            <DialogDescription>ویرایش اطلاعات اتاق {selectedRoom?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>عنوان</Label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>توضیحات</Label>
              <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>انصراف</Button>
            <Button onClick={saveEdit} disabled={saving}>{saving ? "در حال ذخیره..." : "ذخیره"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="حذف اتاق"
        description={`آیا از حذف اتاق ${selectedRoom?.title} اطمینان دارید؟`}
        onConfirm={handleDelete}
        confirmText="حذف اتاق"
        loading={saving}
      />
    </div>
  );
}
