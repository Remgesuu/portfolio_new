"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { PropsWithChildren } from "react";

export type RevealVariant =
  | "fade-up"
  | "fade"
  | "scale-in"
  | "slide-left"
  | "slide-right"
  | "blur-to-crisp"
  | "stagger";

type RevealProps = PropsWithChildren<{
  className?: string;
  delay?: number;
  distance?: number;
  duration?: number;
  id?: string;
  variant?: RevealVariant;
  staggerChildren?: number;
}>;

const easeOutExpo = [0.16, 1, 0.3, 1] as const;
const easeOutQuint = [0.22, 1, 0.36, 1] as const;

function getVariants(
  variant: RevealVariant,
  distance: number,
  duration: number,
  staggerChildren: number
): Variants {
  const baseTransition = {
    duration,
    ease: easeOutQuint,
  };

  switch (variant) {
    case "fade":
      return {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: baseTransition,
        },
      };

    case "scale-in":
      return {
        hidden: { opacity: 0, scale: 0.92 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration,
            ease: easeOutExpo,
          },
        },
      };

    case "slide-left":
      return {
        hidden: { opacity: 0, x: distance },
        visible: {
          opacity: 1,
          x: 0,
          transition: baseTransition,
        },
      };

    case "slide-right":
      return {
        hidden: { opacity: 0, x: -distance },
        visible: {
          opacity: 1,
          x: 0,
          transition: baseTransition,
        },
      };

    case "blur-to-crisp":
      // Simplified version without filter blur for performance
      return {
        hidden: {
          opacity: 0,
          y: distance * 0.5,
          scale: 0.98,
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: duration * 1.1,
            ease: easeOutExpo,
          },
        },
      };

    case "stagger":
      return {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren,
            delayChildren: 0.1,
          },
        },
      };

    case "fade-up":
    default:
      return {
        hidden: { opacity: 0, y: distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: baseTransition,
        },
      };
  }
}

// Stagger item for use inside stagger containers
export function RevealItem({
  children,
  className,
  distance = 24,
  duration = 0.7,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            ease: easeOutQuint,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
  distance = 30,
  duration = 0.85,
  id,
  variant = "fade-up",
  staggerChildren = 0.08,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} id={id}>
        {children}
      </div>
    );
  }

  const variants = getVariants(variant, distance, duration, staggerChildren);

  return (
    <motion.div
      className={className}
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
