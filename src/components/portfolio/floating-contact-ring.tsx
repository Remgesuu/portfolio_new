"use client";

import { motion, AnimatePresence, useScroll, useReducedMotion } from "motion/react";
import { useState, useEffect } from "react";
import Image from "next/image";

interface FloatingContactRingProps {
  /** Email address for contact */
  email: string;
  /** Optional phone number */
  phone?: string;
  /** Avatar image source */
  avatarSrc?: string;
  /** Avatar alt text */
  avatarAlt?: string;
  /** Scroll threshold before showing */
  showAfterScroll?: number;
  /** Text to display in rotating ring */
  ringText?: string;
}

/**
 * FloatingContactRing - Cuberto-style floating contact widget
 * 
 * Features:
 * - Circular avatar with rotating text ring
 * - Appears after scroll threshold
 * - Expands on hover/click to show contact options
 * - Respects reduced motion preferences
 */
export function FloatingContactRing({
  email,
  phone,
  avatarSrc,
  avatarAlt = "Contact avatar",
  showAfterScroll = 400,
  ringText = "contact",
}: FloatingContactRingProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Repeat ring text to fill the circle
  const repeatedText = `${ringText} · `.repeat(6);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsVisible(latest > showAfterScroll);
    });
    return unsubscribe;
  }, [scrollY, showAfterScroll]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25 
          }}
        >
          {/* Main button with rotating ring */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative flex h-16 w-16 items-center justify-center md:h-20 md:w-20"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open contact options"
            aria-expanded={isExpanded}
          >
            {/* Static text ring - no rotation for performance */}
            <div className="absolute inset-0">
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full"
                style={{ 
                  animation: reduceMotion ? "none" : "spin 30s linear infinite",
                }}
              >
                <defs>
                  <path
                    id="circlePath"
                    d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  />
                </defs>
                <text
                  style={{
                    fontSize: "10px",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fill: "var(--text-disabled)",
                  }}
                >
                  <textPath href="#circlePath" startOffset="0%">
                    {repeatedText}
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Inner avatar circle */}
            <div
              className="relative z-10 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border shadow-md md:h-12 md:w-12"
              style={{
                borderColor: "var(--border-default)",
                backgroundColor: "var(--bg-surface)",
              }}
            >
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt={avatarAlt}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span 
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {email.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </motion.button>

          {/* Expanded contact panel */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="absolute bottom-full right-0 mb-3 min-w-56 overflow-hidden rounded-xl border p-4 shadow-lg backdrop-blur-xl"
                style={{
                  borderColor: "var(--border-default)",
                  backgroundColor: "var(--bg-glass-strong)",
                }}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 25 
                }}
              >
                <p 
                  className="mb-3 font-mono text-xs uppercase tracking-widest"
                  style={{ color: "var(--text-disabled)" }}
                >
                  Get in touch
                </p>

                <div className="space-y-2">
                  <a
                    href={`mailto:${email}`}
                    className="block rounded-lg px-3 py-2 font-mono text-sm transition-colors"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      color: "var(--accent-primary)",
                    }}
                  >
                    {email}
                  </a>

                  {phone && (
                    <a
                      href={`tel:${phone.replace(/\D/g, "")}`}
                      className="block rounded-lg px-3 py-2 font-mono text-sm transition-colors"
                      style={{
                        backgroundColor: "var(--bg-surface)",
                        color: "var(--accent-primary)",
                      }}
                    >
                      {phone}
                    </a>
                  )}
                </div>

                <p 
                  className="mt-3 border-t pt-3 text-xs"
                  style={{
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-disabled)",
                  }}
                >
                  Available for remote work
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
