/**
 * Dossier Hero Configuration
 * Central place for all timing, colors, and thresholds
 */

// Stage definitions with scroll ranges
export const STAGES = [
  { id: "intro",     range: [0.00, 0.05] as const, label: null,        thought: null },
  { id: "intake",    range: [0.05, 0.30] as const, label: "INTAKE",    thought: "Every ticket tells a story" },
  { id: "diagnosis", range: [0.30, 0.55] as const, label: "DIAGNOSIS", thought: "Patterns emerge from noise" },
  { id: "action",    range: [0.55, 0.80] as const, label: "ACTION",    thought: "Systems replace repetition" },
  { id: "resolved",  range: [0.80, 1.00] as const, label: "RESOLVED",  thought: "Clarity, documented" },
] as const;

export type DossierStageId = typeof STAGES[number]["id"];

// Color palette for background transition
export const COLORS = {
  // Studio white environment (start)
  studioWhite: "#f8f6f3",
  warmCream: "#f5f0e6",
  warmGray: "#e8e4df",
  
  // Transition midtones
  midTone: "#9a958d",
  coolGray: "#6a6a78",
  
  // Dark environment (end)
  charcoal: "#2a2926",
  graphite: "#1a1a1f",
  nearBlack: "#0a0a0c",
  
  // Accent
  brass: "#c4a574",
  brassActive: "#d4b584",
  brassMuted: "#9a8054",
} as const;

// Background transition keyframes
export const BG_TRANSITION = {
  // Progress points
  keys: [0, 0.70, 0.85, 0.95, 1.0],
  // Corresponding colors
  colors: [
    COLORS.studioWhite,
    COLORS.studioWhite,
    COLORS.warmGray,
    COLORS.charcoal,
    COLORS.nearBlack,
  ],
} as const;

// Text color transition (for readability)
export const TEXT_TRANSITION = {
  primary: {
    keys: [0, 0.70, 0.90, 1.0],
    colors: ["#0a0a0c", "#0a0a0c", "#e8e4df", "#f8f6f3"],
  },
  secondary: {
    keys: [0, 0.70, 0.90, 1.0],
    colors: ["#4a4a52", "#4a4a52", "#9a958d", "#a0a5ab"],
  },
} as const;

// Scroll track height (multiplier of viewport)
export const SCROLL_HEIGHT_VH = 500;

// Pin height
export const PIN_HEIGHT_VH = 100;

// Topbar collapse timeline
export const TOPBAR_TIMELINE = {
  fullStart: 0.00,
  collapseStart: 0.12,
  collapseEnd: 0.24,
  restoreStart: 0.84,
  restoreEnd: 0.96,
} as const;

// Book sequence configuration
export const BOOK_CONFIG = {
  videoSrc: "/scroll-sequences/dossier/book-sequence.mp4",
  posterSrc: "/scroll-sequences/dossier/poster.jpg",
  // Transform ranges
  transforms: {
    // Start slightly down and small, settle to center
    y: { keys: [0, 0.05, 0.30, 0.80, 1.0], values: [40, 0, 0, 0, 0] },
    scale: { keys: [0, 0.05, 0.30, 0.55, 0.80, 1.0], values: [0.92, 1, 1, 1.03, 1, 0.98] },
    opacity: { keys: [0, 0.03], values: [0.7, 1] },
  },
} as const;

// Text layer transforms - Left copy (L1 Front - fastest exit)
export const LEFT_COPY_TRANSFORMS = {
  eyebrow: {
    y: { keys: [0.00, 0.04, 0.12, 0.20], values: [12, 0, 0, -28] },
    scale: { keys: [0.00, 0.04, 0.12, 0.20], values: [1, 1, 1, 1.03] },
    opacity: { keys: [0.00, 0.04, 0.14, 0.20], values: [0, 1, 1, 0] },
    blur: { keys: [0.00, 0.04, 0.14, 0.20], values: [6, 0, 0, 8] },
  },
  title: {
    y: { keys: [0.00, 0.05, 0.14, 0.24], values: [48, 0, 0, -84] },
    scale: { keys: [0.00, 0.05, 0.14, 0.24], values: [0.96, 1, 1, 1.16] },
    opacity: { keys: [0.00, 0.03, 0.16, 0.24], values: [0, 1, 1, 0] },
    blur: { keys: [0.00, 0.05, 0.16, 0.24], values: [12, 0, 0, 12] },
  },
  description: {
    y: { keys: [0.03, 0.08, 0.16, 0.26], values: [24, 0, 0, -44] },
    scale: { keys: [0.03, 0.16, 0.26], values: [0.98, 1, 1.05] },
    opacity: { keys: [0.03, 0.08, 0.18, 0.26], values: [0, 1, 1, 0] },
    blur: { keys: [0.03, 0.08, 0.18, 0.26], values: [8, 0, 0, 10] },
  },
  cta: {
    y: { keys: [0.05, 0.10, 0.18, 0.28], values: [16, 0, 0, -24] },
    opacity: { keys: [0.05, 0.10, 0.20, 0.28], values: [0, 1, 1, 0] },
    scale: { keys: [0.05, 0.10, 0.20, 0.28], values: [1, 1, 1, 1.02] },
  },
  scrollHint: {
    y: { keys: [0.03, 0.14], values: [0, -10] },
    opacity: { keys: [0.03, 0.06, 0.12, 0.14], values: [0, 0.6, 0.6, 0] },
  },
} as const;

