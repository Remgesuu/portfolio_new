# Cuberto-Inspired Portfolio Implementation Plan

**Project:** Grigorii Portfolio  
**Repository:** Remgesuu/portfolio_new  
**Branch:** v0/grigorii584-5980-ca853113  
**Date:** 2026-03-15

---

## Executive Summary

Transform the existing Next.js 16 portfolio into a Cuberto-inspired, recruiter-first showcase while maintaining the strong content foundation and hiring-focused narrative already in place. The goal is to achieve Cuberto-level visual confidence with typography scale, cinematic motion, and editorial pacing—without copying agency information architecture.

---

## Phase 1: Foundation & Design System Enhancement

### Milestone 1.1: Typography & Scale Overhaul
**Dependencies:** None  
**Priority:** Critical

**Tasks:**
1. Replace `Instrument Sans` with a more characterful display font (e.g., `Space Grotesk`, `Manrope`, or a premium sans-serif with editorial weight)
2. Implement dramatic scale contrast matching Cuberto's approach:
   - H1: 90px+ desktop / 48px+ mobile
   - H2: 64px+ desktop / 36px+ mobile
   - Body: 20-24px
3. Tighten line-heights on major headlines (1.0-1.1)
4. Add CSS custom properties for the Cuberto-derived type scale:
   ```css
   --cb-h1-size: clamp(3rem, 6vw, 5.67rem);
   --cb-h2-size: clamp(2.25rem, 4.5vw, 4rem);
   --cb-body-size: clamp(1.125rem, 1.5vw, 1.5rem);
   ```

**Files affected:**
- `src/app/layout.tsx` (font imports)
- `src/app/globals.css` (type scale tokens)
- `src/app/page.module.css` (hero typography)

---

### Milestone 1.2: Layout & Spacing System
**Dependencies:** 1.1  
**Priority:** Critical

**Tasks:**
1. Increase hero top spacing to match Cuberto's dramatic entrance (~240px+)
2. Implement alternating light/dark section rhythm
3. Add rounded section shells for dark stages (large rounded top corners)
4. Expand horizontal breathing room:
   - Max container width: 1440px
   - Section padding: 120px vertical
   - Grid gap: 40-60px
5. Create inverse section utility class with smooth transitions

**Files affected:**
- `src/app/globals.css` (layout tokens)
- `src/app/page.module.css` (section structure)
- `src/styles/shared.module.css` (reusable patterns)

---

### Milestone 1.3: Color & Surface Refinement
**Dependencies:** 1.1  
**Priority:** High

**Tasks:**
1. Refine the existing warm/graphite palette for sharper contrast
2. Add a metallic accent for CTA focus (sparingly used)
3. Increase dark section intensity for cinematic effect
4. Fine-tune glass/surface opacity for premium feel
5. Ensure print styles force light theme

**Files affected:**
- `src/app/globals.css` (color tokens)

---

## Phase 2: Component Architecture

### Milestone 2.1: Navigation Enhancement
**Dependencies:** 1.2  
**Priority:** High

**Tasks:**
1. Redesign topbar for Cuberto-style minimal confidence:
   - Logo left, sparse nav right
   - Clean text links with subtle hover treatment
   - No noisy chrome
2. Add floating circular contact widget (lower-right):
   - Avatar/face core
   - Persistent secondary CTA
   - Smooth entrance animation
3. Implement scroll-aware nav behavior (opacity/blur on scroll)

**New files:**
- `src/components/portfolio/floating-contact.tsx`
- `src/components/portfolio/floating-contact.module.css`

**Files modified:**
- `src/app/page.tsx` (navigation structure)
- `src/app/page.module.css` (topbar styles)

---

### Milestone 2.2: Hero Transformation
**Dependencies:** 1.1, 1.2, 1.3  
**Priority:** Critical

