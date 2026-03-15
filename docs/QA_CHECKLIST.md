# Pre-Launch Checklist

## Component Testing

### CTAButton
- [ ] Primary variant renders with correct color
- [ ] Secondary variant renders with correct color
- [ ] Ghost variant has transparent background
- [ ] Outline variant has border
- [ ] All sizes (sm, md, lg) render correctly
- [ ] Loading state shows spinner
- [ ] Icon prop displays on left
- [ ] Right icon displays on right
- [ ] Hover state scales to 1.02
- [ ] Tap state scales to 0.98
- [ ] Link version (`as="a"`) opens href
- [ ] Button version (`as="button"`) calls onClick
- [ ] External links get `target="_blank" rel="noopener noreferrer"`
- [ ] Disabled state disables interaction

### Card System
- [ ] Card featured variant has correct shadow
- [ ] Card secondary variant has subtle border
- [ ] Card compact variant is reduced opacity
- [ ] CardHeader displays eyebrow in mono uppercase
- [ ] CardHeader title is bold and prominent
- [ ] CardImage has proper aspect ratio
- [ ] CardImage is lazy-loaded below fold
- [ ] CardTags display with color coding
- [ ] CardLink has arrow that animates on hover
- [ ] CardFooter divider is subtle

### FloatingContact
- [ ] Widget appears after scroll 600px
- [ ] Widget fades in from bottom
- [ ] Click expands to show contact details
- [ ] Email link is clickable (mailto:)
- [ ] Phone link is clickable (tel:)
- [ ] Widget dismisses on click outside
- [ ] Widget smooth animations on mobile

### Reveal & Motion
- [ ] Fade variant works on scroll
- [ ] Fade-up variant moves Y + opacity
- [ ] Scale-in variant scales from 0.92
- [ ] Blur-to-crisp variant blurs from 12px
- [ ] Stagger delays apply to children
- [ ] All animations respect prefers-reduced-motion
- [ ] Motion doesn't cause layout shifts
- [ ] Animations smooth at 60fps (DevTools)

## Home Page

### Navigation
- [ ] Brand name links to /
- [ ] Nav links route correctly
- [ ] Theme toggle switches light/dark
- [ ] Email button opens mailto
- [ ] Sticky positioning works on scroll
- [ ] Topbar blur effect visible
- [ ] Border glow on hover

### Hero Section
- [ ] Hero title is 5.5rem on desktop
- [ ] Hero CTAs use new CTAButton component
- [ ] Profile image loads with proper sizing
- [ ] Ambient hero background renders
- [ ] Hero orbs animate smoothly
- [ ] Signals cards display correctly
- [ ] Profile panel background has subtle glow
- [ ] Hero section responsive on mobile

### Case Studies Grid
- [ ] Featured card is larger
- [ ] Secondary cards are compact
- [ ] Cards stagger on entrance (0.08s delay)
- [ ] Images load lazy on scroll
- [ ] Tags display with colors
- [ ] Case links route to `/cases/[slug]`
- [ ] Card hover state works smoothly

### Builds Section
- [ ] Build cards render correctly
- [ ] Level badges display
- [ ] Stack tags show technologies
- [ ] External links have correct icons
- [ ] Cards choreograph on entrance

### Strengths Section
- [ ] Cards display with eyebrows
- [ ] Title and description visible
- [ ] Cards stagger animation works
- [ ] Cards are responsive (1-2 cols on mobile)

### Contact Section
- [ ] Contact statement visible
- [ ] Resume button links correctly
- [ ] Contact list displays all items
- [ ] Email links work
- [ ] Social links are external (target blank)
- [ ] Section is visually distinct

### Footer
- [ ] Footer content displays
- [ ] Location shows
- [ ] Footer responsive on mobile

## Resume Page

### Header
- [ ] Back button links to /
- [ ] Theme toggle works
- [ ] Name displays prominently
- [ ] Headline visible
- [ ] Summary paragraph readable
- [ ] Contact links functional
- [ ] Portrait image loads correctly

### Sections
- [ ] Skills section renders
- [ ] Experience section with dates
- [ ] Education information
- [ ] All sections responsive
- [ ] Print layout forces light theme
- [ ] No overflow on narrow screens

## Case Study Page

### Header
- [ ] Breadcrumbs display (Home > Cases > Title)
- [ ] Title is prominent
- [ ] Meta information visible
- [ ] Featured image loads

### Content
- [ ] Sections render with headings
- [ ] Images scale properly
- [ ] Call-to-action buttons work
- [ ] Back to cases button visible
- [ ] Adjacent case navigation works

## Accessibility

### Keyboard Navigation
- [ ] Tab order is logical
- [ ] Skip link visible on Tab
- [ ] All buttons focusable
- [ ] Links have focus outline
- [ ] Form inputs have labels (if any)
- [ ] No keyboard traps

