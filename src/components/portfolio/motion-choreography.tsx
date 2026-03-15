"use client";

import { motion, type Variants, AnimatePresence, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * useMotionChoreography - Orchestrates staggered animations for multiple elements
 * Perfect for hero sections, card grids, and list items that need coordinated reveals
 */
export function useMotionChoreography(
  staggerDelay: number = 0.08,
  direction: "up" | "down" | "left" | "right" = "up"
) {
  const distance = 30;

  const getInitialState = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: distance };
      case "down":
        return { opacity: 0, y: -distance };
      case "left":
        return { opacity: 0, x: distance };
      case "right":
        return { opacity: 0, x: -distance };
      default:
        return { opacity: 0 };
    }
  };

  const getAnimateState = () => {
    switch (direction) {
      case "up":
      case "down":
        return { opacity: 1, y: 0, x: 0 };
      case "left":
      case "right":
        return { opacity: 1, x: 0, y: 0 };
      default:
        return { opacity: 1 };
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: getInitialState(),
    visible: {
      ...getAnimateState(),
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1], // easeOutQuint
      },
    },
  };

  return { containerVariants, itemVariants };
}

interface ChoreographyContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

/**
 * ChoreographyContainer - Wraps multiple items for coordinated animations
 * Usage: Wrap grid items or list items that should animate in sequence
 */
export function ChoreographyContainer({
  children,
  staggerDelay = 0.08,
  direction = "up",
  className = "",
}: ChoreographyContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { containerVariants } = useMotionChoreography(staggerDelay, direction);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ChoreographyItemProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  delay?: number;
}

/**
 * ChoreographyItem - Individual item within a choreography container
 * No need to specify delay - parent container handles it automatically
 */
export function ChoreographyItem({
  children,
  direction = "up",
  className = "",
  delay = 0,
}: ChoreographyItemProps) {
  const { itemVariants } = useMotionChoreography(0.08, direction);

  return (
    <motion.div
      variants={itemVariants}
      className={className}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * SectionReveal - Full-width section animation with split text effect
 * Used for major section headings and key messaging
 */
export function SectionReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : "hidden"}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * PulseOnHover - Add subtle pulse effect on hover for engagement
 */
export function PulseOnHover({
  children,
  className = "",
  scale = 1.05,
}: {
  children: ReactNode;
  className?: string;
  scale?: number;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{
        scale,
      }}
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * FadeInSequence - Animates a list of children with fade + slide
 * Perfect for testimonials, features, or list items
 */
export function FadeInSequence({
  children,
  staggerDelay = 0.1,
  className = "",
}: {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {(children as ReactNode[]).map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.6,
            delay: index * staggerDelay,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
