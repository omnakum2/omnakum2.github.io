import { SITE } from '../consts';

export function buildWebSiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    // TODO: update with real domain when deployed
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    inLanguage: 'en',
    publisher: { '@id': `${SITE.url}/#person` },
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
    // TODO: update with real domain when deployed
    '@id': `${SITE.url}/#person`,
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

export function buildFaqLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
