"use client";

import { motion, useInView, type Variants } from "motion/react";
import { useRef, type ReactNode } from "react";
import { usePreloader } from "./preloader";

// Stagger configuration for hero elements
const staggerChildren = 0.12;
const delayAfterPreloader = 0.3;

// Parent container variants
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren: delayAfterPreloader,
    },
  },
};

// Individual element variants
const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    filter: "blur(8px)",
  },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1], // ease-out-quint
    },
  },
};

// Title with character split animation
const titleVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 60,
    rotateX: -15,
    filter: "blur(12px)",
  },
  visible: { 
    opacity: 1, 
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Visual element (profile image) with scale
const visualVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
    y: 30,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
      delay: delayAfterPreloader + 0.2,
    },
  },
};

interface HeroEntranceProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}

export function HeroEntrance({ children, className, as = "section" }: HeroEntranceProps) {
  const { hasLoaded } = usePreloader();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const Component = motion[as] as typeof motion.section;

  return (
    <Component
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={hasLoaded && isInView ? "visible" : "hidden"}
    >
      {children}
    </Component>
  );
}

interface HeroItemProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "title" | "visual";
  delay?: number;
}

export function HeroItem({ 
  children, 
  className, 
  variant = "default",
  delay = 0,
}: HeroItemProps) {
  const variants = 
    variant === "title" ? titleVariants :
    variant === "visual" ? visualVariants :
    itemVariants;

  return (
    <motion.div
      className={className}
      variants={variants}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  );
}

// Text split animation for dramatic headlines
interface SplitTextProps {
  children: string;
  className?: string;
  type?: "words" | "chars";
}

export function SplitText({ children, className, type = "words" }: SplitTextProps) {
  const { hasLoaded } = usePreloader();
  
  const elements = type === "words" 
    ? children.split(" ") 
    : children.split("");

  const charVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      rotateX: -40,
    },
    visible: (i: number) => ({
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: delayAfterPreloader + i * 0.04,
      },
    }),
  };

  return (
    <span className={className} style={{ display: "inline-flex", flexWrap: "wrap", perspective: "1000px" }}>
      {elements.map((element, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={charVariants}
          initial="hidden"
          animate={hasLoaded ? "visible" : "hidden"}
          style={{ 
            display: "inline-block",
            marginRight: type === "words" ? "0.3em" : undefined,
            transformStyle: "preserve-3d",
          }}
        >
          {element}
        </motion.span>
      ))}
    </span>
  );
}

// Parallax container for scroll-based effects
interface ParallaxHeroProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxHero({ children, className, speed = 0.5 }: ParallaxHeroProps) {
  return (
    <motion.div
      className={className}
      style={{ 
        willChange: "transform",
      }}
      initial={{ y: 0 }}
      whileInView={{ y: 0 }}
      viewport={{ once: false, amount: 0 }}
    >
      {children}
    </motion.div>
  );
}
