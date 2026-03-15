import Image from "next/image";
import Link from "next/link";

import { AmbientHero } from "@/components/portfolio/ambient-hero";
import { Reveal } from "@/components/portfolio/reveal";
import { HeroEntrance, HeroItem, SplitText } from "@/components/portfolio/hero-entrance";
import { CTAButton } from "@/components/portfolio/cta-button";
import { FloatingThemeToggle } from "@/components/portfolio/floating-theme-toggle";
import { ScrollToTop } from "@/components/portfolio/scroll-to-top";
import { Typewriter } from "@/components/portfolio/typewriter";
import { ChoreographyContainer, ChoreographyItem } from "@/components/portfolio/motion-choreography";
import { siteContent } from "@/content/site-content";
import { proofLevelLabel } from "@/lib/content-utils";
import { isInternalRouteHref, getExternalLinkProps } from "@/lib/url-utils";

import styles from "./page.module.css";

export default function Home() {
  const {
    meta,
    profileMedia,
    hero,
    nav,
    cases,
    builds,
    strengths,
    contact,
    footer,
  } = siteContent;

  return (
    <main id="main-content" tabIndex={-1} className={styles.page}>
      {/* Minimal floating nav pill - kons.fyi style */}
      <Reveal variant="fade" duration={0.6}>
        <header className={styles.topbar}>
          <Link className={styles.homeButton} href="/" aria-label="Home">
            <span className={styles.homeIcon}>G</span>
          </Link>

          <nav className={styles.navPill} aria-label="Primary">
            {nav.map((item) =>
              isInternalRouteHref(item.href) ? (
                <Link key={item.href} className={styles.navLink} href={item.href}>
                  {item.label}
                </Link>
              ) : (
                <a key={item.href} className={styles.navLink} href={item.href}>
                  {item.label}
                </a>
              ),
            )}
          </nav>
        </header>
      </Reveal>

      {/* Hero section with cinematic entrance */}
      <HeroEntrance className={styles.hero}>
        <div className={styles.heroCopy}>
          <HeroItem>
            <p className={styles.eyebrow}>
              <Typewriter
                phrases={[
                  "Support Operations",
                  "AI Automation",
                  "Workflow Systems",
                  "Remote-Ready",
                ]}
                typingSpeed={70}
                deletingSpeed={40}
                pauseDuration={2500}
              />
            </p>
          </HeroItem>

          <HeroItem>
            <p className={styles.heroPositioning}>{hero.positioning}</p>
          </HeroItem>

          <HeroItem variant="title">
            <h1 className={styles.heroTitle}>
              <SplitText type="words">{hero.title}</SplitText>
            </h1>
          </HeroItem>

          <HeroItem>
            <p className={styles.heroDescription}>{hero.description}</p>
          </HeroItem>

          <HeroItem>
            <div className={styles.heroActions}>
              {hero.ctas.map((cta) =>
                isInternalRouteHref(cta.href) ? (
                  <CTAButton
                    key={cta.label}
                    as="a"
                    href={cta.href}
                    variant={cta.variant === "primary" ? "primary" : "ghost"}
                    size="lg"
                  >
                    {cta.label}
                  </CTAButton>
                ) : (
                  <CTAButton
                    key={cta.label}
                    as="a"
                    href={cta.href}
                    variant={cta.variant === "primary" ? "primary" : "ghost"}
                    size="lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {cta.label}
                  </CTAButton>
                ),
              )}
            </div>
          </HeroItem>

          <HeroItem>
            <a className={styles.heroEmail} href={`mailto:${meta.email}`}>
              {meta.email}
            </a>
          </HeroItem>
        </div>

        <HeroItem variant="visual" className={styles.heroVisual}>
          <div className={styles.profileStage}>
            <div className={styles.profileBackdrop} aria-hidden="true">
              <AmbientHero />
            </div>

            <div className={styles.profilePhotoFrame}>
              <Image
                src={profileMedia.src}
                alt={profileMedia.alt}
                width={profileMedia.width}
                height={profileMedia.height}
                priority
                sizes="(max-width: 720px) 100vw, (max-width: 1040px) 72vw, 34rem"
                className={styles.profilePhoto}
              />
            </div>

            <article className={styles.profilePanel}>
              <div className={styles.profilePanelLead}>
                <p className={styles.profileLabel}>Recruiter read</p>
                <p className={styles.profileText}>{hero.positioning}</p>
                <p className={styles.profileAvailability}>{hero.availability}</p>
                <a 
                  className={styles.profileGithub} 
                  href={meta.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/CodeAvd
                </a>
              </div>

              <div className={styles.heroSignals}>
                {hero.signals.map((signal) => (
                  <div key={signal.label} className={styles.signalCard}>
                    <p className={styles.signalValue}>{signal.value}</p>
                    <p className={styles.signalLabel}>{signal.label}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <p className={styles.heroNote}>{hero.note}</p>
        </HeroItem>
      </HeroEntrance>

      {/* Cases section with staggered cards */}
      <Reveal className={styles.section} id="cases" delay={0.06}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>{cases.eyebrow}</p>
          <div>
            <h2 className={styles.sectionTitle}>{cases.title}</h2>
            <p className={styles.sectionIntro}>{cases.intro}</p>
          </div>
        </div>

        <ChoreographyContainer 
          className={styles.casesGrid}
          staggerDelay={0.12}
          direction="up"
        >
          {siteContent.caseStudies.map((caseStudy, index) => (
            <ChoreographyItem key={caseStudy.slug}>
              <article 
                className={index === 0 ? styles.caseCardFeatured : styles.caseCardSecondary}
              >
                <div className={index === 0 ? styles.caseVisualFeatured : styles.caseVisual}>
                  <Image
                    src={caseStudy.previewImage}
                    alt={`${caseStudy.title} preview`}
                    fill
                    sizes={index === 0 ? "(max-width: 900px) 100vw, 56vw" : "(max-width: 900px) 100vw, 40vw"}
                    className={styles.caseImage}
                  />
                </div>

                <div className={styles.caseBody}>
                  <div className={styles.caseMeta}>
                    <p className={styles.caseNumber}>{caseStudy.number}</p>
                    <p className={styles.caseEyebrow}>{caseStudy.eyebrow}</p>
                  </div>

                  <h3 className={index === 0 ? styles.caseTitleFeatured : styles.caseTitle}>{caseStudy.title}</h3>
                  
                  <div className={styles.caseMetaDetails}>
                    <span className={styles.caseMetaItem}>{caseStudy.meta.role}</span>
                    <span className={styles.caseMetaSep} aria-hidden="true">/</span>
                    <span className={styles.caseMetaItem}>{caseStudy.meta.environment}</span>
                    <span className={styles.caseMetaSep} aria-hidden="true">/</span>
                    <span className={styles.caseMetaItem}>{caseStudy.meta.artifactType}</span>
                  </div>
                  
                  <p className={styles.caseSummary}>{caseStudy.summary}</p>
                  {index === 0 && <p className={styles.caseOutcome}>{caseStudy.outcome}</p>}

                  <div className={styles.caseTags}>
                    {caseStudy.tags.map((tag) => (
                      <span key={tag} className={styles.caseTag}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link className={styles.caseLink} href={`/cases/${caseStudy.slug}`}>
                    Open case study
                  </Link>
                </div>
              </article>
            </ChoreographyItem>
          ))}
        </ChoreographyContainer>
      </Reveal>

      {/* Builds section */}
      <Reveal className={styles.section} id="builds" delay={0.1}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>{builds.eyebrow}</p>
          <div>
            <h2 className={styles.sectionTitle}>{builds.title}</h2>
            <p className={styles.sectionIntro}>{builds.intro}</p>
          </div>
        </div>

        <ChoreographyContainer 
          className={styles.buildsGrid}
          staggerDelay={0.1}
          direction="up"
        >
          {builds.items.map((item) => (
            <ChoreographyItem key={item.title}>
              <article className={styles.buildCard}>
                <div className={styles.buildMeta}>
                  <p className={styles.buildEyebrow}>{item.eyebrow}</p>
                  <span className={styles.levelBadge}>{proofLevelLabel(item.level)}</span>
                </div>

                <h3 className={styles.buildTitle}>{item.title}</h3>
                <p className={styles.buildSummary}>{item.summary}</p>
                <p className={styles.buildImpact}>{item.impact}</p>

                <div className={styles.buildStacks}>
                  {item.stack.map((tag) => (
                    <span key={tag} className={styles.buildTag}>
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  className={styles.buildLink}
                  href={item.href}
                  {...getExternalLinkProps(item.href)}
                >
                  {item.linkLabel}
                </a>
              </article>
            </ChoreographyItem>
          ))}
        </ChoreographyContainer>
      </Reveal>

      {/* Strengths section */}
      <Reveal className={styles.section} id="strengths" delay={0.14}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>{strengths.eyebrow}</p>
          <div>
            <h2 className={styles.sectionTitle}>{strengths.title}</h2>
            <p className={styles.sectionIntro}>{strengths.intro}</p>
          </div>
        </div>

        <ChoreographyContainer 
          className={styles.strengthsGrid}
          staggerDelay={0.08}
          direction="up"
        >
          {strengths.items.map((item) => (
            <ChoreographyItem key={item.title}>
              <article className={styles.strengthCard}>
                <p className={styles.strengthEyebrow}>{item.eyebrow}</p>
                <h3 className={styles.strengthTitle}>{item.title}</h3>
                <p className={styles.strengthDescription}>{item.description}</p>
              </article>
            </ChoreographyItem>
          ))}
        </ChoreographyContainer>
      </Reveal>

      {/* Contact section */}
      <Reveal className={`${styles.section} ${styles.contactSection}`} id="contact">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>{contact.eyebrow}</p>
          <div>
            <h2 className={styles.sectionTitle}>{contact.title}</h2>
            <p className={styles.sectionIntro}>{contact.intro}</p>
          </div>
        </div>

        <ChoreographyContainer 
          className={styles.contactGrid}
          staggerDelay={0.15}
          direction="up"
        >
          <ChoreographyItem>
            <article className={styles.contactLead}>
              <p className={styles.contactStatement}>
                Support credibility gets you screened. Systems leverage is what makes
                the interview loop remember you.
              </p>
              <CTAButton as="a" href={meta.resumeUrl} variant="primary" size="lg">
                Open public resume
              </CTAButton>
            </article>
          </ChoreographyItem>

          <ChoreographyItem>
            <ul className={styles.contactList}>
              {contact.links.map((item) => (
                <li key={item.label} className={styles.contactItem}>
                  <span className={styles.contactLabel}>{item.label}</span>
                  {item.href ? (
                    isInternalRouteHref(item.href) ? (
                      <Link className={styles.contactValue} href={item.href}>
                        {item.value}
                      </Link>
                    ) : (
                      <a
                        className={styles.contactValue}
                        href={item.href}
                        {...getExternalLinkProps(item.href)}
                      >
                        {item.value}
                      </a>
                    )
                  ) : (
                    <span className={styles.contactValue}>{item.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </ChoreographyItem>
        </ChoreographyContainer>
      </Reveal>

      <footer className={styles.footer}>
        <p>{footer}</p>
        <p>{meta.location}</p>
      </footer>

      {/* Floating UI elements */}
      <ScrollToTop showAfterScroll={500} />
      <FloatingThemeToggle />
    </main>
  );
}
