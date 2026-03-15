# Visual Upgrade Implementation Plan

## Current State Analysis

The portfolio currently has:
- **Solid foundation**: CSS variables, motion tokens, responsive grid
- **Working components**: CTAButton, FloatingContact, ChoreographyContainer, Card
- **Design system**: Warm/graphite palette, teal/coral accents, grain textures

**What's missing visually:**
1. Hero title uses `clamp(3.2rem, 7vw, 5.5rem)` — not the dramatic 90px scale
2. Case/build cards use individual `Reveal` components — not orchestrated cascading
3. New Card component exists but isn't integrated into sections
4. Typography hierarchy could be more dramatic

---

## Implementation Scope

### Option A: Specific Sections (Recommended for Quick Visual Impact)
Focus on 3 high-impact areas:
1. **Hero Section** — Apply 90px typography scale
2. **Cases Grid** — Replace individual Reveal with ChoreographyContainer
3. **Contact Section** — Add visual separation with alternating background

### Option B: Full Homepage Overhaul
All sections get visual upgrades with new components

---

## Phase 1: Typography Scale (90px Headlines)

### Current
```css
.heroTitle {
  font-size: clamp(3.2rem, 7vw, 5.5rem); /* ~51px-88px */
}
```

### Target
```css
.heroTitle {
  font-size: clamp(3.5rem, 8vw, 5.625rem); /* ~56px-90px */
  letter-spacing: -0.06em; /* Tighter tracking */
}

.sectionTitle {
  font-size: clamp(2.25rem, 5vw, 4rem); /* ~36px-64px */
}

.caseTitleFeatured {
  font-size: clamp(2.5rem, 4.5vw, 3.75rem); /* ~40px-60px */
}
```

### Files to Edit
- `src/app/page.module.css` — lines 165-173 (heroTitle)
- `src/app/page.module.css` — lines 396-402 (sectionTitle)

---

## Phase 2: Cascading Card Animations

### Current Pattern
```tsx
// Each card has individual Reveal with computed delay
{cases.map((caseStudy, index) => (
  <Reveal
    variant="fade-up"
    delay={0.08 * index}
    duration={0.8}
  >
    <article>...</article>
  </Reveal>
))}
```

### Target Pattern
```tsx
// Single ChoreographyContainer orchestrates all children
<ChoreographyContainer staggerDelay={0.1} direction="up" className={styles.casesGrid}>
  {cases.map((caseStudy) => (
    <ChoreographyItem key={caseStudy.slug}>
      <article>...</article>
    </ChoreographyItem>
  ))}
</ChoreographyContainer>
```

### Files to Edit
- `src/app/page.tsx` — lines 151-208 (cases section)
- `src/app/page.tsx` — lines 210-252 (builds section)
- `src/app/page.tsx` — lines 254-285 (strengths section)

---

## Phase 3: Alternating Section Backgrounds

### Current
All sections share the same background (inherited from body)

### Target
Add visual rhythm with alternating light/dark tinted sections:

```css
.section {
  padding: var(--section-gap) 0;
}

.section:nth-of-type(even) {
  background: var(--bg-section-alt);
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  padding-left: calc(50vw - 50%);
  padding-right: calc(50vw - 50%);
}
```

### New CSS Variables
```css
:root {
  --bg-section-alt: rgba(255, 255, 255, 0.35);
}

[data-theme="dark"] {
  --bg-section-alt: rgba(42, 48, 56, 0.4);
}
```

---

## Phase 4: Card Component Integration (Optional)

Replace inline `<article>` elements with the new `Card` component system for:
- Consistent hover effects
- Theme-aware styling
- Reusable structure

### Example Transformation
```tsx
// Before
<article className={styles.caseCardFeatured}>
  <div className={styles.caseVisualFeatured}>...</div>
  <div className={styles.caseBody}>...</div>
</article>

// After
<Card variant="featured" className={styles.caseCardFeatured}>
  <CardImage src={caseStudy.previewImage} alt={...} />
  <CardBody>
    <CardHeader title={caseStudy.title} eyebrow={caseStudy.eyebrow} />
    <CardTags tags={caseStudy.tags.map(t => ({ label: t }))} />
    <CardFooter>
      <CardLink href={`/cases/${caseStudy.slug}`}>Open case study</CardLink>
    </CardFooter>
  </CardBody>
</Card>
```

---

## Testing Checklist

### Visual Regression
- [ ] Screenshot before changes (homepage, mobile/desktop)
- [ ] Screenshot after each phase
- [ ] Compare typography scale at different viewport widths
- [ ] Verify animation timing feels natural (not too fast/slow)

### Responsiveness
- [ ] Mobile (320px, 375px, 414px)
- [ ] Tablet (768px, 1024px)
- [ ] Desktop (1280px, 1440px, 1920px)

### Accessibility
- [ ] `prefers-reduced-motion` disables animations
- [ ] Text contrast ratios pass WCAG AA
- [ ] Focus states visible on all interactive elements

### Performance
- [ ] Lighthouse Performance score > 90
- [ ] No layout shift during animation
- [ ] Images lazy-load below fold

---

## Before/After Comparison Strategy

### Method 1: Screenshot Overlay
1. Open current site in browser
2. Use DevTools → More Tools → Screenshots → Capture full size screenshot
3. Save as `before-homepage.png`
4. Apply changes
5. Capture new screenshot as `after-homepage.png`
6. Use image diff tool (e.g., ImageMagick, Figma overlay)

### Method 2: Git Branch Comparison
1. Current state is on `main` branch
2. Create `visual-upgrade` branch
3. Deploy both to preview URLs
4. Open side-by-side in browser windows

### Method 3: Component Storybook (Future)
- Create visual regression tests with Chromatic/Percy
- Automated diffing on each PR

---

## Recommended Implementation Order

1. **Typography Scale** (5 min)
   - Quick CSS changes with high visual impact
   
2. **Cascading Animations** (15 min)
   - Replace Reveal pattern with ChoreographyContainer
   
3. **Alternating Backgrounds** (10 min)
   - Add section rhythm for visual separation

4. **Card Integration** (Optional, 30 min)
   - Only if current inline styles feel limiting

---

## Summary

The biggest visual wins come from:
1. **90px hero typography** — Creates immediate premium feel
2. **Orchestrated cascading** — Replaces individual staggers with unified choreography
3. **Section rhythm** — Alternating backgrounds break up monotony

These changes require minimal code modifications but deliver significant visual differentiation from the current state.
