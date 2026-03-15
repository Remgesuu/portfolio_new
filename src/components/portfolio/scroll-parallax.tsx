"use client";

import { motion, useScroll, useTransform, useSpring, type MotionValue } from "motion/react";
import { useRef, type ReactNode, type CSSProperties } from "react";

interface ScrollParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number; // -1 to 1, negative = opposite direction
  direction?: "y" | "x" | "both";
  offset?: [string, string]; // viewport intersection points
  scale?: [number, number];
  opacity?: [number, number];
  rotate?: [number, number];
  blur?: [number, number];
  style?: CSSProperties;
}

export function ScrollParallax({
  children,
  className,
  speed = 0.3,
  direction = "y",
  offset = ["start end", "end start"],
  scale,
  opacity,
  rotate,
  blur,
  style,
}: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as ["start end", "end start"],
  });

  // Calculate parallax offset based on speed
  const baseOffset = speed * 100;
  const yOffset = useTransform(scrollYProgress, [0, 1], [baseOffset, -baseOffset]);
  const xOffset = useTransform(scrollYProgress, [0, 1], [baseOffset, -baseOffset]);
  
  // Smooth the values
  const springConfig = { damping: 30, stiffness: 100 };
  const smoothY = useSpring(yOffset, springConfig);
  const smoothX = useSpring(xOffset, springConfig);

  // Optional transforms
  const scaleValue = scale
    ? useTransform(scrollYProgress, [0, 1], scale)
    : undefined;
  const opacityValue = opacity
    ? useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [opacity[0], 1, 1, opacity[1]])
    : undefined;
  const rotateValue = rotate
    ? useTransform(scrollYProgress, [0, 1], rotate)
    : undefined;
  const blurValue = blur
    ? useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [blur[0], 0, 0, blur[1]])
    : undefined;

  const motionStyle: Record<string, MotionValue<number> | undefined> = {};
  
  if (direction === "y" || direction === "both") {
    motionStyle.y = smoothY;
  }
  if (direction === "x" || direction === "both") {
    motionStyle.x = smoothX;
  }
  if (scaleValue) {
    motionStyle.scale = scaleValue;
  }
  if (opacityValue) {
    motionStyle.opacity = opacityValue;
  }
  if (rotateValue) {
    motionStyle.rotate = rotateValue;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        ...motionStyle,
        willChange: "transform",
        filter: blurValue ? `blur(${blurValue}px)` : undefined,
      }}
    >
      {children}
    </motion.div>
  );
}

// Scroll-triggered reveal with various effects
interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  variant?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "scale" | "blur";
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
}

export function ScrollReveal({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  duration = 0.8,
  once = true,
  threshold = 0.2,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  // Map scroll progress to animation
  const progress = useTransform(scrollYProgress, [0, threshold], [0, 1]);
  const smoothProgress = useSpring(progress, { damping: 30, stiffness: 100 });

  // Variant-specific transforms
  const getInitialState = () => {
    switch (variant) {
      case "fade-up":
        return { opacity: 0, y: 60 };
      case "fade-down":
        return { opacity: 0, y: -60 };
      case "fade-left":
        return { opacity: 0, x: 60 };
      case "fade-right":
        return { opacity: 0, x: -60 };
      case "scale":
        return { opacity: 0, scale: 0.8 };
      case "blur":
        return { opacity: 0, filter: "blur(20px)" };
      default:
        return { opacity: 0 };
    }
  };

  const getFinalState = () => {
    switch (variant) {
      case "fade-up":
      case "fade-down":
        return { opacity: 1, y: 0 };
      case "fade-left":
      case "fade-right":
        return { opacity: 1, x: 0 };
      case "scale":
        return { opacity: 1, scale: 1 };
      case "blur":
        return { opacity: 1, filter: "blur(0px)" };
      default:
        return { opacity: 1 };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={getInitialState()}
      whileInView={getFinalState()}
      viewport={{ once, amount: threshold }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Sticky scroll section for dramatic reveals
interface StickyScrollProps {
  children: ReactNode;
  className?: string;
  height?: string; // viewport heights, e.g. "200vh"
}

export function StickyScroll({
  children,
  className,
  height = "200vh",
}: StickyScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={ref} className={className} style={{ height }}>
      <div style={{ position: "sticky", top: 0, height: "100vh" }}>
        {typeof children === "function" 
          ? (children as (progress: MotionValue<number>) => ReactNode)(scrollYProgress)
          : children
        }
      </div>
    </div>
  );
}

// Text reveal on scroll - word by word
interface TextRevealProps {
  children: string;
  className?: string;
  wordClassName?: string;
}

export function TextReveal({ children, className, wordClassName }: TextRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 40%"],
  });

  const words = children.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word 
            key={i} 
            progress={scrollYProgress} 
            range={[start, end]}
            className={wordClassName}
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
}

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
}

function Word({ children, progress, range, className }: WordProps) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const y = useTransform(progress, range, [10, 0]);
  
  return (
    <motion.span
      style={{ opacity, y }}
      className={className}
    >
      {children}{" "}
    </motion.span>
  );
}