**Tasks:**
1. Implement giant statement-driven H1 layout
2. Add eyebrow/kicker above headline
3. Create inline proof signals row (metrics chips)
4. Design dual CTA row (primary: Open resume, secondary: Email)
5. Enhance profile stage with Cuberto-style media treatment:
   - Large rounded corners (18px+)
   - Scale and clip-path reveal animation
   - Subtle parallax on scroll
6. Remove or reduce ambient hero complexity for cleaner silhouette

**Files affected:**
- `src/app/page.tsx` (hero structure)
- `src/app/page.module.css` (hero styles)
- `src/components/portfolio/ambient-hero.tsx` (simplify or replace)

---

### Milestone 2.3: Pill CTA Component
**Dependencies:** 1.3  
**Priority:** High

**Tasks:**
1. Create Cuberto-style rounded outline CTA:
   - Fully rounded borders
   - Border layer + ripple layer + title layer
   - Hover scale and color transition
2. Support primary (filled) and secondary (outline) variants
3. Large padding for oversized CTAs in footer section

**New files:**
- `src/components/portfolio/pill-cta.tsx`
- `src/components/portfolio/pill-cta.module.css`

---

### Milestone 2.4: Project Cards Redesign
**Dependencies:** 1.2, 2.3  
**Priority:** High

**Tasks:**
1. Implement two-column staggered grid layout
2. Create large rounded media frames (18px radius)
3. Support mixed aspect ratios:
   - Featured: 500/675 or 4/5
   - Secondary: 1/1
4. Add media reveal animation (clip-path + scale)
5. Keep text concise (1-2 lines max)
6. Add scroll parallax to media tiles

**Files affected:**
- `src/app/page.module.css` (cases grid)
- `src/app/page.tsx` (card structure)

---

## Phase 3: Motion System

### Milestone 3.1: Smooth Scroll Implementation
**Dependencies:** None (can run parallel with Phase 1)  
**Priority:** High

**Tasks:**
1. Install and configure Lenis for smooth scrolling:
   ```bash
   npm install @studio-freight/lenis
   ```
2. Create smooth scroll provider component
3. Integrate with existing ScrollTrigger/motion setup
4. Respect `prefers-reduced-motion`

**New files:**
- `src/components/portfolio/smooth-scroll-provider.tsx`

**Files affected:**
- `src/app/layout.tsx` (wrap with provider)
- `package.json` (dependency)

---

### Milestone 3.2: GSAP Motion Choreography
**Dependencies:** 3.1  
**Priority:** High

**Tasks:**
1. Install GSAP with ScrollTrigger:
   ```bash
   npm install gsap
   ```
2. Implement motion presets from reference:
   - Heading reveal: `y: 100 → 0`, `opacity: 0 → 1`, `duration: 1.4s`
   - Text fade-up: `y: 40 → 0`, `opacity: 0 → 1`, `duration: 1.2s`
   - Media reveal: `clipPath: inset(10%)`, `scale: 0.94 → 1`
3. Replace or enhance existing `Reveal` component with GSAP
4. Add scroll-scrubbed parallax to media elements

**Files affected:**
- `src/components/portfolio/reveal.tsx` (enhance or replace)
- `package.json` (dependency)

---

### Milestone 3.3: Cursor Follower (Optional)
**Dependencies:** 3.2  
**Priority:** Low (can defer)

**Tasks:**
1. Create custom cursor follower component
2. Implement state changes for interactive elements
3. Ensure accessibility (no critical function dependency)

**New files:**
- `src/components/portfolio/cursor-follower.tsx`
- `src/components/portfolio/cursor-follower.module.css`

---

## Phase 4: Page-Level Implementation

### Milestone 4.1: Home Page Reconstruction
**Dependencies:** 2.1-2.4, 3.1-3.2  
**Priority:** Critical

**Tasks:**
1. **Hero cover block:**
   - Giant statement H1
   - Proof signals row
   - Dual CTA
   - Large visual with parallax

