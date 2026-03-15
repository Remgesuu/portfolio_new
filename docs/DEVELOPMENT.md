# Development Workflow Guide

## Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Navigate to http://localhost:3000
```

## Project Structure

```
src/
├── app/                          # Next.js app router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page
│   ├── page.module.css          # Home page styles
│   ├── resume/                  # Resume page
│   ├── cases/[slug]/            # Dynamic case study pages
│   └── globals.css              # Global design tokens
│
├── components/
│   └── portfolio/               # All portfolio components
│       ├── index.ts             # Component exports
│       ├── ambient-hero.tsx     # Hero background effects
│       ├── cta-button.tsx       # Call-to-action buttons
│       ├── card.tsx             # Card component system
│       ├── motion-choreography.tsx  # Animation orchestration
│       ├── smooth-scroll.tsx    # Scroll provider & utilities
│       ├── floating-contact.tsx # Persistent contact widget
│       ├── theme-provider.tsx   # Theme management
│       ├── reveal.tsx           # Reveal animations
│       ├── theme-toggle.tsx     # Theme switcher
│       ├── breadcrumbs.tsx      # Navigation breadcrumbs
│       └── skip-link.tsx        # Accessibility skip link
│
├── content/
│   └── site-content.ts          # All portfolio content & data
│
├── lib/
│   ├── content-utils.ts         # Content formatting helpers
│   ├── url-utils.ts             # URL & navigation utilities
│   └── site-url.ts              # URL generation
│
└── public/
    └── images/                  # Static images
```

## Common Development Tasks

### Adding a New Component

1. Create component file in `src/components/portfolio/`
2. Export from `src/components/portfolio/index.ts`
3. Document in `docs/COMPONENTS.md`
4. Import and use throughout the app

Example:
```tsx
// src/components/portfolio/my-component.tsx
export function MyComponent({ children }) {
  return <div>{children}</div>;
}

// src/components/portfolio/index.ts
export { MyComponent } from "./my-component";

// Usage in pages
import { MyComponent } from "@/components/portfolio";
```

### Updating Content

All portfolio content lives in `src/content/site-content.ts`:

```tsx
export const siteContent = {
  meta: {
    name: "Your Name",
    role: "Your Role",
    email: "your@email.com",
    // ...
  },
  hero: {
    title: "Your headline",
    description: "Your description",
    ctas: [
      { label: "Primary", href: "/", variant: "primary" },
      { label: "Secondary", href: "https://...", variant: "secondary" }
    ]
  },
  // Add more sections as needed
};
```

### Styling Components

The project uses CSS Modules for component styles and CSS custom properties for theming:

```css
/* src/components/portfolio/my-component.module.css */
.container {
  background: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  transition: border-color var(--transition-base);
}

.container:hover {
  border-color: var(--border-glow);
}
```

### Creating Animations

Use Motion library with built-in choreography helpers:

```tsx
import { Reveal, ChoreographyContainer, ChoreographyItem } from "@/components/portfolio";

// Simple reveal
<Reveal variant="fade-up" delay={0.2} duration={0.8}>
  <h1>Animated Title</h1>
</Reveal>

// Choreographed sequence
<ChoreographyContainer staggerDelay={0.08}>
  {items.map((item) => (
    <ChoreographyItem key={item.id}>
      <Card>{item.content}</Card>
    </ChoreographyItem>
  ))}
</ChoreographyContainer>
```

### Adding Pages

Create new pages using Next.js App Router:

```tsx
// src/app/new-page/page.tsx
import { Reveal } from "@/components/portfolio";

export const metadata = {
  title: "New Page",
  description: "Page description",
};

export default function NewPage() {
  return (
    <main>
      <Reveal variant="fade-up">
        <h1>New Page</h1>
      </Reveal>
    </main>
  );
}
```

### Theming

**Light Theme (Default):**
- Warm background (`#f9f4ed`)
- Dark text (`#16171a`)
- Teal accent (`#8bb7bc`)
- Coral accent (`#d6a98d`)

**Dark Theme:**
- Graphite background (`#11161b`)
- Light text (`#f0f1f2`)
- Light teal accent (`#a8ced2`)
- Light coral accent (`#e5c4ae`)

Change theme via `ThemeToggle` component or programmatically:
```tsx
document.documentElement.setAttribute('data-theme', 'dark');
```

## Performance Optimization

### Image Optimization
Always use Next.js `<Image>` with proper `sizes`:
```tsx
<Image
  src="/image.jpg"
  alt="Description"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Bundle Analysis
```bash
ANALYZE=true pnpm build
```

### Motion Performance
- Animate only necessary properties (avoid animating layout)
- Use `will-change` CSS strategically
- Test on lower-end devices

## Testing & Quality

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Format code
pnpm lint:fix

# Run tests
pnpm test

# E2E tests
pnpm test:e2e
```

## Deployment

### To Vercel (Recommended)

1. Push to GitHub
2. Connect repo to Vercel
3. Automatic deployments on push
4. Preview deployments for PRs

### Manual Build
```bash
pnpm build
pnpm start
```

## Version Control Best Practices

### Branching
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature branches
- `fix/*`: Bug fix branches

### Commit Messages
```
feat: Add new component system
fix: Resolve theme color issue
docs: Update component documentation
style: Improve button styling
refactor: Reorganize motion utilities
```

### Pull Request Process
1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit
3. Push to remote: `git push origin feature/my-feature`
4. Create PR with description
5. Review and merge to `develop`
6. Deploy from `main` branch

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
pnpm dev
```

### Next.js Cache Issues
```bash
rm -rf .next
pnpm dev
```

### Module Not Found
- Clear node_modules: `rm -rf node_modules && pnpm install`
- Check import paths (relative vs absolute)
- Verify file extensions

### Motion/Animation Issues
- Check browser DevTools Performance tab
- Verify Motion library is imported correctly
- Test with `prefers-reduced-motion` setting
- Check component is within SmoothScrollProvider

## Environment Variables

Create `.env.local`:
```env
# Analytics (if needed)
NEXT_PUBLIC_GA_ID=your-id

# API endpoints (if needed)
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Resources

- [Next.js 16 Docs](https://nextjs.org)
- [React 19 Docs](https://react.dev)
- [Motion Library](https://motion.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vercel Deployment](https://vercel.com/docs)

---

## Getting Help

- Check existing component documentation in `docs/COMPONENTS.md`
- Review existing component implementations for patterns
- Check Next.js and React official documentation
- Review browser DevTools for errors and performance issues
