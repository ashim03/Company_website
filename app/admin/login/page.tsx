import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      <div className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-blue-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 size-96 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="relative w-full max-w-sm">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-slate-300 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to website
        </Link>
        <div className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.97] p-6 shadow-2xl shadow-blue-950/40 sm:p-7">
          <div className="space-y-1">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
              C
            </div>
            <h1 className="text-xl font-semibold tracking-tight">CodAstra CMS</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to manage the website content.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
