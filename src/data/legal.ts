// ─────────────────────────────────────────────────────────────────────────────
// Legal content — single tunable source for the Privacy Policy and the
// Terms of Service pages. Edit copy here; both pages render it generically
// via <LegalDoc> (heading → body → items → outro → note).
//
// Conventions
//  • Sections are numbered automatically by their position in `sections`.
//  • The literal token `{{contact}}` inside any `body`, `items[].text`, or
//    `outro` string is replaced at render time with a link to the home
//    Contact section (link text = "contact section").
// ─────────────────────────────────────────────────────────────────────────────

/** A numbered / lead-in item rendered on an accent border-left rail. */
export interface LegalItem {
  /** Optional bold lead-in label (accent), shown before the text. */
  lead?: string;
  /** Item body copy. May contain the `{{email}}` token. */
  text: string;
}

export interface LegalSection {
  /** Section heading (numbered automatically by position). */
  heading?: string;
  /** Body paragraphs shown before the items list. May contain `{{email}}`. */
  body?: string[];
  /** Accent-railed list of numbered / lead items. */
  items?: LegalItem[];
  /** Paragraphs shown after the items list. May contain `{{email}}`. */
  outro?: string[];
  /** Muted footnote paragraph rendered last in the section. */
  note?: string;
}

export interface LegalDoc {
  /** Page H1. */
  title: string;
  /** "Last updated" date. */
  updated?: string;
  /** Intro paragraphs shown before the first section. */
  intro?: string[];
  sections: LegalSection[];
}

// ── Privacy Policy ───────────────────────────────────────────────────────────

export const privacyPolicy: LegalDoc = {
  title: 'Privacy Policy',
  intro: [
    'This Privacy Policy explains what information Om Nakum collects through this website and how information shared during a project is handled.',
  ],
  sections: [
    {
      heading: 'Information we collect',
      items: [
        { text: 'If you contact me through the website, I may collect your name, email address, and the information included in your message.' },
        { text: 'If analytics are enabled, the site may collect basic technical information such as browser type, device type, and general usage data.' },
      ],
    },
    {
      heading: 'Project information you share',
      items: [
        { text: 'When working together, you may share project materials, content, account access, credentials, or business and customer data.' },
        { text: 'I use this information only as needed to provide the agreed services and treat it as confidential.' },
        { text: 'When the work is complete, or when you request it, project data and access can be returned or securely deleted where reasonably possible.' },
      ],
    },
    {
      heading: 'How information is used',
      items: [
        { text: 'Information submitted through the website is used to respond to your enquiry and communicate with you about potential work.' },
        { text: 'Project information is used only to provide the agreed services and manage the project.' },
        { text: 'I do not sell your personal information or use it for advertising purposes.' },
      ],
    },
    {
      heading: 'Cookies and analytics',
      items: [
        { text: 'This website does not use advertising cookies.' },
        { text: 'If analytics are enabled, they are used to understand general website usage rather than to identify you personally.' },
      ],
    },
    {
      heading: 'Your rights and contact',
      items: [
        { text: 'You can contact me to request access to, correction of, or deletion of personal information I hold about you, subject to applicable law.' },
        { text: 'For privacy questions or requests, get in touch through the {{contact}}.' },
      ],
    },
  ],
};

// ── Terms & Conditions ───────────────────────────────────────────────────────

export const termsAndConditions: LegalDoc = {
  title: 'Terms of Service',
  intro: [
    'These Terms of Service apply to web and full-stack development services provided by Om Nakum. The specific terms of each project are also set out in the quote, proposal, or agreement confirmed before work begins.',
  ],
  sections: [
    {
      heading: 'Scope of services',
      items: [
        { text: 'The deliverables, timeline, fees, and scope for each project are defined in the agreed quote, proposal, or contract.' },
        { text: 'Work outside the agreed scope may require a separate estimate and additional fees.' },
      ],
    },
    {
      heading: 'Payment',
      items: [
        { text: 'Fees and payment schedules are set out in the agreed quote, proposal, or invoice.' },
        { text: 'A project may require an upfront deposit, with the remaining balance due on delivery or at agreed milestones.' },
        { text: 'Work may be paused if agreed payments are overdue.' },
      ],
    },
    {
      heading: 'Revisions and changes',
      items: [
        { text: 'Reasonable revisions within the agreed scope are included in the project.' },
        { text: 'Significant changes, new features, or additions outside the agreed scope may be estimated and billed separately.' },
      ],
    },
    {
      heading: 'Client responsibilities',
      items: [
        { text: 'You are responsible for providing the content, assets, access, credentials, and feedback reasonably needed to complete the work.' },
        { text: 'Project timelines may change when required information or feedback is delayed, or when work depends on third-party services.' },
      ],
    },
    {
      heading: 'Intellectual property',
      items: [
        { text: 'Unless agreed otherwise, ownership of the final project deliverables transfers to you once the project has been paid for in full.' },
        { text: 'Pre-existing code, tools, libraries, templates, and other materials I own remain mine unless otherwise agreed.' },
        { text: 'I may showcase completed work in my portfolio unless we agree otherwise in writing.' },
      ],
    },
    {
      heading: 'Warranty and liability',
      items: [
        { text: 'I will provide the services with reasonable care and skill, but I cannot guarantee that every project will be completely free from bugs, interruptions, or issues caused by third-party services.' },
        { text: 'To the extent permitted by applicable law, liability arising from a project is limited to the fees paid for the affected services.' },
      ],
    },
    {
      heading: 'Governing law',
      items: [
        { text: 'These terms are governed by the laws of India.' },
      ],
    },
    {
      heading: 'Contact',
      items: [
        { text: 'Questions about these terms? Get in touch through the {{contact}}.' },
      ],
    },
  ],
};
