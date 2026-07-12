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
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  keywords?: string;
  jsonLd?: {
    faq?: FaqItem[];
    breadcrumbs?: BreadcrumbItem[];
  };
}
