// TODO: update domain logic post-deployment
export const SITE = {
  name: 'Om Nakum',
  tagline: 'Full-Stack Developer',
  email: 'omnakum2@gmail.com',
  // TODO: replace with actual domain after deployment
  url: 'https://example.com',
  // TODO: replace with absolute URL to .webp after deployment
  logo: '/favicon.ico',
  bio: 'Full-Stack Developer with 1+ years of experience building web applications and scalable systems. I enjoy creating fast, reliable, and easy-to-use products from idea to deployment.',
  social: {
    github: 'https://github.com/omnakum2',
    linkedin: 'https://www.linkedin.com/in/om-nakum-959109299'
  },
} as const;

export const DEFAULT_OG_IMAGE = '/og-image.webp';
export const SITE_TITLE_SUFFIX = ` | ${SITE.name}`;
