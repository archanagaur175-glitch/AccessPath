"use client";

import Link from "next/link";
import {
  Radar,
  KanbanSquare,
  PenLine,
  BookOpen,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useSession } from "@/lib/auth/session-context";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const modules = [
  {
    href: "/matcher",
    title: "College Matcher",
    description: "Find and rank schools with an explainable strength index.",
    icon: Radar,
    cta: "Explore matches",
  },
  {
    href: "/tracker",
    title: "Application Tracker",
    description: "Track deadlines and checklists in a visual Kanban board.",
    icon: KanbanSquare,
    cta: "View board",
  },
  {
    href: "/essays",
    title: "Essay Coach",
    description: "Analyze prompts, brainstorm, outline, and get rubric feedback.",
    icon: PenLine,
    cta: "Coach an essay",
  },
  {
    href: "/resources",
    title: "Resource Hub",
    description: "Find programs, scholarships, guides, and human advisors.",
    icon: BookOpen,
    cta: "Browse resources",
  },
];

export default function DashboardPage() {
  const { user, status } = useSession();

  const role = user?.role ?? "student";

  return (
    <AppShell>
      <div className="animate-fade-up space-y-8">
        <div>
          <Badge variant={role === "advisor" ? "brand" : "success"} className="mb-3">
            {role === "advisor" ? "Advisor workspace" : "Student dashboard"}
          </Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            {status === "authenticated" && user
              ? `Welcome back, ${user.name.split(" ")[0]}`
              : "Welcome to AccessPath"}
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-300">
            {role === "advisor"
              ? "Your students' applications, at a glance. Everything below opens in demo mode."
              : "Your college application mission control. Pick a module to get started — everything runs on demo data."}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {(role === "advisor"
            ? [
                ...modules,
                {
                  href: "/advisor",
                  title: "Student Roster",
                  description: "Review the profiles and progress of your students.",
                  icon: GraduationCap,
                  cta: "Open roster",
                },
              ]
            : modules
          ).map((module) => (
            <Card
              key={module.title}
              variant="glass"
              hoverable
              className="flex flex-col p-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow-brand">
                <module.icon className="h-5 w-5" aria-hidden />
              </div>
              <CardTitle className="mt-4">{module.title}</CardTitle>
              <CardDescription className="mt-1.5 flex-1 leading-relaxed">
                {module.description}
              </CardDescription>
              <Link href={module.href} className="mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-2 px-2 font-medium text-brand-600 dark:text-brand-300"
                >
                  {module.cta}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        <Card variant="glass-strong" className="p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-reach-500/15 text-reach-600 sm:flex dark:text-reach-300">
                <Sparkles className="h-6 w-6" aria-hidden />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold">
                  See how AccessPath works
                </h2>
                <p className="mt-1 max-w-xl text-sm text-zinc-600 dark:text-zinc-300">
                  {role === "advisor"
                    ? "Open the matcher or tracker to review how student data surfaces in your workspace."
                    : "Build your profile, then let the Matcher rank schools for you. Your list, explained in plain English."}
                </p>
              </div>
            </div>
            <Link href={role === "advisor" ? "/matcher" : "/profile"}>
              <Button>
                {role === "advisor" ? "Open matcher" : "Build my profile"}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
