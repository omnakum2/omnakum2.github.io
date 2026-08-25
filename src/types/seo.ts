export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoConfig {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  /** Emit a noindex robots directive (e.g. the 404 page). */
  noindex?: boolean;
  jsonLd?: {
    faq?: FaqItem[];
  };
}
