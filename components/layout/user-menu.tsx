"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ChevronDown } from "lucide-react";
import { useSession } from "@/lib/auth/session-context";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function UserMenu() {
  const { user, signOut } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-2xl px-2 py-1.5 transition-colors hover:bg-zinc-900/5 dark:hover:bg-white/10"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-brand text-xs font-bold text-white"
          )}
          aria-hidden
        >
          {initials}
        </span>
        <ChevronDown className="h-4 w-4 text-zinc-400" aria-hidden />
      </button>

      {open ? (
        <div
          className="glass-strong absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl p-2 shadow-glass-lg animate-scale-in"
          role="menu"
        >
          <div className="border-b border-zinc-200/60 px-3 py-2 dark:border-white/10">
            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
              {user.name}
            </p>
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
              {user.email}
            </p>
            <div className="mt-1.5">
              <Badge variant={user.role === "advisor" ? "brand" : "success"}>
                {user.role === "advisor" ? "Advisor" : "Student"}
              </Badge>
            </div>
          </div>
          <Link
            href="/profile"
            role="menuitem"
            className="mt-1 block rounded-xl px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-900/5 dark:text-zinc-200 dark:hover:bg-white/10"
          >
            Edit profile
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={async () => {
              await signOut();
              setOpen(false);
              router.push("/");
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
