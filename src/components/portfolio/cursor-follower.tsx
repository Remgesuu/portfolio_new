"use client";

import { motion, useMotionValue, useSpring, AnimatePresence, useReducedMotion } from "motion/react";
import { useEffect, useState, useCallback, useRef } from "react";

type CursorVariant = "default" | "link";

interface CursorFollowerProps {
  /** Size of the cursor in pixels */
  size?: number;
  /** Color of the cursor ring */
  color?: string;
}

/**
 * CursorFollower - Simplified custom cursor (performance optimized)
 */
export function CursorFollower({
  size = 10,
  color = "currentColor",
}: CursorFollowerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [isTouchDevice, setIsTouchDevice] = useState(true); // Start as true to prevent flash
  const reduceMotion = useReducedMotion();
  const rafRef = useRef<number>(0);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Lighter spring for performance
  const springConfig = { stiffness: 500, damping: 35, mass: 0.3 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const scale = variant === "link" ? 2.5 : 1;

  useEffect(() => {
    // Check for touch/hover capability
    const hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setIsTouchDevice(!hasHover);
    
    if (!hasHover || reduceMotion) return;

    let lastX = 0;
    let lastY = 0;

    const updatePosition = () => {
      mouseX.set(lastX);
      mouseY.set(lastY);
      rafRef.current = 0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updatePosition);
      }
      
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isLink = 
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button");
      
      setVariant(isLink ? "link" : "default");
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    // Hide default cursor
    document.body.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.body.style.cursor = "";
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mouseX, mouseY, isVisible, reduceMotion]);

  if (isTouchDevice || reduceMotion) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
          style={{ x: cursorX, y: cursorY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.1 }, scale: { duration: 0.15 } }}
        >
          <div
            className="rounded-full bg-white"
            style={{
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
