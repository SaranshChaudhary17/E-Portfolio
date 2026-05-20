import { Activity, Bath, Bot, Dumbbell, FileText, Languages, Zap } from "lucide-react";

export type Project = {
  slug: string;
  title: string;
  category: string;
  repository: string;
  tagline: string;
  summary: string;
  year: string;
  duration: string;
  icon: typeof Activity;
  accent: "orange" | "blue" | "linen";
  tech: string[];
  features: string[];
  challenges: { challenge: string; solution: string }[];
  process: string[];
  metrics: { label: string; value: string }[];
};

export const projects: Project[] = [
  {
    slug: "sarvanash",
    title: "Sarvanash Comic Site",
    category: "Comic universe",
    repository: "sarvanash",
    tagline: "A dramatic web experience for a dark visual story world.",
    summary: "A cinematic comic destination with chapter browsing, art-forward panels, atmospheric UI, and a reading experience tuned for mood and momentum.",
    year: "2026",
    duration: "5 weeks",
    icon: Zap,
    accent: "orange",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Cloudinary"],
    features: ["Chapter-first reading flow", "Animated poster grid", "Responsive comic panels", "Character archive", "Editorial story pages"],
    challenges: [
      { challenge: "Large visual assets can overwhelm mobile loading.", solution: "Used progressive image strategy, lazy grids, and compact previews." },
      { challenge: "Comic pages need drama without hurting readability.", solution: "Separated atmosphere from content with controlled contrast and spacing." }
    ],
    process: ["Defined the visual bible", "Built reusable media cards", "Added reading route transitions", "Optimized art delivery"],
    metrics: [{ label: "Chapters", value: "12+" }, { label: "Panels", value: "80+" }, { label: "Load focus", value: "Fast" }]
  },
  {
    slug: "ovid-bathware",
    title: "Ovid Bathware",
    category: "Brand website",
    repository: "Ovid-Bathware",
    tagline: "A refined product site for a premium bathware identity.",
    summary: "A luxurious catalog and brand experience with product sections, polished UI hierarchy, and conversion-oriented contact surfaces.",
    year: "2025",
    duration: "4 weeks",
    icon: Bath,
    accent: "linen",
    tech: ["React", "Tailwind CSS", "GSAP", "Framer Motion"],
    features: ["Product category system", "Premium catalog cards", "Dealer contact flow", "Brand storytelling", "Responsive showroom layout"],
    challenges: [
      { challenge: "Product pages need trust and speed.", solution: "Created a clear hierarchy with lightweight animation and accessible CTAs." },
      { challenge: "Luxury visuals can become too decorative.", solution: "Kept the layout quiet and let product information lead." }
    ],
    process: ["Mapped catalog structure", "Created visual language", "Built reusable product blocks", "Polished mobile flows"],
    metrics: [{ label: "Categories", value: "7" }, { label: "Pages", value: "15+" }, { label: "Focus", value: "Sales" }]
  },
  {
    slug: "invoice-generator",
    title: "Invoice Generator",
    category: "Productivity tool",
    repository: "invoice",
    tagline: "A fast, clean document workflow for invoices and records.",
    summary: "A practical generator for structured invoices with polished forms, totals, printable layouts, and a frictionless user experience.",
    year: "2025",
    duration: "3 weeks",
    icon: FileText,
    accent: "blue",
    tech: ["Next.js", "TypeScript", "React Hook Form", "Tailwind CSS"],
    features: ["Dynamic line items", "Tax and total calculations", "Print-ready templates", "Client records", "Export workflow"],
    challenges: [
      { challenge: "Invoice math must stay reliable.", solution: "Centralized calculation logic and reflected totals in every state." },
      { challenge: "Forms can feel dense.", solution: "Grouped inputs into clear panels and reduced visual noise." }
    ],
    process: ["Designed form model", "Built calculation helpers", "Created print template", "Validated responsive layout"],
    metrics: [{ label: "Forms", value: "8" }, { label: "Exports", value: "PDF" }, { label: "Accuracy", value: "100%" }]
  },
  {
    slug: "ai-phishing-detection",
    title: "AI Powered Phishing Detection",
    category: "Security AI",
    repository: "Ai-Powered-Phishing-Detection",
    tagline: "A security interface for identifying suspicious links and messages.",
    summary: "An AI-assisted detection project that classifies phishing signals and presents risk, explanation, and guidance in a usable dashboard.",
    year: "2025",
    duration: "6 weeks",
    icon: Bot,
    accent: "orange",
    tech: ["Python", "Machine Learning", "React", "FastAPI", "Tailwind CSS"],
    features: ["URL risk scoring", "Message analysis", "Signal explanations", "Detection dashboard", "Result history"],
    challenges: [
      { challenge: "Security results need confidence and clarity.", solution: "Used explainable result cards instead of only a score." },
      { challenge: "AI UI can feel opaque.", solution: "Added visible signal breakdowns and plain-language summaries." }
    ],
    process: ["Prepared phishing dataset", "Trained classifier", "Built API surface", "Designed risk dashboard"],
    metrics: [{ label: "Signals", value: "20+" }, { label: "Model", value: "ML" }, { label: "Risk UI", value: "Live" }]
  },
  {
    slug: "gym-web",
    title: "Gym Web",
    category: "Fitness website",
    repository: "Gym-Web",
    tagline: "A high-energy but premium fitness web experience.",
    summary: "A responsive gym website focused on programs, trainer credibility, membership flow, and a crisp conversion path.",
    year: "2024",
    duration: "2 weeks",
    icon: Dumbbell,
    accent: "blue",
    tech: ["HTML", "CSS", "JavaScript", "GSAP"],
    features: ["Program sections", "Trainer cards", "Membership CTAs", "Class schedule", "Mobile-first navigation"],
    challenges: [
      { challenge: "Fitness sites often get visually loud.", solution: "Balanced energy with clean spacing and strong typography." },
      { challenge: "Mobile conversion needed priority.", solution: "Kept program and contact actions reachable throughout the flow." }
    ],
    process: ["Built landing structure", "Added motion accents", "Tuned mobile spacing", "Polished call-to-actions"],
    metrics: [{ label: "Sections", value: "9" }, { label: "CTAs", value: "4" }, { label: "Speed", value: "Light" }]
  },
  {
    slug: "electricity-billing-system",
    title: "Electricity Billing System",
    category: "Desktop system",
    repository: "Electricity-Billing-System",
    tagline: "A structured billing workflow for customers, usage, and payments.",
    summary: "A utility billing system covering customer records, meter readings, bill generation, and payment-oriented administration.",
    year: "2024",
    duration: "4 weeks",
    icon: Activity,
    accent: "linen",
    tech: ["Java", "MySQL", "Swing", "JDBC"],
    features: ["Customer management", "Meter reading records", "Bill calculation", "Payment status", "Admin dashboard"],
    challenges: [
      { challenge: "Administrative flows require predictable state.", solution: "Separated record management from billing actions." },
      { challenge: "Desktop UI can become crowded.", solution: "Grouped tasks into focused screens and consistent actions." }
    ],
    process: ["Modeled database", "Built billing logic", "Connected UI screens", "Tested record workflows"],
    metrics: [{ label: "Tables", value: "6" }, { label: "Modules", value: "5" }, { label: "Stack", value: "Java" }]
  },
  {
    slug: "t2t-indian-languages",
    title: "T2T Indian Languages",
    category: "Language technology",
    repository: "T2T-indian-Languages",
    tagline: "A translation-focused tool for Indian language accessibility.",
    summary: "A text-to-text translation interface designed to make multilingual conversion more approachable across Indian language contexts.",
    year: "2024",
    duration: "5 weeks",
    icon: Languages,
    accent: "orange",
    tech: ["Python", "NLP", "React", "API", "Tailwind CSS"],
    features: ["Language selection", "Translation panel", "History states", "Accessible text UI", "Copy and export actions"],
    challenges: [
      { challenge: "Language tooling needs careful UX.", solution: "Designed a clean split-panel flow with clear source and target states." },
      { challenge: "Results need fast iteration.", solution: "Kept actions close to output and supported quick copy flows." }
    ],
    process: ["Mapped language flow", "Built translation surface", "Added history states", "Refined accessibility"],
    metrics: [{ label: "Languages", value: "8+" }, { label: "Mode", value: "T2T" }, { label: "UX", value: "Clear" }]
  }
];

export const featuredProjects = projects.slice(0, 4);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
