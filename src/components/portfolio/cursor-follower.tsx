"use client";

import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { useEffect, useState, useCallback } from "react";

type CursorVariant = "default" | "text" | "link" | "media" | "action";

interface CursorFollowerProps {
  /** Enable magnetic effect on interactive elements */
  magnetic?: boolean;
  /** Size of the cursor in pixels */
  size?: number;
  /** Color of the cursor ring */
  color?: string;
  /** Spring stiffness for smoother/snappier feel */
  stiffness?: number;
  /** Spring damping */
  damping?: number;
}

/**
 * CursorFollower - Cuberto-style custom cursor with variant states
 * 
 * Usage:
 * 1. Add <CursorFollower /> to your layout
 * 2. Add data-cursor="link|text|media|action" to interactive elements
 * 
 * The cursor will automatically:
 * - Follow mouse with spring physics
 * - Scale up on interactive elements
 * - Show text labels on [data-cursor-text] elements
 * - Hide the default cursor
 */
export function CursorFollower({
  magnetic = true,
  size = 12,
  color = "var(--text-primary)",
  stiffness = 400,
  damping = 28,
}: CursorFollowerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [cursorText, setCursorText] = useState("");
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Raw mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smoothed position with spring physics
  const springConfig = { stiffness, damping, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Scale based on variant
  const getScale = useCallback(() => {
    switch (variant) {
      case "link":
        return 3;
      case "text":
        return 6;
      case "media":
        return 5;
      case "action":
        return 4;
      default:
        return 1;
    }
  }, [variant]);

  useEffect(() => {
    // Check for touch device
    const checkTouch = () => {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();

    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Detect cursor variant from data attributes
    const handleElementInteraction = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorEl = target.closest("[data-cursor]");
      const textEl = target.closest("[data-cursor-text]");

      if (cursorEl) {
        const cursorType = cursorEl.getAttribute("data-cursor") as CursorVariant;
        setVariant(cursorType || "link");
      } else if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button")
      ) {
        setVariant("link");
      } else {
        setVariant("default");
      }

      if (textEl) {
        setCursorText(textEl.getAttribute("data-cursor-text") || "");
      } else {
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleElementInteraction);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleElementInteraction);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isTouchDevice]);

  // Add/remove cursor-none class on body
  useEffect(() => {
    if (isTouchDevice) return;
    
    // Check for hover capability
    const hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!hasHover) return;

    document.body.style.cursor = "none";
    
    // Add cursor-none to all interactive elements
    const style = document.createElement("style");
    style.id = "cursor-follower-styles";
    style.textContent = `
      @media (hover: hover) and (pointer: fine) {
        *, *::before, *::after { cursor: none !important; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.body.style.cursor = "";
      const existingStyle = document.getElementById("cursor-follower-styles");
      if (existingStyle) existingStyle.remove();
    };
  }, [isTouchDevice]);

  // Don't render on touch devices
  if (isTouchDevice) return null;

  return (
    <AnimatePresence>
        {isVisible && (
          <motion.div
            className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
            style={{
              x: cursorX,
              y: cursorY,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: getScale(),
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              scale: { type: "spring", stiffness: 300, damping: 20 },
              opacity: { duration: 0.15 },
            }}
          >
            {/* Outer ring */}
            <motion.div
              className="absolute rounded-full border"
              style={{
                width: size,
                height: size,
                marginLeft: -size / 2,
                marginTop: -size / 2,
                borderColor: color,
                backgroundColor: variant !== "default" ? color : "transparent",
              }}
              animate={{
                borderWidth: variant === "default" ? 1.5 : 0,
              }}
              transition={{ duration: 0.2 }}
            />

            {/* Cursor text label */}
            <AnimatePresence>
              {cursorText && (
                <motion.span
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-medium uppercase tracking-widest"
                  style={{ color: "var(--bg-primary)" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  {cursorText}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
  );
}
