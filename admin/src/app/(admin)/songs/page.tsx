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
import { Search, Pencil, Trash2, Play, Pause, Plus } from "lucide-react";

interface Song {
  id: string;
  title: string;
  artist?: string;
  duration?: number;
  url?: string;
  image?: string;
  categoryId?: string;
  category?: { name: string };
  isActive: boolean;
  playCount: number;
  createdAt: string;
}

export default function SongsPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [songs, setSongs] = useState<Song[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [editDialog, setEditDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formArtist, setFormArtist] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      const [songsData, catsData] = await Promise.all([
        api.get(`/admin/songs?search=${search}`),
        api.get("/admin/categories"),
      ]);
      setSongs(Array.isArray(songsData) ? songsData : songsData.songs || []);
      setCategories(Array.isArray(catsData) ? catsData : catsData.categories || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [token, search]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const toggleActive = async (song: Song) => {
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      await api.put(`/admin/songs/${song.id}`, { isActive: !song.isActive });
      toast({ title: "موفق", description: `وضعیت آهنگ ${song.title} تغییر کرد`, variant: "success" });
      fetchSongs();
    } catch {
      toast({ title: "خطا", description: "خطا در تغییر وضعیت آهنگ", variant: "destructive" });
    }
  };

  const handleEdit = (song: Song) => {
    setSelectedSong(song);
    setFormTitle(song.title);
    setFormArtist(song.artist || "");
    setFormCategory(song.categoryId || "");
    setFormImage(song.image || "");
    setFormUrl(song.url || "");
    setEditDialog(true);
  };

  const openCreate = () => {
    setSelectedSong(null);
    setFormTitle("");
    setFormArtist("");
    setFormCategory("");
    setFormImage("");
    setFormUrl("");
    setCreateDialog(true);
  };

  const saveSong = async () => {
    if (!formTitle) return;
    setSaving(true);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      const payload = { title: formTitle, artist: formArtist, categoryId: formCategory, image: formImage, url: formUrl };
      if (selectedSong) {
        await api.put(`/admin/songs/${selectedSong.id}`, payload);
        toast({ title: "موفق", description: "آهنگ به‌روزرسانی شد", variant: "success" });
        setEditDialog(false);
      } else {
        await api.post("/admin/songs", payload);
        toast({ title: "موفق", description: "آهنگ جدید اضافه شد", variant: "success" });
        setCreateDialog(false);
      }
      fetchSongs();
    } catch {
      toast({ title: "خطا", description: "خطا در ذخیره آهنگ", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSong) return;
    setSaving(true);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      await api.del(`/admin/songs/${selectedSong.id}`);
      toast({ title: "موفق", description: "آهنگ حذف شد", variant: "success" });
      setDeleteDialog(false);
      fetchSongs();
    } catch {
      toast({ title: "خطا", description: "خطا در حذف آهنگ", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "—";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState onRetry={fetchSongs} />;

  const formContent = (
    <>
      <div className="space-y-2">
        <Label>عنوان آهنگ *</Label>
        <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="عنوان آهنگ" />
      </div>
      <div className="space-y-2">
        <Label>هنرمند</Label>
        <Input value={formArtist} onChange={(e) => setFormArtist(e.target.value)} placeholder="نام هنرمند" />
      </div>
      <div className="space-y-2">
        <Label>دسته‌بندی</Label>
        <Select value={formCategory} onValueChange={setFormCategory}>
          <SelectTrigger>
            <SelectValue placeholder="انتخاب دسته‌بندی" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>تصویر</Label>
        <Input value={formImage} onChange={(e) => setFormImage(e.target.value)} placeholder="URL تصویر" />
      </div>
      <div className="space-y-2">
        <Label>لینک آهنگ</Label>
        <Input value={formUrl} onChange={(e) => setFormUrl(e.target.value)} placeholder="URL آهنگ" dir="ltr" />
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت آهنگ‌ها</h1>
          <p className="text-muted-foreground">مدیریت کاتالوگ آهنگ‌های پلتفرم</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="جستجوی آهنگ..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9 w-64" />
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            آهنگ جدید
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>عنوان</TableHead>
              <TableHead>هنرمند</TableHead>
              <TableHead>مدت</TableHead>
              <TableHead>دسته‌بندی</TableHead>
              <TableHead>تعداد پخش</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead className="text-left">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {songs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  آهنگی یافت نشد
                </TableCell>
              </TableRow>
            ) : (
              songs.map((song) => (
                <TableRow key={song.id}>
                  <TableCell className="font-medium">{song.title}</TableCell>
                  <TableCell>{song.artist || "—"}</TableCell>
                  <TableCell className="text-muted-foreground" dir="ltr">{formatDuration(song.duration)}</TableCell>
                  <TableCell>{song.category?.name || "—"}</TableCell>
                  <TableCell>{song.playCount?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    <Badge variant={song.isActive ? "success" : "destructive"}>
                      {song.isActive ? "فعال" : "غیرفعال"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => toggleActive(song)} title={song.isActive ? "غیرفعال کردن" : "فعال کردن"}>
                        {song.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(song)} title="ویرایش">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedSong(song); setDeleteDialog(true); }} title="حذف">
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
            <DialogTitle>ویرایش آهنگ</DialogTitle>
            <DialogDescription>ویرایش اطلاعات آهنگ {selectedSong?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">{formContent}</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>انصراف</Button>
            <Button onClick={saveSong} disabled={saving}>{saving ? "در حال ذخیره..." : "ذخیره"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>آهنگ جدید</DialogTitle>
            <DialogDescription>افزودن آهنگ جدید به کاتالوگ</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">{formContent}</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialog(false)}>انصراف</Button>
            <Button onClick={saveSong} disabled={saving}>{saving ? "در حال ذخیره..." : "افزودن آهنگ"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="حذف آهنگ"
        description={`آیا از حذف آهنگ ${selectedSong?.title} اطمینان دارید؟`}
        onConfirm={handleDelete}
        confirmText="حذف آهنگ"
        loading={saving}
      />
    </div>
  );
}
