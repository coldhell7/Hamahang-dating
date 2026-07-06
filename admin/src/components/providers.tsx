"use client";

import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/hooks/use-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  );
}
