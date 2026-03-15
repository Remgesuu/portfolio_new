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

// Layout & Navigation Components
export { ThemeProvider, themeScript } from "./theme-provider";
export { ThemeToggle } from "./theme-toggle";
export { SkipLink } from "./skip-link";
export { Breadcrumbs } from "./breadcrumbs";
export { PageTransition } from "./page-transition";
export { ErrorBoundary } from "./error-boundary";
