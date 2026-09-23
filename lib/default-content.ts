// ------------------------------------------------------------------
// Default content for CodAstra Labs.
//
// This file plays two roles:
//  1. Build-time / offline fallback so the public site renders even before
//     a database is connected or seeded.
//  2. The source of truth used by prisma/seed.ts to populate the CMS.
//
// Facts, copy, products, and clients mirror the data published on
// www.codastralabs.com (fetched from api.codastralabs.com). Claims the
// company has not published (stats, team, testimonials, blog posts) are
// left empty for the admin to fill in.
// ------------------------------------------------------------------

import type { Prisma } from "@prisma/client";

export const defaultSiteSettings = {
  companyName: "CodAstraLabs",
  legalName: "CodAstra Labs Pvt. Ltd.",
  tagline: "Software products with operational depth.",
  description:
    "CodAstraLabs builds focused business software for teams that need role-based portals, reliable workflows, clean automation, and scalable product ecosystems.",
  logo: "/codastralabs-logo.jpeg",
  darkLogo: "/codastralabs-logo.jpeg",
  favicon: "/codastralabs-logo.jpeg",
  email: {
    primary: "support.codastralabs@gmail.com",
    secondary: "",
  },
  phone: {
    primary: "9851405271",
    secondary: "",
  },
  address: "",
  mapUrl: "",
  social: {
    facebook: "",
    linkedin: "",
    instagram: "",
    youtube: "",
    whatsapp: "",
  },
  seo: {
    title: "CodAstraLabs",
    description:
      "CodAstraLabs builds practical SaaS products for business operations.",
    ogImage: "/codastralabs-logo.jpeg",
  },
  footer: {
    about:
      "CodAstraLabs builds focused SaaS products for real business operations.",
    copyright: "Copyright 2026 CodAstraLabs. All rights reserved.",
  },
  design: {
    primary: "#2563eb",
    radius: "0.75rem",
  },
  featuresV1: true,
} satisfies Record<string, unknown>;

export type SiteSettingsData = typeof defaultSiteSettings;

// ------------------------------------------------------------------
// Services
// ------------------------------------------------------------------

export const defaultServices: Prisma.ServiceUncheckedCreateInput[] = [
  {
    name: "Websites",
    slug: "websites",
    shortDescription:
      "Company sites, product landing pages, and content websites built with fast, modern web technology.",
    fullDescription:
      "From public company websites to product landing pages, we design and build websites that load fast, rank well, and make your business easy to understand. Every site is responsive, accessible, and built to be maintained without touching code.",
    icon: "globe",
    benefits: [
      "Fast loading on average connections",
      "Search-engine friendly structure",
      "Managed through a simple CMS",
    ],
    features: ["Content management", "SEO-ready", "Analytics", "Contact workflows", "Performance budgets"],
    technologies: ["React", "TypeScript", "Node.js"],
    status: "PUBLISHED",
    sortOrder: 1,
    publishedAt: new Date("2026-01-01"),
  },
  {
    name: "Web apps",
    slug: "web-apps",
    shortDescription:
      "Dashboards, portals, and internal systems with roles, workflows, and real operational depth.",
    fullDescription:
      "We build web applications for work that has to be tracked — dashboards, staff portals, approval flows, document management, and role-based systems. Our approach focuses on the actual workflow first and adds only what the business needs.",
    icon: "layout",
    benefits: [
      "Role-based access control",
      "Clean workflows and audit trails",
      "Built to scale with the business",
    ],
    features: ["Authentication & RBAC", "Dashboards", "Workflow engines", "Audit logs", "Client and staff portals"],
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    status: "PUBLISHED",
    sortOrder: 2,
    publishedAt: new Date("2026-01-01"),
  },
  {
    name: "Mobile apps",
    slug: "mobile-apps",
    shortDescription:
      "Native-quality iOS and Android apps built with modern cross-platform technology.",
    fullDescription:
      "We build mobile applications for employees, students, and customers. Apps are designed around the mobile workflow, synced with the backend you already use, and shipped to both app stores.",
    icon: "smartphone",
    benefits: [
      "One codebase for iOS and Android",
      "Works offline where it matters",
      "Push notifications and in-app updates",
    ],
    features: ["Cross-platform builds", "Push notifications", "Offline support", "App store publishing"],
    technologies: ["Flutter", "React Native", "Node.js"],
    status: "PUBLISHED",
    sortOrder: 3,
    publishedAt: new Date("2026-01-01"),
  },
  {
    name: "Automation",
    slug: "automation",
    shortDescription:
      "Automation for repetitive work — integrations, bots, document flows, and reports.",
    fullDescription:
      "We connect your tools and remove repetitive manual work: data entry, follow-ups, document generation, notifications, and reporting. Automation is built to be auditable and easy to change as your process evolves.",
    icon: "workflow",
    benefits: [
      "Less manual data entry",
      "Fewer delays in follow-ups",
      "Auditable and reversible steps",
    ],
    features: ["API integrations", "Document workflows", "Notifications", "Scheduled jobs", "Reporting"],
    technologies: ["Python", "Node.js", "Docker", "AWS"],
    status: "PUBLISHED",
    sortOrder: 4,
    publishedAt: new Date("2026-01-01"),
  },
  {
    name: "Cloud & DevOps",
    slug: "cloud-devops",
    shortDescription:
      "Deployment, domains, monitoring, and long-term production maintenance you can rely on.",
    fullDescription:
      "We deploy and run the systems we build: infrastructure, CI/CD, monitoring, backups, and upgrades. You get one accountable team that handles operations instead of hand-off between vendors.",
    icon: "cloud",
    benefits: [
      "Reliable releases and rollbacks",
      "Monitoring and alerts",
      "One accountable operations team",
    ],
    features: ["CI/CD pipelines", "Cloud hosting", "Monitoring & alerts", "Backups", "Security patching"],
    technologies: ["Docker", "AWS", "Vercel", "PostgreSQL"],
    status: "PUBLISHED",
    sortOrder: 5,
    publishedAt: new Date("2026-01-01"),
  },
  {
    name: "Security",
    slug: "security",
    shortDescription:
      "Role-based access, secure sessions, data protection, and practical safeguards by default.",
    fullDescription:
      "Security is part of how we build, not an add-on. Role-based access, encrypted secrets, validated inputs, audit trails, and structured data protection are default practice on every system we deliver.",
    icon: "shield",
    benefits: [
      "Access control built into the product",
      "Sensitive data kept server-side",
      "Audit trails for important actions",
    ],
    features: ["RBAC & session security", "Input validation", "Secure uploads", "Audit logging"],
    technologies: ["TypeScript", "Node.js", "PostgreSQL"],
    status: "PUBLISHED",
    sortOrder: 6,
    publishedAt: new Date("2026-01-01"),
  },
  {
    name: "Digital marketing & branding",
    slug: "digital-marketing-branding",
    shortDescription:
      "Branding, content, and digital presence that match the product you actually built.",
    fullDescription:
      "A product is only as strong as the way it is presented. We help with branding, positioning, and digital presence so your site and communications describe your work the way your best clients would.",
    icon: "trending-up",
    benefits: [
      "Consistent brand language",
      "Clear positioning",
      "Measurable digital presence",
    ],
    features: ["Brand identity", "Copywriting", "SEO basics", "Social presence"],
    technologies: ["Design tools", "Analytics"],
    status: "PUBLISHED",
    sortOrder: 7,
    publishedAt: new Date("2026-01-01"),
  },
];

