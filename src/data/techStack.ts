/**
 * Skills / tech stack — drives TechStackMarquee.
 * Icons come from the already-installed @iconify-json/lucide set (monochrome,
 * filled with currentColor). The tile sets `color: var(--brand)` per item so
 * the grayscale-default → brand-color-on-hover interaction works.
 */
export interface TechLogo {
  name: string;
  /** Iconify Lucide icon id, e.g. 'lucide:atom'. */
  icon: string;
  /** Brand color revealed on hover (used as currentColor). */
  color: string;
}

export const techStack: TechLogo[] = [
  { name: 'TypeScript', icon: 'lucide:braces',         color: '#3178C6' },
  { name: 'React',      icon: 'lucide:atom',           color: '#61DAFB' },
  { name: 'Next.js',    icon: 'lucide:triangle',       color: '#FFFFFF' },
  { name: 'Astro',      icon: 'lucide:rocket',         color: '#FF5D01' },
  { name: 'Tailwind',   icon: 'lucide:wind',           color: '#06B6D4' },
  { name: 'Node.js',    icon: 'lucide:hexagon',        color: '#5FA04E' },
  { name: 'PostgreSQL', icon: 'lucide:database',       color: '#4169E1' },
  { name: 'GraphQL',    icon: 'lucide:network',        color: '#E10098' },
  { name: 'Python',     icon: 'lucide:code-2',         color: '#3776AB' },
  { name: 'Figma',      icon: 'lucide:figma',          color: '#F24E1E' },
  { name: 'Framer',     icon: 'lucide:wand-2',         color: '#0055FF' },
  { name: 'Git',        icon: 'lucide:git-branch',     color: '#F05032' },
  { name: 'Docker',     icon: 'lucide:container',      color: '#2496ED' },
  { name: 'AWS',        icon: 'lucide:cloud',          color: '#FF9900' },
];
