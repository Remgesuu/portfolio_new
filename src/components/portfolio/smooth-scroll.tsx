"use client";

import { motion, useScroll, useTransform, useMotionTemplate } from "motion/react";
import { createContext, useContext, type ReactNode } from "react";

// Context for smooth scroll state across the app
const SmoothScrollContext = createContext<ReturnType<typeof useScroll> | null>(null);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const scroll = useScroll();

  return (
    <SmoothScrollContext.Provider value={scroll}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  const context = useContext(SmoothScrollContext);
  if (!context) {
    throw new Error(
      "useSmoothScroll must be used within SmoothScrollProvider"
    );
  }
  return context;
}

/**
 * Parallax Component - Creates depth through scroll-based transforms
 * Usage: Wrap elements and apply transforms like scale, y-position, etc.
 */
export function Parallax({
  children,
  offset = [0, 100],
  scale = [1, 1.1],
  className,
}: {
  children: ReactNode;
  offset?: [number, number];
  scale?: [number, number];
  className?: string;
}) {
  const { scrollYProgress } = useSmoothScroll();
  
  const y = useTransform(scrollYProgress, [0, 1], offset);
  const scaleVal = useTransform(scrollYProgress, [0, 1], scale);

  return (
    <motion.div style={{ y, scale: scaleVal }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * ScrollReveal Component - Reveals text on scroll with word-by-word opacity
 * Perfect for hero headlines and key messaging
 */
export function ScrollReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { scrollYProgress } = useSmoothScroll();
  
  // Map scroll to opacity for smooth fade-in as user scrolls
  const opacity = useTransform(scrollYProgress, [0, 0.15], [0.3, 1]);

  return (
    <motion.div style={{ opacity }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * ScrollProgress Component - Visual indicator of page scroll position
 * Typically used as a thin line at top or bottom of viewport
 */
export function ScrollProgress({
  className = "fixed top-0 left-0 right-0 h-1 bg-accent-primary",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const { scrollYProgress } = useSmoothScroll();
  
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const origin = useMotionTemplate`${useTransform(scrollYProgress, [0, 1], [0, 100])}%`;

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: origin,
        ...style,
      }}
      className={className}
    />
  );
}
