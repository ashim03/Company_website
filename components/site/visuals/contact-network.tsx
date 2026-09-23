import type { CSSProperties } from "react";
import { User, Lightbulb, Braces, Rocket, MessageCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/site/brand-mark";
import styles from "./contact-network.module.css";

const STAGES = [
  { title: "Your brief", detail: "Tell us what matters", icon: User, tag: "You bring the vision" },
  { title: "Explore ideas", detail: "Find the right direction", icon: Lightbulb, tag: "We connect the dots" },
  { title: "CodAstra Labs", detail: "Your team, from day one", icon: MessageCircle, tag: "Create together" },
  { title: "Build a solution", detail: "Turn the plan into a product", icon: Braces, tag: "Thoughtfully crafted" },
  { title: "Launch & grow", detail: "Go live. Keep improving.", icon: Rocket, tag: "Ready for what’s next" },
];

export function ContactNetwork({ className }: { className?: string }) {
  return (
    <section className={cn(styles.network, className)} aria-label="How we work together">
      <div className={styles.header}>
        <span className={styles.eyebrow}>LET’S BUILD SOMETHING TOGETHER</span>
        <h2>Every great project starts with a conversation.</h2>
      </div>
      <div className={styles.journey}>
        <div className={styles.track} aria-hidden="true"><i /></div>
        <ol className={styles.stages}>
          {STAGES.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <li className={cn(styles.stage, i === 2 && styles.team)} key={stage.title} style={{ "--stage-delay": `${-((5 - i) % 5) * 2}s` } as CSSProperties}>
                <span className={styles.number}>0{i + 1}</span>
                <div className={styles.symbol}>
                  {i === 2 ? <BrandMark className="w-16" /> : <Icon size={25} aria-hidden="true" />}
                </div>
                <div className={styles.copy}><h3>{stage.title}</h3><p>{stage.detail}</p></div>
                <span className={styles.tag}>{stage.tag}</span>
                {i < STAGES.length - 1 && <ArrowRight className={styles.next} size={14} aria-hidden="true" />}
              </li>
            );
          })}
        </ol>
      </div>
      <div className={styles.footer}>
        <span className={styles.call}><MessageCircle size={15} aria-hidden="true" /> A practical first call. A clear next step.</span>
        <span className={styles.caption}>Your vision <ArrowRight size={12} aria-hidden="true" /> our shared next chapter</span>
      </div>
    </section>
  );
}
