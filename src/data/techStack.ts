/**
 * Skills / tech stack — drives TechStackMarquee.
 * Icons come from the already-installed @iconify-json/simple-icons set (monochrome,
 * filled with currentColor). The tile sets `color: var(--brand)` per item so
 * the grayscale-default → brand-color-on-hover interaction works.
 */
export interface TechLogo {
  name: string;
  /** Iconify simple-icons icon id, e.g. 'simple-icons:atom'. */
  icon: string;
  /** Brand color revealed on hover (used as currentColor). */
  color: string;
}

export const techStack: TechLogo[] = [
 { name: 'TypeScript', icon: 'simple-icons:typescript', color: '#3178C6' },
  { name: 'React', icon: 'simple-icons:react', color: '#61DAFB' },
  { name: 'Next.js', icon: 'simple-icons:nextdotjs', color: '#FFFFFF' },
  { name: 'Astro', icon: 'simple-icons:astro', color: '#FF5D01' },
  { name: 'Tailwind CSS', icon: 'simple-icons:tailwindcss', color: '#06B6D4' },
  { name: 'Node.js', icon: 'simple-icons:nodedotjs', color: '#5FA04E' },
  { name: 'PostgreSQL', icon: 'simple-icons:postgresql', color: '#4169E1' },
  { name: 'GraphQL', icon: 'simple-icons:graphql', color: '#E10098' },
  { name: 'Python', icon: 'simple-icons:python', color: '#3776AB' },
  { name: 'Figma', icon: 'simple-icons:figma', color: '#F24E1E' },
  { name: 'Framer', icon: 'simple-icons:framer', color: '#0055FF' },
  { name: 'Git', icon: 'simple-icons:git', color: '#F05032' },
  { name: 'Docker', icon: 'simple-icons:docker', color: '#2496ED' },
  { name: 'AWS', icon: 'simple-icons:amazonwebservices', color: '#FF9900' },
];