// ------------------------------------------------------------------
// Classes / courses (professional training catalog)
// ------------------------------------------------------------------

export const defaultCourses: Prisma.CourseUncheckedCreateInput[] = [
  {
    name: "Digital Marketing & Social Media",
    slug: "digital-marketing-social-media",
    category: "Digital Marketing",
    level: "Beginner to Intermediate",
    duration: "8 weeks · 2 sessions/week",
    mode: "Online + On-campus",
    shortDescription:
      "Plan and run real campaigns — SEO, social media, paid ads, email, and analytics — with measurable results from week one.",
    description:
      "This is a practical digital marketing program. You learn how to plan, launch, and optimize campaigns on Google, Meta, Instagram, and LinkedIn. The class is built around real accounts and live projects: keyword research, audience targeting, ad copy, landing pages, email flows, and reporting. By the end you leave with a portfolio campaign you designed, launched, and measured yourself.",
    syllabus: [
      "Digital marketing strategy & funnels",
      "Search engine optimization (SEO)",
      "Meta & Instagram paid advertising",
      "Google Ads & Google Analytics",
      "Content, email, and WhatsApp marketing",
      "Reporting, budgets, and growth plans",
    ],
    prerequisites: ["Basic computer skills", "No prior marketing experience required"],
    price: "NPR 35,000",
    status: "PUBLISHED",
    sortOrder: 1,
    publishedAt: new Date("2026-01-01"),
  },
  {
    name: "Professional Graphic Design",
    slug: "professional-graphic-design",
    category: "Graphic Design",
    level: "Beginner",
    duration: "10 weeks · 2 sessions/week",
    mode: "On-campus + Online",
    shortDescription:
      "Master the tools and principles behind polished brand, print, and digital design — and build a portfolio as you go.",
    description:
      "A project-driven design course covering visual hierarchy, color, and typography, plus hands-on work in Photoshop, Illustrator, and Figma. You design logos, social assets, posters, brochures, and simple UI layouts for real briefs. Every module ends with a critique and a portfolio piece.",
    syllabus: [
      "Design fundamentals: hierarchy, color, typography",
      "Photoshop: editing, retouching, compositing",
      "Illustrator: identity & vector artwork",
      "Figma: social templates and simple UI",
      "Branding: logos, style guides, and mockups",
      "Portfolio presentation & client briefs",
    ],
    prerequisites: ["Basic computer skills", "A laptop with design software access"],
    price: "NPR 40,000",
    status: "PUBLISHED",
    sortOrder: 2,
    publishedAt: new Date("2026-01-01"),
  },
  {
    name: "Full-Stack Web Development",
    slug: "full-stack-web-development",
    category: "Web Development",
    level: "Beginner to Intermediate",
    duration: "16 weeks · 3 sessions/week",
    mode: "Online + On-campus",
    shortDescription:
      "Go from HTML to a deployed web app — frontend, backend, database, and deployment — by building a real product.",
    description:
      "A complete web development track. You start with HTML, CSS, and JavaScript, then move to React for user interfaces and Node.js with PostgreSQL for the backend. You learn version control, API design, authentication, and deployment, and finish by shipping a working full-stack project to the web. Students also get a weekly code review with a working developer.",
    syllabus: [
      "HTML, CSS, and responsive layout",
      "JavaScript: logic, DOM, and fetch",
      "React: components, state, and routing",
      "Node.js APIs with PostgreSQL",
      "Authentication, security basics, and testing",
      "Deployment, git, and team workflow",
    ],
    prerequisites: ["Basic computer skills", "Comfort with typing and files"],
    price: "NPR 75,000",
    status: "PUBLISHED",
    sortOrder: 3,
    publishedAt: new Date("2026-01-01"),
  },
  {
    name: "IT & Digital Skills Essentials",
    slug: "it-digital-skills-essentials",
    category: "IT & Digital Skills",
    level: "Beginner",
    duration: "6 weeks · 2 sessions/week",
    mode: "On-campus + Online",
    shortDescription:
      "Get workplace-ready with computer essentials, cloud tools, cybersecurity hygiene, and modern AI productivity.",
    description:
      "For students, job-seekers, and professionals who want a solid digital base. The class covers file and folder discipline, email and calendar workflow, Google Workspace, cloud storage, computer security basics, and practical use of AI assistants for everyday work. Sessions are hands-on and end with a career-ready digital portfolio of your own setup.",
    syllabus: [
      "Computer, file, and backup fundamentals",
      "Email, calendar, and meeting workflow",
      "Google Workspace & cloud collaboration",
      "Cybersecurity hygiene: passwords, phishing, privacy",
      "AI assistants for productivity",
      "Building a tidy, secure digital workspace",
    ],
    prerequisites: ["No experience required"],
    price: "NPR 18,000",
    status: "PUBLISHED",
    sortOrder: 4,
    publishedAt: new Date("2026-01-01"),
  },
  {
    name: "Mobile App Development",
    slug: "mobile-app-development",
    category: "Web Development",
    level: "Intermediate",
    duration: "12 weeks · 3 sessions/week",
    mode: "Online + On-campus",
    shortDescription:
      "Build and publish real Android (and iOS-ready) apps with Flutter — from first screen to app store.",
    description:
      "A focused mobile development course using Flutter and Dart. You learn app architecture, state management, local storage, API integration, and publishing. The final weeks are spent shipping a personal app project with guidance on app store submission and growth. Ideal for developers who already know basic programming.",
    syllabus: [
      "Dart & Flutter fundamentals",
      "Layouts, widgets, and navigation",
      "State management and local data",
      "REST APIs and authentication",
      "Push notifications and offline mode",
      "App store publishing workflow",
    ],
    prerequisites: ["Basic programming knowledge", "A laptop (Android device helpful)"],
    price: "NPR 65,000",
    status: "PUBLISHED",
    sortOrder: 5,
    publishedAt: new Date("2026-01-01"),
  },
  {
    name: "Data & AI Tools for Work",
    slug: "data-ai-tools-for-work",
    category: "IT & Digital Skills",
    level: "Intermediate",
    duration: "8 weeks · 2 sessions/week",
    mode: "Online + On-campus",
    shortDescription:
      "Use spreadsheets, data, and AI tools to make faster decisions — no heavy math required.",
    description:
      "A practical course on working with data and AI at a professional level. You learn spreadsheet modeling, dashboards, and simple SQL, then apply AI tools for research, writing, analysis, and automation in everyday workflows. The course is built around real business problems and ends with your own AI-assisted workflow project.",
    syllabus: [
      "Spreadsheet modeling & formulas",
      "Dashboards and data visualization",
      "SQL basics for business data",
      "AI tools for research and writing",
      "Automating repetitive work with AI",
      "A practical AI workflow project",
    ],
    prerequisites: ["Basic computer skills", "Comfort with spreadsheets"],
    price: "NPR 30,000",
    status: "PUBLISHED",
    sortOrder: 6,
    publishedAt: new Date("2026-01-01"),
  },
];

