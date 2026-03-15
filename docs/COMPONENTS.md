# Portfolio Components Usage Guide

## Overview

This portfolio uses a comprehensive component system built with Next.js 16, React 19, and Motion/Framer Motion. All components follow consistent patterns for theming, motion, and accessibility.

## Component Categories

### 1. Motion & Animation Components

#### `SmoothScrollProvider`
Global provider that enables scroll-based animations throughout the app.

```tsx
import { SmoothScrollProvider } from "@/components/portfolio";

export default function Layout({ children }) {
  return (
    <SmoothScrollProvider>
      {children}
    </SmoothScrollProvider>
  );
}
```

#### `Parallax`
Creates depth effects through scroll-linked transforms.

```tsx
import { Parallax } from "@/components/portfolio";

<Parallax offset={[0, 100]} scale={[1, 1.1]}>
  <img src="hero.jpg" alt="Hero" />
</Parallax>
```

#### `ChoreographyContainer & ChoreographyItem`
Orchestrates staggered animations for multiple elements.

```tsx
import { ChoreographyContainer, ChoreographyItem } from "@/components/portfolio";

<ChoreographyContainer staggerDelay={0.1} direction="up">
  {items.map((item) => (
    <ChoreographyItem key={item.id}>
      {item.content}
    </ChoreographyItem>
  ))}
</ChoreographyContainer>
```

#### `Reveal`
Built-in reveal component with multiple animation variants.

**Variants:** `"fade"`, `"fade-up"`, `"scale-in"`, `"slide-left"`, `"slide-right"`, `"blur-to-crisp"`, `"stagger"`

```tsx
<Reveal variant="fade-up" delay={0.2} duration={0.8}>
  <h1>Hero Title</h1>
</Reveal>
```

---

### 2. UI Components

#### `CTAButton`
Versatile call-to-action button with multiple variants and states.

**Variants:** `"primary"`, `"secondary"`, `"ghost"`, `"outline"`
**Sizes:** `"sm"`, `"md"`, `"lg"`

```tsx
import { CTAButton } from "@/components/portfolio";

<CTAButton variant="primary" size="lg">
  Get Started
</CTAButton>

<CTAButton as="a" href="/resume" variant="ghost">
  View Resume →
</CTAButton>
```

#### `Card` System
Composable card components for consistent content presentation.

```tsx
import { Card, CardHeader, CardImage, CardBody, CardTags, CardFooter, CardLink } from "@/components/portfolio";

<Card variant="featured">
  <CardHeader 
    eyebrow="Case Study"
    title="Project Name"
    subtitle="Brief description"
  />
  <CardImage src="/image.jpg" alt="Project" />
  <CardBody>
    <p>Detailed content here</p>
  </CardBody>
  <CardTags tags={[
    { label: "React", color: "primary" },
    { label: "Design", color: "secondary" }
  ]} />
  <CardFooter>
    <CardLink href="/cases/slug">Learn More</CardLink>
  </CardFooter>
</Card>
```

#### `FloatingContact`
Persistent contact widget that appears after user scrolls.

```tsx
import { FloatingContact } from "@/components/portfolio";

<FloatingContact 
  email="hello@example.com"
  phone="+1-234-567-8900"
  showAfterScroll={600}
/>
```

#### `AmbientHero`
Cinematic background with animated orbs and effects. Used in hero sections.

```tsx
import { AmbientHero } from "@/components/portfolio";

<div className="relative">
  <div className="absolute inset-0">
    <AmbientHero />
  </div>
  <div className="relative z-10">
    {/* Hero content goes here */}
  </div>
</div>
```

---

### 3. Layout & Theme Components

#### `ThemeProvider`
Manages light/dark theme switching with system preference detection.

```tsx
import { ThemeProvider } from "@/components/portfolio";

<ThemeProvider>
  {children}
</ThemeProvider>
```

#### `ThemeToggle`
Button component for manual theme switching.

```tsx
import { ThemeToggle } from "@/components/portfolio";

<ThemeToggle />
```

#### `SkipLink`
Accessibility component for keyboard navigation to main content.

```tsx
import { SkipLink } from "@/components/portfolio";

<SkipLink />
```

#### `Breadcrumbs`
Navigation breadcrumb trail for page hierarchy.

```tsx
import { Breadcrumbs } from "@/components/portfolio";

<Breadcrumbs 
  items={[
    { label: "Home", href: "/" },
    { label: "Cases", href: "/#cases" },
    { label: "Current Page" }
  ]}
/>
```

