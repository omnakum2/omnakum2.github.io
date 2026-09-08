/**
 * Single source of PORTFOLIO CONTENT.
 * Site-level identity (name, email, url, socials) lives in `consts.ts`.
 * This file holds everything the sections render: hero, about, skills,
 * services, projects, contact, faqs.
 *
 * Icons are astro-icon ids:
 *   - brand/tech logos → `simple-icons:*`  (monochrome, tinted with `color`)
 *   - UI glyphs        → `tabler:*`
 */

import type { FaqItem } from "../types/seo";

/* ── Types ─────────────────────────────────────────────────────────── */

export interface TechLogo {
  name: string;
  /** simple-icons id, e.g. 'simple-icons:react'. */
  icon: string;
  /** Brand color for the icon. */
  color: string;
}

export interface Skill {
  name: string;
  icon: string;
  color: string;
}

export interface PrimarySkill {
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface EducationItem {
  level: string;
  fullForm: string;
  institution: string;
  year: string;
  type: string;
}

export interface ExperienceItem {
  position: string;
  company: string;
  joiningYear: string;
  type: string;
  description: string;
}

export interface ServiceItem {
  title: string;
  /** tabler icon id. */
  icon: string;
  description: string;
  features: string[];
}

export interface ProjectItem {
  name: string;
  description: string;
  techStack: string[];
  category: string;
  image: string;
  status?: string;
  features: string[];
  sourceCode?: string;
  liveDemo?: string;
}

/* ── Hero ──────────────────────────────────────────────────────────── */

export const hero = {
  /** Headline: a fixed lead + a rotating tail (sere-style). */
  headline: {
    lead: "I turn ideas into",
    tails: ["reliable products", "clean code", "simple solutions"],
  },
  tagline:
    "I build web applications that turn complex ideas into simple and reliable user experiences.",
  availability: "Available for work",
  stats: [
    { value: "2+", label: "Years experience" },
    { value: "7+", label: "Projects shipped" },
    { value: "2", label: "Industries explored" },
  ],
  /** Right-side action card content. */
  card: {
    eyebrow: "Start a conversation",
    heading: "What are you building?",
    body: "Building something new or improving an existing product? Send me the details. I'll get back to you within a day.",
    points: [
      "Based in India, available for remote work",
      "Focused on maintainable, high-performance systems",
      "From idea to production",
    ],
  },
};

/* ── About ─────────────────────────────────────────────────────────── */

export const about = {
  bio: "I enjoy turning ideas into reliable, scalable products and continuously improving my skills by building and learning new things. I build web applications with NestJS and React, focusing on clean architecture, performance, and giving users a seamless experience.",
  education: [
    {
      level: "BCA",
      fullForm: "Bachelor of Computer Applications",
      institution: "Saurashtra University, Rajkot",
      year: "2023",
      type: "undergraduate",
    },
    {
      level: "MCA",
      fullForm: "Master of Computer Applications",
      institution: "Gujarat Technological University, Ahmedabad",
      year: "2025",
      type: "postgraduate",
    },
  ],
  experience: [
    {
      position: "Full-Stack Developer",
      company: "Code Symphony LLP",
      joiningYear: "2024",
      type: "full-time",
      description:
        "Leading full-stack development projects, building scalable web applications, and mentoring junior developers.",
    },
  ] as ExperienceItem[],
};

/* ── Skills ────────────────────────────────────────────────────────── */

export const skills = {
  primary: {
    name: "Nest.js",
    description: "Backend API Development",
    icon: "simple-icons:nestjs",
    color: "#E0234E",
    focus: ["APIs", "System Design"]
  } as PrimarySkill,
  secondary: [
    { name: "React.js", icon: "simple-icons:react", color: "#61DAFB" },
    { name: "MySQL", icon: "simple-icons:mysql", color: "#4479A1" },
    { name: "TypeScript", icon: "simple-icons:typescript", color: "#3178C6" },
  ] as Skill[],
  /** "Additional technologies" — rendered as the marquee. */
  techStack: [
    { name: "Express.js", icon: "simple-icons:express", color: "#fff" },
    { name: "TypeORM", icon: "simple-icons:typeorm", color: "#FE0803" },
    { name: "PostgreSQL", icon: "simple-icons:postgresql", color: "#336791" },
    { name: "Swagger", icon: "simple-icons:swagger", color: "#85EA2D" },
    {
      name: "Tailwind CSS",
      icon: "simple-icons:tailwindcss",
      color: "#06B6D4",
    },
    { name: "Bootstrap", icon: "simple-icons:bootstrap", color: "#7952B3" },
    { name: "Astro", icon: "simple-icons:astro", color: "#FF5D01" },
    { name: "MUI", icon: "simple-icons:mui", color: "#007FFF" },
    { name: "PHP", icon: "simple-icons:php", color: "#777BB4" },
    { name: "Laravel", icon: "simple-icons:laravel", color: "#FF2D20" },
  ] as TechLogo[],
  tools: [
    { name: "Claude", icon: "simple-icons:claude", color: "#D97757" },
    // { name: 'lovable', icon: 'bx:heart-filled', color: '#FF4F8B' },
    { name: "AWS", icon: "simple-icons:amazonwebservices", color: "#FF9900" },
    { name: "Render", icon: "simple-icons:render", color: "#46E3B7" },
    { name: "Git", icon: "simple-icons:git", color: "#F05032" },
    { name: "GitHub", icon: "simple-icons:github", color: "#fff" },
    {
      name: "VS Code",
      icon: "simple-icons:visualstudiocode",
      color: "#007ACC",
    },
    { name: "Postman", icon: "simple-icons:postman", color: "#FF6C37" },
    { name: "Trello", icon: "simple-icons:trello", color: "#0052CC" },
    { name: "Vercel", icon: "simple-icons:vercel", color: "#fff" },
  ] as TechLogo[],
};

/* ── Services (3 cards — react's 2 + App Development) ───────────────── */

export const services: ServiceItem[] = [
  {
    title: "Web Design",
    icon: "tabler:palette",
    description:
      "Modern, responsive websites tailored for usability and aesthetics.",
    features: [
      "Website Design",
      "Web Application Design",
      "Modern Responsive UI/UX",
      "SEO & Performance Optimization",
    ],
  },
  {
    title: "Tech Consultancy",
    icon: "tabler:bulb",
    description:
      "Strategic advice for digital transformation and scalable solutions.",
    features: [
      "Technical Architecture",
      "Technology Selection",
      "Performance Optimization",
      "Scalability Planning",
    ],
  },
  {
    title: "App Development",
    icon: "tabler:device-mobile",
    description:
      "Cross-platform mobile and web apps built for scale and smooth UX.",
    features: [
      "Cross-Platform Builds",
      "API Integration",
      "Offline Support",
      "App Store Deployment",
    ],
  },
];

/* ── Projects (2 per tab, per the carousel tweak) ──────────────────── */

export const projects: { academic: ProjectItem[]; company: ProjectItem[] } = {
  academic: [
    {
      name: "Resto",
      description:
        "Node.js + React.js restaurant menu app with admin panel and QR code integration.",
      techStack: ["Node.js", "React.js", "MySQL"],
      category: "Restaurant",
      image: "/project-resto.webp",
      features: [
        "Digital menu QR code",
        "Order management",
        "Admin dashboard",
        "Real-time updates",
      ],
      sourceCode: "https://github.com/omnakum2/Resto",
      liveDemo: "https://resto-frontend-cc24.onrender.com",
    },
    {
      name: "Inventory + POS Web",
      description:
        "Laravel + Bootstrap web POS with user, product, category masters and billing management.",
      techStack: ["Laravel", "Bootstrap", "MySQL"],
      category: "Enterprise",
      image: "/project-pos.webp",
      features: [
        "User Management",
        "Product + Category Management",
        "Billing System",
        "Inventory Tracking",
      ],
      sourceCode: "https://github.com/omnakum2/Inventory",
      liveDemo: "https://inventory-5g9v.onrender.com/",
    },
    {
      name: "Bid Club",
      description:
        "React.js + Node.js WebSocket multiplayer prediction card game with four modes and chat.",
      techStack: ["React.js", "Node.js", "WebSocket", "TypeScript"],
      category: "Games",
      image: "/project-bidclub.webp",
      features: [
        "Real-time multiplayer game",
        "Four different game modes",
        "Live scoreboard & turn timers",
        "Quick chat & invite links",
      ],
      sourceCode: "https://github.com/omnakum2/time-pass",
      liveDemo: "https://bidclub.onrender.com",
    },
  ],
  company: [
    {
      name: "ERP Solutions for Brass Industry",
      description: "React.js + Nest.js ERP with PO, quotation, and HR modules, featuring ESSL biometric webhook integration.",
      techStack: ["React.js", "Nest.js", "MySQL", "TypeScript", "AWS"],
      category: "Enterprise",
      image: "/project-erp.webp",
      status: "Live",
      features: [
        "Quotation System",
        "HR Management",
        "Purchase Orders",
        "Real-time Attendance Tracking",
      ],
    },
    {
      name: "Managed IT & Cybersecurity Website",
      description: "High-performance, search-optimized website for a managed IT services business.",
      techStack: ["Astro", "MDX", "TypeScript", "React"],
      category: "Business / IT Services",
      image: "/project-it-services.webp",
      status: "Live",
      features: [
        "Managed IT Services",
        "Remote IT Support",
        "Cybersecurity Solutions",
        "Service & Pricing Pages",
      ],
    },
  ],
};

/* ── Contact ───────────────────────────────────────────────────────── */

export const contact = {
  /** Left card — "what we'll discuss on the call". */
  discussPoints: [
    "Your goals and the problem we're solving",
    "Scope, timeline, and rough budget",
    "The right tech approach for your project",
    "Clear next steps and how we would work together",
    "Any questions you have for me",
  ],
  /** Step-1 subject select options. */
  subjects: [
    "Web Design",
    "Web Application Development",
    "App Development",
    "Tech Consultancy",
    "Other",
  ],
  /** Step-2 "book a call" content. */
  call: {
    duration: "30 min",
    platform: "Google Meet",
    note: "Free intro call",
    agenda: [
      "Your goals & the problem to solve",
      "Scope, timeline & rough budget",
      "Tech approach & next steps",
    ],
    bookingUrl: "https://calendar.app.google/fJ7EmMKUDk1wYWrx6",
  },
  availability:
    "I'm currently available for new projects and consulting opportunities. Let's discuss how I can help you achieve your goals.",
};

/* ── FAQ ───────────────────────────────────────────────────────────── */

export const faqs: FaqItem[] = [
  {
    question: "What kind of work are you open to?",
    answer:
      "I'm open to full-time engineering roles and select freelance projects. I particularly enjoy building products from scratch, designing APIs, and solving performance problems.",
  },
  {
    question: "What's your preferred tech stack?",
    answer:
      "I'm most productive with TypeScript, NestJS, and React.js. I'm also comfortable stepping outside that stack when the project calls for it.",
  },
  {
    question: "Do you work with remote teams?",
    answer:
      "Yes. I'm comfortable working across time zones and can set aside overlap hours for pairing, discussions, and team meetings.",
  },
  {
    question: "How quickly can you start a new project?",
    answer:
      "For freelance or contract work, I'm typically available within 1–2 weeks. For full-time roles, my standard notice period applies. Send me the scope and target date, and we can work out a realistic timeline.",
  },
  {
    question: "Can I see your code?",
    answer:
      "Yes. Most of my personal and open-source work is on GitHub. For proprietary projects, I can walk you through the architecture, trade-offs, and results without sharing confidential code.",
  },
];
