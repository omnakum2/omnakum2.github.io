import { SITE } from '../consts';

export function buildWebSiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    inLanguage: 'en',
    publisher: { '@id': `${SITE.url}/#person` },
  };
}

interface PersonOptions {
  jobTitle: string;
  sameAs?: string[];
}

export function buildPersonLd(opts: PersonOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE.url}/#person`,
    name: SITE.name,
    url: SITE.url,
    jobTitle: opts.jobTitle,
    ...(opts.sameAs && { sameAs: opts.sameAs }),
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
