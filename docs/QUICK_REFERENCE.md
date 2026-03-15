# Quick Reference: Visual Upgrade Implementation

## Copy-Paste Code Snippets

### 1. Typography Utilities (Add to globals.css)
```css
/* Display Typography */
.text-display-xl {
  font-size: clamp(64px, 8vw, 90px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-weight: 700;
}

.text-display-lg {
  font-size: clamp(48px, 6vw, 64px);
  line-height: 1.2;
  letter-spacing: -0.01em;
  font-weight: 700;
}

.text-display-md {
  font-size: clamp(36px, 5vw, 48px);
  line-height: 1.2;
  letter-spacing: -0.005em;
  font-weight: 700;
}

.text-display-sm {
  font-size: 32px;
  line-height: 1.3;
  font-weight: 600;
}

/* Body Typography */
.text-body-lg {
  font-size: 24px;
  line-height: 1.4;
  font-weight: 500;
}

.text-body-base {
  font-size: 18px;
  line-height: 1.6;
  font-weight: 400;
}

.text-body-sm {
  font-size: 16px;
  line-height: 1.6;
  font-weight: 400;
}

.text-caption {
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### 2. Hero Section Pattern
```jsx
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
```

### 3. Cards Grid Pattern
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
  <ChoreographyContainer variant="stagger-fade" stagger={0.12}>
    {items.map((item, idx) => (
      <ChoreographyItem key={item.id} delay={idx * 0.12}>
        <Card.Root className="h-full">
          <Card.Image src={item.image} alt={item.title} />
          <Card.Body className="p-24">
            <Card.Tags>
              {item.tags?.map((tag) => (
                <span key={tag} className="text-caption">{tag}</span>
              ))}
            </Card.Tags>
            <Card.Title className="text-display-sm mt-12">
              {item.title}
            </Card.Title>
            <Card.Description className="text-body-sm mt-8">
              {item.description}
            </Card.Description>
            <Card.Link href={item.url} className="mt-16">
              View More →
            </Card.Link>
          </Card.Body>
        </Card.Root>
      </ChoreographyItem>
    ))}
  </ChoreographyContainer>
</div>
```

### 4. Dark Section Pattern
```jsx
<section className="py-120 px-16 bg-gradient-to-br from-graphite-950 to-warm-900 text-white">
  <ChoreographyContainer variant="fade-up">
    <ChoreographyItem delay={0}>
      <h2 className="text-display-lg font-bold mb-16">
        Section Title
      </h2>
    </ChoreographyItem>
  </ChoreographyContainer>
  
  {/* Content grid here */}
</section>
```

---

## Implementation Order

### Step 1: Setup (30 min)
- [ ] Add typography classes to globals.css
- [ ] Update tailwind.config.ts with fontSize scale
- [ ] Import new components in page.tsx

### Step 2: Hero (1 hour)
- [ ] Replace Reveal with ChoreographyContainer in hero
- [ ] Apply `text-display-xl` to main title
- [ ] Test cascade animation

### Step 3: About (1 hour)
- [ ] Wrap section with ChoreographyContainer
- [ ] Apply typography scale
- [ ] Add numbered badges

### Step 4: Cases Grid (1.5 hours)
- [ ] Replace individual Reveal with grid ChoreographyContainer
- [ ] Import and use Card component
- [ ] Set stagger to 0.12s
- [ ] Test cascade timing

### Step 5: Builds Section (1 hour)
- [ ] Apply dark background gradient
- [ ] Use Card component
- [ ] Set stagger to 0.1s

### Step 6: Testimonials (45 min)
- [ ] Wrap with ChoreographyContainer
- [ ] Use Card component with quotation styling
- [ ] Set stagger to 0.15s

### Step 7: Footer (30 min)
- [ ] Apply typography scale
- [ ] Add social icons
- [ ] Single fade-up animation

### Step 8: Testing (2 hours)
- [ ] Test all animations at 60fps
- [ ] Verify responsive scaling
- [ ] Accessibility audit
- [ ] Mobile/tablet/desktop testing

**Total Estimated Time: 8-9 hours of coding + 2 hours testing = 10-11 hours**

---

## File Changes Summary

| File | Change | Priority |
|------|--------|----------|
| `globals.css` | Add typography utilities | High |
| `page.tsx` | Refactor all sections | High |
| `page.module.css` | Update hero, cases, footer | High |
| `layout.tsx` | Verify SmoothScrollProvider | Medium |
| `tailwind.config.ts` | Extend fontSize | Medium |

---

## Animation Timings Reference

```
Hero cascade:        0.1s stagger → 0.4s total
Cases grid:          0.12s stagger → 1.2s total (10 cards)
Builds grid:         0.1s stagger → 1.0s total (10 cards)
Testimonials:        0.15s stagger → 0.9s total (6 cards)
Footer:              Single fade-up, no stagger
Hover animations:    0.3s duration
```

---

## Debugging Tips

### Animation Not Triggering?
1. Check `ChoreographyContainer` has `variant` prop
2. Verify `ChoreographyItem` has correct `delay` value
3. Ensure parent has `overflow: visible`

### Typography Not Scaling?
1. Check class name spelling (e.g., `text-display-xl` not `text-display-extra-large`)
2. Verify globals.css is imported in layout
3. Check for conflicting CSS rules in page.module.css

### Performance Degradation?
1. Check animation frame rate in DevTools
2. Reduce stagger time (0.12s → 0.08s)
3. Use `will-change: transform` on animated elements
4. Profile with Chrome DevTools Performance tab

### Mobile Issues?
1. Test with throttled connection (Slow 4G)
2. Check font size clamps are working
3. Verify media queries in page.module.css
4. Test on actual devices, not just browser emulation

---

## Success Metrics

After implementation, verify:

```
LCP (Largest Contentful Paint): < 1.5s
FCP (First Contentful Paint):  < 1.0s
CLS (Cumulative Layout Shift):  < 0.05
Animation FPS:                  60fps
Lighthouse Score:               ≥ 85
Accessibility Score:            ≥ 95
Mobile Score:                   ≥ 80
```

---

## Quick Deploy Checklist

- [ ] All tests passing
- [ ] Mobile responsive verified
- [ ] Accessibility audit complete (WCAG AA)
- [ ] Performance metrics acceptable
- [ ] No console errors
- [ ] Animations smooth at 60fps
- [ ] Before/after screenshots taken
- [ ] Commit message descriptive
- [ ] PR description comprehensive
- [ ] Ready to merge main branch