// ------------------------------------------------------------------
// Products (from api.codastralabs.com/api/marketing-products/public)
// ------------------------------------------------------------------

const CLOUDINARY = "https://res.cloudinary.com/dgd8t6pts/image/upload/";

export const defaultProducts: Prisma.ProductUncheckedCreateInput[] = [
  {
    name: "BridgeLabs",
    slug: "bridgelabs",
    tagline: "The operating system for education consultancies.",
    shortDescription:
      "A full workspace for education consultancies to manage leads, students, classes, documents, visa workflows, invoices, staff roles, and student portals.",
    detailedDescription:
      "BridgeLabs is a full workspace for education consultancies: leads, students, classes, documents, visa workflows, invoices, staff roles, and student portals in one controlled system. Consultancy staff and students get their own portals, with subscription and invoice workflows built in.",
    features: [
      "Consultancy and staff portal",
      "Student PWA portal",
      "Subscription and invoice workflow",
    ],
    technology: "React, Node.js, Flutter, MongoDB, Docker, AWS",
    logo: `${CLOUDINARY}v1/crm-consultancy/marketing-products/1778676305156-s8yvb0-screenshot-from-2026-05-13-18-29-47?_a=BAMAOGkS0`,
    websiteUrl: "https://www.bridgeelabs.com/",
    ctaLabel: "Open Product Website",
    status: "PUBLISHED",
    sortOrder: 1,
    publishedAt: new Date("2026-01-01"),
  },
  {
    name: "AIC International Group Consultancy",
    slug: "aic-international-group-consultancy",
    tagline: "Trusted guidance for study, visa, and international opportunities",
    shortDescription:
      "AIC International Group supports students, families, and professionals with clear counseling, documentation guidance, and practical visa support from Kathmandu.",
    detailedDescription:
      "AIC International Group supports students, families, and professionals with clear counseling, documentation guidance, and practical visa support from Kathmandu. Study-abroad counseling, visa documentation, and application assistance are managed through one accountable workflow.",
    features: [
      "Study Abroad Counseling",
      "Visa Documentation Support",
      "Application Assistance",
    ],
    technology: "React, Node.js, MongoDB, Docker, AWS",
    logo: `${CLOUDINARY}v1/crm-consultancy/marketing-products/1778676131730-k5u7kw-screenshot-from-2026-05-13-18-26-46?_a=BAMAOGkS0`,
    websiteUrl: "https://www.aicintlgroup.com/",
    ctaLabel: "Open Product Website",
    status: "PUBLISHED",
    sortOrder: 2,
    publishedAt: new Date("2026-01-01"),
  },
  {
    name: "Sharpline Engineering And Construction",
    slug: "sharpline-engineering-and-construction",
    tagline: "Construction consultancy, interior and exterior design, renovation",
    shortDescription:
      "Construction consultancy, interior design, exterior design, renovation, and 3D design coordination managed through one accountable workflow from enquiry to final approval.",
    detailedDescription:
      "Sharpline handles construction consultancy, interior design, exterior design, renovation, and 3D design services. Every project moves through one accountable workflow — from the first enquiry to final approval.",
    features: [
      "Interior Design",
      "Exterior Design",
      "Construction Consultancy",
      "Renovation",
      "3D Design Services",
    ],
    technology: "React, Node.js, MongoDB, Docker, AWS",
    logo: `${CLOUDINARY}v1/crm-consultancy/marketing-products/1779388302307-2q1ion-screenshot-2026-05-22-001624?_a=BAMAOGkS0`,
    websiteUrl: "https://www.buildwithsharpline.com/",
    ctaLabel: "Open Product Website",
    status: "PUBLISHED",
    sortOrder: 3,
    publishedAt: new Date("2026-01-01"),
  },
  {
    name: "PlatterLabs",
    slug: "platterlabs",
    tagline: "Restaurant and cafe management with real service flow",
    shortDescription:
      "Run dine-in orders, waiter handoffs, kitchen tickets, recipe stock deductions, billing, subscriptions, staff permissions, and reports from one modern SaaS system.",
    detailedDescription:
      "PlatterLabs is restaurant and cafe management with real service flow: dine-in orders, waiter handoffs, kitchen tickets, recipe stock deductions, billing, subscriptions, staff permissions, and reports from one modern SaaS system.",
    features: [
      "Guest order",
      "POS invoice",
      "Stock update",
      "Sale recorded",
      "Reports ready",
    ],
    technology: "React, Node.js, MongoDB, Docker, AWS",
    logo: `${CLOUDINARY}v1/crm-consultancy/marketing-products/1778676246981-nm01sg-screenshot-from-2026-05-13-18-28-48?_a=BAMAOGkS0`,
    websiteUrl: "https://platterlabs.vercel.app/",
    ctaLabel: "Open Product Website",
    status: "PUBLISHED",
    sortOrder: 4,
    publishedAt: new Date("2026-01-01"),
  },
];

