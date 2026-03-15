/**
 * Type definitions for site content.
 * Separated for cleaner imports and better maintainability.
 */

export type ProofLevel = "core" | "shipped" | "working-knowledge";

export type SiteMeta = {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  githubUrl: string;
  portfolioRepoUrl: string;
  legacyPortfolioUrl: string;
  resumeUrl: string;
};

export type ProfileMedia = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type NavItem = {
  label: string;
  href: string;
};

export type ActionLink = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
};

export type SignalPill = {
  value: string;
  label: string;
};

export type ProofMetric = {
  label: string;
  value: string;
  note: string;
  provenance?: string;
};

export type RoleFitItem = {
  eyebrow: string;
  title: string;
  description: string;
};

export type ContactLink = {
  label: string;
  value: string;
  href?: string;
};

export type SkillGroup = {
  title: string;
  level: ProofLevel;
  items: string[];
  note?: string;
};

export type ProjectProof = {
  title: string;
  eyebrow: string;
  summary: string;
  impact: string;
  href: string;
  linkLabel: string;
  stack: string[];
  level: ProofLevel;
};

export type CaseStudyMetric = {
  label: string;
  value: string;
};

export type ArtifactLink = {
  label: string;
  href: string;
};

export type CaseStudySection = {
  title: string;
  items: string[];
};

export type CaseStudyMeta = {
  role: string;
  environment: string;
  artifactType: string;
};

export type CaseStudy = {
  slug: string;
  number: string;
  eyebrow: string;
  title: string;
  summary: string;
  outcome: string;
  previewImage: string;
  tags: string[];
  meta: CaseStudyMeta;
  metrics: CaseStudyMetric[];
  sections: CaseStudySection[];
  artifacts: ArtifactLink[];
};

export type ResumeExperience = {
  company: string;
  title: string;
  period: string;
  bullets: string[];
};

export type ResumeProject = {
  title: string;
  note: string;
  href: string;
};

export type ResumeEducation = {
  title: string;
  detail: string;
};

export type ResumeContent = {
  headline: string;
  summary: string;
  contactNote: string;
  languages: string;
  contactLinks: ContactLink[];
  skillGroups: SkillGroup[];
  experience: ResumeExperience[];
  selectedProjects: ResumeProject[];
  education: ResumeEducation[];
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  positioning: string;
  ctas: ActionLink[];
  availability: string;
  note: string;
  signals: SignalPill[];
};

export type SectionHeader = {
  eyebrow: string;
  title: string;
  intro: string;
};

export type BuildsSection = SectionHeader & {
  items: ProjectProof[];
};

export type StrengthsSection = SectionHeader & {
  items: RoleFitItem[];
};

export type ContactSection = SectionHeader & {
  links: ContactLink[];
};

export type SiteContent = {
  meta: SiteMeta;
  profileMedia: ProfileMedia;
  description: string;
  nav: NavItem[];
  hero: HeroContent;
  cases: SectionHeader;
  builds: BuildsSection;
  strengths: StrengthsSection;
  contact: ContactSection;
  footer: string;
  resume: ResumeContent;
  caseStudies: CaseStudy[];
};
