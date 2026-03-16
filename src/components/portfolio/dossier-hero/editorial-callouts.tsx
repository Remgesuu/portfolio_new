"use client";

import { memo, useMemo } from "react";
import { motion, type MotionValue, useTransform } from "motion/react";
import { EDITORIAL_CALLOUTS, CALLOUT_TRANSFORMS, COLORS } from "./dossier-hero.config";

/**
 * EditorialCallouts
 * 
 * Atmospheric text that appears around the book at specific scroll positions.
 * 
 * Design principles:
 * - Editorial, not dashboard-like
 * - Minimal and restrained
 * - Support the book, don't compete with it
 * - Live in the margins, respect negative space
 */

interface EditorialCalloutsProps {
  /** Scroll progress (0-1) */
  progress: number;
  /** Whether desktop mode */
  isDesktop: boolean;
  /** Whether reduced motion */
  reducedMotion: boolean;
}

export const EditorialCallouts = memo(function EditorialCallouts({
  progress,
  isDesktop,
  reducedMotion,
}: EditorialCalloutsProps) {
  // Don't render on mobile or reduced motion
  if (!isDesktop || reducedMotion) {
    return null;
  }

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {EDITORIAL_CALLOUTS.map((callout) => (
        <CalloutItem
          key={callout.id}
          callout={callout}
          progress={progress}
        />
      ))}
    </div>
  );
});

// ============================================
// Individual Callout Item
// ============================================

interface CalloutItemProps {
  callout: typeof EDITORIAL_CALLOUTS[number];
  progress: number;
}

const CalloutItem = memo(function CalloutItem({
  callout,
  progress,
}: CalloutItemProps) {
  const { text, position, range, offset } = callout;
  const [rangeStart, rangeEnd] = range;

  // Calculate local progress within this callout's range
  const localProgress = useMemo(() => {
    if (progress < rangeStart) return 0;
    if (progress > rangeEnd) return 1;
    return (progress - rangeStart) / (rangeEnd - rangeStart);
  }, [progress, rangeStart, rangeEnd]);

  // Check if callout should be visible
  const isVisible = progress >= rangeStart && progress <= rangeEnd;

  // Calculate transform values
  const transforms = CALLOUT_TRANSFORMS.enter;
  
  const getTransformValue = (
    config: { keys: readonly number[]; values: readonly number[] },
    local: number
  ): number => {
    const { keys, values } = config;
    if (local <= keys[0]) return values[0];
    if (local >= keys[keys.length - 1]) return values[values.length - 1];

    for (let i = 0; i < keys.length - 1; i++) {
      if (local >= keys[i] && local <= keys[i + 1]) {
        const t = (local - keys[i]) / (keys[i + 1] - keys[i]);
        return values[i] + (values[i + 1] - values[i]) * t;
      }
    }
    return values[values.length - 1];
  };

  const opacity = getTransformValue(transforms.opacity, localProgress);
  const y = getTransformValue(transforms.y, localProgress);
  const blur = getTransformValue(transforms.blur, localProgress);

  // Position styles
  const positionStyles: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    [position === "left" ? "right" : "left"]: `calc(50% + ${Math.abs(offset.x)}%)`,
    transform: `translateY(calc(-50% + ${offset.y}vh + ${y}px))`,
  };

  if (!isVisible && opacity === 0) {
    return null;
  }

  return (
    <motion.p
      className="text-xs font-light tracking-widest max-w-[160px]"
      style={{
        ...positionStyles,
        opacity: opacity * 0.65, // More subtle
        filter: `blur(${blur}px)`,
        color: COLORS.midTone,
        textAlign: position === "left" ? "right" : "left",
        lineHeight: 1.6,
        letterSpacing: "0.08em",
        textTransform: "lowercase",
      }}
    >
      {text}
    </motion.p>
  );
});

export default EditorialCallouts;
