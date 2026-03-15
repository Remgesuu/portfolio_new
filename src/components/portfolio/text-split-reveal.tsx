"use client";

import { motion, useInView, useReducedMotion, type Variants } from "motion/react";
import { useRef, useMemo } from "react";

type SplitType = "chars" | "words" | "lines";

interface TextSplitRevealProps {
  /** Text content to animate */
  children: string;
  /** Split by characters, words, or lines */
  splitBy?: SplitType;
  /** Animation delay before starting */
  delay?: number;
  /** Stagger delay between each element */
  staggerDelay?: number;
  /** Animation duration per element */
  duration?: number;
  /** Distance to animate from (in pixels) */
  distance?: number;
  /** HTML element to render */
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  /** Additional className */
  className?: string;
  /** Whether to add blur effect */
  blur?: boolean;
  /** Easing function */
  ease?: number[];
}

const easeOutExpo = [0.16, 1, 0.3, 1];
const easeOutQuint = [0.22, 1, 0.36, 1];

/**
 * TextSplitReveal - Cuberto-style text animation with character/word/line splits
 * 
 * Usage:
 * <TextSplitReveal as="h1" splitBy="chars" blur>
 *   Design agency focused
 * </TextSplitReveal>
 * 
 * Features:
 * - Split by characters, words, or lines
 * - Optional blur-to-crisp effect
 * - Staggered reveal animation
 * - Respects reduced motion
 */
export function TextSplitReveal({
  children,
  splitBy = "words",
  delay = 0,
  staggerDelay = 0.03,
  duration = 0.8,
  distance = 40,
  as: Tag = "div",
  className = "",
  blur = false,
  ease = easeOutExpo,
}: TextSplitRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const reduceMotion = useReducedMotion();

  // Split text based on splitBy prop
  const elements = useMemo(() => {
    const text = children.trim();
    
    switch (splitBy) {
      case "chars":
        // Split into characters, preserving spaces as elements
        return text.split("").map((char, i) => ({
          text: char === " " ? "\u00A0" : char,
          key: `char-${i}`,
        }));
      
      case "lines":
        // Split by newlines or manual <br> markers
        return text.split(/\n|<br\s*\/?>/gi).map((line, i) => ({
          text: line.trim(),
          key: `line-${i}`,
        }));
      
      case "words":
      default:
        // Split by words
        return text.split(/\s+/).map((word, i) => ({
          text: word,
          key: `word-${i}`,
        }));
    }
  }, [children, splitBy]);

  // Container variants
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  // Item variants with optional blur
  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: distance,
      filter: blur ? "blur(8px)" : "blur(0px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration,
        ease,
      },
    },
  };

  // Reduced motion fallback
  if (reduceMotion) {
    return (
      <Tag ref={ref} className={className}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={className}>
      <motion.span
        className="inline"
        style={{ display: "inline" }}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        aria-label={children}
      >
        {elements.map((el) => (
          <motion.span
            key={el.key}
            variants={itemVariants}
            className={splitBy === "words" ? "mr-[0.25em]" : ""}
            style={{
              display: "inline-block",
              willChange: "transform, opacity, filter",
            }}
          >
            {el.text}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

/**
 * TextLineReveal - Simpler line-by-line reveal for paragraphs
 */
export function TextLineReveal({
  children,
  delay = 0,
  staggerDelay = 0.1,
  duration = 0.7,
  distance = 30,
  as: Tag = "p",
  className = "",
}: Omit<TextSplitRevealProps, "splitBy" | "blur">) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const reduceMotion = useReducedMotion();

  const lines = useMemo(() => {
    return children.split(/\n/).map((line, i) => ({
      text: line.trim(),
      key: `line-${i}`,
    }));
  }, [children]);

  if (reduceMotion) {
    return (
      <Tag ref={ref} className={className}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <motion.span
          key={line.key}
          className="block overflow-hidden"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: delay + i * staggerDelay }}
        >
          <motion.span
            className="block"
            initial={{ y: distance }}
            animate={isInView ? { y: 0 } : { y: distance }}
            transition={{
              duration,
              delay: delay + i * staggerDelay,
              ease: easeOutQuint,
            }}
          >
            {line.text}
          </motion.span>
        </motion.span>
      ))}
    </Tag>
  );
}
