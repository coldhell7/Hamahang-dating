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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageSkeleton } from "@/components/loading-skeleton";
import { ErrorState } from "@/components/error-state";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert, CheckCircle, XCircle, Eye, MessageSquare } from "lucide-react";

type ReportStatus = "pending" | "reviewed" | "dismissed";
type ReportType = "user" | "room" | "message";

interface Report {
  id: string;
  type: ReportType;
  reporterId: string;
  reporter?: { phone: string; name?: string };
  targetId: string;
  targetUser?: { phone: string; name?: string };
  reason: string;
  description?: string;
  status: ReportStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export default function ReportsPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<string>("pending");
  const [detailDialog, setDetailDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      const data = await api.get(`/admin/reports?status=${tab}`);
      setReports(Array.isArray(data) ? data : data.reports || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [token, tab]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const updateStatus = async (report: Report, status: ReportStatus) => {
    setActionLoading(true);
    try {
      const api = (await import("@/lib/auth-context")).apiClient(token);
      await api.put(`/admin/reports/${report.id}`, { status });
      const statusLabels = { reviewed: "بررسی شد", dismissed: "رد شد", pending: "در انتظار" };
      toast({ title: "موفق", description: `وضعیت گزارش به "${statusLabels[status]}" تغییر کرد`, variant: "success" });
      setDetailDialog(false);
      fetchReports();
    } catch {
      toast({ title: "خطا", description: "خطا در به‌روزرسانی گزارش", variant: "destructive" });
    } finally { setActionLoading(false); }
  };

  const viewDetail = (report: Report) => {
    setSelectedReport(report);
    setDetailDialog(true);
  };

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState onRetry={fetchReports} />;

  const typeLabels: Record<ReportType, string> = { user: "کاربر", room: "اتاق", message: "پیام" };
  const statusColors: Record<ReportStatus, "warning" | "success" | "secondary"> = {
    pending: "warning", reviewed: "success", dismissed: "secondary",
  };
  const statusLabels: Record<ReportStatus, string> = {
    pending: "در انتظار بررسی", reviewed: "بررسی شده", dismissed: "رد شده",
  };

  const filteredReports = reports;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">گزارشات و نظارت</h1>
        <p className="text-muted-foreground">بررسی گزارشات ارسال شده توسط کاربران</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="pending">در انتظار بررسی</TabsTrigger>
          <TabsTrigger value="reviewed">بررسی شده</TabsTrigger>
          <TabsTrigger value="dismissed">رد شده</TabsTrigger>
          <TabsTrigger value="all">همه</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نوع</TableHead>
                  <TableHead>گزارش‌دهنده</TableHead>
                  <TableHead>هدف</TableHead>
                  <TableHead>دلیل</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>تاریخ</TableHead>
                  <TableHead className="text-left">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      گزارشی یافت نشد
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <Badge variant="secondary">{typeLabels[report.type]}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {report.reporter?.name || report.reporter?.phone || report.reporterId}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {report.targetUser?.name || report.targetUser?.phone || report.targetId?.slice(0, 8) + "..."}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{report.reason}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[report.status]}>{statusLabels[report.status]}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString("fa-IR")}
                      </TableCell>
                      <TableCell className="text-left">
                        <Button variant="ghost" size="icon" onClick={() => viewDetail(report)} title="مشاهده جزئیات">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={detailDialog} onOpenChange={setDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>جزئیات گزارش</DialogTitle>
            <DialogDescription>مشاهده جزئیات کامل گزارش</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">نوع گزارش</Label>
                  <p><Badge variant="secondary">{typeLabels[selectedReport.type]}</Badge></p>
                </div>
                <div>
                  <Label className="text-muted-foreground">وضعیت</Label>
                  <p><Badge variant={statusColors[selectedReport.status]}>{statusLabels[selectedReport.status]}</Badge></p>
                </div>
                <div>
                  <Label className="text-muted-foreground">گزارش‌دهنده</Label>
                  <p>{selectedReport.reporter?.name || selectedReport.reporter?.phone || selectedReport.reporterId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">کاربر هدف</Label>
                  <p>{selectedReport.targetUser?.name || selectedReport.targetUser?.phone || selectedReport.targetId}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">دلیل</Label>
                <p className="font-medium">{selectedReport.reason}</p>
              </div>
              {selectedReport.description && (
                <div>
                  <Label className="text-muted-foreground">توضیحات</Label>
                  <p className="text-sm whitespace-pre-wrap">{selectedReport.description}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">تاریخ گزارش</Label>
                <p>{new Date(selectedReport.createdAt).toLocaleDateString("fa-IR")}</p>
              </div>

              {selectedReport.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => updateStatus(selectedReport, "reviewed")}
                    disabled={actionLoading}
                  >
                    <CheckCircle className="h-4 w-4" />
                    تأیید گزارش
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => updateStatus(selectedReport, "dismissed")}
                    disabled={actionLoading}
                  >
                    <XCircle className="h-4 w-4" />
                    رد گزارش
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
