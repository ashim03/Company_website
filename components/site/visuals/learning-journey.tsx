import type { CSSProperties } from "react";
import { BookOpen, Repeat, Hammer, Rocket, GraduationCap, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./learning-journey.module.css";

const STEPS = [
  { label: "Learn", detail: "Concepts & tools", icon: BookOpen, note: "Discover" },
  { label: "Practice", detail: "Guided exercises", icon: Repeat, note: "Try it" },
  { label: "Build", detail: "Real projects", icon: Hammer, note: "Create" },
  { label: "Launch", detail: "Your portfolio", icon: Rocket, note: "Take off" },
] as const;

/** The four-step loop is decorative, not a learner's actual progress. */
export function LearningJourney({ className }: { className?: string }) {
  return (
    <div className={cn(styles.journey, className)}>
      <div className={styles.heading}>
        <span className={styles.cap}><GraduationCap size={22} /></span>
        <div><span className={styles.eyebrow}>YOUR LEARNING JOURNEY</span><p>Small steps. Real skills.</p></div>
        <ArrowUpRight className={styles.arrow} size={20} aria-hidden="true" />
      </div>
      <div className={styles.path}>
        <div className={styles.spine} aria-hidden="true"><i /></div>
        <ol className={styles.steps}>
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.label} className={styles.step} style={{ "--step-delay": `${-((4 - i) % 4) * 2}s` } as CSSProperties}>
                <span className={styles.icon}><Icon size={22} aria-hidden="true" /></span>
                <div className={styles.copy}>
                  <div className={styles.title}><span>0{i + 1}</span><h3>{step.label}</h3></div>
                  <p>{step.detail}</p>
                </div>
                <span className={styles.note} aria-hidden="true">{step.note}<ArrowUpRight size={12} /></span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className={styles.footer}>
        <div className={styles.segments} aria-hidden="true">{STEPS.map((step, i) => <i key={step.label} style={{ "--step-delay": `${-((4 - i) % 4) * 2}s` } as CSSProperties} />)}</div>
        <span>Hands-on from day one</span><Rocket size={15} aria-hidden="true" />
      </div>
    </div>
  );
}
