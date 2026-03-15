"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { useMotionValue, useVelocity } from "motion/react";
import { STAGES } from "../dossier-hero.config";
import type { DossierStage, UseDossierProgressReturn } from "../dossier-hero.types";

/**
 * Custom hook for tracking scroll progress within the dossier hero section.
 * Centralizes all scroll logic - child components should NOT access window.scrollY.
 * 
 * Works with both native scroll and Lenis smooth scroll.
 */
export function useDossierProgress(
  containerRef: React.RefObject<HTMLElement | null>
): UseDossierProgressReturn {
  const progress = useMotionValue(0);
  const velocity = useVelocity(progress);
  
  const [progressValue, setProgressValue] = useState(0);
  const [velocityValue, setVelocityValue] = useState(0);
  const rafRef = useRef<number>(0);

  // Calculate progress based on container position
  // Uses getBoundingClientRect which works with both native and Lenis scroll
  const updateProgress = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Get container bounds relative to viewport
    const rect = container.getBoundingClientRect();
    
    // Container total scroll range = container height - viewport height
    const containerHeight = container.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollRange = containerHeight - viewportHeight;

    if (scrollRange <= 0) return;

    // Progress = how much of the container has scrolled past the top of viewport
    // rect.top = 0 means container top is at viewport top (start)
    // rect.top = -scrollRange means container bottom is at viewport bottom (end)
    const scrolled = -rect.top;
    const newProgress = Math.max(0, Math.min(1, scrolled / scrollRange));
    
    progress.set(newProgress);
    setProgressValue(newProgress);
  }, [containerRef, progress]);

  // Use RAF loop for continuous updates (works with Lenis)
  useEffect(() => {
    let running = true;
    
    const tick = () => {
      if (!running) return;
      updateProgress();
      rafRef.current = requestAnimationFrame(tick);
    };
    
    // Start the loop
    rafRef.current = requestAnimationFrame(tick);
    
    // Also listen to resize
    window.addEventListener("resize", updateProgress, { passive: true });

    return () => {
      running = false;
      window.removeEventListener("resize", updateProgress);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateProgress]);

  // Track velocity changes
  useEffect(() => {
    const unsubscribe = velocity.on("change", (v) => {
      setVelocityValue(v);
    });
    return unsubscribe;
  }, [velocity]);

  // Calculate current stage
  const stage = useMemo((): DossierStage => {
    const currentStage = STAGES.find(
      (s) => progressValue >= s.range[0] && progressValue < s.range[1]
    ) ?? STAGES[STAGES.length - 1];

    const stageIndex = STAGES.findIndex((s) => s.id === currentStage.id);
    const [start, end] = currentStage.range;
    const localProgress = end > start 
      ? Math.max(0, Math.min(1, (progressValue - start) / (end - start)))
      : 0;

    return {
      id: currentStage.id,
      index: stageIndex,
      label: currentStage.label,
      thought: currentStage.thought,
      localProgress,
    };
  }, [progressValue]);

  return {
    progress,
    progressValue,
    velocity,
    velocityValue,
    stage,
  };
}

/**
 * Helper to get stage from progress value (non-reactive)
 */
export function getStageFromProgress(progressValue: number): DossierStage {
  const currentStage = STAGES.find(
    (s) => progressValue >= s.range[0] && progressValue < s.range[1]
  ) ?? STAGES[STAGES.length - 1];

  const stageIndex = STAGES.findIndex((s) => s.id === currentStage.id);
  const [start, end] = currentStage.range;
  const localProgress = end > start 
    ? Math.max(0, Math.min(1, (progressValue - start) / (end - start)))
    : 0;

  return {
    id: currentStage.id,
    index: stageIndex,
    label: currentStage.label,
    thought: currentStage.thought,
    localProgress,
  };
}
