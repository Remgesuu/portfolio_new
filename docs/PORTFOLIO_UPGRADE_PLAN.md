# Portfolio Upgrade Plan

## Executive Summary

**Target:** Transform Grigorii's portfolio from a competent hiring document into a high-conversion recruiter asset that wins interviews for Support Operations / Technical Support Specialist roles with AI automation leverage.

**Current State:** Well-structured Next.js portfolio with strong content architecture, typed content system, coherent proof model (45%/35%/70% metrics from Mover Bridge), and editorial warm-neutral design language.

**Key Risks Identified:**
1. Hero visual density competes with the positioning clarity
2. Case studies lack outcome-focused titles (method-named, not result-named)
3. "Role Fit" section feels defensive rather than confident
4. Mobile recruiter scan path is not optimized for 30-second reads

---

## Diagnosis

### 1. Positioning
- **Claim:** AI-enabled support systems operator for technical support, escalation, and workflow automation
- **Role cluster:** Support Ops, Technical Support, Escalation Management, AI-adjacent Operations
- **Verdict:** Clear positioning, but the title "Technical Support Specialist" in the hero undersells the systems leverage shown in the proof

### 2. Audience
- **Primary:** Recruiters doing initial screen (30-second scan)
- **Secondary:** Hiring managers validating technical depth
- **Tertiary:** Product leads checking cross-functional signal quality

### 3. Recruiter Scan Path (Current)
1. Name + role (topbar brand) - good
2. Hero title + positioning - good but competing visual elements
3. Signal cards (45%/35%/70%/112+) - strong proof early
4. Case Studies - method-named, not outcome-named
5. Projects - good technical validation
6. Role Fit - defensive framing
7. Contact - adequate

### 4. Proof Model
- **Strong:** Quantified metrics with provenance (company, year)
- **Strong:** Case studies with Challenge/Method/Impact structure
- **Weak:** No direct testimonials or recommendation links
- **Weak:** Case titles describe method, not outcome achieved

### 5. CTA Flow
- Primary: View case studies (good)
- Secondary: Open resume (good)
- Missing: Direct email CTA in hero for rushed recruiters

---

## Step 2 - Full Audit by Category

### Category 1: Positioning Clarity

```
[MAJOR] Hero title undersells the differentiator
Where: site-content.ts hero.title ("Technical Support Specialist.")
Why it hurts: The title matches junior support roles, while the proof (45% volume reduction, 70% automation) positions for a systems operator. Recruiters screen on title first.
Fix: Change to "Support Systems Operator." or "Technical Support + Systems Automation Specialist."
```

```
[MINOR] Eyebrow feels like internal copy, not recruiter signal
Where: site-content.ts hero.eyebrow ("( SUPPORT-FIRST, SYSTEMS-SHAPED )")
Why it hurts: Clever but not scannable. Recruiters don't decode parenthetical internal language.
Fix: Change to "Support Operations | AI Automation | Remote-Ready" - three clear signals, no decoding required.
```

### Category 2: Recruiter Scan Path

```
[MAJOR] Hero visual competes with positioning clarity
Where: page.tsx heroVisual section (profilePanel, signals, ambient effects)
Why it hurts: The recruiter's eye is pulled to the elaborate visual composition instead of the value proposition. The 45%/35%/70% metrics are inside a nested panel that requires visual effort to parse.
Fix: Move signal metrics to a dedicated proof strip above/below the hero text, not inside the visual frame. Simplify ambient hero to be atmospheric, not information-dense.
```

```
[MAJOR] Contact email not visible in first screen
Where: Hero section has no direct email CTA
Why it hurts: Rushed recruiters want one-click contact. Current flow requires scrolling to Contact section or using the small "Email" button in topbar.
Fix: Add "grigorii584@gmail.com" as visible text in hero, not just a button.
```

```
[MINOR] Navigation labels are internal taxonomy
Where: site-content.ts nav items ("Case Studies", "Projects", "Role Fit")
Why it hurts: "Role Fit" is author-perspective language. Recruiters think in terms of "Why hire" or "Strengths."
Fix: Rename "Role Fit" to "Strengths" or "Why Hire" in navigation.
```

### Category 3: Proof Credibility

```
OK - Metrics are grounded with provenance (company, year). The 45%/35%/70% claims from Mover Bridge 2022-23 and 112+ items from Heapp 2024 are specific and believable.
```

```
[MINOR] Technical stack note is overly defensive
Where: site-content.ts resumeSkillGroups[1].note ("not inflated senior-engineer posturing")
Why it hurts: Calling out what you're NOT doing signals insecurity. Let the proof speak.
Fix: Remove the "not inflated" language. Keep the "grounded in shipped side-project work" part only.
```

