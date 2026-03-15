"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useTransform, useMotionValueEvent } from "motion/react";
import { DioramaScene } from "../diorama-scene";
import { BookSequenceCanvas } from "./book-sequence-canvas";
import { HeroOverlay } from "./hero-overlay";
import { useDossierProgress } from "./hooks/use-dossier-progress";
import { usePointerParallax } from "./hooks/use-pointer-parallax";
import { COLORS, BG_TRANSITION, SCROLL_HEIGHT_VH } from "./dossier-hero.config";
import type { DossierHeroProps } from "./dossier-hero.types";
import styles from "./dossier-hero.module.css";

/**
 * DossierHero - Orchestrator Component
 * 
 * This is the ONLY component that knows about scroll.
 * It coordinates all layers and passes normalized data to children.
 * 
 * Layers:
 * - bgLayer: DioramaScene (3D atmosphere)
 * - bookLayer: BookSequenceCanvas (video scrubbing)
 * - overlayLayer: HeroOverlay (text + CTA)
 */
export function DossierHero({
  resumeHref = "/resume",
  contactHref = "#contact",
  onProgressChange,
  onStageChange,
}: DossierHeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  
  // Device/capability detection
  const [isDesktop, setIsDesktop] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  // Derived interactive state
  const isInteractive = isDesktop && !reducedMotion;

  // Progress and stage from custom hook
  const { progress, progressValue, velocity, velocityValue, stage } = useDossierProgress(containerRef);
  
  // Pointer tracking for parallax
  const { pointer, bind } = usePointerParallax(containerRef, { 
    enabled: isInteractive,
    smoothing: 0.08,
  });

  // Detect device capabilities
  useEffect(() => {
    const checkDevice = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isNarrow = window.innerWidth < 1024;
      setIsDesktop(!isMobile && !isNarrow);
    };

    const checkMotion = () => {
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };

    checkDevice();
    checkMotion();

    window.addEventListener("resize", checkDevice);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionQuery.addEventListener("change", checkMotion);

    return () => {
      window.removeEventListener("resize", checkDevice);
      motionQuery.removeEventListener("change", checkMotion);
    };
  }, []);

  // Emit progress changes to parent
  useMotionValueEvent(progress, "change", (value) => {
    onProgressChange?.(value);
  });

  // Emit stage changes to parent
  useEffect(() => {
    onStageChange?.(stage);
  }, [stage, onStageChange]);

  // Background color transition
  const bgColor = useTransform(
    progress,
    BG_TRANSITION.keys,
    BG_TRANSITION.colors
  );

  // Vignette opacity (appears in final 30%)
  const vignetteOpacity = useTransform(progress, [0.7, 0.9, 1], [0, 0.4, 0.7]);

  // Corner mark color (adapts to background)
  const markColor = useTransform(
    progress,
    [0, 0.7, 0.9, 1],
    [COLORS.brassMuted, COLORS.brassMuted, COLORS.brass, COLORS.brassActive]
  );

  return (
    <section
      ref={containerRef}
      className={styles.scrollTrack}
      style={{ 
        height: `${SCROLL_HEIGHT_VH}vh`,
        // Initial background to prevent flash during hydration
        backgroundColor: COLORS.studioWhite,
      }}
      data-scroll-sequence
      aria-label="Introduction"
      {...bind}
    >
      {/* Sticky window - everything pinned here */}
      <motion.div
        className={styles.stickyWindow}
        style={{ backgroundColor: bgColor }}
      >
        {/* Background Layer - 3D Atmosphere */}
        <div className={styles.bgLayer}>
          {isInteractive && (
            <DioramaScene
              progress={progressValue}
              velocity={velocityValue}
              pointer={pointer}
              stageIndex={stage.index}
              className="w-full h-full"
            />
          )}
        </div>

        {/* Book Layer - Video Sequence */}
        <div className={styles.bookLayer}>
          <BookSequenceCanvas
            progress={progressValue}
            stage={stage}
            isInteractive={isInteractive}
          />
        </div>

        {/* Overlay Layer - Text + CTA */}
        <div className={styles.overlayLayer}>
          <HeroOverlay
            progress={progress}
            stage={stage}
            isDesktop={isDesktop}
            reducedMotion={reducedMotion}
            resumeHref={resumeHref}
            contactHref={contactHref}
          />
        </div>

        {/* Vignette - dark edges on transition */}
        <motion.div
          className={styles.vignette}
          style={{
            opacity: vignetteOpacity,
            background: `
              radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, ${COLORS.nearBlack} 100%),
              linear-gradient(to top, ${COLORS.nearBlack} 0%, transparent 40%)
            `,
          }}
        />

        {/* Corner Marks - editorial crop marks */}
        <motion.div className={styles.cornerMarks} style={{ color: markColor }}>
          <div className={styles.cornerMark} />
          <div className={styles.cornerMark} />
          <div className={styles.cornerMark} />
          <div className={styles.cornerMark} />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default DossierHero;
