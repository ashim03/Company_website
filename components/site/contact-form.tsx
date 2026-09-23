"use client";

import * as React from "react";
import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitContact, type ContactState } from "@/app/(site)/contact/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const initialState: ContactState = { ok: false };

export function ContactForm({ services }: { services: { slug: string; name: string }[] }) {
  const [state, action, pending] = useActionState(submitContact, initialState);

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
      {state.ok ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <CheckCircle2 className="size-12 text-success" />
          <h3 className="text-xl font-semibold">Message sent</h3>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            Thanks for getting in touch. We reply to every serious enquiry — usually within one working day.
          </p>
        </div>
      ) : (
        <form action={action} className="space-y-5" noValidate>
          {state.error ? (
            <p className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error">{state.error}</p>
          ) : null}

          {/* Honeypot — hidden from humans, spam bots tend to fill it */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Leave this field empty</label>
            <Input id="website" name="website" autoComplete="off" tabIndex={-1} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field htmlFor="name" label="Name" error={state.details?.name?.[0]}>
              <Input id="name" name="name" placeholder="Your name" autoComplete="name" />
            </Field>
            <Field htmlFor="company" label="Company" error={state.details?.company?.[0]} optional>
              <Input
                id="company"
                name="company"
                placeholder="Company or organisation"
                autoComplete="organization"
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field htmlFor="email" label="Email" error={state.details?.email?.[0]}>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </Field>
            <Field htmlFor="phone" label="Phone" error={state.details?.phone?.[0]} optional>
              <Input id="phone" name="phone" placeholder="+977 ..." autoComplete="tel" />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field htmlFor="service" label="Service" error={state.details?.service?.[0]} optional>
              <Select id="service" name="service" defaultValue="">
                <option value="">What do you need?</option>
                {services.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
                <option value="other">Something else</option>
              </Select>
            </Field>
            <Field htmlFor="budget" label="Budget" error={state.details?.budget?.[0]} optional>
              <Select id="budget" name="budget" defaultValue="">
                <option value="">Estimate range</option>
                <option value="under-1k">Under $1,000</option>
                <option value="1k-5k">$1,000 – $5,000</option>
                <option value="5k-15k">$5,000 – $15,000</option>
                <option value="15k-plus">$15,000+</option>
                <option value="unknown">Not sure yet</option>
              </Select>
            </Field>
          </div>

          <Field htmlFor="message" label="Message" error={state.details?.message?.[0]}>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us about the operation you're building, fixing, or scaling..."
              rows={6}
            />
          </Field>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" disabled={pending} className="w-full sm:w-auto">
              {pending ? "Sending..." : "Send message"}
            </Button>
            <p className="text-xs text-muted-foreground">
              We keep your details private and never share them.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({
  htmlFor,
  label,
  children,
  error,
  optional,
}: {
  htmlFor: string;
  label: string;
  children: React.ReactNode;
  error?: string;
  optional?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-muted-foreground">(optional)</span>
        ) : null}
      </Label>
      {React.isValidElement<{ "aria-describedby"?: string; id?: string }>(children)
        ? React.cloneElement(children, {
            id: htmlFor,
            "aria-describedby": error ? `${htmlFor}-error` : undefined,
          })
        : children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-xs text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}