### Category 4: Case-Study Structure

```
[MAJOR] Case titles are method-named, not outcome-named
Where: site-content.ts caseStudies titles
Current:
- "Darkest AFK compensation workflow"
- "Dig Dig Die escalation-ready feedback view"
- "Vacation Cafe player-friction analysis"

Why it hurts: These describe what was built, not what was achieved. Recruiters scan for outcomes.
Fix:
- "Darkest AFK: 112+ items indexed, recovery time cut"
- "Dig Dig Die: 23 issues structured from community noise"
- "Vacation Cafe: Retention hypotheses from player friction"
```

```
[MINOR] Case summaries front-load method, not impact
Where: site-content.ts caseStudies[].summary
Why it hurts: "Built a repeatable operator-facing catalog..." starts with what you did, not why it mattered.
Fix: Lead with impact: "Faster recovery packages and cleaner internal handling through a repeatable operator-facing catalog with 112+ indexed items."
```

### Category 5: Information Architecture

```
OK - Route structure is clean (/cases/[slug], /resume). Section IDs work for anchor navigation.
```

```
[MINOR] "Role Fit" section name doesn't match recruiter mental model
Where: page.tsx id="strengths", but content is framed as "Role Fit"
Why it hurts: ID and display name mismatch creates minor cognitive friction.
Fix: Align both to "strengths" - simpler, recruiter-natural.
```

### Category 6: Content Density and Readability

```
[MINOR] Hero description is slightly dense for scan speed
Where: site-content.ts hero.description (47 words)
Why it hurts: Recruiter scans want 15-25 words max for the opening hook.
Fix: Shorten to: "I reduce repeated ticket noise, build operator tooling, and package customer signals into actionable artifacts for product, QA, and ops teams."
```

```
[MINOR] Contact statement is internally focused
Where: page.tsx contactStatement ("Support credibility gets you screened...")
Why it hurts: This is author-facing reflection, not recruiter-facing value.
Fix: Replace with clear CTA: "Looking for support credibility with systems leverage? Let's talk."
```

### Category 7: Visual System Discipline

```
[POLISH] Ambient hero effects may be over-designed for hiring context
Where: ambient-hero.module.css (orbs, rings, shimmer)
Why it hurts: The cinematic effects are beautiful but can distract from the hiring read. Portfolio is not a motion design showcase.
Fix: Reduce orb opacity by 20%, remove shimmer animation, keep subtle depth only.
```

```
[POLISH] Section padding creates visual monotony
Where: page.module.css .section styles
Why it hurts: Every section has the same rhythm, which can feel repetitive on long scroll.
Fix: Add alternating padding variance (e.g., cases section slightly more top padding, builds section asymmetric).
```

### Category 8: Theme and Surface Consistency

```
OK - Light/dark token system is coherent. Theme toggle works. No major inconsistencies detected.
```

### Category 9: Responsiveness and Accessibility

```
[MAJOR] Mobile hero is too dense
Where: page.module.css @media (max-width: 900px) hero layout
Why it hurts: On mobile, the hero tries to fit visual + panel + signals + text. This creates scroll fatigue before the value proposition lands.
Fix: On mobile, collapse signal metrics into a simpler horizontal strip. Hide ambient orb effects. Prioritize title + positioning + CTA.
```

```
[MINOR] Theme toggle may be hard to discover on mobile
Where: topbar layout on small screens
Why it hurts: The toggle is small and positioned at the edge.
Fix: Floating theme toggle (already implemented) helps. Ensure it's visible on all breakpoints.
```

### Category 10: Implementation Consistency

```
OK - Content is centralized in site-content.ts. Types are properly separated. Patterns are consistent across routes.
```

---

## Step 3 - Missing Proof

```
MISSING PROOF
1. Missing: LinkedIn recommendations or testimonial snippets
Why it matters: Third-party validation adds trust. Current proof is all self-reported.
Best place to add it: Contact section or dedicated "What others say" micro-block.

2. Missing: Specific tool/software proficiency list for ATS parsing
Why it matters: Many recruiters use ATS keyword matching. Current skills are grouped conceptually, not by tool name.
Best place to add it: Resume page skills section - add explicit tool names (Zendesk, Intercom, Jira, etc. if applicable).

3. Missing: Response time or resolution metrics from current role (Heapp Games 2024)
Why it matters: The strong metrics are from Mover Bridge 2022-23. Current role (2024) only shows "112+ indexed items" which is a volume metric, not performance metric.
Best place to add it: Hero signals or Heapp case study.
```

