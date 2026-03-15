"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";

interface InverseSectionProps {
  /** Section content */
  children: ReactNode;
  /** Section ID for anchor links */
  id?: string;
  /** Additional className */
  className?: string;
  /** Top corner radius size */
  cornerRadius?: "sm" | "md" | "lg" | "xl" | "2xl";
  /** Vertical padding size */
  padding?: "sm" | "md" | "lg" | "xl";
  /** Background video source (optional) */
  backgroundVideo?: string;
  /** Background image source (optional) */
  backgroundImage?: string;
  /** Background overlay opacity (0-1) */
  overlayOpacity?: number;
  /** Animate entrance */
  animate?: boolean;
}

const radiusMap = {
  sm: "2rem",
  md: "2.5rem",
  lg: "3rem",
  xl: "4rem",
  "2xl": "5rem",
};

const paddingMap = {
  sm: "py-12 md:py-16",
  md: "py-16 md:py-24",
  lg: "py-20 md:py-32",
  xl: "py-24 md:py-40",
};

/**
 * InverseSection - Cuberto-style dark section with rounded top corners
 * 
 * Features:
 * - Dark background with configurable corners
 * - Optional video/image background
 * - Smooth entrance animation
 * - Flexible padding options
 * 
 * Usage:
 * <InverseSection id="projects" cornerRadius="xl">
 *   <h2>Featured Projects</h2>
 * </InverseSection>
 */
export function InverseSection({
  children,
  id,
  className = "",
  cornerRadius = "xl",
  padding = "lg",
  backgroundVideo,
  backgroundImage,
  overlayOpacity = 0.4,
  animate = true,
}: InverseSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const radius = radiusMap[cornerRadius];
  const paddingClass = paddingMap[padding];

  const sectionStyle = {
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
  };

  const content = (
    <>
      {/* Background media */}
      {(backgroundVideo || backgroundImage) && (
        <div className="absolute inset-0 overflow-hidden" style={sectionStyle}>
          {backgroundVideo ? (
            <video
              src={backgroundVideo}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          ) : backgroundImage ? (
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
          ) : null}

          {/* Dark overlay */}
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </>
  );

  if (animate) {
    return (
      <motion.section
        ref={ref}
        id={id}
        className={`
          relative 
          -mx-[var(--page-padding,1.5rem)] 
          bg-[#0a0a0b] 
          text-white
          ${paddingClass}
          px-[var(--page-padding,1.5rem)]
          ${className}
        `}
        style={sectionStyle}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {content}
      </motion.section>
    );
  }

  return (
    <section
      ref={ref}
      id={id}
      className={`
        relative 
        -mx-[var(--page-padding,1.5rem)] 
        bg-[#0a0a0b] 
        text-white
        ${paddingClass}
        px-[var(--page-padding,1.5rem)]
        ${className}
      `}
      style={sectionStyle}
    >
      {content}
    </section>
  );
}

/**
 * SectionDivider - Subtle divider between sections
 */
export function SectionDivider({
  variant = "gradient",
  className = "",
}: {
  variant?: "line" | "gradient" | "space";
  className?: string;
}) {
  if (variant === "space") {
    return <div className={`h-16 md:h-24 ${className}`} />;
  }

  if (variant === "gradient") {
    return (
      <div
        className={`h-px w-full bg-gradient-to-r from-transparent via-border-default to-transparent ${className}`}
      />
    );
  }

  return <div className={`h-px w-full bg-border-default ${className}`} />;
}

/**
 * CTAStage - Final CTA section like Cuberto's "Have an idea?" block
 */
export function CTAStage({
  heading,
  subheading,
  children,
  backgroundVideo,
  id,
  className = "",
}: {
  heading: string;
  subheading?: string;
  children: ReactNode;
  backgroundVideo?: string;
  id?: string;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <InverseSection
      id={id}
      backgroundVideo={backgroundVideo}
      overlayOpacity={0.5}
      cornerRadius="2xl"
      padding="xl"
      className={`text-center ${className}`}
      animate={false}
    >
      <motion.div 
        ref={ref}
        className="mx-auto max-w-3xl"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {subheading && (
          <p className="mb-4 font-mono text-sm uppercase tracking-widest text-white/60">
            {subheading}
          </p>
        )}

        <h2 className="mb-8 text-4xl font-medium leading-tight md:text-6xl lg:text-7xl">
          {heading}
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {children}
        </div>
      </motion.div>
    </InverseSection>
  );
}
