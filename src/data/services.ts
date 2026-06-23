export interface Service {
  title: string;
  /** simple-icons icon id, e.g. 'simple-icons:layout'. */
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
    icon: 'simple-icons:astro',
    description: 'UX flows and pixel-tight UI ready for build.',
    tags: ['UX Research', 'UI Design', 'Prototyping', 'Design QA'],
  },
  {
    title: 'Frontend Engineering',
    icon: 'simple-icons:astro',
    description: 'Astro and React builds that ship fast and stay accessible.',
    tags: ['React & Astro', 'Responsive UI', 'Performance', 'A11y'],
  },
  {
    title: 'Design Systems',
    icon: 'simple-icons:astro',
    description: 'Tokens, components, and docs teams actually adopt.',
    tags: ['Design Tokens', 'Component Library', 'Documentation', 'Governance'],
  },
  {
    title: 'Tech Consultancy',
    icon: 'simple-icons:rocket',
    description: 'Stack reviews and zero-to-one MVP planning for founders.',
    tags: ['Architecture', 'MVP Strategy', 'SEO', 'Scalability'],
  },
];
