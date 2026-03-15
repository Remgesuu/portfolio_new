"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type CardVariant = "featured" | "secondary" | "compact";
type CardTag = {
  label: string;
  color?: "primary" | "secondary" | "accent";
};

interface CardProps {
  variant?: CardVariant;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  href?: string;
  asLink?: boolean;
}

/**
 * Card - Base container for content with theme-aware styling
 */
export function Card({
  variant = "secondary",
  className = "",
  children,
  href,
  asLink,
  ...props
}: CardProps) {
  const variantStyles: Record<CardVariant, string> = {
    featured:
      "bg-gradient-to-br from-bg-surface to-bg-elevated border border-border-default shadow-card hover:shadow-lg hover:border-border-glow",
    secondary:
      "bg-bg-surface border border-border-default shadow-md hover:shadow-card hover:border-border-glow",
    compact:
      "bg-bg-surface/60 backdrop-blur border border-border-subtle hover:border-border-default",
  };

  const content = (
    <motion.div
      className={`rounded-lg p-6 transition-all duration-200 ${variantStyles[variant]} ${className}`}
      whileHover={{ y: -4 }}
      {...props}
    >
      {children}
    </motion.div>
  );

  if (href && asLink) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

/**
 * CardHeader - Top section with metadata and title
 */
export function CardHeader({
  label,
  eyebrow,
  title,
  subtitle,
}: {
  label?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      {eyebrow && (
        <p className="text-xs uppercase tracking-widest text-text-disabled mb-2">
          {eyebrow}
        </p>
      )}
      <h3 className="text-2xl font-bold text-text-primary mb-2">{title}</h3>
      {subtitle && (
        <p className="text-sm text-text-secondary">{subtitle}</p>
      )}
      {label && (
        <span className="inline-block mt-2 px-3 py-1 rounded-full bg-accent-primary-subtle text-accent-primary text-xs font-medium">
          {label}
        </span>
      )}
    </div>
  );
}

/**
 * CardImage - Responsive image container with lazy loading
 */
export function CardImage({
  src,
  alt,
  height = 320,
}: {
  src: string;
  alt: string;
  height?: number;
}) {
  return (
    <div className="relative w-full mb-4 overflow-hidden rounded-md bg-bg-secondary h-[320px]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
      />
    </div>
  );
}

/**
 * CardBody - Main content area
 */
export function CardBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
}

/**
 * CardTags - Displays tags with color variants
 */
export function CardTags({ tags }: { tags: CardTag[] }) {
  const tagColorMap: Record<NonNullable<CardTag["color"]>, string> = {
    primary: "bg-accent-primary-subtle text-accent-primary",
    secondary: "bg-accent-secondary-subtle text-accent-secondary",
    accent: "bg-border-glow/20 text-text-primary",
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag.label}
          className={`px-2 py-1 rounded-md text-xs font-medium ${
            tagColorMap[tag.color || "primary"]
          }`}
        >
          {tag.label}
        </span>
      ))}
    </div>
  );
}

/**
 * CardFooter - Bottom action area
 */
export function CardFooter({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`pt-4 border-t border-border-subtle flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}

/**
 * CardLink - Styled link for card actions
 */
export function CardLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="inline-flex items-center text-accent-primary hover:text-accent-primary-hover font-medium text-sm group"
      whileHover={{ x: 4 }}
    >
      {children}
      <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
    </motion.a>
  );
}
