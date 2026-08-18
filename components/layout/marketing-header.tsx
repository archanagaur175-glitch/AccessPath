"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/60 bg-white/50 backdrop-blur-xl dark:border-white/10 dark:bg-surface-dark/60">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="AccessPath home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Marketing">
          <a
            href="#features"
            className="rounded-2xl px-3.5 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="rounded-2xl px-3.5 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            How it works
          </a>
          <a
            href="#open-access"
            className="rounded-2xl px-3.5 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            Open access
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/signup" className="hidden sm:inline-flex">
            <Button size="sm">
              <Sparkles className="h-4 w-4" aria-hidden />
              Get started free
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 transition-colors hover:bg-zinc-900/5 dark:text-zinc-300 dark:hover:bg-white/10 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          className="border-t border-zinc-200/60 bg-white/80 px-4 py-4 backdrop-blur-xl md:hidden dark:border-white/10 dark:bg-surface-dark/80"
          aria-label="Mobile marketing"
        >
          <div className="flex flex-col gap-1">
            <a
              href="#features"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-3.5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-900/5 dark:text-zinc-300 dark:hover:bg-white/10"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-3.5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-900/5 dark:text-zinc-300 dark:hover:bg-white/10"
            >
              How it works
            </a>
            <a
              href="#open-access"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-3.5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-900/5 dark:text-zinc-300 dark:hover:bg-white/10"
            >
              Open access
            </a>
            <div className="mt-2 flex gap-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup" className="flex-1">
                <Button className="w-full">Get started</Button>
              </Link>
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
