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
import { Search, Pencil, Trash2, Plus, Image } from "lucide-react";

interface Sticker {
  id: string;
  name: string;
  imageUrl: string;
  category?: string;
  isActive: boolean;
  price?: number;
  createdAt: string;
}

export default function StickersPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [editDialog, setEditDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const [formName, setFormName] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formPrice, setFormPrice] = useState("0");
  const [saving, setSaving] = useState(false);

  const fetchStickers = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      const data = await api.get(`/admin/stickers?search=${search}`);
      setStickers(Array.isArray(data) ? data : data.stickers || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [token, search]);

  useEffect(() => { fetchStickers(); }, [fetchStickers]);

  const toggleActive = async (sticker: Sticker) => {
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      await api.put(`/admin/stickers/${sticker.id}`, { isActive: !sticker.isActive });
      toast({ title: "موفق", description: `وضعیت ${sticker.name} تغییر کرد`, variant: "success" });
      fetchStickers();
    } catch {
      toast({ title: "خطا", description: "خطا در تغییر وضعیت", variant: "destructive" });
    }
  };

  const handleEdit = (sticker: Sticker) => {
    setSelectedSticker(sticker);
    setFormName(sticker.name);
    setFormImageUrl(sticker.imageUrl);
    setFormCategory(sticker.category || "");
    setFormPrice(String(sticker.price || 0));
    setEditDialog(true);
  };

  const openCreate = () => {
    setSelectedSticker(null);
    setFormName(""); setFormImageUrl(""); setFormCategory(""); setFormPrice("0");
    setCreateDialog(true);
  };

  const saveSticker = async () => {
    if (!formName || !formImageUrl) return;
    setSaving(true);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      const payload = { name: formName, imageUrl: formImageUrl, category: formCategory, price: parseInt(formPrice) || 0 };
      if (selectedSticker) {
        await api.put(`/admin/stickers/${selectedSticker.id}`, payload);
        toast({ title: "موفق", description: "استیکر به‌روزرسانی شد", variant: "success" });
        setEditDialog(false);
      } else {
        await api.post("/admin/stickers", payload);
        toast({ title: "موفق", description: "استیکر جدید اضافه شد", variant: "success" });
        setCreateDialog(false);
      }
      fetchStickers();
    } catch {
      toast({ title: "خطا", description: "خطا در ذخیره استیکر", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selectedSticker) return;
    setSaving(true);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      await api.del(`/admin/stickers/${selectedSticker.id}`);
      toast({ title: "موفق", description: "استیکر حذف شد", variant: "success" });
      setDeleteDialog(false);
      fetchStickers();
    } catch {
      toast({ title: "خطا", description: "خطا در حذف استیکر", variant: "destructive" });
    } finally { setSaving(false); }
  };

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState onRetry={fetchStickers} />;

  const formContent = (
    <>
      <div className="space-y-2">
        <Label>نام *</Label>
        <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="نام استیکر" />
      </div>
      <div className="space-y-2">
        <Label>تصویر *</Label>
        <Input value={formImageUrl} onChange={(e) => setFormImageUrl(e.target.value)} placeholder="URL تصویر" />
      </div>
      <div className="space-y-2">
        <Label>دسته‌بندی</Label>
        <Input value={formCategory} onChange={(e) => setFormCategory(e.target.value)} placeholder="دسته‌بندی" />
      </div>
      <div className="space-y-2">
        <Label>قیمت (تومان)</Label>
        <Input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} />
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت استیکرها</h1>
          <p className="text-muted-foreground">مدیریت استیکرهای قابل استفاده در چت</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9 w-64" />
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            استیکر جدید
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>تصویر</TableHead>
              <TableHead>نام</TableHead>
              <TableHead>دسته‌بندی</TableHead>
              <TableHead>قیمت</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead className="text-left">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stickers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  استیکری یافت نشد
                </TableCell>
              </TableRow>
            ) : (
              stickers.map((sticker) => (
                <TableRow key={sticker.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {sticker.imageUrl ? (
                        <img src={sticker.imageUrl} alt={sticker.name} className="h-10 w-10 rounded object-cover" />
                      ) : (
                        <Image className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{sticker.name}</TableCell>
                  <TableCell>{sticker.category || "—"}</TableCell>
                  <TableCell dir="ltr">{sticker.price ? `${sticker.price.toLocaleString()} تومان` : "رایگان"}</TableCell>
                  <TableCell>
                    <Badge variant={sticker.isActive ? "success" : "destructive"}>
                      {sticker.isActive ? "فعال" : "غیرفعال"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(sticker)} title="ویرایش">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedSticker(sticker); setDeleteDialog(true); }} title="حذف">
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
            <DialogTitle>ویرایش استیکر</DialogTitle>
            <DialogDescription>ویرایش {selectedSticker?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">{formContent}</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>انصراف</Button>
            <Button onClick={saveSticker} disabled={saving}>{saving ? "در حال ذخیره..." : "ذخیره"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>استیکر جدید</DialogTitle>
            <DialogDescription>افزودن استیکر جدید</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">{formContent}</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialog(false)}>انصراف</Button>
            <Button onClick={saveSticker} disabled={saving}>{saving ? "در حال ذخیره..." : "افزودن"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="حذف استیکر"
        description={`آیا از حذف ${selectedSticker?.name} اطمینان دارید؟`}
        onConfirm={handleDelete}
        confirmText="حذف استیکر"
        loading={saving}
      />
    </div>
  );
}
