/**
 * Dossier Hero Types
 * Shared types for orchestrator and child components
 */

import type { MotionValue } from "motion/react";
import type { DossierStageId } from "./dossier-hero.config";

// Stage information
export interface DossierStage {
  id: DossierStageId;
  index: number;
  label: string | null;
  thought: string | null;
  localProgress: number; // 0-1 within the stage
}

// Pointer position normalized to -1..1
export interface PointerState {
  x: number;
  y: number;
  isActive: boolean; // Whether pointer is over the hero
}

// Full state passed to child components
export interface DossierHeroState {
  // Scroll progress
  progress: number;        // 0-1 global
  velocity: number;        // Scroll velocity
  
  // Current stage
  stage: DossierStage;
  
  // Device/capability flags
  isDesktop: boolean;
  reducedMotion: boolean;
  isInteractive: boolean;  // Combined: desktop + !reducedMotion
  
  // Pointer for parallax
  pointer: PointerState;
}

// Motion value versions for reactive transforms
export interface DossierHeroMotionState {
  progress: MotionValue<number>;
  velocity: MotionValue<number>;
}

// Props for DossierHero orchestrator
export interface DossierHeroProps {
  resumeHref?: string;
  contactHref?: string;
  onProgressChange?: (progress: number) => void;
  onStageChange?: (stage: DossierStage) => void;
}

// Props for BookSequenceCanvas
export interface BookSequenceCanvasProps {
  progress: number;
  stage: DossierStage;
  isInteractive: boolean;
  className?: string;
}

// Props for DioramaScene (atmosphere layer)
export interface DioramaSceneProps {
  progress: number;
  velocity: number;
  pointer: PointerState;
  stage: DossierStage;
  className?: string;
}

// Props for HeroOverlay (text layer)
export interface HeroOverlayProps {
  progress: MotionValue<number>;
  stage: DossierStage;
  isDesktop: boolean;
  reducedMotion: boolean;
  resumeHref: string;
  contactHref: string;
  className?: string;
}

// Props for AdaptiveTopbar
export interface AdaptiveTopbarProps {
  progress: number;
  stage: DossierStage;
  className?: string;
}

// Transform config shape
export interface TransformConfig {
  keys: readonly number[];
  values: readonly number[];
}

// Layer transform set
export interface LayerTransforms {
  y?: TransformConfig;
  x?: TransformConfig;
  scale?: TransformConfig;
  opacity?: TransformConfig;
  blur?: TransformConfig;
}

// Hook return types
export interface UseDossierProgressReturn {
  progress: MotionValue<number>;
  progressValue: number;
  velocity: MotionValue<number>;
  velocityValue: number;
  stage: DossierStage;
}

export interface UsePointerParallaxReturn {
  pointer: PointerState;
  bind: {
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerLeave: () => void;
  };
}
