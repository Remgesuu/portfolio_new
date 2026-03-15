"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  variant?: "fade" | "slide" | "curtain" | "blur";
}

/**
 * Wraps page content with cinematic transitions between routes.
 * Respects user's reduced motion preferences.
 */
export function PageTransition({ children, variant = "blur" }: PageTransitionProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    curtain: {
      initial: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
      animate: { opacity: 1, clipPath: "inset(0 0 0% 0)" },
      exit: { opacity: 0, clipPath: "inset(100% 0 0 0)" },
    },
    blur: {
      initial: { opacity: 0, filter: "blur(12px)", y: 20 },
      animate: { opacity: 1, filter: "blur(0px)", y: 0 },
      exit: { opacity: 0, filter: "blur(8px)", y: -10 },
    },
  };

  const currentVariant = variants[variant];

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={currentVariant.initial}
        animate={currentVariant.animate}
        exit={currentVariant.exit}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Fullscreen curtain overlay for dramatic page transitions
 */
export function TransitionCurtain() {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      <motion.div
        key={`curtain-${pathname}`}
        className="pointer-events-none fixed inset-0 z-[9990]"
        style={{ background: "var(--color-night-900)" }}
        initial={{ scaleY: 0, transformOrigin: "bottom" }}
        animate={{ 
          scaleY: [0, 1, 1, 0],
          transformOrigin: ["bottom", "bottom", "top", "top"]
        }}
        transition={{
          duration: 0.8,
          times: [0, 0.4, 0.6, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </AnimatePresence>
  );
}