### Screen Reader
- [ ] Page title in browser tab
- [ ] Main content has `<main>` with `id="main-content"`
- [ ] Headings have proper hierarchy (H1 > H2 > H3)
- [ ] Images have alt text
- [ ] Decorative images have `aria-hidden="true"`
- [ ] Buttons have clear labels
- [ ] Links have descriptive text

### Motion
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Content visible without animations
- [ ] No seizure-inducing flashes (<3 per second)

### Color Contrast
- [ ] Text on background meets WCAG AA (4.5:1 for body)
- [ ] Links are distinguishable from text
- [ ] Focus states are visible (3:1 minimum)

## Theme Switching

### Light Theme
- [ ] Background is warm-50 (#fdfbf8)
- [ ] Text is dark gray (#16171a)
- [ ] Accents are teal/coral
- [ ] Shadows are subtle
- [ ] Grain texture visible

### Dark Theme
- [ ] Background is graphite-500 (#11161b)
- [ ] Text is light gray (#f0f1f2)
- [ ] Accents are light teal/coral
- [ ] Shadows are darker
- [ ] Grain texture subtle

### Theme Persistence
- [ ] Selected theme persists on reload
- [ ] System preference detected on first visit
- [ ] Toggle updates all components

## Performance

### Bundle Size
- [ ] Production build < 200KB (JS)
- [ ] CSS < 50KB
- [ ] No console errors

### Load Performance
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift = 0.0
- [ ] Time to Interactive < 3s

### Runtime Performance
- [ ] Smooth animations at 60fps
- [ ] No jank on scroll
- [ ] No memory leaks (DevTools)
- [ ] Responsive to input (< 100ms)

## Mobile Testing

### 720px Width (Mobile)
- [ ] All content visible without horizontal scroll
- [ ] Touch targets > 48px
- [ ] Text is readable (14px minimum)
- [ ] Navigation is accessible
- [ ] Images scale properly
- [ ] Forms are usable

### 1024px Width (Tablet)
- [ ] Layout adapts gracefully
- [ ] Two-column where appropriate
- [ ] Images maintain quality

### 1200px+ Width (Desktop)
- [ ] Full-width layouts work
- [ ] Sticky elements position correctly
- [ ] Parallax effects smooth

## Browser Compatibility

### Desktop
- [ ] Chrome/Edge latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] No console errors

### Mobile
- [ ] iOS Safari (latest 2 versions)
- [ ] Chrome Android (latest)
- [ ] Samsung Internet (latest)

## SEO

### Meta Tags
- [ ] Title tag on all pages
- [ ] Meta description present
- [ ] Canonical URL set
- [ ] Open Graph tags complete (title, description, image)
- [ ] Twitter card tags present

### Structured Data
- [ ] Schema.org markup if applicable
- [ ] Rich snippet preview works

### Robots & Sitemap
- [ ] robots.txt allows indexing
- [ ] sitemap.xml exists (if needed)
- [ ] No noindex meta tags (unless intentional)

## Links & Navigation

### Internal Links
- [ ] All `/` routes load correctly
- [ ] All `/cases/[slug]` routes exist and load
- [ ] `/resume` page loads and displays
- [ ] Back navigation works

### External Links
- [ ] GitHub links work
- [ ] LinkedIn links work
- [ ] Email mailto: links work
- [ ] All external links have `rel="noopener noreferrer"`
- [ ] External links open in new tab

## Content

### Accuracy
- [ ] Name, title, email correct
- [ ] All links lead to correct destinations
- [ ] Dates and timelines accurate
- [ ] No spelling/grammar errors
- [ ] Contact information current

### Completeness
- [ ] All case studies complete
- [ ] All skills listed
- [ ] Resume/portfolio up to date
- [ ] Social links included
- [ ] Call-to-action visible above fold

## Deployment

### Before Deploy
- [ ] All changes committed to `portfolio-implementation-plan`
- [ ] No uncommitted local changes
- [ ] Build passes: `pnpm build`
- [ ] Linting passes: `pnpm lint`
- [ ] TypeScript passes: `pnpm typecheck`

### Deploy Commands
```bash
# Verify clean build
rm -rf .next
pnpm build

# Check for errors
pnpm lint
pnpm typecheck

# Deploy to Vercel
git push origin portfolio-implementation-plan
# Create PR → Merge to main
# Vercel auto-deploys from main
```

### Post-Deploy Verification
- [ ] Live site loads (https://yoursite.com)
- [ ] All pages accessible
- [ ] No 404 errors
- [ ] Analytics tracking works (if enabled)
- [ ] Email links work
- [ ] Contact widget appears after scroll
- [ ] Theme toggle works
- [ ] Performance score good (Vercel Analytics)

## Final Sign-Off

**QA Lead:** _________________ **Date:** _______

**PM/Stakeholder:** _________________ **Date:** _______

**Ready to Deploy:** [ ] Yes [ ] No

---

## Issues Found During Testing

| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
| | | | |
| | | | |

---

**Deployment Status:** [ ] Cleared for Production [ ] Pending Fixes

**Deploy Time:** _____________  
**Deployed By:** _____________  
**Deployment URL:** _____________  
