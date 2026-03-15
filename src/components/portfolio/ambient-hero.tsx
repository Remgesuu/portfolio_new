"use client";

import { useReducedMotion } from "motion/react";

import styles from "./ambient-hero.module.css";

export function AmbientHero() {
  const reduceMotion = useReducedMotion();

  // Static orbs with CSS animations instead of JS-driven motion
  // This is much more performant for continuous animations

  return (
    <div className={styles.frame} aria-hidden="true">
      <div className={styles.grid} />

      {/* Core orb - CSS animation for better performance */}
      <div 
        className={`${styles.orb} ${styles.core}`}
        style={{
          animation: reduceMotion ? "none" : "orbFloat 22s ease-in-out infinite",
        }}
      />

      {/* Secondary orb - CSS animation */}
      <div 
        className={`${styles.orb} ${styles.secondary}`}
        style={{
          animation: reduceMotion ? "none" : "orbFloat2 24s ease-in-out infinite",
        }}
      />

      {/* Highlight accent - CSS animation */}
      <div 
        className={`${styles.orb} ${styles.highlight}`}
        style={{
          animation: reduceMotion ? "none" : "orbPulse 14s ease-in-out infinite",
        }}
      />

      {/* Structural rings */}
      <div className={styles.ring} />
      <div className={styles.ringMinor} />

      {/* Bottom haze */}
      <div className={styles.haze} />

      {/* Ambient shimmer line - CSS animation */}
      <div 
        className={styles.shimmer}
        style={{
          animation: reduceMotion ? "none" : "shimmerSlide 10s ease-in-out infinite",
        }}
      />
    </div>
  );
}
