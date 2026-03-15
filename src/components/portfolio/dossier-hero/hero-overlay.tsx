"use client";

import { useMemo } from "react";
import { motion, useTransform, AnimatePresence, type MotionValue } from "motion/react";
import { CTAButton } from "../cta-button";
import { siteContent } from "@/content/site-content";
import {
  COLORS,
  TEXT_TRANSITION,
  LEFT_COPY_TRANSFORMS,
  RIGHT_RAIL_TRANSFORMS,
  EVIDENCE_TRANSFORMS,
  STAGES,
} from "./dossier-hero.config";
import type { HeroOverlayProps, DossierStage } from "./dossier-hero.types";
import styles from "./hero-overlay.module.css";

/**
 * HeroOverlay
 * 
 * All text content with parallax transforms.
 * - Left: headline, description, CTA (fast Z-exit)
 * - Right: stage label, thought, progress rail (slow parallax)
 * - Evidence: appears on resolved stage
 * 
 * This component receives progress as MotionValue for reactive transforms.
 */
export function HeroOverlay({
  progress,
  stage,
  isDesktop,
  reducedMotion,
  resumeHref,
  contactHref,
  className = "",
}: HeroOverlayProps) {
  const { hero } = siteContent;

  // Text color transitions
  const textPrimary = useTransform(
    progress,
    [...TEXT_TRANSITION.primary.keys],
    [...TEXT_TRANSITION.primary.colors]
  );
  const textSecondary = useTransform(
    progress,
    [...TEXT_TRANSITION.secondary.keys],
    [...TEXT_TRANSITION.secondary.colors]
  );

  // Left copy transforms
  const leftTransforms = useMemo(() => {
    if (reducedMotion) {
      return {
        eyebrow: { y: 0, scale: 1, opacity: 1, blur: 0 },
        title: { y: 0, scale: 1, opacity: 1, blur: 0 },
        description: { y: 0, scale: 1, opacity: 1, blur: 0 },
        cta: { y: 0, opacity: 1, scale: 1 },
        scrollHint: { y: 0, opacity: 0.6 },
      };
    }
    return null; // Use motion transforms
  }, [reducedMotion]);

  return (
    <div className={`${styles.overlay} ${className}`}>
      {/* Three-column grid */}
      <div className={styles.grid}>
        {/* LEFT: Headline, description, CTA */}
        <div className={styles.leftCopy}>
          <LeftCopyContent
            progress={progress}
            textPrimary={textPrimary}
            textSecondary={textSecondary}
            reducedMotion={reducedMotion}
            hero={hero}
            resumeHref={resumeHref}
            contactHref={contactHref}
            stage={stage}
          />
        </div>

        {/* CENTER: Spacer for book */}
        <div className={styles.centerSpacer} />

        {/* RIGHT: Stage label, thought, progress rail, evidence */}
        <div className={styles.rightRail}>
          <RightRailContent
            progress={progress}
            stage={stage}
            hero={hero}
            textSecondary={textSecondary}
            reducedMotion={reducedMotion}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================
// Left Copy Component
// ============================================

interface LeftCopyProps {
  progress: MotionValue<number>;
  textPrimary: MotionValue<string>;
  textSecondary: MotionValue<string>;
  reducedMotion: boolean;
  hero: typeof siteContent.hero;
  resumeHref: string;
  contactHref: string;
  stage: DossierStage;
}

function LeftCopyContent({
  progress,
  textPrimary,
  textSecondary,
  reducedMotion,
  hero,
  resumeHref,
  contactHref,
  stage,
}: LeftCopyProps) {
  const transforms = LEFT_COPY_TRANSFORMS;

  // Eyebrow transforms
  const eyebrowY = useTransform(progress, [...transforms.eyebrow.y.keys], [...transforms.eyebrow.y.values]);
  const eyebrowScale = useTransform(progress, [...transforms.eyebrow.scale.keys], [...transforms.eyebrow.scale.values]);
  const eyebrowOpacity = useTransform(progress, [...transforms.eyebrow.opacity.keys], [...transforms.eyebrow.opacity.values]);
  const eyebrowBlur = useTransform(progress, [...transforms.eyebrow.blur.keys], [...transforms.eyebrow.blur.values]);

  // Title transforms
  const titleY = useTransform(progress, [...transforms.title.y.keys], [...transforms.title.y.values]);
  const titleScale = useTransform(progress, [...transforms.title.scale.keys], [...transforms.title.scale.values]);
  const titleOpacity = useTransform(progress, [...transforms.title.opacity.keys], [...transforms.title.opacity.values]);
  const titleBlur = useTransform(progress, [...transforms.title.blur.keys], [...transforms.title.blur.values]);

  // Description transforms
  const descY = useTransform(progress, [...transforms.description.y.keys], [...transforms.description.y.values]);
  const descScale = useTransform(progress, [...transforms.description.scale.keys], [...transforms.description.scale.values]);
  const descOpacity = useTransform(progress, [...transforms.description.opacity.keys], [...transforms.description.opacity.values]);
  const descBlur = useTransform(progress, [...transforms.description.blur.keys], [...transforms.description.blur.values]);

  // CTA transforms
  const ctaY = useTransform(progress, [...transforms.cta.y.keys], [...transforms.cta.y.values]);
  const ctaOpacity = useTransform(progress, [...transforms.cta.opacity.keys], [...transforms.cta.opacity.values]);
  const ctaScale = useTransform(progress, [...transforms.cta.scale.keys], [...transforms.cta.scale.values]);

  // Scroll hint transforms
  const hintY = useTransform(progress, [...transforms.scrollHint.y.keys], [...transforms.scrollHint.y.values]);
  const hintOpacity = useTransform(progress, [...transforms.scrollHint.opacity.keys], [...transforms.scrollHint.opacity.values]);

  if (reducedMotion) {
    return (
      <>
        <p className={styles.eyebrow} style={{ color: COLORS.midTone }}>
          {hero.eyebrow}
        </p>
        <h1 className={styles.title}>{hero.title}</h1>
        <p className={styles.description}>{hero.description}</p>
        <div className={styles.ctaRow}>
          <CTAButton as="a" href={resumeHref} variant="primary" size="lg">
            View Resume
          </CTAButton>
          <CTAButton as="a" href={contactHref} variant="ghost" size="lg">
            Contact
          </CTAButton>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Eyebrow */}
      <motion.p
        className={styles.eyebrow}
        style={{
          y: eyebrowY,
          scale: eyebrowScale,
          opacity: eyebrowOpacity,
          filter: useTransform(eyebrowBlur, (b) => `blur(${b}px)`),
          color: textSecondary,
        }}
      >
        {hero.eyebrow}
      </motion.p>

      {/* Title */}
      <motion.h1
        className={styles.title}
        style={{
          y: titleY,
          scale: titleScale,
          opacity: titleOpacity,
          filter: useTransform(titleBlur, (b) => `blur(${b}px)`),
          color: textPrimary,
        }}
      >
        {hero.title}
      </motion.h1>

      {/* Description */}
      <motion.p
        className={styles.description}
        style={{
          y: descY,
          scale: descScale,
          opacity: descOpacity,
          filter: useTransform(descBlur, (b) => `blur(${b}px)`),
          color: textSecondary,
        }}
      >
        {hero.description}
      </motion.p>

      {/* CTA Row */}
      <motion.div
        className={styles.ctaRow}
        style={{
          y: ctaY,
          opacity: ctaOpacity,
          scale: ctaScale,
        }}
        data-cta-area="true"
      >
        <CTAButton as="a" href={resumeHref} variant="primary" size="lg">
          View Resume
        </CTAButton>
        <CTAButton as="a" href={contactHref} variant="ghost" size="lg">
          Contact
        </CTAButton>
      </motion.div>

      {/* Scroll hint - only visible at start */}
      <motion.div
        className={styles.scrollHint}
        style={{
          y: hintY,
          opacity: hintOpacity,
          color: textSecondary,
        }}
      >
        <span className={styles.scrollIcon}>
          <motion.span
            className={styles.scrollDot}
            animate={{ y: [2, 14, 2] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        <span>Scroll to explore</span>
      </motion.div>
    </>
  );
}

// ============================================
// Right Rail Component
// ============================================

interface RightRailProps {
  progress: MotionValue<number>;
  stage: DossierStage;
  hero: typeof siteContent.hero;
  textSecondary: MotionValue<string>;
  reducedMotion: boolean;
}

function RightRailContent({
  progress,
  stage,
  hero,
  textSecondary,
  reducedMotion,
}: RightRailProps) {
  // Progress rail transforms
  const railY = useTransform(
    progress,
    [...RIGHT_RAIL_TRANSFORMS.progressRail.y.keys],
    [...RIGHT_RAIL_TRANSFORMS.progressRail.y.values]
  );
  const railOpacity = useTransform(
    progress,
    [...RIGHT_RAIL_TRANSFORMS.progressRail.opacity.keys],
    [...RIGHT_RAIL_TRANSFORMS.progressRail.opacity.values]
  );

  // Evidence transforms
  const evidenceY = useTransform(
    progress,
    [...EVIDENCE_TRANSFORMS.container.y.keys],
    [...EVIDENCE_TRANSFORMS.container.y.values]
  );
  const evidenceScale = useTransform(
    progress,
    [...EVIDENCE_TRANSFORMS.container.scale.keys],
    [...EVIDENCE_TRANSFORMS.container.scale.values]
  );
  const evidenceOpacity = useTransform(
    progress,
    [...EVIDENCE_TRANSFORMS.container.opacity.keys],
    [...EVIDENCE_TRANSFORMS.container.opacity.values]
  );
  const evidenceBlur = useTransform(
    progress,
    [...EVIDENCE_TRANSFORMS.container.blur.keys],
    [...EVIDENCE_TRANSFORMS.container.blur.values]
  );

  // Get current stage data
  const showStageContent = stage.id !== "intro" && stage.id !== "resolved";
  const showEvidence = stage.id === "resolved";

  return (
    <>
      {/* Stage label + thought (top right) */}
      <div className={styles.stageArea}>
        <AnimatePresence mode="wait">
          {showStageContent && stage.label && (
            <StageContent
              key={`stage-${stage.id}`}
              stage={stage}
              textSecondary={textSecondary}
              reducedMotion={reducedMotion}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Progress indicator */}
      <motion.div
        className={styles.progressRail}
        style={{
          y: railY,
          opacity: railOpacity,
        }}
      >
        {STAGES.filter((s) => s.label).map((s, i) => (
          <div
            key={s.id}
            className={styles.progressTick}
            data-active={stage.index >= STAGES.findIndex((st) => st.id === s.id)}
          >
            <span
              className={styles.progressBar}
              style={{
                width: stage.id === s.id ? `${Math.min(100, stage.localProgress * 100)}%` : stage.index > STAGES.findIndex((st) => st.id === s.id) ? "100%" : "0%",
              }}
            />
          </div>
        ))}
      </motion.div>

      {/* Evidence section (bottom right, appears on resolved) */}
      <motion.div
        className={styles.evidenceArea}
        style={{
          y: evidenceY,
          scale: evidenceScale,
          opacity: evidenceOpacity,
          filter: useTransform(evidenceBlur, (b) => `blur(${b}px)`),
        }}
      >
        <p className={styles.evidenceLabel}>EVIDENCE</p>
        <div className={styles.evidenceGrid}>
          {hero.signals.slice(0, 3).map((signal, i) => (
            <motion.div
              key={signal.label}
              className={styles.evidenceItem}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: showEvidence ? 1 : 0, y: showEvidence ? 0 : 10 }}
              transition={{ delay: i * EVIDENCE_TRANSFORMS.itemStagger }}
            >
              <span className={styles.evidenceValue}>{signal.value}</span>
              <span className={styles.evidenceDesc}>{signal.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

// ============================================
// Stage Content Component (animated per stage)
// ============================================

interface StageContentProps {
  stage: DossierStage;
  textSecondary: MotionValue<string>;
  reducedMotion: boolean;
}

function StageContent({ stage, textSecondary, reducedMotion }: StageContentProps) {
  const transforms = RIGHT_RAIL_TRANSFORMS;
  const local = stage.localProgress;

  // Calculate transform values based on local progress
  const getTransformValue = (
    config: { keys: readonly number[]; values: readonly number[] },
    localProgress: number
  ): number => {
    const { keys, values } = config;
    if (localProgress <= keys[0]) return values[0];
    if (localProgress >= keys[keys.length - 1]) return values[values.length - 1];

    for (let i = 0; i < keys.length - 1; i++) {
      if (localProgress >= keys[i] && localProgress <= keys[i + 1]) {
        const t = (localProgress - keys[i]) / (keys[i + 1] - keys[i]);
        return values[i] + (values[i + 1] - values[i]) * t;
      }
    }
    return values[values.length - 1];
  };

  if (reducedMotion) {
    return (
      <div className={styles.stageContent}>
        <p className={styles.stageLabel} style={{ color: COLORS.brassActive }}>
          {stage.label}
        </p>
        {stage.thought && (
          <p className={styles.stageThought}>"{stage.thought}"</p>
        )}
      </div>
    );
  }

  const labelY = getTransformValue(transforms.stageLabel.y, local);
  const labelX = getTransformValue(transforms.stageLabel.x, local);
  const labelOpacity = getTransformValue(transforms.stageLabel.opacity, local);
  const labelBlur = getTransformValue(transforms.stageLabel.blur, local);
  const labelScale = getTransformValue(transforms.stageLabel.scale, local);

  const thoughtY = getTransformValue(transforms.thought.y, local);
  const thoughtX = getTransformValue(transforms.thought.x, local);
  const thoughtOpacity = getTransformValue(transforms.thought.opacity, local);
  const thoughtBlur = getTransformValue(transforms.thought.blur, local);

  return (
    <motion.div
      className={styles.stageContent}
      initial={{ opacity: 0, x: 24, filter: "blur(10px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: -10, filter: "blur(8px)" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.p
        className={styles.stageLabel}
        style={{
          color: COLORS.brassActive,
          y: labelY,
          x: labelX,
          opacity: labelOpacity,
          scale: labelScale,
          filter: `blur(${labelBlur}px)`,
        }}
      >
        {stage.label}
      </motion.p>
      {stage.thought && (
        <motion.p
          className={styles.stageThought}
          style={{
            color: textSecondary,
            y: thoughtY,
            x: thoughtX,
            opacity: thoughtOpacity,
            filter: `blur(${thoughtBlur}px)`,
          }}
        >
          "{stage.thought}"
        </motion.p>
      )}
    </motion.div>
  );
}