// ------------------------------------------------------------------
// Process steps (Understand → Support)
// ------------------------------------------------------------------

export const defaultProcessSteps: { title: string; description: string }[] = [
  {
    title: "Understand",
    description:
      "We start with the business problem, the people involved, and the workflow that has to work. No assumptions, no unnecessary features.",
  },
  {
    title: "Plan",
    description:
      "We turn the workflow into clear product scope: pages, roles, data, and release priorities that everyone can read.",
  },
  {
    title: "Design",
    description:
      "Designs are built around real screens and real tasks, with feedback loops that keep the direction obvious.",
  },
  {
    title: "Build",
    description:
      "We build in small working pieces, shipped continuously, so progress is visible from the first week.",
  },
  {
    title: "Test",
    description:
      "Every release passes practical checks: flows, roles, performance, and edge cases that affect real users.",
  },
  {
    title: "Launch",
    description:
      "Deployment, domains, and monitoring are handled by the same team that built the product.",
  },
  {
    title: "Support",
    description:
      "After launch we stay accountable — updates, support, and improvements as your operations grow.",
  },
];

export const defaultWhyItems = [
  {
    title: "Website enquiries route into one inbox.",
    description:
      "Support and sales requests stay visible inside the platform.",
  },
  {
    title: "Products ship with media and real links.",
    description:
      "Each product can point to its own domain, pricing path, or workspace.",
  },
  {
    title: "Small product surface, serious operational depth.",
    description:
      "Focused SaaS systems with clean workflows, strong access control, and reliable automation.",
  },
  {
    title: "Built and maintained from Nepal.",
    description:
      "One accountable team that owns the product after launch, not just the build.",
  },
];

export const defaultWhy = {
  eyebrow: "Why CodAstraLabs",
  title: "A parent company site that routes people to the right product.",
  description:
    "CodAstraLabs manages product websites, public enquiries, support paths, and workspace destinations from one ecosystem.",
  items: defaultWhyItems,
};

export const defaultHero = {
  eyebrow: "CodAstra Labs",
  title: "Digital Solutions. Creative Services. Professional Training.",
  description:
    "Helping businesses, organizations, and individuals grow through digital marketing, creative design, technology solutions, social media management, and practical professional training.",
  primaryCta: { label: "Explore Our Services", href: "#services" },
  secondaryCta: { label: "Explore Classes", href: "/classes" },
  image: "",
  stats: [] as { label: string; value: string }[],
};

export const defaultIntro = {
  eyebrow: "About CodAstraLabs",
  title: "A product studio behind live software.",
  description:
    "CodAstraLabs builds and operates focused SaaS products for businesses that need clean workflows, strong access control, and reliable automation. BridgeLabs is the proof point — clear portals, admin-controlled content, and role-aware workflows that hold up after launch.",
  points: [
    "Small product surface, serious operational depth.",
    "The company site exists to explain live products and keep support paths clean.",
    "Software built and maintained from Nepal.",
  ],
};

export const defaultProcessSection = {
  eyebrow: "How we work",
  title: "A clear process, easy to follow.",
  description:
    "From first call to long-term support, our process is designed to be understandable to non-technical readers.",
  steps: defaultProcessSteps,
};

export const defaultCTA = {
  eyebrow: "Support",
  title: "Talk to CodAstraLabs.",
  description:
    "Contact us for BridgeLabs onboarding, future products, partnerships, or custom product work.",
  primaryCta: { label: "Contact Us", href: "/contact" },
  secondaryCta: { label: "Email Support", href: "mailto:support.codastralabs@gmail.com" },
};

export const defaultFaqs: Prisma.FaqUncheckedCreateInput[] = [
  {
    question: "What kind of software does CodAstraLabs build?",
    answer:
      "We build practical business software with real operational depth: role-based portals, dashboards, approval workflows, internal systems, websites, mobile apps, and automation that connects the tools you already use.",
    category: "Services",
    sortOrder: 1,
    isVisible: true,
  },
  {
    question: "How do you decide what to build first?",
    answer:
      "It starts with the workflow that has to work. We map the people involved, the steps they repeat, and the data they depend on, then define a scope that everyone can read before we write code.",
    category: "Process",
    sortOrder: 2,
    isVisible: true,
  },
  {
    question: "Do you build products of your own, or only client work?",
    answer:
      "Both. We build and operate our own SaaS products — BridgeLabs is the flagship — and we take on custom product work for clients. Our own products are proof of how we build for everyone else.",
    category: "Company",
    sortOrder: 3,
    isVisible: true,
  },
  {
    question: "What happens after launch?",
    answer:
      "Deployment, domains, monitoring, backups, security patching, and updates are handled by the same team that built the product. One accountable team owns the result after launch, not just the build.",
    category: "Support",
    sortOrder: 4,
    isVisible: true,
  },
  {
    question: "How long does a typical project take?",
    answer:
      "It varies with scope, but we build in small working pieces shipped continuously, so you see progress from the first week. Simple sites can go live fast; complex portals are planned in phases.",
    category: "Process",
    sortOrder: 5,
    isVisible: true,
  },
  {
    question: "Do you take on projects from outside Nepal?",
    answer:
      "Yes. We work remotely with clients internationally and use tools that keep communication transparent — clear roadmaps, regular demos, and shared reporting on progress.",
    category: "Company",
    sortOrder: 6,
    isVisible: true,
  },
];

// Keep the public site free of invented people until the team is entered in CMS.
export const defaultTeamMembers: Prisma.TeamMemberUncheckedCreateInput[] = [];

// Testimonials are deliberately empty until verified client quotes are added.
export const defaultTestimonials: Prisma.TestimonialUncheckedCreateInput[] = [];

