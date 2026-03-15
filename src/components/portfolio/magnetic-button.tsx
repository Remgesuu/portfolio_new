"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode, type MouseEvent } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
  as?: "button" | "a" | "div";
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  radius = 150,
  as = "button",
  href,
  onClick,
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);

  // Mouse position relative to element center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth following
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Scale on hover
  const scale = useSpring(1, { damping: 20, stiffness: 300 });

  // Text/content moves slightly more than container
  const innerX = useTransform(x, (val) => val * 1.3);
  const innerY = useTransform(y, (val) => val * 1.3);

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current || disabled) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    // Only apply magnetic effect within radius
    if (distance < radius) {
      const pull = (1 - distance / radius) * strength;
      mouseX.set(distanceX * pull);
      mouseY.set(distanceY * pull);
      scale.set(1.05);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      scale.set(1.02);
    }
  };

  const Component = motion[as] as typeof motion.button;

  const commonProps = {
    ref: ref as React.RefObject<HTMLButtonElement>,
    className,
    style: { x, y, scale },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onMouseEnter: handleMouseEnter,
    onClick: disabled ? undefined : onClick,
  };

  if (as === "a" && href) {
    return (
      <motion.a
        {...commonProps}
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
      >
        <motion.span style={{ x: innerX, y: innerY, display: "inline-block" }}>
          {children}
        </motion.span>
      </motion.a>
    );
  }

  return (
    <Component {...commonProps} disabled={disabled}>
      <motion.span style={{ x: innerX, y: innerY, display: "inline-block" }}>
        {children}
      </motion.span>
    </Component>
  );
}

// Higher-order wrapper for existing components
interface MagneticWrapperProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticWrapper({ 
  children, 
  className = "",
  strength = 0.25 
}: MagneticWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set((e.clientX - centerX) * strength);
    mouseY.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
