"use client"

import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 left-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "rounded-lg border px-4 py-3 shadow-lg flex items-start gap-3",
            toast.variant === "destructive"
              ? "bg-red-50 border-red-200 text-red-800"
              : toast.variant === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-white border-gray-200 text-gray-900",
          )}
        >
          <div className="flex-1 min-w-0">
            {toast.title && <p className="font-medium text-sm">{toast.title}</p>}
            {toast.description && (
              <p className="text-sm opacity-80">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