2. **Transition/thesis bridge:**
   - Short paragraph block on white
   - Optional abstract visual object
   - Button: "See selected proof"

3. **Featured case stage:**
   - Full-width dark section with rounded top corners
   - Oversized "Selected cases" heading
   - Two-column staggered grid
   - Outcome-first card packaging

4. **What I actually do:**
   - White section reset
   - Three capability pillars
   - Proof anchors per pillar

5. **Final contact moment:**
   - Large emotional CTA section
   - Dark or accent background
   - Giant text + oversized pill CTA
   - Metadata row (GitHub, location, availability)

**Files affected:**
- `src/app/page.tsx` (full restructure)
- `src/app/page.module.css` (all section styles)

---

### Milestone 4.2: Case Study Pages
**Dependencies:** 4.1  
**Priority:** Medium

**Tasks:**
1. Apply Cuberto typography scale to case detail pages
2. Add media reveal animations
3. Implement dark/light section alternation
4. Keep print-friendly layout
5. Add breadcrumb navigation with smooth transitions

**Files affected:**
- `src/app/cases/[slug]/page.tsx`
- `src/app/cases/[slug]/page.module.css`

---

### Milestone 4.3: Resume Page Refinement
**Dependencies:** 1.1, 1.2  
**Priority:** Medium

**Tasks:**
1. Maintain recruiter-friendly, scannable layout
2. Add subtle entrance animations
3. Ensure print styles remain perfect
4. Add visual break/dividers between sections

**Files affected:**
- `src/app/resume/page.tsx`
- `src/app/resume/page.module.css`

---

## Phase 5: Polish & Optimization

### Milestone 5.1: Media Assets
**Dependencies:** 4.1  
**Priority:** High

**Tasks:**
1. Generate or source high-quality case study preview images
2. Create cinematic-style stills (not generic mockups)
3. Consider video assets for hover states (optional)
4. Optimize all images for web delivery

**Files affected:**
- `public/images/cases/` (new assets)

---

### Milestone 5.2: Performance Optimization
**Dependencies:** All previous  
**Priority:** High

**Tasks:**
1. Audit bundle size after GSAP/Lenis additions
2. Implement code splitting for motion components
3. Add loading states for heavy sections
4. Verify Core Web Vitals targets
5. Test reduced-motion path

**Files affected:**
- Various component files
- `next.config.ts` (optimization flags)

---

### Milestone 5.3: Accessibility Audit
**Dependencies:** 5.2  
**Priority:** Critical

**Tasks:**
1. Verify all animations respect `prefers-reduced-motion`
2. Test keyboard navigation
3. Run WAVE/axe accessibility checks
4. Ensure ARIA labels are meaningful
5. Test screen reader flow

---

### Milestone 5.4: Cross-Browser Testing
**Dependencies:** 5.2  
**Priority:** High

**Tasks:**
1. Test Chrome, Firefox, Safari, Edge
2. Verify mobile Safari smooth scroll
3. Test high-DPI displays
4. Verify dark/light theme transitions

---

## Phase 6: Deployment & QA

### Milestone 6.1: Staging Deployment
**Dependencies:** All Phase 5  
**Priority:** Critical

**Tasks:**
1. Deploy to Vercel preview
2. Run E2E tests (existing Playwright suite)
3. Visual regression testing
4. Performance profiling on real network

---

### Milestone 6.2: Content Final Review
**Dependencies:** 6.1  
**Priority:** High

**Tasks:**
1. Review all copy for recruiter clarity
2. Verify all links work
3. Check OG images and meta tags
4. Test social sharing cards

---

### Milestone 6.3: Production Release
**Dependencies:** 6.2  
**Priority:** Critical

**Tasks:**
1. Merge to main branch
2. Deploy to production
3. Verify DNS and canonical URLs
4. Monitor initial traffic and errors

---

## Dependency Graph

