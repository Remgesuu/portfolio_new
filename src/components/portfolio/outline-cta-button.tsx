"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, type ReactNode } from "react";

interface OutlineCTAButtonProps {
  children: ReactNode;
  /** Render as anchor or button */
  as?: "a" | "button";
  href?: string;
  onClick?: () => void;
  /** Style variant */
  variant?: "default" | "ghost";
  /** Size variant */
  size?: "sm" | "md" | "lg" | "xl";
  /** Enable ripple effect on click */
  ripple?: boolean;
  /** Icon to show on left */
  icon?: ReactNode;
  /** Icon to show on right */
  rightIcon?: ReactNode;
  /** Additional className */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** External link (adds target="_blank") */
  external?: boolean;
}

const sizeStyles = {
  sm: "px-4 py-2 text-xs min-h-9",
  md: "px-6 py-3 text-sm min-h-11",
  lg: "px-8 py-4 text-base min-h-13",
  xl: "px-12 py-5 text-lg min-h-16",
};

/**
 * OutlineCTAButton - Cuberto-style pill outline button with hover fill
 * 
 * Features:
 * - Rounded pill shape with border
 * - Fill animation on hover
 * - Optional ripple effect
 * - Multiple size variants
 * - Text color inversion on hover
 */
export function OutlineCTAButton({
  children,
  as,
  href,
  onClick,
  variant = "default",
  size = "lg",
  ripple = true,
  icon,
  rightIcon,
  className = "",
  disabled = false,
  external = false,
}: OutlineCTAButtonProps) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;

    // Add ripple effect
    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples((prev) => [...prev, { id, x, y }]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    }

    onClick?.();
  };

  const variantStyles = variant === "ghost" 
    ? "border-white/30 hover:border-white/60" 
    : "border-white";

  const baseClassName = `
    group relative inline-flex items-center justify-center gap-2
    rounded-full border-2 ${variantStyles}
    font-medium tracking-wide
    overflow-hidden
    transition-colors duration-300
    ${sizeStyles[size]}
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    ${className}
  `;

  const content = (
    <>
      {/* Background fill on hover */}
      <motion.span
        className="absolute inset-0 bg-white origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: r.x,
              top: r.y,
              width: 10,
              height: 10,
              marginLeft: -5,
              marginTop: -5,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 40, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Content layer */}
      <span className="relative z-10 flex items-center gap-2 text-white group-hover:text-black transition-colors duration-300">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={baseClassName}
        onClick={handleClick}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      className={baseClassName}
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {content}
    </motion.button>
  );
}

/**
 * OutlineCTALink - Simplified outline link variant
 */
export function OutlineCTALink({
  children,
  href,
  className = "",
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`
        inline-flex items-center gap-2
        rounded-full border border-border-default
        px-5 py-2.5
        text-sm font-medium text-text-primary
        bg-transparent
        hover:bg-text-primary hover:text-text-inverse
        hover:border-text-primary
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </a>
  );
}
