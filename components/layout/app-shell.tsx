"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { SidebarLinks } from "@/components/layout/sidebar-links";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { useSession } from "@/lib/auth/session-context";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role ?? "student";

  return (
    <div className="relative min-h-screen">
      {/* ambient background glows */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-32 right-[-10%] h-96 w-96 rounded-full bg-brand-500/20 blur-3xl dark:bg-brand-500/15" />
        <div className="absolute bottom-[-20%] left-[-5%] h-96 w-96 rounded-full bg-violet-500/15 blur-3xl dark:bg-violet-500/10" />
      </div>

      {/* mobile top bar */}
      <header className="glass sticky top-0 z-40 flex items-center justify-between border-b border-zinc-200/60 px-4 py-3 lg:hidden dark:border-white/10">
        <Logo />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {status === "authenticated" ? (
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 transition-colors hover:bg-zinc-900/5 dark:text-zinc-300 dark:hover:bg-white/10"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden />
              ) : (
                <Menu className="h-5 w-5" aria-hidden />
              )}
            </button>
          ) : null}
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 sm:px-6">
        {/* desktop sidebar */}
        <aside
          className={cn(
            "sticky top-6 hidden h-[calc(100vh-3rem)] w-60 shrink-0 flex-col lg:flex"
          )}
        >
          <div className="glass flex flex-1 flex-col gap-6 rounded-3xl p-4">
            <div className="px-2 pt-1">
              <Logo />
            </div>
            {status === "authenticated" ? (
              <SidebarLinks role={role} />
            ) : (
              <p className="px-2 text-sm text-zinc-500 dark:text-zinc-400">
                Sign in to view your workspace.
              </p>
            )}
            <div className="mt-auto flex items-center justify-between px-2">
              {status === "authenticated" ? <UserMenu /> : <ThemeToggle />}
            </div>
          </div>
        </aside>

        {/* mobile drawer */}
        {mobileOpen && status === "authenticated" ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <aside className="glass-strong absolute left-0 top-0 h-full w-72 p-4 shadow-glass-lg animate-fade-in">
              <SidebarLinks role={role} />
            </aside>
          </div>
        ) : null}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
