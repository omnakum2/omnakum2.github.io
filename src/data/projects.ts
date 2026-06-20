export interface Project {
  title: string;
  /** Single-line summary. */
  description: string;
  /** Lucide icon id, e.g. 'lucide:cloud'. */
  icon: string;
  /**
   * Outcome bullets — render as the checkmark list in the `feature` Card variant.
   * Keep tight (3–4 entries, each ~3–5 words).
   */
  highlights: string[];
  /**
   * Short tech keyword chips — render as inline chips in the `linear` Card variant.
   */
  tech: string[];
  /** External link or anchor target. Demo URLs are fine. */
  href: string;
}

export const projects: Project[] = [
  {
    title: 'CloudSync Dashboard',
    description: 'Real-time cloud infrastructure monitoring for ops teams.',
    icon: 'lucide:cloud',
    highlights: [
      '40% faster incident response',
      '5k+ engineers onboarded',
      '99.99% uptime SLA',
      'SSO + role-based access',
    ],
    tech: ['React', 'TypeScript', 'WebSocket'],
    href: 'https://example.com/work/cloudsync',
  },
  {
    title: 'FinTrack API',
    description: 'RESTful API for personal finance with automated categorisation.',
    icon: 'lucide:bar-chart-3',
    highlights: [
      '50k+ active users',
      '12 payment providers integrated',
      'SOC 2 Type II certified',
      'P95 latency under 80ms',
    ],
    tech: ['Node.js', 'PostgreSQL', 'Redis'],
    href: 'https://example.com/work/fintrack',
  },
  {
    title: 'ShopEase Mobile',
    description: 'Offline-first e-commerce PWA with one-tap checkout.',
    icon: 'lucide:shopping-cart',
    highlights: [
      '3× faster checkout flow',
      '1M+ orders processed',
      'Offline cart support',
      'Push-driven re-engagement',
    ],
    tech: ['React', 'PWA', 'Stripe'],
    href: 'https://example.com/work/shopease',
  },
  {
    title: 'TaskFlow',
    description: 'Kanban project management with realtime team sync.',
    icon: 'lucide:layout-dashboard',
    highlights: [
      '10k+ teams active',
      'Drag-and-drop UX',
    ],
    tech: ['Next.js', 'Prisma', 'tRPC'],
    href: 'https://example.com/work/taskflow',
  },
  {
    title: 'DevBlog Engine',
    description: 'Astro + MDX blog engine optimised for SEO and Core Web Vitals.',
    icon: 'lucide:pen-tool',
    highlights: [
      '1M+ monthly views',
      'Perfect Lighthouse scores',
    ],
    tech: ['Astro', 'MDX', 'Tailwind'],
    href: 'https://example.com/work/devblog',
  },
  {
    title: 'CLI Toolkit',
    description: 'Developer productivity CLI for scaffolding and codegen.',
    icon: 'lucide:terminal',
    highlights: [
      '500+ daily developers',
      '200k npm installs',
    ],
    tech: ['Python', 'Click', 'Docker'],
    href: 'https://example.com/work/cli-toolkit',
  },
];
