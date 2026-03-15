# Section-by-Section Implementation Guide

## SECTION 1: HERO

### Current Code Location
- Component: `src/app/page.tsx` (lines ~50-120)
- Styles: `src/app/page.module.css` (.hero, .heroContent, .heroActions)

### What to Replace
```jsx
// BEFORE: Multiple Reveal components
<Reveal variant="fade-up" delay={0.2}>
  <h1>{hero.title}</h1>
</Reveal>
<Reveal variant="fade-up" delay={0.3}>
  <p>{hero.description}</p>
</Reveal>
<Reveal variant="fade-up" delay={0.45}>
  <div>{/* CTAs */}</div>
</Reveal>
```

### Implementation Steps
1. Import: `import { ChoreographyContainer, ChoreographyItem } from "@/components/portfolio/motion-choreography"`
2. Add `text-display-xl` class to h1
3. Wrap entire hero content in `<ChoreographyContainer variant="fade-up" stagger={0.1}>`
4. Replace each `<Reveal>` with `<ChoreographyItem delay={value}>`
5. Update CSS: Change `page.module.css` .hero section to use padding tokens

### Testing Checklist
- [ ] Hero title renders at 90px on desktop
- [ ] Title scales to ~70px on tablet (768px)
- [ ] Title scales to ~60px on mobile (375px)
- [ ] Cascade animation plays smoothly (60fps)
- [ ] Cascade completes in ~400ms
- [ ] CTAs are clickable after animation
- [ ] No layout shift during animation

### Expected Result
Dramatic 90px title with cascading animation of description and CTA buttons, no more individual Reveal components.

---

## SECTION 2: ABOUT

### Current Code Location
- Component: `src/app/page.tsx` (lines ~120-200)
- Styles: `src/app/page.module.css` (.about, .aboutContent)

### What to Replace
```jsx
// BEFORE: Inconsistent Reveal timings
<Reveal delay={0.1}>{/* Title */}</Reveal>
<Reveal delay={0.2}>{/* Description */}</Reveal>
<Reveal delay={0.3}>{/* Points */}</Reveal>
```

### Implementation Steps
1. Add background: `bg-gradient-to-br from-warm-50 to-graphite-950`
2. Wrap entire about section with `<ChoreographyContainer variant="slide-up" stagger={0.15}>`
3. Apply `text-display-lg` to about title
4. Add numbered badge containers for each point
5. Update spacing to use design tokens (py-120, px-16)

### New Structure Example
```jsx
<section className="py-120 px-16 bg-gradient-to-br from-warm-50 to-graphite-950">
  <ChoreographyContainer variant="slide-up" stagger={0.15}>
    <ChoreographyItem delay={0}>
      <h2 className="text-display-lg">About Me</h2>
    </ChoreographyItem>
    {about.points?.map((point, idx) => (
      <ChoreographyItem key={idx} delay={(idx + 1) * 0.15}>
        <div className="flex gap-6">
          <div className="w-12 h-12 bg-teal-500 flex items-center justify-center rounded">
            {idx + 1}
          </div>
          <div>
            <h3 className="text-display-sm">{point.title}</h3>
            <p className="text-body-sm">{point.description}</p>
          </div>
        </div>
      </ChoreographyItem>
    ))}
  </ChoreographyContainer>
</section>
```

### Testing Checklist
- [ ] Background gradient applies correctly
- [ ] Numbered badges align properly
- [ ] Cascade stagger: 0.15s between items
- [ ] Total cascade ~1.2s for 8 items
- [ ] Typography scale applied to h2 and h3
- [ ] Mobile: Content stacks single column
- [ ] Tablet: 2-column layout works

### Expected Result
About section with elegant gradient background, numbered point badges, and smooth cascading animation with proper typography scale.

---

## SECTION 3: CASES GRID (Most Important)

### Current Code Location
- Component: `src/app/page.tsx` (lines ~200-280)
- Styles: `src/app/page.module.css` (.cases, .caseGrid, .caseCard)

### What to Replace
```jsx
// BEFORE: Individual Reveal per card
{cases.map((caseStudy, idx) => (
  <Reveal key={caseStudy.id} variant="fade-up" delay={idx * 0.1}>
    <Link href={`/cases/${caseStudy.slug}`}>
      {/* Card content */}
    </Link>
  </Reveal>
))}
```

### Implementation Steps

**Step 1: Update Grid Wrapper**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
  <ChoreographyContainer variant="stagger-fade" stagger={0.12}>
