"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  Users,
  Music2,
  Music,
  FolderTree,
  CreditCard,
  Sticker,
  Flag,
  MessageSquare,
  UserCog,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Star,
  DollarSign,
  Megaphone,
  LogOut,
  Home,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "داشبورد", icon: LayoutDashboard },
  { href: "/users", label: "کاربران", icon: Users },
  { href: "/rooms", label: "اتاق‌ها", icon: Music2 },
  { href: "/songs", label: "آهنگ‌ها", icon: Music },
  { href: "/categories", label: "دسته‌بندی‌ها", icon: FolderTree },
  { href: "/subscriptions", label: "اشتراک‌ها", icon: CreditCard },
  { href: "/stickers", label: "استیکرها", icon: Sticker },
  { href: "/reports", label: "گزارشات", icon: ShieldAlert },
  { href: "/feature-flags", label: "ویژگی‌ها", icon: Flag },
  { href: "/sample-characters", label: "شخصیت‌ها", icon: UserCog },
  { href: "/preset-messages", label: "پیام‌ها", icon: MessageSquare },
  { href: "/room-pricing", label: "قیمت‌گذاری", icon: DollarSign },
  { href: "/sponsored-rooms", label: "اتاق‌های ویژه", icon: Megaphone },
  { href: "/admins", label: "مدیران", icon: UserCheck },
  { href: "/settings", label: "تنظیمات", icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { logout, admin } = useAuth();

  return (
    <aside
      className={cn(
        "fixed right-0 top-0 z-40 flex h-screen flex-col border-l bg-card transition-all duration-300",
        open ? "w-64" : "w-16"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {open && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">هم‌آهنگ</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn("shrink-0", !open && "mx-auto")}
        >
          {open ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
                !open && "justify-center px-2"
              )}
              title={!open ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {open && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-3">
        {open && admin && (
          <div className="mb-2 px-2 py-1 text-xs text-muted-foreground truncate">
            {admin.name || admin.email}
          </div>
        )}
        <Button
          variant="ghost"
          className={cn(
            "w-full gap-2 text-muted-foreground hover:text-destructive",
            !open && "justify-center px-2"
          )}
          onClick={logout}
          title="خروج"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {open && <span>خروج</span>}
        </Button>
      </div>
    </aside>
  );
}
