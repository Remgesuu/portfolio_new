# Portfolio Development Project Plan

**Project:** Personal Portfolio Website for Grigorii  
**Stack:** Next.js 16 App Router, TypeScript, CSS Modules, Motion  
**Timeline:** 8–10 weeks  
**Team Size:** 1–3 people (solo developer with optional design/content support)

---

## Executive Summary

This plan outlines the development of a recruiter-first portfolio site for a support operations / technical support specialist with AI automation and workflow systems leverage. The site serves as a hiring decision tool—not a visual showcase—and must communicate positioning, proof, and credibility within 30 seconds of recruiter scan time.

**Primary Audience:** Recruiters, hiring managers, founders, product leads  
**Core Positioning:** "AI-enabled support systems operator for technical support, escalation, and workflow automation"

---

## Phase 1: Requirements Gathering & Content Audit

**Duration:** Week 1  
**Objective:** Define hiring narrative, audit existing content, identify proof gaps

### Tasks

| Task | Owner | Deliverable |
|------|-------|-------------|
| Define target role cluster | Content | Role fit matrix |
| Audit existing case studies for proof credibility | Content | Proof gap analysis |
| Map recruiter scan path (what they see in 30 sec) | Design | Scan path wireframe |
| Identify quantifiable metrics and outcomes | Content | Metrics inventory |
| Define "public-safe" packaging for each case | Content | Disclosure guidelines |
| Review competitor portfolios in target space | Research | Competitive brief |

### Deliverables
- [ ] Positioning statement (1 sentence)
- [ ] Target audience definition
- [ ] Content inventory spreadsheet
- [ ] Proof credibility audit
- [ ] Initial sitemap

### Exit Criteria
- Clear answer to: "Who is this person claiming to be?"
- Identified 3–5 strongest proof points
- Defined CTA flow (what should reader do next?)

---

## Phase 2: Information Architecture & Content Structure

**Duration:** Week 2  
**Objective:** Design content model, define page hierarchy, establish data contracts

### Tasks

| Task | Owner | Deliverable |
|------|-------|-------------|
| Design TypeScript content types | Dev | `src/content/types.ts` |
| Structure case study schema | Dev/Content | CaseStudy type with sections |
| Define navigation hierarchy | Design | Nav structure document |
| Map content to routes | Dev | Route manifest |
| Establish proof level taxonomy | Content | ProofLevel enum (core/shipped/working-knowledge) |
| Create content entry template | Content | Site content template |

### Content Types (Already Implemented)

```typescript
// Core content model
SiteContent {
  meta: SiteMeta           // Name, role, contact, links
  hero: HeroContent        // Positioning, CTAs, signals
  cases: SectionHeader     // Case study section intro
  builds: BuildsSection    // Technical proof items
  strengths: StrengthsSection // Role fit positioning
  contact: ContactSection  // Contact info and CTA
  resume: ResumeContent    // Full resume data
  caseStudies: CaseStudy[] // Deep-dive case studies
}
```

### Route Structure

| Route | Purpose | Content Source |
|-------|---------|----------------|
| `/` | Homepage with recruiter scan path | `siteContent` |
| `/cases/[slug]` | Deep-dive case studies | `caseStudies[]` |
| `/resume` | Printable/skimmable resume | `siteContent.resume` |

### Deliverables
- [ ] Complete TypeScript content model
- [ ] Populated `site-content.ts`
- [ ] Route documentation
- [ ] Navigation specification

---

## Phase 3: Design System & Visual Foundation

**Duration:** Week 2–3  
**Objective:** Establish design tokens, component patterns, and editorial aesthetic

### Design Direction
**Aesthetic:** Warm editorial / cinematic luxe  
**Not:** Generic developer portfolio, startup homepage, Dribbble shot

### Token Architecture (globals.css)

