"use client";

import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

type RevealDirection = "center" | "left" | "right" | "top" | "bottom";

interface MediaClipRevealProps {
  /** Content to reveal (image, video, etc.) */
  children: ReactNode;
  /** Direction the reveal animates from */
  direction?: RevealDirection;
  /** Initial inset percentage */
  inset?: number;
  /** Border radius in pixels */
  borderRadius?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Animation delay in seconds */
  delay?: number;
  /** Whether to add parallax scroll effect */
  parallax?: boolean;
  /** Parallax intensity (-1 to 1, where 0.1 = 10% movement) */
  parallaxIntensity?: number;
  /** Scale animation start value */
  scaleFrom?: number;
  /** Additional className */
  className?: string;
}

const easeOutExpo = [0.16, 1, 0.3, 1];

/**
 * MediaClipReveal - Cuberto-style clip-path reveal animation for media
 * 
 * Usage:
 * <MediaClipReveal direction="center" parallax>
 *   <Image src="..." alt="..." fill />
 * </MediaClipReveal>
 * 
 * Features:
 * - Clip-path based reveal animation
 * - Multiple reveal directions
 * - Optional parallax on scroll
 * - Scale animation
 */
export function MediaClipReveal({
  children,
  direction = "center",
  inset = 10,
  borderRadius = 18,
  duration = 1.4,
  delay = 0,
  parallax = false,
  parallaxIntensity = 0.15,
  scaleFrom = 0.94,
  className = "",
}: MediaClipRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const reduceMotion = useReducedMotion();

  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [100 * parallaxIntensity, -100 * parallaxIntensity]
  );

  // Generate clip-path based on direction
  const getClipPath = (revealed: boolean) => {
    const i = revealed ? 0 : inset;
    const r = `${borderRadius}px`;

    switch (direction) {
      case "left":
        return `inset(0% ${revealed ? 0 : 100 - inset}% 0% 0% round ${r})`;
      case "right":
        return `inset(0% 0% 0% ${revealed ? 0 : 100 - inset}% round ${r})`;
      case "top":
        return `inset(0% 0% ${revealed ? 0 : 100 - inset}% 0% round ${r})`;
      case "bottom":
        return `inset(${revealed ? 0 : 100 - inset}% 0% 0% 0% round ${r})`;
      case "center":
      default:
        return `inset(${i}% ${i}% ${i}% ${i}% round ${r})`;
    }
  };

  // Reduced motion fallback
  if (reduceMotion) {
    return (
      <div ref={ref} className={`relative overflow-hidden ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial={{
        clipPath: getClipPath(false),
        scale: scaleFrom,
        opacity: 0,
      }}
      animate={
        isInView
          ? {
              clipPath: getClipPath(true),
              scale: 1,
              opacity: 1,
            }
          : {
              clipPath: getClipPath(false),
              scale: scaleFrom,
              opacity: 0,
            }
      }
      transition={{
        duration,
        delay,
        ease: easeOutExpo,
      }}
      style={{
        borderRadius,
      }}
    >
      <motion.div
        className="h-full w-full"
        style={parallax ? { y: parallaxY } : undefined}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/**
 * ImageHoverZoom - Smooth zoom effect on hover for images
 */
export function ImageHoverZoom({
  children,
  scale = 1.05,
  duration = 0.6,
  className = "",
}: {
  children: ReactNode;
  scale?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      whileHover="hover"
      initial="initial"
    >
      <motion.div
        variants={{
          initial: { scale: 1 },
          hover: { scale },
        }}
        transition={{
          duration,
          ease: easeOutExpo,
        }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/**
 * VideoReveal - Clip-path reveal specifically for video elements
 */
export function VideoReveal({
  src,
  poster,
  className = "",
  ...revealProps
}: Omit<MediaClipRevealProps, "children"> & {
  src: string;
  poster?: string;
}) {
  return (
    <MediaClipReveal className={className} {...revealProps}>
      <video
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
      />
    </MediaClipReveal>
  );
}
