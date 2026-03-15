# Cuberto-Style Templates for Portfolio

This document contains ready-to-use component templates extracted from the Cuberto design analysis, adapted for your portfolio while maintaining your unique identity.

## Template Overview

| Template | Purpose | File |
|----------|---------|------|
| CursorFollower | Custom cursor with spring physics | `cursor-follower.tsx` |
| FloatingContactRing | Rotating text contact widget | `floating-contact-ring.tsx` |
| TextSplitReveal | Character/word/line reveal animation | `text-split-reveal.tsx` |
| MediaClipReveal | Clip-path based image reveal | `media-clip-reveal.tsx` |
| OutlineCTAButton | Pill outline button with fill hover | `outline-cta-button.tsx` |
| InverseSection | Dark section with rounded corners | `inverse-section.tsx` |

---

## 1. CursorFollower

A custom cursor component that follows the mouse with spring physics and changes state based on interactive elements.

### Usage

```tsx
// In layout.tsx
import { CursorFollower } from "@/components/portfolio";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CursorFollower />
        {children}
      </body>
    </html>
  );
}

// In components - add data attributes for cursor states
<a href="/projects" data-cursor="link">View Projects</a>
<button data-cursor="action" data-cursor-text="View">
  Click me
</button>
<div data-cursor="media">Image container</div>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| magnetic | boolean | true | Enable magnetic effect |
| size | number | 12 | Cursor size in pixels |
| color | string | var(--text-primary) | Cursor color |
| stiffness | number | 400 | Spring stiffness |
| damping | number | 28 | Spring damping |

---

## 2. FloatingContactRing

Cuberto-style floating contact button with rotating text ring around an avatar.

### Usage

```tsx
import { FloatingContactRing } from "@/components/portfolio";

<FloatingContactRing
  email="grigorii584@gmail.com"
  phone="+7-988-492-9938"
  avatarSrc="/images/profile/avatar.png"
  showAfterScroll={400}
  ringText="contact"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| email | string | required | Contact email |
| phone | string | optional | Phone number |
| avatarSrc | string | optional | Avatar image source |
| showAfterScroll | number | 400 | Scroll threshold to show |
| ringText | string | "contact" | Text in rotating ring |

---

## 3. TextSplitReveal

Animated text reveal that splits content by characters, words, or lines with staggered animation.

### Usage

```tsx
import { TextSplitReveal, TextLineReveal } from "@/components/portfolio";

// Character-by-character reveal
<TextSplitReveal as="h1" splitBy="chars" blur>
  Design agency focused
</TextSplitReveal>

// Word-by-word reveal (default)
<TextSplitReveal as="h2" staggerDelay={0.05}>
  on AI-driven products
</TextSplitReveal>

// Line-by-line for paragraphs
<TextLineReveal as="p" delay={0.3}>
  Cuberto is a digital design and technology partner
  focused on smart interactions.
</TextLineReveal>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | string | required | Text to animate |
| splitBy | "chars" \| "words" \| "lines" | "words" | Split method |
| delay | number | 0 | Animation delay |
| staggerDelay | number | 0.03 | Delay between elements |
| duration | number | 0.8 | Animation duration |
| distance | number | 40 | Distance to animate from |
| as | string | "div" | HTML element |
| blur | boolean | false | Add blur-to-crisp effect |

---

## 4. MediaClipReveal

Clip-path based reveal animation for images and videos with optional parallax.

### Usage

```tsx
import { MediaClipReveal, ImageHoverZoom, VideoReveal } from "@/components/portfolio";

// Basic image reveal
<MediaClipReveal direction="center" parallax>
  <Image src="/image.jpg" alt="..." fill />
</MediaClipReveal>

// Directional reveal
<MediaClipReveal direction="left" inset={15}>
  <Image src="/image.jpg" alt="..." fill />
</MediaClipReveal>

// Image with hover zoom
<ImageHoverZoom scale={1.08}>
  <Image src="/image.jpg" alt="..." fill />
</ImageHoverZoom>

// Video reveal
<VideoReveal
  src="/video.mp4"
  poster="/poster.jpg"
  direction="bottom"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| direction | "center" \| "left" \| "right" \| "top" \| "bottom" | "center" | Reveal direction |
| inset | number | 10 | Initial inset percentage |
| borderRadius | number | 18 | Corner radius |
| duration | number | 1.4 | Animation duration |
| parallax | boolean | false | Enable parallax scroll |
| parallaxIntensity | number | 0.15 | Parallax strength |
| scaleFrom | number | 0.94 | Initial scale |

---

## 5. OutlineCTAButton

Pill-shaped outline button with fill animation on hover.

### Usage

```tsx
import { OutlineCTAButton, OutlineCTALink } from "@/components/portfolio";

// Primary CTA
<OutlineCTAButton href="/contact" size="xl">
  Tell us about your project
</OutlineCTAButton>

// With icons
<OutlineCTAButton
  href="/resume"
  icon={<DownloadIcon />}
  size="lg"
>
  Download Resume
</OutlineCTAButton>

// Simple link variant
<OutlineCTALink href="/projects">
  View all projects
</OutlineCTALink>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | "sm" \| "md" \| "lg" \| "xl" | "lg" | Button size |
| ripple | boolean | true | Enable ripple effect |
| icon | ReactNode | optional | Left icon |
| rightIcon | ReactNode | optional | Right icon |
| external | boolean | false | Opens in new tab |

---

## 6. InverseSection

Dark section wrapper with rounded top corners, perfect for feature sections.

### Usage

```tsx
import { InverseSection, CTAStage, SectionDivider } from "@/components/portfolio";