export const defaultProjects: Prisma.ProjectUncheckedCreateInput[] = [
  {
    name: "BridgeLabs",
    slug: "bridgelabs",
    client: "CodAstraLabs product",
    industry: "Education",
    projectType: "SaaS product",
    shortDescription:
      "A complete workspace for education consultancies — leads, students, classes, documents, visas, invoices, and portals in one system.",
    problem:
      "Education consultancies ran leads, students, documents, and billing across spreadsheets and chat. Staff had no single view, and students had no way to track their own applications.",
    solution:
      "We designed a role-based workspace with separate portals for consultancy staff and students. Subscription and invoice workflows are built in, and every important action leaves an audit trail.",
    outcome:
      "A full operating system for consultancies — one controlled system where enquiry, enrollment, visa work, and billing flow through a single accountable workflow.",
    coverImage:
      "https://res.cloudinary.com/dgd8t6pts/image/upload/v1/crm-consultancy/marketing-products/1778676305156-s8yvb0-screenshot-from-2026-05-13-18-29-47?_a=BAMAOGkS0",
    technology: [
      "React",
      "Node.js",
      "Flutter",
      "MongoDB",
      "Docker",
      "AWS",
    ],
    serviceProvided: "Product build, mobile app, cloud & DevOps",
    projectUrl: "https://www.bridgeelabs.com/",
    completionDate: new Date("2026-05-01"),
    featured: true,
    testimonials: [
      "Replaced the spreadsheets and chat we were running on. Leads, students, visas, and invoices now live in one system our whole team can see.",
    ],
    status: "PUBLISHED",
    publishedAt: new Date("2026-05-01"),
  },
  {
    name: "PlatterLabs",
    slug: "platterlabs",
    client: "CodAstraLabs product",
    industry: "Food & beverage",
    projectType: "SaaS product",
    shortDescription:
      "Restaurant and cafe management with real service flow — dine-in orders, kitchen tickets, recipe stock, billing, and reports.",
    problem:
      "Restaurants tracked orders on paper and reconciled stock in memory. Kitchen tickets went missing, and end-of-day reports took hours to piece together.",
    solution:
      "We built a modern POS flow: guest order capture, waiter handoff, kitchen tickets, automatic recipe-based stock deduction, billing, staff permissions, and reports — from one system.",
    outcome:
      "Service flow that matches how a restaurant actually runs — orders move to the kitchen, stock updates as dishes are served, and reports are ready without manual work.",
    coverImage:
      "https://res.cloudinary.com/dgd8t6pts/image/upload/v1/crm-consultancy/marketing-products/1778676246981-nm01sg-screenshot-from-2026-05-13-18-28-48?_a=BAMAOGkS0",
    technology: ["React", "Node.js", "MongoDB", "Docker", "AWS"],
    serviceProvided: "Product build, cloud & DevOps",
    projectUrl: "https://platterlabs.vercel.app/",
    completionDate: new Date("2026-05-01"),
    featured: true,
    testimonials: [
      "Dine-in orders, kitchen tickets, stock, and billing finally talk to each other. It matches how we actually run service.",
    ],
    status: "PUBLISHED",
    publishedAt: new Date("2026-05-01"),
  },
  {
    name: "AIC International Group Consultancy",
    slug: "aic-international-group-consultancy",
    client: "AIC International Group",
    industry: "Education consultancy",
    projectType: "Consultancy platform",
    shortDescription:
      "Study-abroad counseling, visa documentation, and application assistance managed through one accountable workflow.",
    problem:
      "A growing consultancy needed counseling requests and documentation follow-ups routed into one visible system so nothing slipped between staff.",
    solution:
      "We delivered a platform where enquiries move through counseling, documentation, and application stages with clear owners and status — plus a public site that routes visitors to it.",
    outcome:
      "Clear counseling, documentation guidance, and practical visa support — every enquiry tracked from first contact to application.",
    coverImage:
      "https://res.cloudinary.com/dgd8t6pts/image/upload/v1/crm-consultancy/marketing-products/1778676131730-k5u7kw-screenshot-from-2026-05-13-18-26-46?_a=BAMAOGkS0",
    technology: ["React", "Node.js", "MongoDB", "Docker", "AWS"],
    serviceProvided: "Web app, website, automation",
    projectUrl: "https://www.aicintlgroup.com/",
    completionDate: new Date("2026-04-01"),
    featured: false,
    status: "PUBLISHED",
    publishedAt: new Date("2026-04-01"),
  },
  {
    name: "Sharpline Engineering And Construction",
    slug: "sharpline-engineering-and-construction",
    client: "Sharpline Construction",
    industry: "Construction",
    projectType: "Website & workflow",
    shortDescription:
      "Construction consultancy, interior and exterior design, renovation, and 3D design coordinated from enquiry to approval.",
    problem:
      "Construction design requests — interiors, exteriors, renovation, 3D work — arrived through many channels and lacked a single review path.",
    solution:
      "We built a coordinated workflow where every enquiry moves from first contact to design and final approval, supported by a professional public website.",
    outcome:
      "One accountable pipeline for design work, with a public presence that presents the services consistently.",
    coverImage:
      "https://res.cloudinary.com/dgd8t6pts/image/upload/v1/crm-consultancy/marketing-products/1779388302307-2q1ion-screenshot-2026-05-22-001624?_a=BAMAOGkS0",
    technology: ["React", "Node.js", "MongoDB", "Docker", "AWS"],
    serviceProvided: "Website, web app, automation",
    projectUrl: "https://www.buildwithsharpline.com/",
    completionDate: new Date("2026-04-01"),
    featured: false,
    status: "PUBLISHED",
    publishedAt: new Date("2026-04-01"),
  },
];

export const defaultBlogCategories = [
  { name: "Engineering", slug: "engineering", sortOrder: 1 },
  { name: "Product", slug: "product", sortOrder: 2 },
  { name: "Operations", slug: "operations", sortOrder: 3 },
];

