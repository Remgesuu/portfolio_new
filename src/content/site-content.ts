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

export type CaseStudy = {
  slug: string;
  number: string;
  eyebrow: string;
  title: string;
  summary: string;
  outcome: string;
  previewImage: string;
  tags: string[];
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

export type SiteContent = {
  meta: SiteMeta;
  profileMedia: ProfileMedia;
  description: string;
  nav: NavItem[];
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    positioning: string;
    ctas: ActionLink[];
    availability: string;
    note: string;
    signals: SignalPill[];
  };
  cases: {
    eyebrow: string;
    title: string;
    intro: string;
  };
  builds: {
    eyebrow: string;
    title: string;
    intro: string;
    items: ProjectProof[];
  };
  strengths: {
    eyebrow: string;
    title: string;
    intro: string;
    items: RoleFitItem[];
  };
  contact: {
    eyebrow: string;
    title: string;
    intro: string;
    links: ContactLink[];
  };
  footer: string;
  resume: ResumeContent;
  caseStudies: CaseStudy[];
};

const caseStudies: CaseStudy[] = [
  {
    slug: "darkest-afk",
    number: "01",
    eyebrow: "Support systems design",
    title: "Darkest AFK compensation workflow",
    summary:
      "Built a repeatable operator-facing catalog for faster recovery packages and cleaner internal handling.",
    outcome:
      "A support-heavy recovery flow became faster, more consistent, and easier to repeat without manual lookup noise.",
    previewImage: "/images/cases/project-darkest-afk.svg",
    tags: [
      "112+ indexed items",
      "Bilingual operator UX",
      "Standardized package prep",
    ],
    meta: {
      role: "Support Ops Lead",
      environment: "Mobile F2P, Heapp Games",
      artifactType: "Operator tool",
    },
    metrics: [
      { label: "Indexed items", value: "112+" },
      { label: "Operator UX", value: "Bilingual" },
      { label: "Preparation", value: "Standardized" },
    ],
    sections: [
      {
        title: "Challenge",
        items: [
          "Support and admin workflows needed a faster, safer way to prepare compensation packages without repeated manual lookup and formatting.",
          "Manual item search and package prep created repetitive friction and made consistency harder to maintain.",
        ],
      },
      {
        title: "Inputs",
        items: [
          "Support workflow pain points.",
          "Existing item metadata.",
          "Internal package assembly requirements.",
        ],
      },
      {
        title: "Method",
        items: [
          "Built a static operator tool with search, filtering, bilingual labels, and standardized package-prep logic.",
          "Optimized the flow for repetitive internal support work rather than presentation-only browsing.",
          "Created a cleaner path from item lookup to repeatable output.",
        ],
      },
      {
        title: "What surfaced",
        items: [
          "Operator tooling matters when the same recovery flow happens repeatedly.",
          "Consistency is as important as speed in compensation work.",
          "Workflow design can remove support friction without changing team structure.",
        ],
      },
      {
        title: "Impact",
        items: [
          "112+ indexed items in one operator-facing tool.",
          "Clearer and more repeatable package preparation.",
          "Public proof of support tooling and process thinking.",
        ],
      },
      {
        title: "Next move",
        items: [
          "Measure package-prep time before and after tool adoption.",
          "Track formatting mistakes and repeat corrections.",
          "Identify the next repetitive support workflow worth standardizing.",
        ],
      },
    ],
    artifacts: [
      {
        label: "Legacy public case page",
        href: "https://codeavd.github.io/Portfolio/cases/darkest-afk.html",
      },
      {
        label: "Original one-pager on GitHub",
        href: "https://github.com/CodeAvd/Portfolio/blob/main/case_01_darkest_afk_one_pager_en.md",
      },
    ],
  },
  {
    slug: "dig-dig-die",
    number: "02",
    eyebrow: "Feedback intelligence",
    title: "Dig Dig Die escalation-ready feedback view",
    summary:
      "Structured noisy community feedback into a shared view for support, product, and execution conversations.",
    outcome:
      "Raw complaints became a concise escalation artifact with priorities, repeat themes, and less duplication across teams.",
    previewImage: "/images/cases/project-dig-dig-die.svg",
    tags: ["23 structured items", "6 critical issues", "3 repeat themes"],
    meta: {
      role: "Support Ops Lead",
      environment: "Steam Early Access, Heapp Games",
      artifactType: "Escalation memo",
    },
    metrics: [
      { label: "Structured items", value: "23" },
      { label: "Critical issues", value: "6" },
      { label: "Repeat themes", value: "3" },
    ],
    sections: [
      {
        title: "Challenge",
        items: [
          "Steam, Discord, and community reports contained recurring bug and UX signals, but the feedback was fragmented and duplicated across channels.",
          "Support and product conversations were slower because the same issues were appearing in multiple formats without a shared structure.",
        ],
      },
      {
        title: "Inputs",
        items: [
          "Steam feedback snapshots.",
          "Discord and community reports.",
          "Creator and player commentary.",
        ],
      },
      {
        title: "Method",
        items: [
          "Clustered raw feedback into repeat issue groups and feedback themes.",
          "Added simple priority framing to move from noise to next actions.",
          "Packed the result into a support-to-product escalation view.",
        ],
      },
      {
        title: "What surfaced",
        items: [
          "23 structured items made the volume of player pain legible.",
          "6 critical bug or UX issues stood out as near-term risk.",
          "3 repeat feedback themes showed where frustration was concentrating.",
        ],
      },
      {
        title: "Impact",
        items: [
          "Faster path from public user complaints to structured escalation.",
          "Less duplication between support, product, and dev conversations.",
          "Clear proof of customer feedback prioritization inside a support-led narrative.",
        ],
      },
      {
        title: "Next move",
        items: [
          "Track whether structured escalations shorten prioritization conversations.",
          "Measure how often duplicate complaints collapse into a single issue view.",
          "Repeat the same workflow for another noisy signal set.",
        ],
      },
    ],
    artifacts: [
      {
        label: "Legacy public case page",
        href: "https://codeavd.github.io/Portfolio/cases/dig-dig-die.html",
      },
      {
        label: "Original one-pager on GitHub",
        href: "https://github.com/CodeAvd/Portfolio/blob/main/case_03_dig_dig_die_one_pager_en.md",
      },
    ],
  },
  {
    slug: "vacation-cafe",
    number: "03",
    eyebrow: "Retention and friction analysis",
    title: "Vacation Cafe player-friction analysis",
    summary:
      "Turned fragmented player friction signals into retention-oriented hypotheses a product team could review quickly.",
    outcome:
      "Community pain points became named patterns, clearer language, and short-loop experiments instead of scattered anecdotes.",
    previewImage: "/images/cases/project-vacation-cafe.svg",
    tags: [
      "6-8h pain point",
      "Level 4-5 complexity spike",
      "Short-loop hypotheses",
    ],
    meta: {
      role: "Support Ops Lead",
      environment: "Mobile F2P, Heapp Games",
      artifactType: "Analysis brief",
    },
    metrics: [
      { label: "Friction signal", value: "6-8h" },
      { label: "Complexity spike", value: "Level 4-5" },
      { label: "Experiments", value: "Short-loop" },
    ],
    sections: [
      {
        title: "Challenge",
        items: [
          "Community and market feedback described points where the cozy loop started to feel repetitive or mechanically heavy, but the signals were not yet organized into actions.",
          "The underlying player pain was real, but it was scattered across channels and not translated into testable next steps.",
        ],
      },
      {
        title: "Inputs",
        items: [
          "Steam review and feedback snapshots.",
          "Discord discussion samples.",
          "Genre and benchmark observations.",
        ],
      },
      {
        title: "Method",
        items: [
          "Grouped repeat complaints into friction patterns instead of isolated anecdotes.",
          "Mapped the patterns to simple retention and session-quality questions.",
          "Proposed short-loop hypotheses a team could review quickly.",
        ],
      },
      {
        title: "What surfaced",
        items: [
          "A repeat friction signal appeared around 6-8 hours for part of the player base.",
          "Complexity increased near Level 4-5 and changed the feel of the loop.",
          "This work is strongest as decision support, not as a full product-title pivot.",
        ],
      },
      {
        title: "Impact",
        items: [
          "Clear public example of player-friction analysis and hypothesis framing.",
          "Better language for turning user pain into support-to-product escalation.",
          "Useful differentiation without breaking the support narrative.",
        ],
      },
      {
        title: "Next move",
        items: [
          "Test whether the same framework helps in a SaaS onboarding or help-center context.",
          "Shorten the analysis into a one-page operating memo.",
          "Track whether teams act faster when friction patterns are named clearly.",
        ],
      },
    ],
    artifacts: [
      {
        label: "Legacy public case page",
        href: "https://codeavd.github.io/Portfolio/cases/vacation-cafe.html",
      },
      {
        label: "Original one-pager on GitHub",
        href: "https://github.com/CodeAvd/Portfolio/blob/main/case_02_vacation_cafe_one_pager_en.md",
      },
    ],
  },
];

