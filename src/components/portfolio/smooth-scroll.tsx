"use client";

import { motion, useScroll, useTransform, useMotionTemplate, type MotionValue } from "motion/react";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// Type for scroll context that handles SSR
interface ScrollContextType {
  scrollY: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
  scrollX: MotionValue<number>;
  scrollXProgress: MotionValue<number>;
}

// Context for smooth scroll state across the app
const SmoothScrollContext = createContext<ScrollContextType | null>(null);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const scroll = useScroll();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // During SSR and initial client render, just render children without context
  // This prevents hydration mismatch from useScroll accessing window
  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <SmoothScrollContext.Provider value={scroll}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  const context = useContext(SmoothScrollContext);
  // Return null-safe defaults if not mounted yet
  if (!context) {
    return null;
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
  const scroll = useSmoothScroll();
  const scrollYProgress = scroll?.scrollYProgress;
  
  const y = useTransform(scrollYProgress ?? { get: () => 0, set: () => {} } as MotionValue<number>, [0, 1], offset);
  const scaleVal = useTransform(scrollYProgress ?? { get: () => 0, set: () => {} } as MotionValue<number>, [0, 1], scale);

  // Return static version during SSR
  if (!scroll) {
    return <div className={className}>{children}</div>;
  }

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
  const scroll = useSmoothScroll();
  const scrollYProgress = scroll?.scrollYProgress;
  
  // Map scroll to opacity for smooth fade-in as user scrolls
  const opacity = useTransform(
    scrollYProgress ?? { get: () => 0, set: () => {} } as MotionValue<number>, 
    [0, 0.15], 
    [0.3, 1]
  );

  // Return static version during SSR
  if (!scroll) {
    return <div className={className}>{children}</div>;
  }

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
  const scroll = useSmoothScroll();
  const scrollYProgress = scroll?.scrollYProgress;
  
  const fallbackValue = { get: () => 0, set: () => {} } as MotionValue<number>;
  const scaleX = useTransform(scrollYProgress ?? fallbackValue, [0, 1], [0, 1]);
  const origin = useMotionTemplate`${useTransform(scrollYProgress ?? fallbackValue, [0, 1], [0, 100])}%`;

  // Return nothing during SSR
  if (!scroll) {
    return null;
  }

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
