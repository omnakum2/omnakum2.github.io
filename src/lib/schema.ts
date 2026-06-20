import { SITE } from '../consts';

export function buildWebSiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
  };
}

interface PersonOptions {
  jobTitle: string;
  image?: string;
  knowsAbout?: string[];
  sameAs?: string[];
  alumniOf?: string;
}

export function buildPersonLd(opts: PersonOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.name,
    url: SITE.url,
    jobTitle: opts.jobTitle,
    ...(opts.image && { image: new URL(opts.image, SITE.url).toString() }),
    ...(opts.knowsAbout && { knowsAbout: opts.knowsAbout }),
    ...(opts.sameAs && { sameAs: opts.sameAs }),
    ...(opts.alumniOf && {
      alumniOf: { '@type': 'EducationalOrganization', name: opts.alumniOf },
    }),
  };
}