export const defaultBlogPosts: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  authorName?: string;
  categorySlug: string;
  tagNames: string[];
  publishedAt: Date;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}[] = [
  {
    title: "What 'operational depth' actually means in software",
    slug: "what-operational-depth-means",
    excerpt:
      "Dashboards are easy. Software that survives daily use by real staff is hard. A look at the difference between demos and operations.",
    content: `Every product demo looks good. The difference shows up in week two, when real staff use the tool on a busy Tuesday.

**Operational depth** is what happens when software is designed around the workflow that has to work — not around a feature list. It shows up in the small things: a follow-up that never falls between staff, a role that can see only what it needs, an action that leaves an audit trail.

**What it looks like in practice:**

- Role-based access that matches who actually does what
- Workflows that reflect the real steps, including the exceptions
- Data that is shared where it should be and protected where it must be
- Reporting that answers the questions you ask every week

> A spreadsheet can track anything, but it cannot enforce a workflow.

That is the core difference. Software with operational depth makes the right path the easy path. It is the difference between a demo that impresses and a system people rely on.

**How we build for it**

We start with the workflow first. Who is involved, what do they repeat, what data do they depend on? Only then do we define screens, roles, and releases. The result is software that fits how the operation actually runs.

That philosophy is why our own products — BridgeLabs among them — are built around roles, portals, and workflows rather than standalone features.`,
    authorName: "Arun Shrestha",
    categorySlug: "operations",
    tagNames: ["operations", "workflow"],
    publishedAt: new Date("2026-06-10"),
    featured: true,
    seoTitle: "What operational depth actually means in software",
    seoDescription:
      "Dashboards are easy. Software that survives daily use is hard. A look at the difference between demos and operations.",
  },
  {
    title: "Role-based access: the first decision most products get wrong",
    slug: "role-based-access-first-decision",
    excerpt:
      "Authentication is table stakes. The hard part is deciding who can see what, when, and why — before you write a single screen.",
    content: `Most software projects treat permissions as an afterthought: log in, and everyone is an admin until someone complains.

Role-based access control (RBAC) is not a security feature. It is a product decision. It defines what each person in the operation can see and do — and getting it wrong is the fastest way to build a system staff stop trusting.

**Start with the workflow, not the feature list**

Before writing auth code, answer these questions for each role:

- What does a typical day look like for this person?
- What do they need to see to do their job?
- What should they never be able to do by accident?
- What actions should leave a visible record?

**Keep it auditable**

Every important action should be traceable. Who changed what, when, and from which session. Audit trails turn "someone must have done it" into a searchable answer.

**Ship it in phases**

Permissions do not have to be perfect on day one. Ship the roles the workflow actually needs, then refine as people use the system. A small role model that is used is worth more than a comprehensive one that is ignored.`,
    authorName: "Rahul Karki",
    categorySlug: "engineering",
    tagNames: ["security", "rbac"],
    publishedAt: new Date("2026-05-22"),
    featured: false,
  },
  {
    title: "Why we keep our product surface small and the operations deep",
    slug: "small-surface-deep-operations",
    excerpt:
      "Focused SaaS systems with clean workflows win over sprawling tools with every feature imaginable. Here is why we design that way.",
    content: `It is tempting to add features. Every customer request sounds reasonable, and every competitor seems to have more.

We designed CodAstraLabs and our own products the opposite way: **small product surface, serious operational depth.**

**Small surface**

A short, understandable list of capabilities. Users can describe the product in one sentence without being wrong. Onboarding takes days, not months.

**Deep operations**

Under that small surface, the things that matter are done properly: reliable workflows, strong access control, automation that removes manual steps, and data protections that hold up in production.

> A tool you can describe in one sentence — and trust for years — beats a platform nobody fully understands.

**What this means for our clients**

When we scope a product, we ask what the operation actually needs and leave the rest out. The result costs less, launches faster, and is easier for staff to adopt.

If a feature does not survive contact with a real workflow, it does not belong in the product. That standard applies to our own products first.`,
    authorName: "Priya Maharjan",
    categorySlug: "product",
    tagNames: ["product", "scope"],
    publishedAt: new Date("2026-04-18"),
    featured: false,
  },
];

// Client logos are entered through the CMS after consent is confirmed.
export const defaultClients: Prisma.ClientUncheckedCreateInput[] = [];

export const defaultNav = [
  { label: "Home", url: "/", sortOrder: 1 },
  { label: "Services", url: "/services", sortOrder: 2 },
  { label: "Products", url: "/products", sortOrder: 3 },
  { label: "Classes", url: "/classes", sortOrder: 4 },
  { label: "Company", url: "/company", sortOrder: 5 },
  { label: "Work", url: "/work", sortOrder: 6 },
  { label: "Contact", url: "/contact", sortOrder: 7 },
];

export const defaultFooterLinks = {
  services: defaultServices.map((s) => ({ label: s.name, url: `/services/${s.slug}` })),
  company: [
    { label: "About us", url: "/company" },
    { label: "How we work", url: "/process" },
    { label: "Our work", url: "/work" },
    { label: "Classes", url: "/classes" },
  ],
  resources: [
    { label: "Insights", url: "/insights" },
    { label: "Privacy Policy", url: "/privacy" },
    { label: "Terms & Conditions", url: "/terms" },
    { label: "Cookie Policy", url: "/cookies" },
  ],
};

// ------------------------------------------------------------------
// Statically-known pages (legal + company + process)
// These are additionally seeded as Page records keeping content editable.
// ------------------------------------------------------------------

export interface DefaultPageContent {
  title: string;
  slug: string;
  description: string;
  sections: {
    sectionType: string;
    title?: string;
    content: Record<string, unknown>;
  }[];
}

