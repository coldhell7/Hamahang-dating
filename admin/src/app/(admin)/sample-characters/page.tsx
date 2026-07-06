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
import { Search, Pencil, Trash2, Plus, Image, User } from "lucide-react";

interface SampleCharacter {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
  gender?: string;
  personality?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export default function SampleCharactersPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [characters, setCharacters] = useState<SampleCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [editDialog, setEditDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedChar, setSelectedChar] = useState<SampleCharacter | null>(null);
  const [formName, setFormName] = useState("");
  const [formAvatar, setFormAvatar] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formGender, setFormGender] = useState("");
  const [formPersonality, setFormPersonality] = useState("");
  const [formOrder, setFormOrder] = useState("0");
  const [saving, setSaving] = useState(false);

  const fetchCharacters = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      const data = await api.get(`/admin/sample-characters?search=${search}`);
      setCharacters(Array.isArray(data) ? data : data.characters || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [token, search]);

  useEffect(() => { fetchCharacters(); }, [fetchCharacters]);

  const toggleActive = async (char: SampleCharacter) => {
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      await api.put(`/admin/sample-characters/${char.id}`, { isActive: !char.isActive });
      toast({ title: "موفق", description: `وضعیت ${char.name} تغییر کرد`, variant: "success" });
      fetchCharacters();
    } catch {
      toast({ title: "خطا", description: "خطا در تغییر وضعیت", variant: "destructive" });
    }
  };

  const handleEdit = (char: SampleCharacter) => {
    setSelectedChar(char);
    setFormName(char.name);
    setFormAvatar(char.avatar || "");
    setFormDesc(char.description || "");
    setFormGender(char.gender || "");
    setFormPersonality(char.personality || "");
    setFormOrder(String(char.order));
    setEditDialog(true);
  };

  const openCreate = () => {
    setSelectedChar(null);
    setFormName(""); setFormAvatar(""); setFormDesc(""); setFormGender("");
    setFormPersonality(""); setFormOrder("0");
    setCreateDialog(true);
  };

  const saveChar = async () => {
    if (!formName) return;
    setSaving(true);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      const payload = {
        name: formName, avatar: formAvatar, description: formDesc,
        gender: formGender, personality: formPersonality,
        order: parseInt(formOrder) || 0,
      };
      if (selectedChar) {
        await api.put(`/admin/sample-characters/${selectedChar.id}`, payload);
        toast({ title: "موفق", description: "شخصیت به‌روزرسانی شد", variant: "success" });
        setEditDialog(false);
      } else {
        await api.post("/admin/sample-characters", payload);
        toast({ title: "موفق", description: "شخصیت جدید اضافه شد", variant: "success" });
        setCreateDialog(false);
      }
      fetchCharacters();
    } catch {
      toast({ title: "خطا", description: "خطا در ذخیره شخصیت", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selectedChar) return;
    setSaving(true);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      await api.del(`/admin/sample-characters/${selectedChar.id}`);
      toast({ title: "موفق", description: "شخصیت حذف شد", variant: "success" });
      setDeleteDialog(false);
      fetchCharacters();
    } catch {
      toast({ title: "خطا", description: "خطا در حذف شخصیت", variant: "destructive" });
    } finally { setSaving(false); }
  };

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState onRetry={fetchCharacters} />;

  const formContent = (
    <>
      <div className="space-y-2">
        <Label>نام *</Label>
        <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="نام شخصیت" />
      </div>
      <div className="space-y-2">
        <Label>تصویر</Label>
        <Input value={formAvatar} onChange={(e) => setFormAvatar(e.target.value)} placeholder="URL تصویر" />
      </div>
      <div className="space-y-2">
        <Label>جنسیت</Label>
        <Input value={formGender} onChange={(e) => setFormGender(e.target.value)} placeholder="مرد / زن / ..." />
      </div>
      <div className="space-y-2">
        <Label>شخصیت‌شناسی</Label>
        <Input value={formPersonality} onChange={(e) => setFormPersonality(e.target.value)} placeholder="ویژگی‌های شخصیتی" />
      </div>
      <div className="space-y-2">
        <Label>توضیحات</Label>
        <Input value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="توضیحات شخصیت" />
      </div>
      <div className="space-y-2">
        <Label>ترتیب</Label>
        <Input type="number" value={formOrder} onChange={(e) => setFormOrder(e.target.value)} />
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">شخصیت‌های نمونه</h1>
          <p className="text-muted-foreground">مدیریت شخصیت‌های پیش‌فرض برای کاربران جدید</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9 w-64" />
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            شخصیت جدید
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>تصویر</TableHead>
              <TableHead>نام</TableHead>
              <TableHead>جنسیت</TableHead>
              <TableHead>شخصیت</TableHead>
              <TableHead>ترتیب</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead className="text-left">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {characters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  شخصیتی یافت نشد
                </TableCell>
              </TableRow>
            ) : (
              characters.map((char) => (
                <TableRow key={char.id}>
                  <TableCell>
                    <div className="flex items-center">
                      {char.avatar ? (
                        <img src={char.avatar} alt={char.name} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <User className="h-10 w-10 rounded-full bg-muted p-2 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{char.name}</TableCell>
                  <TableCell>{char.gender || "—"}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">
                    {char.personality || "—"}
                  </TableCell>
                  <TableCell>{char.order}</TableCell>
                  <TableCell>
                    <Badge variant={char.isActive ? "success" : "destructive"}>
                      {char.isActive ? "فعال" : "غیرفعال"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(char)} title="ویرایش">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedChar(char); setDeleteDialog(true); }} title="حذف">
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
            <DialogTitle>ویرایش شخصیت</DialogTitle>
            <DialogDescription>ویرایش {selectedChar?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">{formContent}</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>انصراف</Button>
            <Button onClick={saveChar} disabled={saving}>{saving ? "در حال ذخیره..." : "ذخیره"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>شخصیت جدید</DialogTitle>
            <DialogDescription>افزودن شخصیت نمونه جدید</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">{formContent}</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialog(false)}>انصراف</Button>
            <Button onClick={saveChar} disabled={saving}>{saving ? "در حال ذخیره..." : "افزودن"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="حذف شخصیت"
        description={`آیا از حذف ${selectedChar?.name} اطمینان دارید؟`}
        onConfirm={handleDelete}
        confirmText="حذف شخصیت"
        loading={saving}
      />
    </div>
  );
}
