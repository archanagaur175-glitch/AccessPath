"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  size?: "md" | "lg" | "xl";
}

const sizeClasses = {
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  size = "md",
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousFocus = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Dialog"}
    >
      <div
        className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          "glass-strong relative z-10 w-full rounded-3xl border border-zinc-200/60 p-6",
          "shadow-glass-lg animate-scale-in outline-none dark:border-white/10",
          sizeClasses[size],
          className
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-xl p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
        {title ? (
          <h2 className="font-display pr-8 text-xl font-semibold tracking-tight">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
        ) : null}
        {children}
      </div>
    </div>,
    document.body
  );
}