export const defaultPages: DefaultPageContent[] = [
  {
    title: "Privacy Policy",
    slug: "privacy",
    description:
      "How CodAstra Labs collects, uses, stores, protects, shares, and deletes information.",
    sections: [
      {
        sectionType: "content",
        title: "Privacy Policy",
        content: {
          body: [
            "This Privacy Policy explains how CodAstraLabs collects, uses, stores, protects, shares, and deletes information through its website and products.",
            "**Information we collect** — We collect information you provide directly, such as your name, email address, phone number, and message when you contact us or register for our services.",
            "**How we use information** — We use the information to respond to enquiries, provide and improve our services, send updates you request, and meet legal obligations.",
            "**Data protection** — Sensitive data is kept server-side, access is role-based, and industry-standard safeguards are applied. We do not sell personal information.",
            "**Your rights** — You may request access, correction, or deletion of your personal information by contacting us at the support address below.",
            "_Please note: this document is a starting point. Have it reviewed by a qualified legal professional before relying on it._",
          ],
        },
      },
    ],
  },
  {
    title: "Terms & Conditions",
    slug: "terms",
    description: "The terms that govern use of CodAstra Labs websites and services.",
    sections: [
      {
        sectionType: "content",
        title: "Terms & Conditions",
        content: {
          body: [
            "These Terms and Conditions govern access to and use of websites and services operated by CodAstraLabs.",
            "**Services** — We provide software design, development, and operations services under written agreements scoped per project.",
            "**Website content** — Information on this website is provided for general purposes and may change without notice.",
            "**Acceptable use** — You agree not to misuse the website, attempt unauthorized access, or interfere with its operation.",
            "**Limitation of liability** — To the extent permitted by law, CodAstraLabs is not liable for indirect or consequential losses arising from use of this website.",
            "**Governing law** — These terms are intended to be governed by the laws applicable in Nepal.",
            "_Please note: this document is a starting point. Have it reviewed by a qualified legal professional before relying on it._",
          ],
        },
      },
    ],
  },
  {
    title: "Cookie Policy",
    slug: "cookies",
    description: "How CodAstra Labs uses cookies on its website.",
    sections: [
      {
        sectionType: "content",
        title: "Cookie Policy",
        content: {
          body: [
            "This Cookie Policy explains how CodAstraLabs uses cookies and similar technologies on its website.",
            "**What are cookies** — Cookies are small text files stored on your device that help the website remember preferences and understand how it is used.",
            "**Cookies we use** — We use essential cookies for security and core functionality, and optional analytics cookies (if enabled) to understand site performance.",
            "**Managing cookies** — You can control cookies through your browser settings. Disabling certain cookies may affect how the website works.",
            "**Contact** — For questions about cookies, contact us at our support address.",
            "_Please note: this document is a starting point. Have it reviewed by a qualified legal professional before relying on it._",
          ],
        },
      },
    ],
  },
];

export const defaultContact = {
  heading: "Talk to CodAstraLabs.",
  description:
    "Contact us for BridgeLabs onboarding, future products, partnerships, or custom product work.",
};

// ------------------------------------------------------------------
// Page sections for the homepage (default order + visibility)
// ------------------------------------------------------------------

export function defaultHomeSections(): {
  sectionType: string;
  title?: string;
  subtitle?: string;
  sortOrder: number;
  content: Record<string, unknown>;
}[] {
  return [
    { sectionType: "hero", sortOrder: 1, content: defaultHero as Record<string, unknown> },
    {
      sectionType: "clients",
      title: "Companies We Work With",
      subtitle: "Trusted by organizations.",
      sortOrder: 2,
      content: {
        eyebrow: "Our clients",
        title: "Companies We Work With",
        description:
          "Businesses and organizations trust CodAstra Labs for digital solutions, creative services, and professional support.",
      },
    },
    {
      sectionType: "intro",
      title: "About CodAstra Labs",
      subtitle: "Who we are and what we do.",
      sortOrder: 3,
      content: {
        eyebrow: "About us",
        title: "A practical partner for the work behind growth.",
        description:
          "We bring strategy, design, software, and training into one accountable team so your next step is clear and useful from day one.",
        image:
          "https://images.pexels.com/photos/16323454/pexels-photo-16323454.jpeg?auto=compress&cs=tinysrgb&w=1600",
        imageAlt:
          "Young professionals collaborating in a modern coworking space in Kathmandu, Nepal",
        points: [
          "One partner for marketing, design, technology, and training",
          "Practical work and professional classes — hands-on from day one",
          "Support from strategy and design through launch and beyond",
        ],
      },
    },
    {
      sectionType: "services",
      title: "Our services",
      subtitle: "What we do.",
      sortOrder: 4,
      content: {
        eyebrow: "What we do",
        title: "Everything your next release needs.",
        description:
          "Choose the right starting point, then keep the same team through strategy, design, build, launch, and support.",
      },
    },
    {
      sectionType: "products",
      title: "Products built for real operations",
      subtitle: "Tools we build and run.",
      sortOrder: 5,
      content: {
        eyebrow: "Our products",
        title: "Software that keeps the work moving.",
        description:
          "Focused systems for teams that need fewer hand-offs, clearer ownership, and reliable day-to-day operations.",
      },
    },
    {
      sectionType: "process",
      title: "How we work",
      subtitle: "A clear path from brief to launch.",
      sortOrder: 6,
      content: {
        eyebrow: "Our process",
        title: "Small steps, visible progress.",
        description:
          "We start with the real workflow, make the decisions visible, and ship in useful increments so you always know what happens next.",
      },
    },
    {
      sectionType: "classes",
      title: "Learn. Build. Grow.",
      subtitle: "Professional classes and training.",
      sortOrder: 7,
      content: {
        eyebrow: "Professional classes",
        title: "Learn. Build. Grow.",
        description:
          "Build practical, industry-relevant skills through professional classes and hands-on training designed for students, professionals, and aspiring digital creators.",
        image:
          "https://images.pexels.com/photos/33845767/pexels-photo-33845767.jpeg?auto=compress&cs=tinysrgb&w=1600",
        imageAlt:
          "Students studying in an MBA classroom at a university in Nepal",
        points: [
          "IT and digital skills",
          "Digital marketing",
          "Graphic design",
          "Web development",
        ],
        primaryCta: { label: "Explore Our Classes", href: "/classes" },
      },
    },
    {
      sectionType: "why",
      title: "Why CodAstra",
      subtitle: "Reasons to work with us.",
      sortOrder: 8,
      content: {
        eyebrow: "Why CodAstra Labs",
        title: "One partner for your digital growth.",
        description:
          "A single accountable team covering marketing, creative, technology, and training — so your digital presence stays consistent.",
        items: [
          {
            title: "One accountable team",
            description:
              "Marketing, design, software, and training handled under one roof with a single point of responsibility.",
          },
          {
            title: "Practical, hands-on work",
            description:
              "Deliverables and classes built around real projects, real platforms, and skills you can actually use.",
          },
          {
            title: "Growth that shows",
            description:
              "Clear reporting on campaigns, websites, and social media so you can see what is working.",
          },
          {
            title: "Built for the long term",
            description:
              "Professional training levels up your own team, so progress continues after the engagement ends.",
          },
        ],
      },
    },
    {
      sectionType: "projects",
      title: "Selected work",
      subtitle: "Projects we've shipped.",
      sortOrder: 9,
      content: {
        eyebrow: "Selected work",
        title: "From problem to deployed product.",
        description:
          "Software we've built and run for real operations — consultancies, restaurants, and service businesses.",
      },
    },
    {
      sectionType: "testimonials",
      title: "What clients say",
      subtitle: "In their words.",
      sortOrder: 10,
      content: {
        eyebrow: "In their words",
        title: "What teams say about working with us.",
        description:
          "Feedback from people who run the operations we've built software for.",
      },
    },
    {
      sectionType: "blog",
      title: "From the blog",
      subtitle: "Latest insights.",
      sortOrder: 11,
      content: {
        eyebrow: "From the blog",
        title: "Notes on building software that ships.",
        description:
          "Practical writing about operations software, product engineering, and dependable systems.",
      },
    },
    {
      sectionType: "cta",
      title: "Let's talk",
      subtitle: "Start a conversation.",
      sortOrder: 12,
      content: {
        eyebrow: "Ready when you are",
        title: "Let's build your digital growth.",
        description:
          "Tell us about your business, your goals, or the skills you and your team want to learn — the first conversation is free and practical.",
        primaryCta: { label: "Start a conversation", href: "/contact" },
        secondaryCta: { label: "Email Support", href: "mailto:support.codastralabs@gmail.com" },
      },
    },
  ];
}

