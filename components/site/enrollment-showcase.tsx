"use client";

import * as React from "react";
import { useActionState } from "react";
import {
  CheckCircle2,
  Clock3,
  GraduationCap,
  Megaphone,
  Palette,
  Code2,
  MonitorSmartphone,
  Smartphone,
  BrainCircuit,
  Sparkles,
  MapPin,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { submitEnrollment, type EnrollmentState } from "@/app/(site)/classes/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CourseShape = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  level: string | null;
  duration: string | null;
  mode: string | null;
  shortDescription: string;
  description: string | null;
  syllabus: string[];
  prerequisites: string[];
  price: string | null;
};

const CATEGORY_ICONS: Record<string, typeof Sparkles> = {
  "Digital Marketing": Megaphone,
  "Graphic Design": Palette,
  "Web Development": Code2,
  "IT & Digital Skills": MonitorSmartphone,
  "Mobile Development": Smartphone,
  "Data & AI": BrainCircuit,
};

const OTHER_COURSE = "__other__";
const OTHER_LABEL = "A class not listed above / not sure yet";

const initialState: EnrollmentState = { ok: false };

export function EnrollmentShowcase({ courses }: { courses: CourseShape[] }) {
  const [state, action, pending] = useActionState(submitEnrollment, initialState);
  const [courseValue, setCourseValue] = React.useState("");
  const [courseSlug, setCourseSlug] = React.useState("");
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const pickCourse = React.useCallback((course: CourseShape) => {
    setCourseValue(course.name);
    setCourseSlug(course.slug);
    requestAnimationFrame(() => {
      document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const onCourseChange = (value: string) => {
    if (value === OTHER_COURSE) {
      setCourseValue(OTHER_LABEL);
      setCourseSlug("");
    } else {
      setCourseValue(value);
      setCourseSlug(courses.find((c) => c.name === value)?.slug ?? "");
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-start">
      {/* ------- Course catalog ------- */}
      <div className="space-y-4">
        {courses.map((course, i) => {
          const Icon = CATEGORY_ICONS[course.category ?? ""] ?? GraduationCap;
          const isOpen = expanded === course.id;
          return (
            <article
              key={course.id}
              className="group relative overflow-hidden rounded-2xl gradient-border bg-card/80 p-6 transition-all hover:-translate-y-0.5 sm:p-7"
            >
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/15 to-cyan-400/15 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary">
                        {course.category ?? "Class"}
                      </p>
                      <h3 className="text-lg font-semibold tracking-tight">{course.name}</h3>
                    </div>
                  </div>
                  {course.price ? (
                    <span className="shrink-0 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {course.price}
                    </span>
                  ) : null}
                </div>

                <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                  {course.shortDescription}
                </p>

                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                  {course.level ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-primary/60" />
                      {course.level}
                    </span>
                  ) : null}
                  {course.duration ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="size-3.5 text-primary/60" />
                      {course.duration}
                    </span>
                  ) : null}
                  {course.mode ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-primary/60" />
                      {course.mode}
                    </span>
                  ) : null}
                </div>

                {course.syllabus.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {(isOpen ? course.syllabus : course.syllabus.slice(0, 4)).map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground"
                      >
                        {topic}
                      </span>
                    ))}
                    {!isOpen && course.syllabus.length > 4 ? (
                      <span className="rounded-full border border-border/70 px-2.5 py-0.5 font-mono text-[0.65rem] text-primary">
                        +{course.syllabus.length - 4} more
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <div
                  className={cn(
                    "grid transition-all duration-300",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-4 border-t border-border/60 pt-4">
                      {course.description ? (
                        <p className="text-sm leading-6 text-muted-foreground">
                          {course.description}
                        </p>
                      ) : null}
                      {course.prerequisites.length > 0 ? (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-foreground/90">
                            Who it&apos;s for
                          </p>
                          <ul className="mt-1.5 flex flex-wrap gap-1.5">
                            {course.prerequisites.map((p) => (
                              <li
                                key={p}
                                className="rounded-full border border-border/70 bg-background/50 px-2.5 py-0.5 text-xs text-foreground"
                              >
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={async () => {
                      pickCourse(course);
                      setExpanded(null);
                    }}
                    className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_40px_-12px_rgba(59,130,246,0.8)] transition-shadow hover:shadow-[0_18px_50px_-12px_rgba(34,211,238,0.8)]"
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                    <span className="relative flex items-center gap-2">
                      Request enrollment
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setExpanded(isOpen ? null : course.id)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    {isOpen ? "Hide details" : "Course details"}
                    <ChevronDown
                      className={cn("size-4 transition-transform duration-300", isOpen && "rotate-180")}
                    />
                  </button>
                </div>
              </div>
              <span className="pointer-events-none absolute -right-2 top-2 font-mono text-5xl font-bold tabular-nums text-primary/5">
                {String(i + 1).padStart(2, "0")}
              </span>
            </article>
          );
        })}
      </div>

      {/* ------- Enrollment form ------- */}
      <div id="enroll" className="scroll-mt-24 lg:sticky lg:top-24">
        <div className="rounded-2xl gradient-border bg-card/85 p-6 sm:p-7">
          {state.ok ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <CheckCircle2 className="size-12 text-success" />
              <h3 className="text-xl font-semibold">Request received</h3>
              <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                Thanks for your interest. Our team will review your request and contact you about
                availability and next steps — usually within one working day.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={() => {
                  setCourseValue("");
                  setCourseSlug("");
                  window.history.replaceState(null, "", "#enroll");
                }}
              >
                Submit another request
              </Button>
            </div>
          ) : (
            <form action={action} className="space-y-5" noValidate>
              <div>
                <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary">
                  Request to join
                </p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight">Enroll in a class</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Tell us which class you&apos;re interested in and we&apos;ll confirm a seat and
                  schedule with you.
                </p>
              </div>

              {state.error ? (
                <p className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error">{state.error}</p>
              ) : null}

              {/* Honeypot — hidden from humans, spam bots tend to fill it */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Leave this field empty</label>
                <Input id="website" name="website" autoComplete="off" tabIndex={-1} />
              </div>

              <Field htmlFor="name" label="Full name" error={state.details?.name?.[0]}>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field htmlFor="email" label="Email" error={state.details?.email?.[0]}>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@email.com"
                    autoComplete="email"
                    required
                  />
                </Field>
                <Field htmlFor="phone" label="Phone" error={state.details?.phone?.[0]} optional>
                  <Input id="phone" name="phone" placeholder="+977 ..." autoComplete="tel" />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="course">Course / class</Label>
                  <input type="hidden" name="course" value={courseValue} />
                  <input type="hidden" name="courseSlug" value={courseSlug} />
                  <Select
                    id="course"
                    value={courseValue}
                    onChange={(e) => onCourseChange(e.target.value)}
                    aria-invalid={Boolean(state.details?.course?.[0])}
                    aria-describedby={state.details?.course?.[0] ? "course-error" : undefined}
                  >
                    <option value="">Choose a class</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    <option value={OTHER_COURSE}>{OTHER_LABEL}</option>
                  </Select>
                  {state.details?.course?.[0] ? (
                    <p id="course-error" className="text-xs text-error">
                      {state.details.course[0]}
                    </p>
                  ) : null}
                </div>
                <Field htmlFor="experience" label="Experience" optional>
                  <Select id="experience" name="experience" defaultValue="">
                    <option value="">Your current level</option>
                    <option value="not sure">Not sure</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </Select>
                </Field>
              </div>

              <Field
                htmlFor="schedule"
                label="Preferred schedule"
                error={state.details?.schedule?.[0]}
                optional
              >
                <Input
                  id="schedule"
                  name="schedule"
                  placeholder="e.g. weekend only, evening batch, ASAP"
                />
              </Field>

              <Field htmlFor="message" label="Message" error={state.details?.message?.[0]} optional>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Anything we should know — goals, timeframe, questions..."
                  rows={4}
                />
              </Field>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <Button type="submit" disabled={pending} className="w-full sm:w-auto">
                  {pending ? "Submitting..." : "Submit enrollment request"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  No payment now — we confirm availability first.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
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