| Category | Tokens | Purpose |
|----------|--------|---------|
| Colors | `--color-warm-*`, `--color-graphite-*` | Neutral palette |
| Accents | `--accent-teal`, `--accent-coral` | Brand highlights |
| Surfaces | `--bg-primary`, `--bg-glass`, `--bg-elevated` | Layering system |
| Text | `--text-primary`, `--text-secondary` | Hierarchy |
| Borders | `--border-default`, `--border-glow` | Edge treatments |
| Shadows | `--shadow-sm` to `--shadow-lg` | Depth system |
| Motion | `--ease-out-expo`, `--transition-*` | Animation curves |
| Layout | `--page-width`, `--section-gap`, `--radius-*` | Spacing/sizing |

### Theme Support

| Theme | Palette | Characteristic |
|-------|---------|----------------|
| Light | Warm neutrals (warm-50 to warm-400) | Soft paper texture |
| Dark | Smoked graphite (graphite-300 to graphite-600) | Deep editorial |

### Tasks

| Task | Owner | Deliverable |
|------|-------|-------------|
| Define color palette (3–5 colors max) | Design | Token values in CSS |
| Establish typography scale | Design | Font specification |
| Design component library | Design | Component specs |
| Create glass/surface treatments | Design | Surface tokens |
| Define motion language | Design | Animation tokens |
| Implement light/dark themes | Dev | Theme tokens in globals.css |

### Deliverables
- [ ] Complete `globals.css` with all tokens
- [ ] Theme toggle component
- [ ] Typography specification
- [ ] Surface/glass treatment system

---

## Phase 4: Core Component Development

**Duration:** Week 3–4  
**Objective:** Build reusable component library

### Component Inventory

| Component | Location | Purpose |
|-----------|----------|---------|
| `ThemeProvider` | `components/portfolio/` | Theme state management |
| `ThemeToggle` | `components/portfolio/` | Light/dark switch |
| `Reveal` | `components/portfolio/` | Scroll-triggered animations |
| `AmbientHero` | `components/portfolio/` | Hero background effect |
| `Breadcrumbs` | `components/portfolio/` | Case study navigation |
| `SkipLink` | `components/portfolio/` | Accessibility skip nav |
| `ErrorBoundary` | `components/portfolio/` | Error handling |
| `PageTransition` | `components/portfolio/` | Route transitions |

### Tasks

| Task | Owner | Deliverable |
|------|-------|-------------|
| Build theme provider and toggle | Dev | Theme components |
| Create reveal animation system | Dev | Reveal component |
| Implement ambient hero effect | Dev | AmbientHero component |
| Build breadcrumb navigation | Dev | Breadcrumbs component |
| Add skip link for accessibility | Dev | SkipLink component |
| Create error boundary wrapper | Dev | ErrorBoundary component |

### Component Patterns

```tsx
// Reveal wrapper pattern
<Reveal variant="fade-up" delay={0.1} duration={0.7}>
  <YourContent />
</Reveal>

// Available variants: fade, fade-up, blur-to-crisp, scale-in
```

### Deliverables
- [ ] All components in `src/components/portfolio/`
- [ ] Corresponding CSS modules
- [ ] Component documentation

---

## Phase 5: Page Development

**Duration:** Week 4–6  
**Objective:** Build all page templates with content integration

### Homepage Sections (in recruiter scan order)

| Section | Priority | Content |
|---------|----------|---------|
| Topbar | Critical | Name, role, nav, contact |
| Hero | Critical | Positioning, CTAs, photo, signals |
| Cases | Critical | 3 case studies with outcomes |
| Builds | High | Technical proof (GitHub projects) |
| Strengths | High | Role fit positioning |
| Contact | Critical | Email, phone, GitHub, resume |
| Footer | Low | Copyright, location |

### Case Study Page Structure

| Section | Purpose |
|---------|---------|
| Breadcrumbs | Navigation context |
| Header | Number, eyebrow, title |
| Summary | Quick outcome statement |
| Metrics rail | Quantified proof (3 items) |
| Content sections | Challenge → Inputs → Method → What Surfaced → Impact → Next Move |
| Artifacts | Links to external proof |
| Adjacent cases | Continue reading flow |

### Resume Page Structure

| Section | Purpose |
|---------|---------|
| Header | Headline + summary |
| Contact | Location, email, phone, links |
| Skills | Core / Shipped / Working Knowledge |
| Experience | Company, title, period, bullets |
| Selected projects | With links to cases/repos |
| Education | Degrees, certifications |

