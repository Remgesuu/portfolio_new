/**
 * Portfolio Components Library
 * ============================
 * 
 * This file exports all portfolio components for convenient access.
 * Import components directly: import { CTAButton } from "@/components/portfolio"
 */

// Motion & Animation Components
export { SmoothScrollProvider, useSmoothScroll, Parallax, ScrollReveal, ScrollProgress } from "./smooth-scroll";
export { useMotionChoreography, ChoreographyContainer, ChoreographyItem, SectionReveal, PulseOnHover, FadeInSequence } from "./motion-choreography";
export { Reveal, RevealItem } from "./reveal";
export { AmbientHero } from "./ambient-hero";

// UI Components
export { CTAButton } from "./cta-button";
export { FloatingContact } from "./floating-contact";
export { Card, CardHeader, CardImage, CardBody, CardTags, CardFooter, CardLink } from "./card";

// Cuberto-Style Templates (New)
export { CursorFollower } from "./cursor-follower";
export { FloatingContactRing } from "./floating-contact-ring";
export { TextSplitReveal, TextLineReveal } from "./text-split-reveal";
export { MediaClipReveal, ImageHoverZoom, VideoReveal } from "./media-clip-reveal";
export { OutlineCTAButton, OutlineCTALink } from "./outline-cta-button";
export { InverseSection, SectionDivider, CTAStage } from "./inverse-section";

// Layout & Navigation Components
export { ThemeProvider, themeScript } from "./theme-provider";
export { ThemeToggle } from "./theme-toggle";
export { SkipLink } from "./skip-link";
export { Breadcrumbs } from "./breadcrumbs";
export { PageTransition } from "./page-transition";
export { ErrorBoundary } from "./error-boundary";