const technicalProofs: ProjectProof[] = [
  {
    title: "Jarvis v1",
    eyebrow: "AI workflow system",
    summary:
      "Telegram-first assistant with Obsidian memory, SQLite state, Chroma retrieval, and typed LLM outputs through a practical personal ops workflow.",
    impact:
      "Shows shipped builder proof in Python, FastAPI, aiogram, SQLite, local retrieval, and LLM orchestration without pretending it is enterprise product scale.",
    href: "https://github.com/CodeAvd/jarvis",
    linkLabel: "Open GitHub repo",
    stack: [
      "Python",
      "FastAPI",
      "SQLite",
      "Chroma",
      "aiogram",
      "LiteLLM",
    ],
    level: "shipped",
  },
  {
    title: "Vacation Dashboard React",
    eyebrow: "Frontend signal packaging",
    summary:
      "Next.js dashboard package that turns noisy player feedback into triage tables, risk slices, and decision-ready readouts for support, QA, and product conversations.",
    impact:
      "Shows React, Next.js, TypeScript, bilingual information design, and the ability to package raw user input into a static, usable operating artifact.",
    href: "https://github.com/CodeAvd/vacation_dashboard",
    linkLabel: "Open GitHub repo",
    stack: ["Next.js", "React", "TypeScript", "Dashboard UI", "QA framing"],
    level: "shipped",
  },
];