### Tasks

| Task | Owner | Deliverable |
|------|-------|-------------|
| Build homepage layout | Dev | `app/page.tsx` |
| Implement hero section | Dev | Hero component |
| Build case card components | Dev | Case grid |
| Create case study detail page | Dev | `app/cases/[slug]/page.tsx` |
| Build resume page | Dev | `app/resume/page.tsx` |
| Add loading states | Dev | `loading.tsx` |
| Create 404 page | Dev | `not-found.tsx` |

### Deliverables
- [ ] All page routes functional
- [ ] CSS modules for each page
- [ ] Content rendering correctly

---

## Phase 6: Responsive Design & Mobile Optimization

**Duration:** Week 5–6  
**Objective:** Ensure mobile-first responsive behavior

### Breakpoints

| Breakpoint | Target | Key Changes |
|------------|--------|-------------|
| < 480px | Small mobile | Single column, stacked hero |
| 480–768px | Large mobile | 2-column grids |
| 768–1024px | Tablet | Navigation adjustments |
| 1024–1280px | Desktop | Full layout |
| > 1280px | Large desktop | Max-width constraints |

### Tasks

| Task | Owner | Deliverable |
|------|-------|-------------|
| Mobile navigation pattern | Dev | Responsive nav |
| Hero layout responsive flow | Dev | Stacked mobile hero |
| Case card grid breakpoints | Dev | Responsive grid |
| Resume print layout | Dev | Print stylesheet |
| Touch target sizing (48px min) | Dev | Mobile accessibility |
| Test all breakpoints | QA | Breakpoint checklist |

### Deliverables
- [ ] All pages responsive
- [ ] Mobile navigation working
- [ ] Print stylesheet for resume
- [ ] Touch targets ≥ 48px

---

## Phase 7: Accessibility Implementation

**Duration:** Week 6–7  
**Objective:** Meet WCAG 2.1 AA compliance

### Accessibility Checklist

| Requirement | Implementation |
|-------------|----------------|
| Skip to main content | `SkipLink` component |
| Keyboard navigation | Focus management |
| ARIA labels | Navigation, buttons, links |
| Color contrast | 4.5:1 text, 3:1 UI |
| Reduced motion | `prefers-reduced-motion` support |
| Focus indicators | Visible focus rings |
| Alt text | All images |
| Heading hierarchy | h1 → h2 → h3 logical order |
| Link purpose | Descriptive link text |

### Tasks

| Task | Owner | Deliverable |
|------|-------|-------------|
| Implement skip link | Dev | SkipLink component |
| Add ARIA labels to navigation | Dev | Accessible nav |
| Test color contrast | QA | Contrast report |
| Add reduced motion support | Dev | CSS media query |
| Test keyboard navigation | QA | Keyboard audit |
| Add focus indicators | Dev | Focus styles |
| Validate heading structure | QA | Heading hierarchy audit |

### Deliverables
- [ ] Skip link working
- [ ] All ARIA labels in place
- [ ] Contrast ratios passing
- [ ] Keyboard navigation complete
- [ ] Reduced motion support

---

## Phase 8: Performance Optimization

**Duration:** Week 7  
**Objective:** Achieve Core Web Vitals targets

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP | < 2.5s | Largest Contentful Paint |
| FID | < 100ms | First Input Delay |
| CLS | < 0.1 | Cumulative Layout Shift |
| TTI | < 3.8s | Time to Interactive |

### Optimization Strategies

| Strategy | Implementation |
|----------|----------------|
| Image optimization | `next/image` with priority for hero |
| Font loading | `next/font` with swap display |
| Code splitting | Dynamic imports for heavy components |
| Static generation | Pre-render all pages at build |
| Asset compression | Optimized SVGs, WebP images |
| CSS optimization | Critical CSS inline, CSS modules |

### Tasks

| Task | Owner | Deliverable |
|------|-------|-------------|
| Optimize hero image loading | Dev | Priority image with sizes |
| Implement font optimization | Dev | next/font setup |
| Add dynamic imports | Dev | Code splitting |
| Optimize SVG case images | Dev | Compressed SVGs |
| Test Core Web Vitals | QA | Performance report |
| Implement static generation | Dev | generateStaticParams |

