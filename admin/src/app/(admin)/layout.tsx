"use client";

import { useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import Sidebar from '@/components/sidebar';
import { Toaster } from '@/components/ui/toaster';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className={`flex-1 overflow-y-auto p-6 ${sidebarOpen ? 'mr-64' : 'mr-16'}`}>
        {children}
      </main>
      <Toaster />
    </div>
  );
}
