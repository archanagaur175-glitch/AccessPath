import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="animate-fade-up">
      <Card variant="glass-strong" className="p-6 sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription className="mt-1.5">
            Sign in to continue your college admissions journey.
          </CardDescription>
        </CardHeader>
        <div className="mt-6">
          <LoginForm />
        </div>
      </Card>
      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        New to AccessPath?{" "}
        <Link
          href="/signup"
          className="inline-flex items-center gap-1 font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          Create a free account
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </p>
    </div>
  );
}
