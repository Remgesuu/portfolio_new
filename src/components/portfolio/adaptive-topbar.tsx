"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import Link from "next/link";
import { isInternalRouteHref } from "@/lib/url-utils";
import { TOPBAR_TIMELINE, STAGES } from "./dossier-hero/dossier-hero.config";
import styles from "./adaptive-topbar.module.css";

interface NavItem {
  label: string;
  href: string;
}

interface AdaptiveTopbarProps {
  nav: NavItem[];
  className?: string;
}

/**
 * AdaptiveTopbar
 * 
 * Collapses during hero scroll:
 * - 0.00-0.12: Full topbar (logo + all links)
 * - 0.12-0.24: Collapsing (nav fades out)
 * - 0.24-0.84: Minimal (logo + stage chip only)
 * - 0.84-0.96: Restoring (nav fades in)
 * - 0.96+: Full topbar
 */
export function AdaptiveTopbar({ nav, className = "" }: AdaptiveTopbarProps) {
  const [heroProgress, setHeroProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<string>("intro");
  const progress = useMotionValue(0);

  // Listen for hero scroll progress
  useEffect(() => {
    const handleScroll = () => {
      // Find the dossier hero section
      const heroSection = document.querySelector("[data-scroll-sequence]");
      if (!heroSection) return;

      const rect = heroSection.getBoundingClientRect();
      const containerTop = window.scrollY + rect.top;
      const containerHeight = heroSection.scrollHeight - window.innerHeight;

      if (containerHeight <= 0) return;

      const scrolled = window.scrollY - containerTop;
      const newProgress = Math.max(0, Math.min(1, scrolled / containerHeight));
      
      setHeroProgress(newProgress);
      progress.set(newProgress);

      // Determine current stage
      const stage = STAGES.find(
        (s) => newProgress >= s.range[0] && newProgress < s.range[1]
      );
      if (stage) {
        setCurrentStage(stage.id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [progress]);

  // Determine if in minimal mode
  const isMinimal = heroProgress >= TOPBAR_TIMELINE.collapseEnd && 
                    heroProgress <= TOPBAR_TIMELINE.restoreStart;

  // Transform values
  const navOpacity = useTransform(
    progress,
    [
      TOPBAR_TIMELINE.collapseStart,
      TOPBAR_TIMELINE.collapseEnd,
      TOPBAR_TIMELINE.restoreStart,
      TOPBAR_TIMELINE.restoreEnd,
    ],
    [1, 0, 0, 1]
  );

  const navX = useTransform(
    progress,
    [TOPBAR_TIMELINE.collapseStart, TOPBAR_TIMELINE.collapseEnd],
    [0, 12]
  );

  const indicatorOpacity = useTransform(
    progress,
    [
      TOPBAR_TIMELINE.collapseStart,
      TOPBAR_TIMELINE.collapseEnd,
      TOPBAR_TIMELINE.restoreStart,
      TOPBAR_TIMELINE.restoreEnd,
    ],
    [0, 1, 1, 0]
  );

  const pillOpacity = useTransform(
    progress,
    [0, TOPBAR_TIMELINE.collapseEnd, TOPBAR_TIMELINE.restoreStart, 1],
    [1, 0.85, 0.85, 1]
  );

  // Get stage label for indicator
  const stageLabel = useMemo(() => {
    const stage = STAGES.find((s) => s.id === currentStage);
    return stage?.label || "";
  }, [currentStage]);

  const stageIndex = useMemo(() => {
    return STAGES.findIndex((s) => s.id === currentStage);
  }, [currentStage]);

  return (
    <motion.header
      className={`${styles.topbar} ${className}`}
      style={{ opacity: pillOpacity }}
    >
      {/* Logo/Home button */}
      <Link className={styles.homeButton} href="/" aria-label="Home">
        <span className={styles.homeIcon}>G</span>
      </Link>

      {/* Navigation links - hidden in minimal mode */}
      <motion.nav
        className={styles.navPill}
        style={{ opacity: navOpacity, x: navX }}
        aria-hidden={isMinimal}
        aria-label="Primary"
      >
        {nav.map((item) =>
          isInternalRouteHref(item.href) ? (
            <Link
              key={item.href}
              className={styles.navLink}
              href={item.href}
              tabIndex={isMinimal ? -1 : 0}
            >
              {item.label}
            </Link>
          ) : (
            <a
              key={item.href}
              className={styles.navLink}
              href={item.href}
              tabIndex={isMinimal ? -1 : 0}
            >
              {item.label}
            </a>
          )
        )}
      </motion.nav>

      {/* Stage indicator - visible only in minimal mode */}
      <motion.div
        className={styles.stageIndicator}
        style={{ opacity: indicatorOpacity }}
        aria-hidden={!isMinimal}
      >
        {stageLabel && (
          <>
            <span className={styles.stageLabel}>{stageLabel}</span>
            <span className={styles.stageDot} />
            <span className={styles.stageCount}>
              {String(stageIndex).padStart(2, "0")} / {String(STAGES.length - 1).padStart(2, "0")}
            </span>
          </>
        )}
      </motion.div>
    </motion.header>
  );
}

export default AdaptiveTopbar;