---

## Design System

### Color Tokens

All colors use CSS variables defined in `globals.css`:

- `--text-primary`: Main text color
- `--text-secondary`: Secondary text (descriptions, meta)
- `--text-disabled`: Disabled/muted text
- `--bg-primary`: Main background
- `--bg-surface`: Surface/card backgrounds
- `--bg-elevated`: Elevated surfaces
- `--accent-primary`: Teal accent
- `--accent-secondary`: Coral accent
- `--border-default`: Default border color
- `--shadow-*`: Various shadow depths

### Typography Scale

Tailwind extends include Cuberto-inspired scale:

- `text-10xl` (90px): Hero headlines
- `text-9xl` (72px): Section titles
- `text-8xl` (56px): Large titles
- `text-6xl` (36px): Medium titles
- `text-4xl` (24px): Standard headings
- `text-base` (14px): Body text

### Spacing System

- `--section-gap`: 4.5rem - 7rem (responsive)
- `--page-width`: Container max-width
- Tailwind spacing scale extended with `hero: 240px`

### Motion Tokens

- `--transition-fast`: 150ms (quick interactions)
- `--transition-base`: 220ms (standard)
- `--transition-slow`: 500ms (cinematic reveals)
- `--ease-out-quint`: Primary easing function

---

## Patterns & Best Practices

### 1. Using Motion with Responsive Design

Always test motion animations on reduced motion settings:

```tsx
import { useReducedMotion } from "motion/react";

export function MyComponent() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={shouldReduceMotion ? {} : { y: 100 }}
      // Fallback for reduced motion
    />
  );
}
```

### 2. Choreographing Multiple Elements

Use `ChoreographyContainer` for consistent staggered reveals:

```tsx
<ChoreographyContainer staggerDelay={0.08} direction="up">
  {caseStudies.map((study) => (
    <ChoreographyItem key={study.id}>
      <Card variant="featured">
        {/* Case content */}
      </Card>
    </ChoreographyItem>
  ))}
</ChoreographyContainer>
```

### 3. Theming Components

Override component backgrounds consistently:

```tsx
<div className="bg-bg-surface text-text-primary">
  {/* Content automatically inherits theme */}
</div>
```

### 4. Building Complex Layouts

Use flexbox first, CSS Grid for 2D layouts:

```tsx
<div className="flex items-center justify-between gap-8">
  {/* Flex layout */}
</div>

<div className="grid grid-cols-3 gap-6">
  {/* Grid layout */}
</div>
```

---

## Performance Considerations

1. **Image Optimization**: All images use Next.js `<Image>` with `sizes` prop
2. **Motion Performance**: Animations use `will-change` and GPU acceleration where needed
3. **Code Splitting**: Components are lazy-loaded where appropriate
4. **SEO**: All semantic HTML and proper heading hierarchy maintained

---

## Accessibility

- **ARIA Labels**: Buttons and interactive elements have proper labels
- **Keyboard Navigation**: All components keyboard accessible
- **Screen Readers**: Semantic HTML and skip links included
- **Reduced Motion**: All animations respect `prefers-reduced-motion`
- **Color Contrast**: WCAG AA compliance throughout

---

## Component Import Path

All components can be imported from the root portfolio path:

```tsx
// Individual imports
import { CTAButton } from "@/components/portfolio/cta-button";
import { Card, CardHeader } from "@/components/portfolio/card";

// Batch import via index
import { CTAButton, Card, CardHeader, Reveal } from "@/components/portfolio";
```

---

## Migration Guide

If upgrading from previous versions:

1. Replace old button components with `CTAButton`
2. Use `ChoreographyContainer` instead of manual stagger delays
3. Leverage `FloatingContact` for persistent contact access
4. Use `Card` system for consistent case/project display

---

## Support & Troubleshooting

### Motion not working?
- Ensure component is wrapped in `SmoothScrollProvider` (in layout)
- Check browser DevTools for console errors
- Verify `motion/react` is imported correctly

### Theme colors not applying?
- Confirm `ThemeProvider` wraps your app
- Check CSS variable names in `globals.css`
- Verify Tailwind config includes extended colors

### Components not responsive?
- Use Tailwind responsive prefixes: `md:`, `lg:`, `xl:`
- Test with viewport sizes in DevTools
- Check mobile-specific CSS in component modules
