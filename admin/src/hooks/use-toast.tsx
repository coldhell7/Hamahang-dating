"use client"

import { useState, useCallback, createContext, useContext, ReactNode } from "react"

type ToastVariant = "default" | "destructive" | "success"

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
}

interface ToastAction {
  title: string
  description?: string
  variant?: ToastVariant
}

interface ToastContextType {
  toasts: Toast[]
  toast: (action: ToastAction) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

let toastCount = 0

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    // Fallback for when no provider exists
    return {
      toasts: [] as Toast[],
      toast: () => {},
      dismiss: () => {},
    }
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((action: ToastAction) => {
    const id = String(++toastCount)
    setToasts((prev) => [
      ...prev,
      { id, title: action.title, description: action.description, variant: action.variant },
    ])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}
