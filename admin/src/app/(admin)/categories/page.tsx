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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PageSkeleton } from "@/components/loading-skeleton";
import { ErrorState } from "@/components/error-state";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Pencil, Trash2, Plus, Eye, EyeOff } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug?: string;
  icon?: string;
  parentId?: string | null;
  parent?: { name: string };
  type: "room" | "song" | "general";
  isActive: boolean;
  order: number;
  createdAt: string;
}

export default function CategoriesPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [editDialog, setEditDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formIcon, setFormIcon] = useState("");
  const [formType, setFormType] = useState<"room" | "song" | "general">("general");
  const [formOrder, setFormOrder] = useState("0");
  const [formParentId, setFormParentId] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      const data = await api.get(`/admin/categories?search=${search}`);
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [token, search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const toggleActive = async (cat: Category) => {
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      await api.put(`/admin/categories/${cat.id}`, { isActive: !cat.isActive });
      toast({ title: "موفق", description: `وضعیت ${cat.name} تغییر کرد`, variant: "success" });
      fetchCategories();
    } catch {
      toast({ title: "خطا", description: "خطا در تغییر وضعیت", variant: "destructive" });
    }
  };

  const handleEdit = (cat: Category) => {
    setSelectedCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug || "");
    setFormIcon(cat.icon || "");
    setFormType(cat.type);
    setFormOrder(String(cat.order));
    setFormParentId(cat.parentId || "");
    setEditDialog(true);
  };

  const openCreate = () => {
    setSelectedCategory(null);
    setFormName("");
    setFormSlug("");
    setFormIcon("");
    setFormType("general");
    setFormOrder("0");
    setFormParentId("");
    setCreateDialog(true);
  };

  const saveCategory = async () => {
    if (!formName) return;
    setSaving(true);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      const payload = { name: formName, slug: formSlug, icon: formIcon, type: formType, order: parseInt(formOrder) || 0, parentId: formParentId || null };
      if (selectedCategory) {
        await api.put(`/admin/categories/${selectedCategory.id}`, payload);
        toast({ title: "موفق", description: "دسته‌بندی به‌روزرسانی شد", variant: "success" });
        setEditDialog(false);
      } else {
        await api.post("/admin/categories", payload);
        toast({ title: "موفق", description: "دسته‌بندی جدید اضافه شد", variant: "success" });
        setCreateDialog(false);
      }
      fetchCategories();
    } catch {
      toast({ title: "خطا", description: "خطا در ذخیره دسته‌بندی", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    setSaving(true);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      await api.del(`/admin/categories/${selectedCategory.id}`);
      toast({ title: "موفق", description: "دسته‌بندی حذف شد", variant: "success" });
      setDeleteDialog(false);
      fetchCategories();
    } catch {
      toast({ title: "خطا", description: "خطا در حذف دسته‌بندی", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState onRetry={fetchCategories} />;

  const typeLabels: Record<string, string> = { room: "اتاق", song: "آهنگ", general: "عمومی" };

  const formContent = (
    <>
      <div className="space-y-2">
        <Label>نام *</Label>
        <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="نام دسته‌بندی" />
      </div>
      <div className="space-y-2">
        <Label>اسلاگ</Label>
        <Input value={formSlug} onChange={(e) => setFormSlug(e.target.value)} placeholder="slug" dir="ltr" />
      </div>
      <div className="space-y-2">
        <Label>آیکون</Label>
        <Input value={formIcon} onChange={(e) => setFormIcon(e.target.value)} placeholder="نام آیکون" />
      </div>
      <div className="space-y-2">
        <Label>نوع</Label>
        <Select value={formType} onValueChange={(v: "room" | "song" | "general") => setFormType(v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="room">اتاق</SelectItem>
            <SelectItem value="song">آهنگ</SelectItem>
            <SelectItem value="general">عمومی</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>ترتیب</Label>
        <Input type="number" value={formOrder} onChange={(e) => setFormOrder(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>دسته‌بندی والد</Label>
        <Select value={formParentId} onValueChange={setFormParentId}>
          <SelectTrigger>
            <SelectValue placeholder="بدون والد" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="بدون والد">بدون والد</SelectItem>
            {categories.filter(c => c.id !== selectedCategory?.id).map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">دسته‌بندی‌ها</h1>
          <p className="text-muted-foreground">مدیریت دسته‌بندی‌های اتاق‌ها و آهنگ‌ها</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9 w-64" />
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            دسته‌بندی جدید
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام</TableHead>
              <TableHead>اسلاگ</TableHead>
              <TableHead>نوع</TableHead>
              <TableHead>والد</TableHead>
              <TableHead>ترتیب</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead className="text-left">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  دسته‌بندی‌ای یافت نشد
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-muted-foreground" dir="ltr">{cat.slug || "—"}</TableCell>
                  <TableCell><Badge variant="secondary">{typeLabels[cat.type]}</Badge></TableCell>
                  <TableCell>{cat.parent?.name || "—"}</TableCell>
                  <TableCell>{cat.order}</TableCell>
                  <TableCell>
                    <Badge variant={cat.isActive ? "success" : "destructive"}>
                      {cat.isActive ? "فعال" : "غیرفعال"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => toggleActive(cat)} title={cat.isActive ? "غیرفعال کردن" : "فعال کردن"}>
                        {cat.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)} title="ویرایش">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedCategory(cat); setDeleteDialog(true); }} title="حذف">
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
            <DialogTitle>ویرایش دسته‌بندی</DialogTitle>
            <DialogDescription>ویرایش {selectedCategory?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">{formContent}</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>انصراف</Button>
            <Button onClick={saveCategory} disabled={saving}>{saving ? "در حال ذخیره..." : "ذخیره"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>دسته‌بندی جدید</DialogTitle>
            <DialogDescription>افزودن دسته‌بندی جدید</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">{formContent}</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialog(false)}>انصراف</Button>
            <Button onClick={saveCategory} disabled={saving}>{saving ? "در حال ذخیره..." : "افزودن"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="حذف دسته‌بندی"
        description={`آیا از حذف ${selectedCategory?.name} اطمینان دارید؟`}
        onConfirm={handleDelete}
        confirmText="حذف"
        loading={saving}
      />
    </div>
  );
}
