"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export type CTAVariant = "primary" | "secondary" | "ghost" | "outline";
export type CTASize = "sm" | "md" | "lg";

interface CTAButtonProps {
  children: ReactNode;
  variant?: CTAVariant;
  size?: CTASize;
  as?: "button" | "a";
  href?: string;
  target?: string;
  rel?: string;
  isLoading?: boolean;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const variantStyles: Record<CTAVariant, string> = {
  primary:
    "bg-accent-primary text-white hover:bg-accent-primary-hover shadow-md hover:shadow-lg",
  secondary:
    "bg-accent-secondary text-white hover:bg-accent-secondary-hover shadow-md hover:shadow-lg",
  ghost:
    "text-accent-primary hover:text-accent-primary-hover hover:bg-accent-primary-subtle",
  outline:
    "border border-accent-primary text-accent-primary hover:bg-accent-primary-subtle",
};

const sizeStyles: Record<CTASize, string> = {
  sm: "px-3 py-2 text-xs min-h-9",
  md: "px-5 py-3 text-sm min-h-10",
  lg: "px-6 py-4 text-base min-h-12",
};

function CTAButtonContent({ children, isLoading, icon, rightIcon }: Omit<CTAButtonProps, 'as' | 'href'>) {
  return (
    <>
      {icon && !isLoading && <span className="mr-2 flex-shrink-0">{icon}</span>}
      {isLoading && (
        <motion.span
          className="mr-2 flex-shrink-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ○
        </motion.span>
      )}
      <span>{children}</span>
      {rightIcon && !isLoading && (
        <span className="ml-2 flex-shrink-0">{rightIcon}</span>
      )}
    </>
  );
}

/**
 * CTAButton - Versatile call-to-action button component
 * Supports multiple variants, sizes, and states
 */
export function CTAButton({
  children,
  variant = "primary",
  size = "md",
  as = "button",
  href,
  target,
  rel,
  isLoading = false,
  icon,
  rightIcon,
  className = "",
  disabled,
  onClick,
}: CTAButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 ease-out-quint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary disabled:opacity-50 disabled:cursor-not-allowed";

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (as === "a" && href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        className={combinedClassName}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <CTAButtonContent isLoading={isLoading} icon={icon} rightIcon={rightIcon}>
          {children}
        </CTAButtonContent>
      </motion.a>
    );
  }

  return (
    <motion.button
      className={combinedClassName}
      disabled={disabled || isLoading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <CTAButtonContent isLoading={isLoading} icon={icon} rightIcon={rightIcon}>
        {children}
      </CTAButtonContent>
    </motion.button>
  );
}