const resumeSkillGroups: SkillGroup[] = [
  {
    title: "Core operator skills",
    level: "core",
    items: [
      "Support operations",
      "Technical support",
      "Escalation management",
      "Incident handling",
      "Issue reproduction",
      "Feedback intelligence",
      "Knowledge base operations",
      "Cross-functional handoff quality",
    ],
  },
  {
    title: "Technical stack",
    level: "shipped",
    items: [
      "Python",
      "FastAPI",
      "SQLite",
      "Next.js",
      "React",
      "TypeScript",
      "HTML/CSS/JS",
      "Webhook-based automation",
      "Telegram bot workflows",
      "LLM orchestration",
    ],
    note:
      "Technical stack claims are grounded in shipped side-project work and automation-heavy support systems, not inflated senior-engineer posturing.",
  },
  {
    title: "Working knowledge",
    level: "working-knowledge",
    items: [
      "SQL",
      "Pandas",
      "Vector retrieval / Chroma",
      "QA regression thinking",
      "Product signal clustering",
    ],
  },
];

const resumeExperience: ResumeExperience[] = [
  {
    company: "Heapp Games",
    title: "Customer Success Lead",
    period: "Jan 2024 - Current",
    bullets: [
      "Turned fragmented player and community feedback into a Dig Dig Die escalation view with 23 structured priorities, 6 critical issues, and clearer routing between support, product, and execution.",
      "Built a bilingual Darkest AFK recovery tool with 112+ indexed items and standardized package-prep logic, reducing repetitive operator work and making compensation handling more consistent.",
      "Translated recurring Vacation Cafe friction signals into backlog-ready hypotheses and decision support for product conversations without exposing internal-only workflow detail.",
    ],
  },
  {
    company: "Mover Bridge (Aptos Ecosystem)",
    title: "Customer Success Lead / Senior Support Specialist",
    period: "Sep 2022 - Dec 2023",
    bullets: [
      "Reduced repetitive tier-1 volume by 45% by implementing AI-assisted support workflows and tightening the knowledge base around recurring bridge, wallet, and transaction issues.",
      "Improved first response time by 35% through webhook-based routing, issue tagging, and escalation triage tied to trust-sensitive transaction troubleshooting.",
      "Built an internal failed-transaction compensation workflow that cut manual operational load by 70% while improving consistency in recovery handling.",
      "Investigated and resolved high-stakes incidents involving wallets, stuck transactions, and user funds while keeping communication clear during stressful user-facing recovery cases.",
    ],
  },
  {
    company: "Phaver / CoinList / Mover",
    title: "Community & Customer Success Manager",
    period: "Jan 2021 - Aug 2022",
    bullets: [
      "Managed launch, onboarding, and high-volume support communication across Web3 products and time-sensitive token events.",
      "Guided non-technical users through wallets, KYC, deposits, and first-use troubleshooting by turning complex product behavior into clear support guidance.",
      "Protected 10,000+ member communities with moderation, anti-scam hygiene, and cleaner onboarding communication.",
    ],
  },
];