export const defaultCompanySections = [
  { sectionType: "hero", sortOrder: 1, content: {
      eyebrow: "About CodAstra Labs",
      title: "A digital company that builds, designs, and teaches.",
      description: "For eight years we have helped businesses grow with digital marketing, striking creative work, dependable software, and practical professional training.",
      image: "https://images.pexels.com/photos/8128186/pexels-photo-8128186.jpeg?auto=compress&cs=tinysrgb&w=1600",
      imageAlt: "A professional working on a laptop in a modern office in Kathmandu, Nepal",
      primaryCta: { label: "Explore Our Services", href: "/services" },
      secondaryCta: { label: "Contact Us", href: "/contact" },
      stats: [] as { label: string; value: string }[],
    } },
  { sectionType: "intro", sortOrder: 2, content: {
      eyebrow: "About us",
      title: "One team for marketing, design, technology, and training.",
      description:
        "CodAstra Labs is a full-stack digital company. We plan, design, build, and teach — helping businesses grow through digital marketing, creative services, software solutions, and professional classes delivered with years of hands-on experience.",
      image: "https://images.pexels.com/photos/16323580/pexels-photo-16323580.jpeg?auto=compress&cs=tinysrgb&w=1600",
      imageAlt: "A developer building software at a desk with dual monitors in a modern workspace",
      points: [
        "Digital marketing & social media that build real reach",
        "Branding, design, web, and software under one roof",
        "IT solutions and professional training for teams and individuals",
      ],
    } as Record<string, unknown> },
  { sectionType: "journey", sortOrder: 3, content: {
      eyebrow: "The company journey",
      title: "From idea to operating product.",
      description:
        "The path CodAstraLabs took — from a product idea to software that runs real operations every day.",
      steps: [
        { label: "Idea", description: "A product that outgrows spreadsheets." },
        { label: "Founded", description: "CodAstraLabs is set up from Kathmandu." },
        { label: "Built", description: "Focused SaaS with real operational depth." },
        { label: "Projects", description: "Live portals, workflows, and automation." },
        { label: "Products", description: "BridgeLabs, PlatterLabs, and the products we run." },
        { label: "Growth", description: "One accountable team, continuously shipping." },
      ],
    } as Record<string, unknown> },
  { sectionType: "why", sortOrder: 4, content: {
      eyebrow: "Why CodAstra Labs",
      title: "A full-service digital partner with years of delivered work.",
      description:
        "From marketing and design to software and training, CodAstra Labs pairs every engagement with one accountable team — and every project with practical, ready-to-use results.",
      items: [
        {
          title: "Everything under one inbox",
          description:
            "Enquiries, support, and sales requests route into one channel, so nothing gets lost between marketing, design, or software teams.",
        },
        {
          title: "Deliverables with real links",
          description:
            "Campaigns, sites, and products ship with working URLs, live builds, and clear next steps — not mockups or hand-offs.",
        },
        {
          title: "Small surface, serious depth",
          description:
            "Focused engagements with clean workflows, strong access control, and reliable automation behind every deliverable.",
        },
        {
          title: "Built and maintained from Nepal",
          description:
            "One accountable team that owns the result after launch — not just the build. Experience you can measure.",
        },
      ],
    } as Record<string, unknown> },
  { sectionType: "team", title: "Meet the team", subtitle: "The people behind CodAstra Labs.", sortOrder: 5, content: {
      eyebrow: "Our team",
      title: "The people behind CodAstra Labs.",
      description:
        "Designers, marketers, developers, and trainers who plan, build, and teach digital work — together, from Nepal.",
    } },
  { sectionType: "cta", sortOrder: 6, content: {
      eyebrow: "Let's work together",
      title: "Ready to grow with a full-service partner?",
      description:
        "Tell us about your business, your brand, or the skills your team wants to learn. The first conversation is free and practical.",
      primaryCta: { label: "Start a conversation", href: "/contact" },
      secondaryCta: { label: "Email Support", href: "mailto:support.codastralabs@gmail.com" },
    } as Record<string, unknown> },
];

export const defaultProcessSections = [
  { sectionType: "hero", sortOrder: 1, content: {
      eyebrow: "Our process",
      title: "A clear, experienced path from brief to launch.",
      description: "Years of delivering digital projects have shaped a process that keeps clients informed and outcomes predictable — discover, design, build, launch, train.",
      image: "https://images.pexels.com/photos/16323455/pexels-photo-16323455.jpeg?auto=compress&cs=tinysrgb&w=1600",
      imageAlt: "A focused professional working on a laptop at a desk in a productive workspace",
      primaryCta: { label: "See what we do", href: "/services" },
      secondaryCta: { label: "Start a project", href: "/contact" },
      stats: [] as { label: string; value: string }[],
    } },
  { sectionType: "process", sortOrder: 2, content: defaultProcessSection as Record<string, unknown> },
  { sectionType: "cta", sortOrder: 3, content: defaultCTA as Record<string, unknown> },
];
