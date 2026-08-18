"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/layout/theme-provider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  label?: string;
}

export function ThemeToggle({ className, label }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 transition-all",
        "hover:bg-brand-500/10 hover:text-brand-600 active:scale-95",
        "dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-brand-300",
        className
      )}
    >
      {theme === "dark" ? (
        <Sun className="h-[18px] w-[18px]" aria-hidden />
      ) : (
        <Moon className="h-[18px] w-[18px]" aria-hidden />
      )}
      {label ? <span className="sr-only">{label}</span> : null}
    </button>
  );
}