```

**Step 2: Update Each Card**
```jsx
{cases.map((caseStudy, idx) => (
  <ChoreographyItem key={caseStudy.id} delay={idx * 0.12}>
    <Link href={`/cases/${caseStudy.slug}`}>
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
    </Link>
  </ChoreographyItem>
))}
```

**Step 3: CSS Updates**
```css
/* In page.module.css */
.caseCard {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.caseCard:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
```

### Testing Checklist
- [ ] 10 cards cascade in exactly 1.2s (0.12s × 10)
- [ ] Each card staggered by 0.12s
- [ ] Hover effect triggers smoothly
- [ ] Images load without layout shift
- [ ] Grid responsive: 3 cols (desktop) → 2 cols (tablet) → 1 col (mobile)
- [ ] Links navigate correctly
- [ ] Tags styled with teal accent
- [ ] Animation FPS: 60fps (DevTools Performance)

### Performance Notes
- Total cascade duration: 1.2 seconds
- Stagger interval: 120ms
- Hover animation: 300ms

### Expected Result
Beautiful cascading grid animation with cards sliding up + fading in, staggered at 0.12s intervals. Smooth hover effects with subtle elevation change.

---

## SECTION 4: BUILDS

### Current Code Location
- Component: `src/app/page.tsx` (lines ~280-360)
- Styles: `src/app/page.module.css` (.builds, .buildGrid, .buildCard)

### Key Differences from Cases
- Dark background (graphite-950 → warm-900 gradient)
- White text on dark background
- Teal/coral accent colors for tech tags
- 0.1s stagger (faster than cases)

### Implementation Pattern
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

### Testing Checklist
- [ ] Dark background renders correctly
- [ ] White text readable (contrast ≥ 4.5:1)
- [ ] Teal border on hover visible
- [ ] Tech tags use coral accent
- [ ] 0.1s stagger applied (0.2s faster than cases)
- [ ] Links open in new tab
- [ ] Grid layout responsive

### Expected Result
Dark section with inverted color scheme, faster cascade animation, tech tag highlights with coral accent color.

---

## SECTION 5: TESTIMONIALS

### Current Code Location
- Component: `src/app/page.tsx` (lines ~360-420)
- Styles: `src/app/page.module.css` (.testimonials, .testimonialCard)

### Implementation Pattern
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

### Testing Checklist
- [ ] 0.15s stagger applied (slower cascade)
- [ ] Quote text italic and readable
- [ ] Avatar images load and display correctly
- [ ] Author name and role aligned
- [ ] Left border (4px teal) visible
- [ ] Responsive at all breakpoints

### Expected Result
Elegant testimonials section with italicized quotes, author details, and slow cascading animation (0.15s stagger).

---

## SECTION 6: FOOTER

### Current Code Location
- Component: `src/app/page.tsx` (lines ~420-450)
- Styles: `src/app/page.module.css` (.footer)

### Implementation Pattern
```jsx
<footer className="bg-graphite-950 text-white py-120 px-16">
  <ChoreographyContainer variant="fade-up">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-48 mb-48">
      {/* Footer sections */}
    </div>
    
    <div className="border-t border-graphite-800 pt-24">
      <div className="flex justify-between items-center">
        <p className="text-body-sm text-graphite-400">
          {footer}
        </p>
        <div className="flex gap-16">
          {/* Social links */}
        </div>
      </div>
    </div>
  </ChoreographyContainer>
</footer>
```

### Testing Checklist
- [ ] Single fade-up animation (no stagger)
- [ ] Dark background (graphite-950)
- [ ] White text readable
- [ ] Social links functional
- [ ] Footer text left-aligned, social links right-aligned
- [ ] Responsive: stack on mobile

### Expected Result
Simple, elegant footer with single fade-up animation, dark background, and organized layout.

---

## Summary Table

| Section | Current Pattern | Target Pattern | Stagger | Total Time |
|---------|-----------------|----------------|---------|------------|
| Hero | Individual Reveal | ChoreographyContainer | 0.1s | 0.4s |
| About | Inconsistent timing | Choreography + badges | 0.15s | 1.2s |
| Cases | Individual Reveal | Grid Choreography | 0.12s | 1.2s |
| Builds | Individual Reveal | Dark Grid Choreography | 0.1s | 1.0s |
| Testimonials | Reveal | Card Choreography | 0.15s | 0.9s |
| Footer | Basic footer | Fade-up Choreography | None | Single |

**Total Animation Duration: ~6 seconds (all sections combined)**

---

## Recommended Implementation Order

1. **Hero** (simplest, most visible) → 1 hour
2. **About** (medium complexity) → 1 hour
3. **Cases** (most complex) → 1.5 hours
4. **Builds** (similar to cases, faster) → 1 hour
5. **Testimonials** (straightforward) → 45 min
6. **Footer** (simplest) → 30 min
7. **Testing & Polish** → 2 hours

**Total: ~8-9 hours implementation + 2 hours testing = 10-11 hours**
