"use client"

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PageSkeleton } from "@/components/loading-skeleton";
import { ErrorState } from "@/components/error-state";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function FeatureFlagsPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag | null>(null);
  const [formKey, setFormKey] = useState("");
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formEnabled, setFormEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchFlags = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      const data = await api.get("/admin/feature-flags");
      setFlags(Array.isArray(data) ? data : data.flags || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchFlags(); }, [fetchFlags]);

  const toggleFlag = async (flag: FeatureFlag) => {
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      await api.put(`/admin/feature-flags/${flag.id}`, { enabled: !flag.enabled });
      toast({ title: "موفق", description: `ویژگی ${flag.name} ${!flag.enabled ? "فعال" : "غیرفعال"} شد`, variant: "success" });
      fetchFlags();
    } catch {
      toast({ title: "خطا", description: "خطا در تغییر وضعیت", variant: "destructive" });
    }
  };

  const handleEdit = (flag: FeatureFlag) => {
    setSelectedFlag(flag);
    setFormKey(flag.key);
    setFormName(flag.name);
    setFormDesc(flag.description || "");
    setFormEnabled(flag.enabled);
    setEditDialog(true);
  };

  const openCreate = () => {
    setSelectedFlag(null);
    setFormKey(""); setFormName(""); setFormDesc(""); setFormEnabled(false);
    setCreateDialog(true);
  };

  const saveFlag = async () => {
    if (!formKey || !formName) return;
    setSaving(true);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      const payload = { key: formKey, name: formName, description: formDesc, enabled: formEnabled };
      if (selectedFlag) {
        await api.put(`/admin/feature-flags/${selectedFlag.id}`, payload);
        toast({ title: "موفق", description: "ویژگی به‌روزرسانی شد", variant: "success" });
        setEditDialog(false);
      } else {
        await api.post("/admin/feature-flags", payload);
        toast({ title: "موفق", description: "ویژگی جدید اضافه شد", variant: "success" });
        setCreateDialog(false);
      }
      fetchFlags();
    } catch {
      toast({ title: "خطا", description: "خطا در ذخیره ویژگی", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selectedFlag) return;
    setSaving(true);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      await api.del(`/admin/feature-flags/${selectedFlag.id}`);
      toast({ title: "موفق", description: "ویژگی حذف شد", variant: "success" });
      setDeleteDialog(false);
      fetchFlags();
    } catch {
      toast({ title: "خطا", description: "خطا در حذف ویژگی", variant: "destructive" });
    } finally { setSaving(false); }
  };

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState onRetry={fetchFlags} />;

  const formContent = (
    <>
      <div className="space-y-2">
        <Label>کلید *</Label>
        <Input value={formKey} onChange={(e) => setFormKey(e.target.value)} placeholder="feature_key" dir="ltr" />
      </div>
      <div className="space-y-2">
        <Label>نام *</Label>
        <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="نام ویژگی" />
      </div>
      <div className="space-y-2">
        <Label>توضیحات</Label>
        <Input value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="توضیحات ویژگی" />
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={formEnabled} onCheckedChange={setFormEnabled} />
        <Label>فعال</Label>
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">ویژگی‌ها</h1>
          <p className="text-muted-foreground">مدیریت سوییچ‌های ویژگی‌های پلتفرم</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          ویژگی جدید
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>کلید</TableHead>
              <TableHead>نام</TableHead>
              <TableHead>توضیحات</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>آخرین به‌روزرسانی</TableHead>
              <TableHead className="text-left">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flags.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  ویژگی‌ای یافت نشد
                </TableCell>
              </TableRow>
            ) : (
              flags.map((flag) => (
                <TableRow key={flag.id}>
                  <TableCell className="font-mono text-sm" dir="ltr">{flag.key}</TableCell>
                  <TableCell className="font-medium">{flag.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">
                    {flag.description || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={flag.enabled ? "success" : "destructive"}>
                      {flag.enabled ? "فعال" : "غیرفعال"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(flag.updatedAt || flag.createdAt).toLocaleDateString("fa-IR")}
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => toggleFlag(flag)} title={flag.enabled ? "غیرفعال کردن" : "فعال کردن"}>
                        {flag.enabled ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(flag)} title="ویرایش">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedFlag(flag); setDeleteDialog(true); }} title="حذف">
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
            <DialogTitle>ویرایش ویژگی</DialogTitle>
            <DialogDescription>ویرایش {selectedFlag?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">{formContent}</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>انصراف</Button>
            <Button onClick={saveFlag} disabled={saving}>{saving ? "در حال ذخیره..." : "ذخیره"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ویژگی جدید</DialogTitle>
            <DialogDescription>افزودن ویژگی جدید</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">{formContent}</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialog(false)}>انصراف</Button>
            <Button onClick={saveFlag} disabled={saving}>{saving ? "در حال ذخیره..." : "افزودن"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="حذف ویژگی"
        description={`آیا از حذف ${selectedFlag?.name} اطمینان دارید؟`}
        onConfirm={handleDelete}
        confirmText="حذف ویژگی"
        loading={saving}
      />
    </div>
  );
}
