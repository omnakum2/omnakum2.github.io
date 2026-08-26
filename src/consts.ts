export const SITE = {
  name: 'Om Nakum',
  tagline: 'Full-Stack Developer',
  email: 'omnakum2@gmail.com',
  url: 'https://omnakum2.github.io',
  bio: 'Full-Stack Developer with 1+ years of experience building web applications and scalable systems. I enjoy creating fast, reliable, and easy-to-use products from idea to deployment.',
  social: {
    github: 'https://github.com/omnakum2',
    linkedin: 'https://www.linkedin.com/in/om-nakum-959109299'
  },
} as const;

export const DEFAULT_OG_IMAGE = '/og-image.webp';
export const SITE_TITLE_SUFFIX = ` | ${SITE.name}`;


// TODO(next-deploy): replace with your deployed gateway values.
export const CONTACT_GATEWAY = {
  url: 'http://localhost:3000',
  publicKey: 'aea5c744ab2adf20a9717bc022d500a1928b1309085c8dfeedc4a51eb36eeaa2',
} as const;
