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
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to website
        </Link>
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
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