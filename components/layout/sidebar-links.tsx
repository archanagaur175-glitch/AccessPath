"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Radar,
  KanbanSquare,
  PenLine,
  BookOpen,
  UserCog,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/supabase/types";

interface SidebarItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles?: UserRole[];
}

const items: SidebarItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/matcher", label: "Matcher", icon: Radar },
  { href: "/tracker", label: "Tracker", icon: KanbanSquare },
  { href: "/essays", label: "Essays", icon: PenLine },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/advisor", label: "Advisor View", icon: GraduationCap, roles: ["advisor"] },
  { href: "/profile", label: "My Profile", icon: UserCog },
];

export function SidebarLinks({ role }: { role: UserRole }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="Primary">
      {items
        .filter((item) => !item.roles || item.roles.includes(role))
        .map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-brand-500/15 text-brand-700 dark:bg-brand-500/25 dark:text-brand-300"
                  : "text-zinc-600 hover:bg-zinc-900/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110",
                  active
                    ? "text-brand-600 dark:text-brand-300"
                    : "text-zinc-400 dark:text-zinc-500"
                )}
                aria-hidden
              />
              {item.label}
            </Link>
          );
        })}
    </nav>
  );
}
