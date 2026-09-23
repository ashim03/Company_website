import type { Metadata } from "next";
import Link from "next/link";
import { StickyNote, Users, CalendarClock, MessageCircle, GraduationCap } from "lucide-react";
import { getCourses } from "@/lib/queries";
import { PageHeader } from "@/components/site/page-header";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { text } from "@/lib/types";
import {
  EnrollmentShowcase,
  type CourseShape,
} from "@/components/site/enrollment-showcase";

export const metadata: Metadata = {
  title: "Classes & Training — CodAstra Labs",
  description:
    "Professional classes in digital marketing, graphic design, web development, mobile apps, and IT & digital skills — practical, project-based training in Nepal and online.",
};

const HOW_IT_WORKS = [
  {
    icon: GraduationCap,
    title: "Choose your class",
    description: "Pick the course that matches your goals and current level.",
  },
  {
    icon: StickyNote,
    title: "Request to enroll",
    description: "Submit a short request — no payment until we confirm a seat.",
  },
  {
    icon: CalendarClock,
    title: "We confirm the schedule",
    description: "Our team contacts you with batch availability and next steps.",
  },
  {
    icon: MessageCircle,
    title: "Start learning hands-on",
    description: "Build real projects in small, practical sessions with working professionals.",
  },
];

export default async function ClassesPage() {
  const courses = await getCourses();
  const shapes: CourseShape[] = courses.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    category: c.category,
    level: c.level,
    duration: c.duration,
    mode: c.mode,
    shortDescription: c.shortDescription,
    description: text(c.description),
    syllabus: c.syllabus,
    prerequisites: c.prerequisites,
    price: text(c.price),
  }));

  return (
    <>
      <PageHeader
        eyebrow="Classes & training"
        splitHeading
        title="Practical classes that build real skills"
        description="Professional training in digital marketing, design, development, mobile apps, and IT skills — taught through real projects, not theory dumps."
      />

      <Container className="py-16 md:py-20">
        {shapes.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Classes are being prepared — check back soon.
          </p>
        ) : (
          <EnrollmentShowcase courses={shapes} />
        )}
      </Container>

      <Container className="pb-20 md:pb-28">
        <div className="rounded-3xl gradient-border bg-card/80 p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/15 to-cyan-400/15 text-primary">
              <Users className="size-5" />
            </span>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">How joining works</h2>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step, i) => (
              <Reveal key={step.title} delay={i * 80}>
                <div className="flex h-full flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <step.icon className="size-5 text-primary" />
                    <span className="font-mono text-xs font-bold tabular-nums text-primary/60">
                      STEP 0{i + 1}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold">{step.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 border-t border-border/60 pt-6">
            <p className="text-sm text-muted-foreground">
              Unsure which class fits?{" "}
              <Link href="/contact" className="font-medium text-primary hover:underline">
                Tell us about your goals
              </Link>{" "}
              and we&apos;ll point you in the right direction.
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}