### Deliverables
- [ ] All images optimized
- [ ] Fonts loading efficiently
- [ ] Core Web Vitals passing
- [ ] Lighthouse score ≥ 90

---

## Phase 9: SEO & Metadata

**Duration:** Week 7–8  
**Objective:** Optimize for search and social sharing

### SEO Implementation

| Element | Implementation |
|---------|----------------|
| Page titles | Metadata API in layout/page |
| Meta descriptions | Per-page descriptions |
| Open Graph | `opengraph-image.tsx` |
| Twitter cards | `twitter-image.tsx` |
| Canonical URLs | Site URL configuration |
| Sitemap | `sitemap.ts` |
| Robots | `robots.ts` |

### Tasks

| Task | Owner | Deliverable |
|------|-------|-------------|
| Configure metadata in layout | Dev | Root metadata |
| Add per-page metadata | Dev | Page metadata |
| Implement OG image generation | Dev | opengraph-image.tsx |
| Implement Twitter image | Dev | twitter-image.tsx |
| Generate sitemap | Dev | sitemap.ts |
| Configure robots.txt | Dev | robots.ts |
| Set canonical URLs | Dev | Environment variable |

### Deliverables
- [ ] All metadata configured
- [ ] Social images generating
- [ ] Sitemap accessible
- [ ] Robots.txt correct

---

## Phase 10: Testing & Quality Assurance

**Duration:** Week 8–9  
**Objective:** Comprehensive testing coverage

### Test Types

| Test Type | Tool | Coverage |
|-----------|------|----------|
| Unit tests | Vitest | Utility functions |
| E2E tests | Playwright | User flows |
| Accessibility | Playwright + axe | WCAG compliance |
| Visual | Playwright screenshots | Regression |

### E2E Test Coverage

| Test File | Coverage |
|-----------|----------|
| `accessibility.spec.ts` | Skip links, ARIA, keyboard nav |
| `case-studies.spec.ts` | Case study navigation and content |
| `navigation.spec.ts` | All routes and links |
| `not-found.spec.ts` | 404 handling |
| `responsive.spec.ts` | Breakpoint behavior |
| `theme.spec.ts` | Light/dark toggle |

### Tasks

| Task | Owner | Deliverable |
|------|-------|-------------|
| Write unit tests for utilities | Dev | Vitest tests |
| Write E2E navigation tests | QA | Playwright tests |
| Write accessibility tests | QA | a11y test suite |
| Write responsive tests | QA | Breakpoint tests |
| Write theme tests | QA | Theme toggle tests |
| Run full test suite | QA | Test report |

### Deliverables
- [ ] Unit tests passing
- [ ] E2E tests passing
- [ ] Accessibility tests passing
- [ ] Test coverage report

---

## Phase 11: Deployment & Launch

**Duration:** Week 9  
**Objective:** Deploy to production on Vercel

### Deployment Checklist

| Task | Status |
|------|--------|
| Connect GitHub repository | ☐ |
| Configure environment variables | ☐ |
| Set `NEXT_PUBLIC_SITE_URL` | ☐ |
| Run production build locally | ☐ |
| Deploy to Vercel | ☐ |
| Verify all routes | ☐ |
| Test social sharing | ☐ |
| Check analytics setup | ☐ |
| Configure custom domain | ☐ |

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata/sitemap |

### Pre-Deploy Verification

```bash
npm run lint        # No lint errors
npm run typecheck   # No type errors
npm run build       # Build succeeds
npm run test        # All tests pass
npm run test:e2e    # E2E tests pass
```

### Deliverables
- [ ] Production deployment live
- [ ] All routes verified
- [ ] Custom domain configured
- [ ] SSL certificate active

---

## Phase 12: Post-Launch & Maintenance

**Duration:** Ongoing  
**Objective:** Monitor, iterate, and maintain

### Monitoring

| Metric | Tool | Frequency |
|--------|------|-----------|
| Core Web Vitals | Vercel Analytics | Weekly |
| Error rates | Vercel Logs | Daily |
| Traffic | Vercel Analytics | Weekly |
| SEO performance | Google Search Console | Monthly |

