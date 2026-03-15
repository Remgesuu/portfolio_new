"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import type { PointerState, UsePointerParallaxReturn } from "../dossier-hero.types";

/**
 * Custom hook for tracking pointer position normalized to -1..1 range.
 * Used for mouse parallax effects on book and atmosphere layers.
 */
export function usePointerParallax(
  containerRef: React.RefObject<HTMLElement | null>,
  options: { enabled?: boolean; smoothing?: number } = {}
): UsePointerParallaxReturn {
  const { enabled = true, smoothing = 0.1 } = options;
  
  const [pointer, setPointer] = useState<PointerState>({
    x: 0,
    y: 0,
    isActive: false,
  });

  // Target values for smoothing
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const isActiveRef = useRef(false);

  // Smooth animation loop
  useEffect(() => {
    if (!enabled) return;

    const animate = () => {
      const { x: tx, y: ty } = targetRef.current;
      const { x: cx, y: cy } = currentRef.current;

      // Lerp towards target
      const newX = cx + (tx - cx) * smoothing;
      const newY = cy + (ty - cy) * smoothing;

      // Only update if changed significantly
      if (Math.abs(newX - cx) > 0.001 || Math.abs(newY - cy) > 0.001) {
        currentRef.current = { x: newX, y: newY };
        setPointer({
          x: newX,
          y: newY,
          isActive: isActiveRef.current,
        });
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, smoothing]);

  // Handle pointer move
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!enabled) return;
    
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    
    // Normalize to -1..1
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    targetRef.current = { x, y };
    isActiveRef.current = true;
  }, [containerRef, enabled]);

  // Handle pointer leave
  const handlePointerLeave = useCallback(() => {
    // Smoothly return to center
    targetRef.current = { x: 0, y: 0 };
    isActiveRef.current = false;
  }, []);

  return {
    pointer,
    bind: {
      onPointerMove: handlePointerMove,
      onPointerLeave: handlePointerLeave,
    },
  };
}

/**
 * Non-hook version for use in R3F useFrame
 * Returns a ref that updates directly
 */
export function createPointerTracker(
  containerRef: React.RefObject<HTMLElement | null>
) {
  const pointer = { x: 0, y: 0, isActive: false };

  const handlePointerMove = (e: PointerEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    pointer.isActive = true;
  };

  const handlePointerLeave = () => {
    pointer.isActive = false;
  };

  return {
    pointer,
    attach: () => {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("pointerleave", handlePointerLeave);
    },
    detach: () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    },
  };
}
