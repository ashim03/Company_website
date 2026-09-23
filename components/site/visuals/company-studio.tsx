import { Braces, Check, GraduationCap, Palette, ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/site/brand-mark";
import styles from "./company-studio.module.css";

/** A decorative studio scene, complete even when motion is disabled. */
export function CompanyStudio() {
  return (
    <div className={styles.studio} aria-hidden="true">
      <div className={styles.grid} />
      <div className={styles.topline}>
        <span><i /> THE CODASTRA STUDIO</span>
        <span>IDEAS → IMPACT</span>
      </div>

      <svg className={styles.connections} viewBox="0 0 500 560" preserveAspectRatio="none">
        <path d="M125 150 C125 280 250 190 250 280 S375 360 375 420 M375 150 C375 260 250 210 250 280 S125 350 125 420" />
        <path className={styles.signal} d="M125 150 C125 280 250 190 250 280 S375 360 375 420 M375 150 C375 260 250 210 250 280 S125 350 125 420" />
      </svg>

      <div className={styles.cards}>
        <div className={`${styles.card} ${styles.design}`}>
          <div className={styles.cardTitle}><Palette size={16} /><span>Design</span><span className={styles.number}>01</span></div>
          <div className={styles.designPreview}><span /><span /><span /></div>
          <div className={styles.swatches}><i /><i /><i /><i /><span>Make it memorable.</span></div>
        </div>
        <div className={`${styles.card} ${styles.develop}`}>
          <div className={styles.cardTitle}><Braces size={16} /><span>Develop</span><span className={styles.number}>02</span></div>
          <div className={styles.code}><span>const idea = build(&#123;</span><span>&nbsp; craft: &quot;thoughtful&quot;,</span><span>&nbsp; purpose: &quot;growth&quot;</span><span>&#125;);<b /></span></div>
          <div className={styles.status}><Check size={12} /> Ready for what&apos;s next</div>
        </div>

        <div className={styles.center}>
          <div className={styles.orbit}><i /></div>
          <div className={styles.innerOrbit} />
          <div className={styles.identity}><BrandMark className="w-20 sm:w-24" /></div>
          <span className={styles.centerLabel}>ONE TEAM. EVERY POSSIBILITY.</span>
        </div>

        <div className={`${styles.card} ${styles.learn}`}>
          <div className={styles.cardTitle}><GraduationCap size={17} /><span>Learn</span><span className={styles.number}>03</span></div>
          <div className={styles.lesson}><span>Learn by building</span><span>Practice. Create. Grow.</span></div>
          <div className={styles.progress}><i /></div>
          <div className={styles.steps}><span>Explore</span><span>Practice</span><span>Create</span></div>
        </div>
        <div className={`${styles.card} ${styles.launch}`}>
          <div className={styles.cardTitle}><ArrowUpRight size={16} /><span>Grow</span><span className={styles.number}>04</span></div>
          <div className={styles.chart}>{[28, 44, 37, 65, 55, 82, 100].map((height, i) => <i key={i} style={{ height: `${height}%`, animationDelay: `${i * 120}ms` }} />)}</div>
          <span className={styles.caption}>Built to move you forward.</span>
        </div>
      </div>
      <div className={styles.bottomline}><span>Strategy meets creativity.</span><span>Built in Nepal <ArrowUpRight size={13} /></span></div>
    </div>
  );
}
