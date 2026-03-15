"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { useMotionValue, useVelocity } from "motion/react";
import { STAGES } from "../dossier-hero.config";
import type { DossierStage, UseDossierProgressReturn } from "../dossier-hero.types";

/**
 * Custom hook for tracking scroll progress within the dossier hero section.
 * Centralizes all scroll logic - child components should NOT access window.scrollY.
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
  const updateProgress = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const containerTop = window.scrollY + rect.top;
    const containerHeight = container.offsetHeight - window.innerHeight;

    if (containerHeight <= 0) return;

    const scrolled = window.scrollY - containerTop;
    const newProgress = Math.max(0, Math.min(1, scrolled / containerHeight));
    
    progress.set(newProgress);
    setProgressValue(newProgress);
  }, [containerRef, progress]);

  // Scroll listener with RAF throttling
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      
      rafRef.current = requestAnimationFrame(() => {
        updateProgress();
        rafRef.current = 0;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    
    // Initial calculation
    updateProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
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