// Right rail transforms (L2 Mid - slower parallax)
export const RIGHT_RAIL_TRANSFORMS = {
  // These are calculated per-stage using local progress
  stageLabel: {
    // Local progress within stage [0, 1]
    y: { keys: [0, 0.12, 0.82, 1], values: [18, 0, -34, -54] },
    x: { keys: [0, 0.12, 0.82, 1], values: [24, 0, 0, -4] },
    opacity: { keys: [0, 0.12, 0.82, 1], values: [0, 1, 1, 0] },
    blur: { keys: [0, 0.12, 0.82, 1], values: [10, 0, 0, 8] },
    scale: { keys: [0, 0.12, 0.82, 1], values: [0.98, 1, 1, 1.04] },
  },
  thought: {
    y: { keys: [0, 0.15, 0.80, 1], values: [12, 0, -22, -34] },
    x: { keys: [0, 0.15, 0.80, 1], values: [16, 0, 0, -2] },
    opacity: { keys: [0, 0.15, 0.82, 1], values: [0, 1, 1, 0] },
    blur: { keys: [0, 0.15, 0.82, 1], values: [8, 0, 0, 6] },
  },
  progressRail: {
    y: { keys: [0.05, 1.00], values: [0, -18] },
    opacity: { keys: [0.05, 0.40, 1.00], values: [0.35, 0.55, 0.75] },
  },
} as const;

// Evidence block transforms (L1.75 - late entry)
export const EVIDENCE_TRANSFORMS = {
  header: {
    y: { keys: [0.80, 0.88, 0.96, 1.00], values: [24, 0, 0, -8] },
    opacity: { keys: [0.80, 0.88, 1.00], values: [0, 1, 1] },
    blur: { keys: [0.80, 0.88], values: [8, 0] },
  },
  container: {
    y: { keys: [0.82, 0.92, 0.97, 1.00], values: [32, 0, 0, -12] },
    scale: { keys: [0.82, 0.92], values: [0.92, 1] },
    opacity: { keys: [0.82, 0.90, 1.00], values: [0, 1, 1] },
    blur: { keys: [0.82, 0.92], values: [12, 0] },
  },
  // Stagger delay for individual items
  itemStagger: 0.03,
} as const;

// Editorial callouts - atmospheric text around the book
// These are cinematic, not dashboard-like. They support the narrative.
export const EDITORIAL_CALLOUTS = [
  {
    id: "signal",
    text: "Signal becomes structure",
    position: "left" as const,
    // When this callout is visible (progress range)
    range: [0.15, 0.35] as const,
    // Offset from book center (percentage of container)
    offset: { x: -38, y: -5 },
  },
  {
    id: "pattern",
    text: "Repetition turns into system",
    position: "right" as const,
    range: [0.38, 0.58] as const,
    offset: { x: 36, y: 8 },
  },
  {
    id: "evidence",
    text: "Evidence, organized",
    position: "left" as const,
    range: [0.60, 0.78] as const,
    offset: { x: -35, y: 12 },
  },
  {
    id: "resolution",
    text: "Resolution, documented",
    position: "right" as const,
    range: [0.82, 0.98] as const,
    offset: { x: 32, y: -8 },
  },
] as const;

// Callout transform config
export const CALLOUT_TRANSFORMS = {
  enter: {
    opacity: { keys: [0, 0.15, 0.85, 1], values: [0, 1, 1, 0] },
    y: { keys: [0, 0.15, 0.85, 1], values: [12, 0, 0, -8] },
    blur: { keys: [0, 0.15, 0.85, 1], values: [4, 0, 0, 4] },
  },
} as const;

// Breakpoint adjustments
export const BREAKPOINTS = {
  desktop: 1280,
  tablet: 1024,
  mobile: 768,
} as const;

// Scale factors for smaller screens
export const RESPONSIVE_SCALE = {
  tablet: 0.8, // Multiply all y/x values
  mobile: 0.5, // Much reduced motion
} as const;
