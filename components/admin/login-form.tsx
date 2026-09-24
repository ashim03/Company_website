"use client";

import { useActionState, useEffect, useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, type LoginState } from "@/app/admin/actions/session";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const seconds = state.retryAt ? Math.max(0, Math.ceil((state.retryAt - now) / 1000)) : 0;

  return (
    <form action={formAction} autoComplete="off" className="space-y-4">
      {state.error ? (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.retryAt ? seconds > 0 ? `Too many failed attempts. Try again in ${seconds} seconds.` : "You can try signing in again." : state.error}
        </div>
      ) : null}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="off"
          placeholder="Enter your email"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <div className="relative"><Input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="off"
          placeholder="Enter your password"
          className="pr-12"
          required
        /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} aria-controls="password" onClick={() => setShowPassword(value => !value)} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div>
      </div>
      <Button type="submit" className="w-full" disabled={pending || seconds > 0}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        {seconds > 0 ? `Try again in ${seconds}s` : "Sign in"}
      </Button>
    </form>
  );
}
