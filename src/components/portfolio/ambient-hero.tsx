"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import styles from "./ambient-hero.module.css";

export function AmbientHero() {
  const reduceMotion = useReducedMotion();

  // Subtle parallax on scroll - using window scroll for smooth effect
  const { scrollYProgress } = useScroll();

  const parallaxY = useTransform(scrollYProgress, [0, 0.3], [0, 60]);
  const parallaxScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.08]);
  const secondaryParallaxY = useTransform(scrollYProgress, [0, 0.3], [0, 40]);

  return (
    <div className={styles.frame} aria-hidden="true">
      <div className={styles.grid} />

      {/* Core orb - slow orbital drift */}
      <motion.div
        className={`${styles.orb} ${styles.core}`}
        style={
          reduceMotion
            ? undefined
            : {
                y: parallaxY,
                scale: parallaxScale,
              }
        }
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 18, -14, 0],
                y: [0, -12, 16, 0],
                rotate: [0, 5, -4, 0],
                scale: [1, 1.04, 0.98, 1],
              }
        }
        transition={{
          duration: 22,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Secondary orb - offset drift */}
      <motion.div
        className={`${styles.orb} ${styles.secondary}`}
        style={
          reduceMotion
            ? undefined
            : {
                y: secondaryParallaxY,
              }
        }
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, -16, 14, 0],
                y: [0, 14, -16, 0],
                rotate: [0, -6, 5, 0],
                scale: [1, 0.97, 1.03, 1],
              }
        }
        transition={{
          duration: 24,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Highlight accent - pulse glow */}
      <motion.div
        className={`${styles.orb} ${styles.highlight}`}
        animate={
          reduceMotion
            ? undefined
            : {
                opacity: [0.55, 0.75, 0.5, 0.55],
                scale: [1, 1.08, 0.95, 1],
              }
        }
        transition={{
          duration: 14,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Structural rings */}
      <div className={styles.ring} />
      <div className={styles.ringMinor} />

      {/* Bottom haze */}
      <div className={styles.haze} />

      {/* Ambient shimmer line - desktop only */}
      <motion.div
        className={styles.shimmer}
        animate={
          reduceMotion
            ? undefined
            : {
                x: ["-100%", "200%"],
                opacity: [0, 0.6, 0],
              }
        }
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 6,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