const resumeProjects: ResumeProject[] = [
  {
    title: "Darkest AFK",
    note:
      "Bilingual operator tool with 112+ indexed items for faster compensation handling and repeatable recovery workflows.",
    href: "/cases/darkest-afk",
  },
  {
    title: "Dig Dig Die",
    note:
      "Feedback intelligence pack that turned noisy community signals into 23 structured priorities and 6 critical issues.",
    href: "/cases/dig-dig-die",
  },
  {
    title: "Jarvis v1",
    note:
      "Telegram-first assistant with FastAPI, SQLite, Chroma, and typed LLM flows shipped as a working personal ops system.",
    href: "https://github.com/CodeAvd/jarvis",
  },
  {
    title: "Vacation Dashboard React",
    note:
      "Next.js / React dashboard package for packaging player feedback, risk, and triage into decision-ready views.",
    href: "https://github.com/CodeAvd/vacation_dashboard",
  },
];

const resumeContent: ResumeContent = {
  headline:
    "Support Operations / Technical Support Specialist with AI automation and workflow systems leverage.",
  summary:
    "Support operations and technical support specialist with 3.5+ years across Web3, FinTech, gamedev, and customer-facing operations. Reduced repetitive tier-1 volume by 45%, improved first response time by 35%, and cut manual operational load by 70% through automation, routing, and internal tooling. Strong in escalation management, incident communication, knowledge base improvement, feedback intelligence, and turning repeated support pain into calmer systems.",
  contactNote:
    "Russia | Remote | grigorii584@gmail.com | +7-988-492-9938",
  languages: "Russian (native), English (B2)",
  contactLinks: [
    {
      label: "GitHub",
      value: "github.com/CodeAvd",
      href: "https://github.com/CodeAvd",
    },
    {
      label: "Portfolio",
      value: "portfolio-v2",
      href: "/",
    },
    {
      label: "Email",
      value: "grigorii584@gmail.com",
      href: "mailto:grigorii584@gmail.com",
    },
  ],
  skillGroups: resumeSkillGroups,
  experience: resumeExperience,
  selectedProjects: resumeProjects,
  education: [
    {
      title: "Volgograd State Medical University",
      detail: "General Medicine, 2019-2024",
    },
    {
      title: "QA Engineer Training",
      detail: "Manual testing, bug tracking, SDLC fundamentals",
    },
  ],
};

