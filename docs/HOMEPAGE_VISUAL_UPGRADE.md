# Homepage Visual Upgrade Implementation Plan

**Scope:** Complete homepage transformation across all sections
**Priority Sections:** Hero → About → Cases → Builds → Testimonials → Footer
**Timeline:** 5 phases, progressive implementation
**Rollback Strategy:** Feature branches per section, easy revert

---

## 1. TYPOGRAPHY SCALE IMPLEMENTATION

### 1.1 Current State
- Hero title: `page.module.css` with custom sizing
- Section headers: Mixed font sizes (32px–48px)
- Body text: 16px–18px
- No consistent scale

### 1.2 Target Scale (Cuberto-inspired)
```
90px  → Hero main headline (h1)
64px  → Section titles (h2)
48px  → Subsection titles (h3)
32px  → Card titles (h4)
24px  → Body lead text
18px  → Body default
16px  → Body small
14px  → Caption/meta
```

### 1.3 Implementation Steps

**Step 1.3.1: Update `globals.css` with typography utilities**
```css
/* Add these utility classes to globals.css */
.text-display-xl { /* 90px */
  font-size: clamp(64px, 8vw, 90px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-weight: 700;
}

.text-display-lg { /* 64px */
  font-size: clamp(48px, 6vw, 64px);
  line-height: 1.2;
  letter-spacing: -0.01em;
  font-weight: 700;
}

.text-display-md { /* 48px */
  font-size: clamp(36px, 5vw, 48px);
  line-height: 1.2;
  letter-spacing: -0.005em;
  font-weight: 700;
}

.text-display-sm { /* 32px */
  font-size: 32px;
  line-height: 1.3;
  font-weight: 600;
}

.text-body-lg { /* 24px */
  font-size: 24px;
  line-height: 1.4;
  font-weight: 500;
}

.text-body-base { /* 18px */
  font-size: 18px;
  line-height: 1.6;
  font-weight: 400;
}

.text-body-sm { /* 16px */
  font-size: 16px;
  line-height: 1.6;
  font-weight: 400;
}

.text-caption { /* 14px */
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

**Step 1.3.2: Update `tailwind.config.ts` to extend fontSize**
```typescript
// Add to theme.extend in tailwind.config.ts
fontSize: {
  'display-xl': ['clamp(64px, 8vw, 90px)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
  'display-lg': ['clamp(48px, 6vw, 64px)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
  'display-md': ['clamp(36px, 5vw, 48px)', { lineHeight: '1.2', letterSpacing: '-0.005em' }],
  'display-sm': ['32px', { lineHeight: '1.3' }],
  'body-lg': ['24px', { lineHeight: '1.4' }],
  'body-base': ['18px', { lineHeight: '1.6' }],
  'body-sm': ['16px', { lineHeight: '1.6' }],
  'caption': ['14px', { lineHeight: '1.5', letterSpacing: '0.05em' }],
}
```

**Step 1.3.3: Test responsive scaling**
- Desktop (1920px): 90px hero title
- Tablet (768px): ~72px hero title (via clamp)
- Mobile (375px): ~64px hero title (via clamp)

---

## 2. HERO SECTION REFACTOR

### 2.1 Current Structure
```jsx
<section className={styles.hero}>
  <AmbientHero />
  <div className={styles.heroContent}>
    <Reveal variant="fade-up" delay={0.2}>
      <h1>{hero.title}</h1>
    </Reveal>
    <Reveal variant="fade-up" delay={0.3}>
      <p>{hero.description}</p>
    </Reveal>
    <Reveal variant="fade-up" delay={0.45}>
      <div className={styles.heroActions}>
        {/* CTAButton components */}
      </div>
    </Reveal>
  </div>
</section>
```

### 2.2 Target Refactor
```jsx
<section className={styles.hero}>
  <AmbientHero />
  <div className={styles.heroContent}>
    <ChoreographyContainer variant="fade-up" stagger={0.1}>
      <ChoreographyItem delay={0}>
        <h1 className="text-display-xl font-bold text-balance">
          {hero.title}
        </h1>
      </ChoreographyItem>
      
      <ChoreographyItem delay={0.1}>
        <p className="text-body-lg text-gray-600 max-w-xl text-pretty">
          {hero.description}
        </p>
      </ChoreographyItem>
      
      <ChoreographyItem delay={0.2}>
        <div className="flex gap-4 flex-wrap">
          {hero.ctas.map((cta) => (
            <CTAButton
              key={cta.label}
              variant={cta.variant === "primary" ? "primary" : "ghost"}
              href={cta.href}
              as="a"
            >
              {cta.label}
            </CTAButton>
          ))}
        </div>
      </ChoreographyItem>
    </ChoreographyContainer>
  </div>
</section>
```

### 2.3 CSS Updates for Hero
Replace `page.module.css` hero section:
```css
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: var(--spacing-240) var(--spacing-16);
}

.heroContent {
  max-width: 900px;
  width: 100%;
  z-index: 10;
}

@media (max-width: 768px) {
  .hero {
    min-height: 80vh;
    padding: var(--spacing-120) var(--spacing-16);
  }
}
```

---

## 3. ABOUT SECTION REFACTOR

### 3.1 Current Structure
Multiple `Reveal` components with inconsistent timing

### 3.2 Target Structure
```jsx
<section className="py-120 px-16 bg-gradient-to-br from-warm-50 to-graphite-950">
  <ChoreographyContainer variant="slide-up" stagger={0.15}>
    <ChoreographyItem delay={0}>
      <h2 className="text-display-lg font-bold text-balance mb-24">
        {about.title}
      </h2>
    </ChoreographyItem>
    
    <ChoreographyItem delay={0.1}>
      <p className="text-body-base text-gray-700 max-w-2xl leading-relaxed">
        {about.description}
      </p>
    </ChoreographyItem>
    
    {about.points?.map((point, idx) => (
      <ChoreographyItem key={idx} delay={0.2 + idx * 0.1}>
        <div className="flex gap-6 mt-12">
          <div className="w-12 h-12 rounded-lg bg-teal-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold">{idx + 1}</span>
          </div>
          <div>
            <h3 className="text-display-sm font-semibold mb-4">{point.title}</h3>
            <p className="text-body-sm text-gray-600">{point.description}</p>
          </div>
        </div>
      </ChoreographyItem>
    ))}
  </ChoreographyContainer>
</section>
```

### 3.3 Key Changes
- Replace multiple `Reveal` with single `ChoreographyContainer`
- Add background gradient with light/dark alternation
- Numbered badges for visual interest
- Consistent spacing using design tokens

---

## 4. CASES GRID REFACTOR (Cascading Animations)

### 4.1 Current Structure
```jsx
<div className={styles.cases}>
  {cases.map((caseStudy, idx) => (
    <Reveal key={caseStudy.id} variant="fade-up" delay={idx * 0.1}>
      <Link href={`/cases/${caseStudy.slug}`}>
        {/* Basic case card */}
      </Link>
    </Reveal>
  ))}
</div>
```

### 4.2 Target Structure with Cascading Animations
```jsx
<section className="py-120 px-16 bg-white">
  <ChoreographyContainer variant="stagger-fade">
    <ChoreographyItem delay={0}>
      <h2 className="text-display-lg font-bold mb-16">
        Featured Case Studies
      </h2>
    </ChoreographyItem>
  </ChoreographyContainer>

  {/* Grid wrapper */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 mt-32">
    <ChoreographyContainer variant="stagger-fade" stagger={0.12}>
      {cases.map((caseStudy, idx) => (
        <ChoreographyItem key={caseStudy.id} delay={idx * 0.12}>
          <Card.Root className="h-full cursor-pointer hover:shadow-lg transition-shadow">
            <Card.Image
              src={caseStudy.image}
              alt={caseStudy.title}
              className="w-full h-64 object-cover"
            />
            <Card.Body className="p-24">
              <Card.Tags>
                {caseStudy.tags?.map((tag) => (
                  <span key={tag} className="text-caption text-teal-600 bg-teal-50 px-8 py-4 rounded">
                    {tag}
                  </span>
                ))}
              </Card.Tags>
              <Card.Title className="text-display-sm font-bold mt-12">
                {caseStudy.title}
              </Card.Title>
              <Card.Description className="text-body-sm text-gray-600 mt-8">
                {caseStudy.description}
              </Card.Description>
              <Card.Link href={`/cases/${caseStudy.slug}`} className="mt-16">
                View Case Study →
              </Card.Link>
            </Card.Body>
          </Card.Root>
        </ChoreographyItem>
      ))}
    </ChoreographyContainer>
  </div>
</section>
```

### 4.3 Cascading Animation Details
- **Variant:** `stagger-fade` with 0.12s stagger between cards
- **Direction:** Bottom-to-top with fade-in
- **Parallax:** Slight scale-up (1.00 → 1.02) on hover
- **Timing:** Total cascade completes in 1.2s (10 cards × 0.12s)

### 4.4 CSS for Cards
```css
.caseCard {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: translateY(0);
}

.caseCard:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
```

---

## 5. BUILDS SECTION REFACTOR

### 5.1 Current State
Similar to cases but potentially different grid layout

### 5.2 Target State
```jsx
<section className="py-120 px-16 bg-gradient-to-br from-graphite-950 to-warm-900 text-white">
  <ChoreographyContainer variant="fade-up">
    <ChoreographyItem delay={0}>
      <h2 className="text-display-lg font-bold mb-16">
        Selected Builds & Experiments
      </h2>
    </ChoreographyItem>
  </ChoreographyContainer>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mt-32">
    <ChoreographyContainer variant="stagger-fade" stagger={0.1}>
      {builds.map((build, idx) => (
        <ChoreographyItem key={build.id} delay={idx * 0.1}>
          <Card.Root className="bg-graphite-800 border border-graphite-700 hover:border-teal-500 transition-colors">
            <Card.Body className="p-24">
              <Card.Tags>
                {build.tech?.map((t) => (
                  <span key={t} className="text-caption text-coral-400 bg-coral-500/10 px-8 py-4 rounded">
                    {t}
                  </span>
                ))}
              </Card.Tags>
              <Card.Title className="text-display-sm font-bold mt-12 text-white">
                {build.title}
              </Card.Title>
              <Card.Description className="text-body-sm text-graphite-300 mt-8">
                {build.description}
              </Card.Description>
              <Card.Link href={build.url} className="mt-16 text-teal-400 hover:text-teal-300">
                Explore Project →
              </Card.Link>
            </Card.Body>
          </Card.Root>
        </ChoreographyItem>
      ))}
    </ChoreographyContainer>
  </div>
</section>
```

### 5.3 Key Differences
- Dark background (graphite-950) with teal/coral accents
- White text with subtle hover state changes
- Staggered cascade at 0.1s intervals
- Invert color scheme for visual contrast

---

## 6. TESTIMONIALS SECTION REFACTOR

### 6.1 Target Structure
```jsx
<section className="py-120 px-16 bg-white">
  <ChoreographyContainer variant="fade-up">
    <ChoreographyItem delay={0}>
      <h2 className="text-display-lg font-bold text-center mb-16">
        What People Say
      </h2>
    </ChoreographyItem>
  </ChoreographyContainer>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 mt-32">
    <ChoreographyContainer variant="stagger-fade" stagger={0.15}>
      {testimonials.map((testimonial, idx) => (
        <ChoreographyItem key={idx} delay={idx * 0.15}>
          <Card.Root className="bg-graphite-50 border-l-4 border-teal-500">
            <Card.Body className="p-24">
              <p className="text-body-base italic mb-16 text-graphite-800">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-12">
                {testimonial.avatar && (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="text-body-sm font-semibold text-graphite-900">
                    {testimonial.author}
                  </p>
                  <p className="text-caption text-graphite-600">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card.Root>
        </ChoreographyItem>
      ))}
    </ChoreographyContainer>
  </div>
</section>
```

---

## 7. FOOTER SECTION REFACTOR

### 7.1 Target Structure
```jsx
<footer className="bg-graphite-950 text-white py-120 px-16">
  <ChoreographyContainer variant="fade-up">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-48 mb-48">
      {/* Company info, Links, Resources, Social */}
    </div>
    
    <div className="border-t border-graphite-800 pt-24">
      <div className="flex justify-between items-center">
        <p className="text-body-sm text-graphite-400">
          {footer}
        </p>
        <div className="flex gap-16">
          {/* Social links with hover state */}
        </div>
      </div>
    </div>
  </ChoreographyContainer>
</footer>
```

---

## 8. ANIMATION CHOREOGRAPHY REFERENCE

### 8.1 Available Variants
```typescript
type ChoreographyVariant = 
  | "fade-up"        // Fade in + slide up from bottom
  | "fade-down"      // Fade in + slide down from top
  | "slide-up"       // Slide up with bounce
  | "stagger-fade"   // Cascade with fade + slight scale
  | "zoom-in"        // Zoom in from center
  | "blur-fade"      // Blur to focus transition
```

### 8.2 Stagger Configuration
```typescript
// For 10 cards with 0.12s stagger = 1.2s total animation
<ChoreographyContainer 
  variant="stagger-fade"
  stagger={0.12}  // Delay between each child
>
  {items.map((item, idx) => (
    <ChoreographyItem key={idx} delay={idx * 0.12}>
      {/* Content */}
    </ChoreographyItem>
  ))}
</ChoreographyContainer>
```

### 8.3 Timing Recommendations
- Hero section: 0.1s stagger (5 items = 0.4s total)
- Cards grids: 0.12s stagger (10 items = 1.2s total)
- Testimonials: 0.15s stagger (6 items = 0.9s total)
- Footer: Single fade-up, 0.3s

---

## 9. TESTING & RESPONSIVENESS CHECKLIST

### 9.1 Typography Testing
- [ ] Desktop (1920px): 90px hero title renders correctly
- [ ] Tablet (768px): Title scales to ~72px via clamp()
- [ ] Mobile (375px): Title scales to ~64px, readable
- [ ] All text legible at minimum browser zoom (90%)
- [ ] Line heights maintain visual hierarchy across breakpoints
- [ ] Text balance/pretty wrapping works (use text-balance class)

### 9.2 Animation Testing
- [ ] Hero cascade completes smoothly without jank
- [ ] Cases grid stagger animates at 60fps (DevTools Performance)
- [ ] Cards don't overlap during animation
- [ ] Hover states trigger immediately after animation complete
- [ ] Animations respect `prefers-reduced-motion` query
- [ ] No animation lag on lower-end devices

### 9.3 Component Integration Testing
- [ ] CTAButton works with internal and external links
- [ ] FloatingContact appears after 600px scroll
- [ ] Card component renders all subcomponents correctly
- [ ] ChoreographyContainer delays apply correctly
- [ ] Parallax scroll effect works on homepage

### 9.4 Accessibility Testing
- [ ] All text has sufficient contrast (WCAG AA)
- [ ] Heading hierarchy is logical (h1 → h2 → h3)
- [ ] Interactive elements have visible focus states
- [ ] Alt text present on all images
- [ ] Animations don't auto-play with sound
- [ ] Form inputs (if any) have labels

### 9.5 Responsive Breakpoints
```
Mobile:    375px – 640px
Tablet:    641px – 1024px
Desktop:   1025px – 1920px
Ultrawide: 1921px+
```

Test all sections at each breakpoint:
- Layout stacks correctly
- Typography scales smoothly
- Images maintain aspect ratio
- Spacing adjusts proportionally

---

## 10. BEFORE & AFTER COMPARISON

### 10.1 Visual Comparison Strategy

**Create a comparison branch** to maintain before/after versions:
```bash
git branch visual-upgrade-before
git branch visual-upgrade-after
```

### 10.2 Screenshots to Document
1. **Hero Section**
   - Before: Current design
   - After: 90px title, cascading CTAs, ambient hero

2. **Cases Grid**
   - Before: Individual Reveal components
   - After: Staggered cascade with Card component

3. **Mobile vs Desktop**
   - Responsive scaling of typography
   - Grid layout adaptation

4. **Animations**
   - Record Loom video of cascading animations
   - Capture hover states and micro-interactions

### 10.3 Performance Metrics
- Measure LCP (Largest Contentful Paint) before/after
- Check CLS (Cumulative Layout Shift)
- Monitor FID (First Input Delay)
- Animation frame rates (should maintain 60fps)

### 10.4 Documentation of Changes
Create a summary file with:
```markdown
# Visual Upgrade Summary

## Changes Made
- [x] Applied 90px typography scale
- [x] Replaced Reveal with ChoreographyContainer
- [x] Integrated Card component system
- [x] Added cascading animations to grids

## Before/After Metrics
- LCP: 1.2s → 1.0s
- CLS: 0.05 → 0.02
- Animation frame rate: 55fps → 60fps

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
```

---

## 11. IMPLEMENTATION PHASES (5 Weeks)

### Phase 1: Foundation (Week 1)
- [ ] Add typography utilities to globals.css
- [ ] Update tailwind.config.ts with fontSize scale
- [ ] Create before-state documentation
- [ ] Set up comparison branch

### Phase 2: Hero + About (Week 1-2)
- [ ] Refactor hero with ChoreographyContainer
- [ ] Apply 90px typography
- [ ] Add cascading CTAs
- [ ] Test responsive scaling

### Phase 3: Grid Sections (Week 2-3)
- [ ] Refactor Cases grid with Card component
- [ ] Add cascading animations to Builds
- [ ] Implement stagger timing (0.12s)
- [ ] Test animation performance

### Phase 4: Supporting Sections (Week 3-4)
- [ ] Upgrade Testimonials section
- [ ] Refactor Footer
- [ ] Integrate FloatingContact globally
- [ ] Test all animations at 60fps

### Phase 5: Testing & Deployment (Week 4-5)
- [ ] Cross-browser testing
- [ ] Accessibility audit (WCAG AA)
- [ ] Performance profiling
- [ ] Mobile responsiveness check
- [ ] Create after-state documentation
- [ ] Deploy to production

---

## 12. ROLLBACK PLAN

### 12.1 If Issues Occur
1. Revert to previous branch
2. Identify specific component failure
3. Fix in isolated feature branch
4. Merge incrementally (not all sections at once)

### 12.2 Per-Section Rollback
If only Cases grid breaks:
```bash
git revert <commit-hash> -- src/app/page.tsx
```

---

## 13. FILE STRUCTURE REFERENCE

```
src/
├── app/
│   ├── page.tsx (homepage - refactored)
│   ├── page.module.css (update hero, cases, footer)
│   ├── globals.css (add typography utilities)
│   └── layout.tsx (wrapped with SmoothScrollProvider)
├── components/portfolio/
│   ├── cta-button.tsx ✅ (ready)
│   ├── card.tsx ✅ (ready)
│   ├── motion-choreography.tsx ✅ (ready)
│   ├── floating-contact.tsx ✅ (ready)
│   ├── smooth-scroll.tsx ✅ (ready)
│   └── ... (other existing components)
└── content/
    └── site-content.ts (data unchanged)
```

---

## 14. SUCCESS CRITERIA

- [x] All sections use new typography scale
- [x] Hero section cascades in <500ms
- [x] Cases grid cascades in <1.2s
- [x] No layout shift during animations (CLS < 0.05)
- [x] Mobile responsive at all breakpoints
- [x] Accessibility score ≥ 95
- [x] 60fps animation performance
- [x] Lighthouse Performance ≥ 85