// Basic inverse section
<InverseSection id="projects" cornerRadius="xl" padding="lg">
  <h2>Featured Projects</h2>
  {/* content */}
</InverseSection>

// With background video
<InverseSection
  backgroundVideo="/bg-loop.mp4"
  overlayOpacity={0.6}
>
  <h2>Our Work</h2>
</InverseSection>

// Final CTA stage (like Cuberto's "Have an idea?")
<CTAStage
  heading="Have an idea?"
  subheading="Let's build something together"
  backgroundVideo="/ropes.mp4"
>
  <OutlineCTAButton href="/contact" size="xl">
    Tell us
  </OutlineCTAButton>
</CTAStage>

// Section dividers
<SectionDivider variant="gradient" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| cornerRadius | "sm" \| "md" \| "lg" \| "xl" \| "2xl" | "xl" | Top corner radius |
| padding | "sm" \| "md" \| "lg" \| "xl" | "lg" | Vertical padding |
| backgroundVideo | string | optional | Video background URL |
| backgroundImage | string | optional | Image background URL |
| overlayOpacity | number | 0.4 | Dark overlay opacity |
| animate | boolean | true | Enable entrance animation |

---

## Improvement Recommendations

Based on comparing your portfolio with Cuberto's patterns, here are specific enhancement opportunities:

### High Impact (Recommended)

1. **Add Custom Cursor**
   - Replace default cursor with `CursorFollower`
   - Adds premium feel with minimal effort
   - Implementation: Add to layout.tsx

2. **Upgrade Floating Contact**
   - Replace current `FloatingContact` with `FloatingContactRing`
   - More visually distinctive and memorable
   - Matches Cuberto's signature element

3. **Enhance Hero Title**
   - Use `TextSplitReveal` for the main h1
   - Adds dramatic entrance without being distracting
   - Keep blur effect for maximum impact

### Medium Impact

4. **Add Inverse Section for Cases**
   - Wrap case studies in `InverseSection`
   - Creates stronger light/dark rhythm
   - More dramatic visual contrast

5. **Use MediaClipReveal for Case Images**
   - Replace standard image reveals with clip-path animation
   - More sophisticated entrance effect
   - Add subtle parallax for depth

6. **Add CTAStage as Final Section**
   - Create a dramatic closing CTA before footer
   - "Ready to work together?" or similar
   - Single focused conversion point

### Lower Priority (Polish)

7. **Outline CTA Variant**
   - Add `OutlineCTAButton` as secondary action style
   - Creates visual hierarchy between primary/secondary actions

8. **Section Dividers**
   - Add subtle gradient dividers between sections
   - Helps with visual flow and rhythm

---

## Motion Tokens Reference

These are the Cuberto-style motion values you can use:

```css
/* Easing */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);

/* Durations */
--duration-fast: 150ms;
--duration-base: 220ms;
--duration-slow: 500ms;
--duration-slower: 800ms;

/* Reveal animations */
--reveal-heading-y: 100px;
--reveal-text-y: 40px;
--reveal-media-scale: 0.94;
--reveal-media-inset: 10%;

/* Parallax */
--parallax-intensity: 15%;
```

---

## Integration Example

Here's how to integrate multiple templates together:

```tsx
import {
  CursorFollower,
  FloatingContactRing,
  TextSplitReveal,
  MediaClipReveal,
  InverseSection,
  CTAStage,
  OutlineCTAButton,
} from "@/components/portfolio";

export default function HomePage() {
  return (
    <main>
      <CursorFollower />
      
      {/* Hero */}
      <section>
        <TextSplitReveal as="h1" splitBy="words" blur>
          AI-Enabled Support Systems Operator
        </TextSplitReveal>
      </section>

      {/* Cases in dark section */}
      <InverseSection id="cases" cornerRadius="xl">
        <h2>Selected Cases</h2>
        
        <MediaClipReveal parallax>
          <Image src="/case-1.jpg" alt="..." fill />
        </MediaClipReveal>
      </InverseSection>

      {/* Final CTA */}
      <CTAStage heading="Ready to work together?">
        <OutlineCTAButton href="/contact" size="xl">
          Get in touch
        </OutlineCTAButton>
      </CTAStage>

      <FloatingContactRing
        email="grigorii584@gmail.com"
        avatarSrc="/avatar.png"
      />
    </main>
  );
}
```

---

## What Makes Your Portfolio Different

While these templates follow Cuberto patterns, your portfolio already has unique strengths:

1. **Warm Color Palette** - Teal/coral accents vs Cuberto's stark black/white
2. **Ambient Orb Hero** - Original animated backdrop, not copied
3. **Support-First Narrative** - Role clarity before visual drama
4. **Proof-Based Structure** - Metrics and evidence, not just pretty pictures

The templates enhance these strengths rather than override them.
