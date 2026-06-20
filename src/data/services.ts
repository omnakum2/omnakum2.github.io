export interface Service {
  title: string;
  /** Lucide icon id, e.g. 'lucide:layout'. */
  icon: string;
  /** Single-line summary. */
  description: string;
  /**
   * Short keyword items. Render as compact chips in compact/linear variants,
   * as checkmark bullets under "What's Included" in the feature variant.
   */
  tags: string[];
}

export const services: Service[] = [
  {
    title: 'Product Design',
    icon: 'lucide:layout',
    description: 'UX flows and pixel-tight UI ready for build.',
    tags: ['UX Research', 'UI Design', 'Prototyping', 'Design QA'],
  },
  {
    title: 'Frontend Engineering',
    icon: 'lucide:code',
    description: 'Astro and React builds that ship fast and stay accessible.',
    tags: ['React & Astro', 'Responsive UI', 'Performance', 'A11y'],
  },
  {
    title: 'Design Systems',
    icon: 'lucide:layers',
    description: 'Tokens, components, and docs teams actually adopt.',
    tags: ['Design Tokens', 'Component Library', 'Documentation', 'Governance'],
  },
  {
    title: 'Tech Consultancy',
    icon: 'lucide:rocket',
    description: 'Stack reviews and zero-to-one MVP planning for founders.',
    tags: ['Architecture', 'MVP Strategy', 'SEO', 'Scalability'],
  },
];
