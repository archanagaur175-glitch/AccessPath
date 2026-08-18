import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Create your account",
};

export default function SignupPage() {
  return (
    <div className="animate-fade-up">
      <Card variant="glass-strong" className="p-6 sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="text-2xl">Create your free account</CardTitle>
          <CardDescription className="mt-1.5">
            Choose your role — you can always update your profile later.
          </CardDescription>
        </CardHeader>
        <div className="mt-6">
          <SignupForm />
        </div>
      </Card>
      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="inline-flex items-center gap-1 font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          Sign in
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </p>
    </div>
  );
}