---

## Step 4 - Quick Wins and Structural Fixes

### Quick Wins

```
QUICK WINS
1. Change hero title from "Technical Support Specialist." to "Support Systems Operator."
2. Change hero eyebrow from "( SUPPORT-FIRST, SYSTEMS-SHAPED )" to "Support Operations | AI Automation | Remote-Ready"
3. Add visible email (grigorii584@gmail.com) in hero text, not just button
4. Rename nav item "Role Fit" to "Strengths"
5. Remove defensive language in technical stack note ("not inflated senior-engineer posturing")
6. Shorten hero description to under 30 words
7. Change contact statement to direct CTA language
8. Reduce ambient hero orb opacity by 20%
```

### Structural Fixes

```
STRUCTURAL FIXES
1. Rewrite case study titles to be outcome-named:
   - "Darkest AFK: 112+ items indexed, recovery time cut"
   - "Dig Dig Die: 23 issues structured from community noise"
   - "Vacation Cafe: Retention hypotheses from player friction"

2. Restructure mobile hero:
   - Collapse signals into horizontal strip
   - Hide ambient orb effects on <720px
   - Stack title > positioning > CTA > email vertically
   - Move visual below fold on mobile

3. Add ATS-friendly tool names to resume skills:
   - Support: Zendesk, Intercom, Freshdesk (if applicable)
   - Technical: Git, VS Code, Postman
   - AI: OpenAI API, LangChain (if applicable)

4. Reframe "Role Fit" section:
   - Current framing is defensive ("positioning is broader now, but evidence stays disciplined")
   - New framing: confident statement of value ("Three reasons I'm the hire")
```

---

## Step 5 - Final Verdict

```
TOTAL
CRITICAL: 0
MAJOR: 4
MINOR: 8
POLISH: 2

TOP 3 PRIORITIES
1. Rewrite case study titles to be outcome-named (biggest impact on recruiter scan)
2. Simplify mobile hero to prioritize value proposition over visual composition
3. Add direct email visibility in hero for one-click recruiter contact

HIRING READ SCORE: 7.5/10
Verdict: Strong content architecture and proof model held back by visual density and method-focused case naming that makes recruiters work harder than necessary to understand the value.
```

---

## Implementation Phases

### Phase 1: Content Refinement (Day 1-2)
- [ ] Update hero title, eyebrow, description in site-content.ts
- [ ] Rewrite case study titles to outcome-focused
- [ ] Update case summaries to lead with impact
- [ ] Remove defensive language from technical stack note
- [ ] Rename "Role Fit" to "Strengths" in nav and section
- [ ] Update contact statement to direct CTA

### Phase 2: Mobile Optimization (Day 3-4)
- [ ] Create mobile-specific hero layout
- [ ] Collapse signals into horizontal strip on mobile
- [ ] Hide ambient orb effects on viewports < 720px
- [ ] Test touch targets and scroll behavior

### Phase 3: Visual Refinement (Day 5)
- [ ] Reduce ambient hero orb opacity
- [ ] Remove shimmer animation
- [ ] Add section padding variance

### Phase 4: Proof Enhancement (Day 6-7)
- [ ] Add ATS-friendly tool names to resume
- [ ] Consider adding testimonial placeholder structure
- [ ] Verify all external links work

### Phase 5: Testing & Polish (Day 8-10)
- [ ] Test on real devices (iOS Safari, Android Chrome)
- [ ] Run Lighthouse audit
- [ ] Verify print/PDF resume output
- [ ] Final recruiter scan test (30-second evaluation)

---

## Success Metrics

1. **Time to value proposition:** < 5 seconds (currently ~8 seconds due to visual competition)
2. **Mobile scroll to CTA:** < 2 thumb scrolls (currently ~3-4 scrolls)
3. **Case study title clarity:** Recruiters can state the outcome without reading the summary
4. **Contact accessibility:** Email visible without scrolling on desktop hero

---

## Files to Modify

### Content Changes
- `src/content/site-content.ts` - hero, cases, nav, contact content updates

### Style Changes
- `src/app/page.module.css` - mobile hero layout, section padding
- `src/components/portfolio/ambient-hero.module.css` - reduced orb effects

### Component Changes
- `src/app/page.tsx` - hero structure for mobile, email visibility

### Optional Additions
- `src/components/portfolio/proof-strip.tsx` - dedicated metrics component
- Resume tool names in site-content.ts resume section