export const siteContent: SiteContent = {
  meta: {
    name: "Grigorii",
    role: "AI-enabled support systems operator for technical support, escalation, and workflow automation",
    location: "Russia | Remote",
    email: "grigorii584@gmail.com",
    phone: "+7-988-492-9938",
    githubUrl: "https://github.com/CodeAvd",
    portfolioRepoUrl: "https://github.com/Remgesuu/portfolio_new",
    legacyPortfolioUrl: "https://codeavd.github.io/Portfolio/",
    resumeUrl: "/resume",
  },
  profileMedia: {
    src: "/images/profile/grigorii-portrait.png",
    alt: "Portrait of Grigorii against a warm city skyline at sunset.",
    width: 1792,
    height: 2400,
  },
  description:
    "English-first portfolio and resume for an AI-enabled support systems operator working across technical support, escalation, workflow automation, and product-facing signal packaging.",
  nav: [
    { label: "Case Studies", href: "#cases" },
    { label: "Projects", href: "#builds" },
    { label: "Role Fit", href: "#strengths" },
    { label: "Resume", href: "/resume" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    eyebrow: "( SUPPORT-FIRST, SYSTEMS-SHAPED )",
    title: "Technical Support Specialist.",
    description:
      "Support-first by training, systems-first in execution. I reduce repeated ticket noise, build operator tooling, and package customer signals into artifacts product, QA, and ops teams can actually use.",
    positioning:
      "Support Operations / Technical Support Specialist with AI automation and workflow systems leverage. Remote-ready.",
    ctas: [
      { label: "View case studies", href: "#cases", variant: "primary" },
      { label: "Open resume", href: "/resume", variant: "secondary" },
    ],
    availability:
      "Remote-first and interview-ready for support ops, technical support, incident-heavy support, and AI-adjacent operations roles.",
    note:
      "Public-safe packaging only. The site keeps shipped interfaces, operating logic, and proof metrics while leaving out internal-only workflow detail.",
    signals: [
      { value: "45%", label: "lower repetitive tier-1 volume (Mover Bridge, 2022-23)" },
      { value: "35%", label: "faster first response time (Mover Bridge, 2022-23)" },
      { value: "70%", label: "less manual operational load (Mover Bridge, 2022-23)" },
      { value: "112+", label: "indexed support items (Heapp Games, 2024)" },
    ],
  },
  cases: {
    eyebrow: "( FLAGSHIP CASES )",
    title: "Three public-safe case studies where support work turns into clearer systems.",
    intro:
      "Workflow design, feedback intelligence, and product-facing packaging drawn from support-adjacent work and confidentiality-safe examples.",
  },
  builds: {
    eyebrow: "( SELECTED TECHNICAL WORK )",
    title: "Additional shipped systems that widen the read beyond a support dashboard.",
    intro:
      "Real builder proof from personal and public-safe work. These are not filler projects; they show the technical stack behind the operating claims.",
    items: technicalProofs,
  },
  strengths: {
    eyebrow: "( ROLE FIT )",
    title: "The positioning is broader now, but the evidence stays disciplined.",
    intro:
      "Support-first credibility remains the foundation. The wider operator read comes from shipped systems and better packaging, not from inflated titles.",
    items: [
      {
        eyebrow: "Support systems",
        title: "Workflow automation and operator tooling",
        description:
          "Repeatable recovery flows, internal tooling, and lower-friction processes where consistency matters as much as speed.",
      },
      {
        eyebrow: "Escalation quality",
        title: "Incident handling and issue reproduction",
        description:
          "Bridge incidents, user trust, reproduction detail, and cleaner handoffs between support, QA, product, and engineering.",
      },
      {
        eyebrow: "AI leverage",
        title: "Signal packaging and systems thinking",
        description:
          "LLM-assisted workflows, structured feedback clustering, and artifacts that help teams act faster instead of rereading the same noise.",
      },
    ],
  },
  contact: {
    eyebrow: "( CONTACT )",
    title: "If you need support credibility with stronger systems leverage, we should talk.",
    intro:
      "Open to remote-first roles across support ops, technical support, escalation-heavy support, AI-enabled internal tooling, and product-facing operations.",
    links: [
      {
        label: "Email",
        value: "grigorii584@gmail.com",
        href: "mailto:grigorii584@gmail.com",
      },
      {
        label: "GitHub",
        value: "github.com/CodeAvd",
        href: "https://github.com/CodeAvd",
      },
      {
        label: "Resume",
        value: "Public resume",
        href: "/resume",
      },
      {
        label: "Portfolio source",
        value: "github.com/Remgesuu/portfolio_new",
        href: "https://github.com/Remgesuu/portfolio_new",
      },
      {
        label: "Location",
        value: "Russia | Remote",
      },
    ],
  },
  footer:
    "English ships first. Support-first credibility stays intact while the public packaging reads wider and cleaner.",
  resume: resumeContent,
  caseStudies,
};

export function getCaseStudy(slug: string) {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug) ?? null;
}

export function getAdjacentCaseStudies(slug: string) {
  const index = caseStudies.findIndex((caseStudy) => caseStudy.slug === slug);

  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: caseStudies[index - 1] ?? null,
    next: caseStudies[index + 1] ?? null,
  };
}
