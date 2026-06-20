export interface FaqItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SeoConfig {
  title: string;
  description: string;
  canonical: string;
  jsonLd?: {
    faq?: FaqItem[];
    breadcrumbs?: BreadcrumbItem[];
  };
}
