import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/portfolio/breadcrumbs";
import { Reveal } from "@/components/portfolio/reveal";
import { ThemeToggle } from "@/components/portfolio/theme-toggle";
import {
  getAdjacentCaseStudies,
  getCaseStudy,
  siteContent,
} from "@/content/site-content";
import { absoluteUrl } from "@/lib/site-url";
import { getExternalLinkProps } from "@/lib/url-utils";

import styles from "./page.module.css";

type CasePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return siteContent.caseStudies.map((caseStudy) => ({
    slug: caseStudy.slug,
  }));
}

export async function generateMetadata({
  params,
}: CasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    return {
      title: "Case study not found",
    };
  }

  return {
    title: caseStudy.title,
    description: caseStudy.summary,
    alternates: {
      canonical: `/cases/${caseStudy.slug}`,
    },
    openGraph: {
      title: `${caseStudy.title} | ${siteContent.meta.name}`,
      description: caseStudy.summary,
      url: absoluteUrl(`/cases/${caseStudy.slug}`),
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${caseStudy.title} | ${siteContent.meta.name}`,
      description: caseStudy.summary,
    },
  };
}

export default async function CaseStudyPage({ params }: CasePageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  const adjacent = getAdjacentCaseStudies(slug);

  return (
    <main id="main-content" tabIndex={-1} className={styles.page} data-case-page>
      {/* Navigation bar */}
      <Reveal variant="fade" duration={0.6}>
        <div className={styles.navBar}>
          <div className={styles.navLeft}>
            <Link className={styles.backLink} href="/#cases">
              Back to portfolio
            </Link>
            <Breadcrumbs
              className={styles.breadcrumbs}
              items={[
                { label: "Home", href: "/" },
                { label: "Cases", href: "/#cases" },
                { label: caseStudy.title },
              ]}
            />
          </div>
          <ThemeToggle />
        </div>
      </Reveal>

      {/* Hero section with staged entrance */}
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <Reveal variant="fade" delay={0.1} duration={0.7}>
            <p className={styles.eyebrow}>
              ({caseStudy.number}) {caseStudy.eyebrow}
            </p>
          </Reveal>

          <Reveal variant="blur-to-crisp" delay={0.15} duration={1}>
            <h1 className={styles.heroTitle}>{caseStudy.title}</h1>
          </Reveal>

          <Reveal variant="fade-up" delay={0.3} duration={0.8}>
            <p className={styles.heroSummary}>{caseStudy.summary}</p>
            <p className={styles.heroOutcome}>{caseStudy.outcome}</p>

            <div className={styles.heroTags}>
              {caseStudy.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal className={styles.heroVisual} variant="scale-in" delay={0.2} duration={1}>
          <div className={styles.imageFrame}>
            <Image
              src={caseStudy.previewImage}
              alt={`${caseStudy.title} preview`}
              fill
              priority
              sizes="(max-width: 920px) 100vw, 50vw"
              className={styles.heroImage}
            />
          </div>
        </Reveal>
      </section>

      {/* Content grid with cascade rhythm */}
      <section className={styles.contentGrid}>
        <div className={styles.contentColumn}>
          {caseStudy.sections.map((section, index) => (
            <Reveal
              key={section.title}
              className={styles.sectionCard}
              variant="fade-up"
              delay={0.05 * index}
              duration={0.7}
            >
              <p className={styles.sectionLabel}>{section.title}</p>
              <ul className={styles.sectionList}>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className={styles.rail} variant="fade-up" delay={0.15} duration={0.8}>
          <aside className={styles.railCard}>
            <div className={styles.railBlock}>
              <p className={styles.sectionLabel}>Quick read</p>
              <p className={styles.railText}>
                This is the premium packaging of a public-safe case. It keeps the
                operating logic visible without exposing internal-only workflow detail.
              </p>
            </div>

            <div className={styles.railBlock}>
              <p className={styles.sectionLabel}>Case metrics</p>
              <ul className={styles.metricList}>
                {caseStudy.metrics.map((metric) => (
                  <li key={metric.label} className={styles.metricItem}>
                    <span className={styles.metricValue}>{metric.value}</span>
                    <span className={styles.metricName}>{metric.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.railBlock}>
              <p className={styles.sectionLabel}>Artifacts</p>
              <div className={styles.artifactList}>
                {caseStudy.artifacts.map((artifact) => (
                  <a
                    key={artifact.label}
                    className={styles.artifactLink}
                    href={artifact.href}
                    {...getExternalLinkProps(artifact.href)}
                  >
                    {artifact.label}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </Reveal>
      </section>

      <Reveal className={styles.navigationFooter} variant="fade-up" delay={0.1}>
        <div className={styles.footerCard}>
          <p className={styles.sectionLabel}>Continue reading</p>
          <div className={styles.footerLinks}>
            {adjacent.previous ? (
              <Link className={styles.footerLink} href={`/cases/${adjacent.previous.slug}`}>
                Previous: {adjacent.previous.title}
              </Link>
            ) : (
              <Link className={styles.footerLink} href="/">
                Return to homepage
              </Link>
            )}

            {adjacent.next ? (
              <Link className={styles.footerLink} href={`/cases/${adjacent.next.slug}`}>
                Next: {adjacent.next.title}
              </Link>
            ) : (
              <Link className={styles.footerLink} href="/#contact">
                Contact and positioning
              </Link>
            )}
          </div>
        </div>
      </Reveal>
    </main>
  );
}