```
Phase 1 (Foundation)
├── 1.1 Typography ──┬── 1.2 Layout ──┬── 1.3 Color
│                    │                │
Phase 2 (Components) │                │
├── 2.1 Navigation ──┴── 2.2 Hero ────┴── 2.3 Pill CTA
│                         │                    │
├── 2.4 Project Cards ────┴────────────────────┘
│
Phase 3 (Motion) [parallel]
├── 3.1 Smooth Scroll ── 3.2 GSAP Choreography ── 3.3 Cursor (optional)
│
Phase 4 (Pages)
├── 4.1 Home ── 4.2 Case Studies ── 4.3 Resume
│
Phase 5 (Polish)
├── 5.1 Media ── 5.2 Performance ── 5.3 Accessibility ── 5.4 Cross-Browser
│
Phase 6 (Deployment)
├── 6.1 Staging ── 6.2 Content Review ── 6.3 Production
```

---

## Technical Specifications

### New Dependencies
```json
{
  "@studio-freight/lenis": "^1.0.42",
  "gsap": "^3.12.5"
}
```

### Component Manifest (New)
| Component | Purpose | Priority |
|-----------|---------|----------|
| `SmoothScrollProvider` | Lenis wrapper for smooth scroll | High |
| `FloatingContact` | Persistent circular CTA widget | High |
| `PillCta` | Cuberto-style rounded outline button | High |
| `CursorFollower` | Custom cursor with state changes | Low |
| `InverseSection` | Dark section shell with rounded corners | High |
| `ParallaxMedia` | Scroll-scrubbed parallax container | Medium |

### Design Token Updates (globals.css)
```css
/* Cuberto-derived additions */
--cb-h1-size: clamp(3rem, 6vw, 5.67rem);
--cb-h2-size: clamp(2.25rem, 4.5vw, 4rem);
--cb-hero-top: clamp(8rem, 15vw, 15rem);
--cb-section-padding: clamp(5rem, 10vw, 7.5rem);
--cb-border-radius: 18px;
--cb-border-radius-lg: 2rem;
```

---

## Implementation Order (Recommended)

For incremental, safe development:

1. **Week 1:** Foundation (1.1-1.3) + Smooth Scroll (3.1)
2. **Week 2:** Components (2.1-2.4) + GSAP (3.2)
3. **Week 3:** Home Page (4.1) + Media Assets (5.1)
4. **Week 4:** Secondary Pages (4.2-4.3) + Polish (5.2-5.4)
5. **Week 5:** Testing & Deployment (6.1-6.3)

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| GSAP bundle size | Use modular imports, tree-shake unused plugins |
| Motion sickness | Always check `prefers-reduced-motion`, provide static fallback |
| Font loading FOUT | Use `next/font` with display: swap, critical CSS |
| Dark mode contrast | Test WCAG AA ratios in both themes |
| Mobile performance | Profile on real devices, defer non-critical animations |

---

## Success Criteria

- [ ] Hero loads under 2s on 3G
- [ ] LCP under 2.5s
- [ ] CLS under 0.1
- [ ] All motion respects reduced-motion preference
- [ ] WCAG AA compliance on all pages
- [ ] Print resume matches screen layout
- [ ] Social sharing cards render correctly
- [ ] E2E tests pass in CI

---

## Reference Files

All Cuberto reference materials available in `user_read_only_context/`:
- `cuberto-observed-inventory-2026-03-15-Pwo8R.md` - Design theory & context
- `cuberto-template-pack-2026-03-15-eW8sD.md` - HTML/GSAP snippets
- `cuberto-safe-ui-tokens-2x045.css` - Styling variables
- `cuberto-safe-motion-presets-iVbiw.json` - Animation timings
- `cuberto-component-manifest-2026-03-15-E8k36.json` - System structure
- `cuberto-reference-brief-2026-03-15-bfxW9.md` - Portfolio adaptation guide
