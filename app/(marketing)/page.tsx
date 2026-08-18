import Link from "next/link";
import {
  ArrowRight,
  Radar,
  KanbanSquare,
  PenLine,
  BookOpen,
  GraduationCap,
  BarChart3,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CollegeCategory } from "@/lib/supabase/types";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";

const features = [
  {
    icon: Radar,
    title: "College Matcher",
    description:
      "A transparent, explainable Admission Strength Index that shows you exactly why a school is a reach, target, or safety — no black boxes.",
  },
  {
    icon: KanbanSquare,
    title: "Application Tracker",
    description:
      "A visual Kanban board for every application with deadline countdowns and per-school checklists that keep you on schedule.",
  },
  {
    icon: PenLine,
    title: "Essay Coach",
    description:
      "Prompt analysis, guided brainstorming, narrative outlines, and rubric feedback — a coaching posture that helps you find your own voice.",
  },
  {
    icon: BarChart3,
    title: "Admission Analytics",
    description:
      "See your list distribution across reach, target, and safety — and how your odds shift as your profile changes.",
  },
  {
    icon: BookOpen,
    title: "Resource Hub",
    description:
      "A searchable directory of programs, scholarships, and admissions guides, tagged by category, major, and region.",
  },
  {
    icon: GraduationCap,
    title: "Human Advisors",
    description:
      "Connect with a directory of experienced counselors when you want a human perspective on your journey.",
  },
];

const steps = [
  {
    step: "01",
    title: "Build your profile",
    description:
      "GPA, test scores, course rigor, extracurriculars, interests, and budget. Everything lives on your terms.",
  },
  {
    step: "02",
    title: "Find your fit",
    description:
      "Match against 40+ real school profiles and see an explainable strength index for each one.",
  },
  {
    step: "03",
    title: "Apply with confidence",
    description:
      "Track every application, hit every deadline, and craft essays with structured coaching along the way.",
  },
];

export default function MarketingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/2 top-0 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-brand-500/15 blur-3xl dark:bg-brand-500/10" />
          <div className="absolute right-[10%] top-40 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl dark:bg-violet-500/10" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
          <div className="animate-fade-up">
            <Badge variant="brand" className="mb-5 gap-1.5 px-3 py-1">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Free · Open access · No paywalls
            </Badge>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-white">
              College admissions guidance,{" "}
              <span className="text-gradient">without the gatekeepers.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
              AccessPath is a free, open-access platform that helps students match with
              colleges, track applications, and write stronger essays — with an
              explainable strength index and real counselor-grade coaching baked in.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get started free
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <Link href="/dashboard" className="sm:inline-flex">
                <Button size="lg" variant="glass" className="w-full sm:w-auto">
                  Explore the live demo
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              Works instantly in demo mode — no account, no credit card, no email
              required.
            </p>
          </div>

          {/* hero preview card */}
          <div className="animate-fade-up [animation-delay:120ms]">
            <Card variant="glass-strong" className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-xl font-bold">Your list, visualized</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Admission Strength Index distribution
                  </p>
                </div>
                <Badge variant="brand">Live demo</Badge>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/50 p-4 dark:bg-white/5">
                  <ProgressRing value={32} size={72} strokeWidth={8} />
                  <Badge category="reach">Reach</Badge>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/50 p-4 dark:bg-white/5">
                  <ProgressRing value={58} size={72} strokeWidth={8} />
                  <Badge category="target">Target</Badge>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/50 p-4 dark:bg-white/5">
                  <ProgressRing value={84} size={72} strokeWidth={8} />
                  <Badge category="safety">Safety</Badge>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {(
                  [
                    {
                      name: "Stanford University",
                      category: "reach",
                      ring: "bg-reach-500",
                    },
                    {
                      name: "University of Michigan",
                      category: "target",
                      ring: "bg-target-500",
                    },
                    {
                      name: "Arizona State University",
                      category: "safety",
                      ring: "bg-safety-500",
                    },
                  ] as { name: string; category: CollegeCategory; ring: string }[]
                ).map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center gap-3 rounded-xl bg-white/50 px-3 py-2.5 text-sm dark:bg-white/5"
                  >
                    <span
                      className={`h-3.5 w-3.5 rounded-full ${row.ring}`}
                      aria-hidden
                    />
                    <span className="font-medium text-zinc-800 dark:text-zinc-100">
                      {row.name}
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                      <MapPin className="h-3 w-3" aria-hidden /> US
                    </span>
                    <Badge category={row.category} className="capitalize">
                      {row.category}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6"
      >
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="brand" className="mb-4">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Everything in one place
          </Badge>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Six modules. One clear path to college.
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">
            Built for students and advisors, with an explainable engine instead of an
            opaque algorithm.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} variant="glass" hoverable className="p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow-brand">
                <feature.icon className="h-5 w-5" aria-hidden />
              </div>
              <CardTitle className="mt-4">{feature.title}</CardTitle>
              <CardDescription className="mt-2 leading-relaxed">
                {feature.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Three steps to a stronger application
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.step} variant="glass" className="relative p-6">
              <span
                className="font-display text-5xl font-bold text-brand-500/20 dark:text-brand-400/20"
                aria-hidden
              >
                {step.step}
              </span>
              <CardTitle className="mt-3">{step.title}</CardTitle>
              <CardDescription className="mt-2 leading-relaxed">
                {step.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </section>

      {/* Open access */}
      <section
        id="open-access"
        className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6"
      >
        <Card variant="glass-strong" className="relative overflow-hidden p-8 sm:p-12">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl"
            aria-hidden
          />
          <div className="relative max-w-2xl">
            <Badge variant="brand" className="mb-4">
              <HeartHandshake className="h-3.5 w-3.5" aria-hidden />
              Our mission
            </Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Admission guidance is a public good.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
              High-quality college counseling shouldn&apos;t cost families thousands of
              dollars. AccessPath runs entirely in your browser with a full demo dataset —
              and connects to your own Supabase database when you&apos;re ready to go
              live. Everything is open, explainable, and free.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup">
                <Button size="lg">
                  Start your journey
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <Link href="/matcher">
                <Button size="lg" variant="glass">
                  See the matcher
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}