### Maintenance Tasks

| Task | Frequency |
|------|-----------|
| Dependency updates | Monthly |
| Content updates | As needed |
| Security patches | As released |
| Performance audits | Quarterly |
| Case study additions | As projects complete |

### Future Enhancements

| Enhancement | Priority | Effort |
|-------------|----------|--------|
| Blog/writing section | Low | Medium |
| Contact form | Medium | Low |
| More case studies | High | Medium |
| Testimonials section | Low | Low |
| Multi-language support | Low | High |

---

## Dependencies & Milestones

```
Week 1  ─── Requirements ───┐
Week 2  ─── IA + Design ────┤
Week 3  ─── Design System ──┼─── MILESTONE: Design Complete
Week 4  ─── Components ─────┤
Week 5  ─── Pages ──────────┤
Week 6  ─── Responsive ─────┼─── MILESTONE: Feature Complete
Week 7  ─── A11y + Perf ────┤
Week 8  ─── SEO + Testing ──┤
Week 9  ─── Deployment ─────┼─── MILESTONE: Launch
Week 10 ─── Iteration ──────┘
```

### Critical Path

1. Content audit → determines all downstream content
2. Design tokens → blocks all visual development
3. Content types → blocks page development
4. Homepage → must complete before case pages
5. Testing → must complete before deployment

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Content delays | Start with placeholder content |
| Scope creep | Strict MVP definition |
| Performance issues | Early lighthouse testing |
| Accessibility gaps | Test early and often |

---

## Team Roles & Responsibilities

| Role | Responsibilities |
|------|------------------|
| **Developer** | Implementation, testing, deployment |
| **Content** | Copy, case studies, proof packaging |
| **Design** | Visual direction, tokens, components |
| **QA** | Testing, accessibility, performance |

*For solo development, all roles collapse to single person with content as primary bottleneck.*

---

## Success Criteria

### Hiring Conversion Metrics

- [ ] Recruiter understands positioning in < 30 seconds
- [ ] Clear path from homepage to contact
- [ ] Case studies answer: challenge, method, impact
- [ ] Resume is printable and skimmable
- [ ] All proof claims are verifiable

### Technical Metrics

- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] Core Web Vitals all green
- [ ] Zero runtime errors

### Quality Metrics

- [ ] All E2E tests passing
- [ ] Zero a11y violations (axe)
- [ ] Print stylesheet functional
- [ ] Dark mode fully supported
- [ ] Reduced motion supported

---

## Appendix A: File Structure

```
portfolio_new/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Design tokens
│   │   ├── cases/[slug]/
│   │   │   └── page.tsx          # Case study detail
│   │   └── resume/
│   │       └── page.tsx          # Resume page
│   ├── components/portfolio/     # Shared components
│   ├── content/
│   │   ├── site-content.ts       # All content
│   │   └── types.ts              # Content types
│   └── lib/                      # Utilities
├── public/images/                # Static assets
├── e2e/                          # Playwright tests
└── tests/                        # Unit tests
```

## Appendix B: Content Checklist

### Homepage Content

- [ ] Name and role
- [ ] Positioning statement
- [ ] Hero description
- [ ] Availability status
- [ ] Key signals/metrics
- [ ] Case study summaries (×3)
- [ ] Technical proof items (×2)
- [ ] Strength positioning (×3)
- [ ] Contact information

### Per Case Study

- [ ] Title (outcome-oriented)
- [ ] Eyebrow (category)
- [ ] Summary (2 sentences)
- [ ] Outcome (1 sentence)
- [ ] Metrics (3 items)
- [ ] Challenge section
- [ ] Inputs section
- [ ] Method section
- [ ] What Surfaced section
- [ ] Impact section
- [ ] Next Move section
- [ ] Artifact links

### Resume Content

- [ ] Headline
- [ ] Summary paragraph
- [ ] Contact info
- [ ] Languages
- [ ] Skill groups with levels
- [ ] Experience entries with bullets
- [ ] Selected projects with links
- [ ] Education

---

*Last updated: March 2026*
