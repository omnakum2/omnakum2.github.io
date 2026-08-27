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
    'This Privacy Policy explains how Om Nakum handles both the information you share through this website and any materials you share when we work together on a project.',
  ],
  sections: [
    {
      heading: 'Information we collect',
      items: [
        { text: 'Details you submit through the contact form: your name, email address, and message.' },
        { text: 'Basic, non-identifying technical data your browser sends, only if analytics is enabled.' },
      ],
    },
    {
      heading: 'Project information you share',
      items: [
        { text: 'To deliver a project, you may share materials, content, accounts or access credentials, and business or customer data.' },
        { text: 'This is used only to carry out the agreed work, kept confidential, and never shared beyond what the project requires.' },
        { text: 'On request, or once the work is complete, project data and any access are returned or securely deleted.' },
      ],
    },
    {
      heading: 'How we use it',
      items: [
        { text: 'Only to read and respond to your enquiry.' },
        { text: 'We never sell, rent, or share your personal data with third parties.' },
      ],
    },
    {
      heading: 'Cookies and analytics',
      items: [
        { text: 'This site uses no advertising or tracking cookies.' },
        { text: 'Any analytics are privacy-friendly and aggregate only.' },
      ],
    },
    {
      heading: 'Your rights and contact',
      items: [
        { text: 'You can request access to, correction of, or deletion of your data at any time.' },
        { text: 'Get in touch through the {{contact}} with any privacy questions.' },
      ],
    },
  ],
};

// ── Terms & Conditions ───────────────────────────────────────────────────────

export const termsAndConditions: LegalDoc = {
  title: 'Terms of Service',
  intro: [
    'These Terms of Service apply to the web and full-stack development services provided by Om Nakum. By engaging these services, you agree to the terms below.',
  ],
  sections: [
    {
      heading: 'Scope of services',
      items: [
        { text: 'The exact deliverables, timeline, and scope for each project are defined in the quote or agreement confirmed before work begins.' },
        { text: 'Anything outside that agreed scope is treated as new work and quoted separately.' },
      ],
    },
    {
      heading: 'Payment',
      items: [
        { text: 'Fees and the payment schedule are set out in the project quote or invoice we agree on.' },
        { text: 'Projects may require an upfront deposit, with the remaining balance due on delivery or at the agreed milestones.' },
      ],
    },
    {
      heading: 'Revisions and changes',
      items: [
        { text: 'A reasonable number of revisions within the agreed scope are included.' },
        { text: 'Significant changes or additions are estimated and billed separately.' },
      ],
    },
    {
      heading: 'Client responsibilities',
      items: [
        { text: 'Please provide the content, assets, access, and feedback needed to complete the work in good time.' },
        { text: 'Delivery timelines are estimates and depend on timely responses and any third-party services involved.' },
      ],
    },
    {
      heading: 'Intellectual property',
      items: [
        { text: 'Ownership of the final deliverables transfers to you once the project is paid for in full; until then, the work remains my property.' },
        { text: 'I may showcase completed work in my portfolio unless we agree otherwise in writing.' },
      ],
    },
    {
      heading: 'Warranty and liability',
      items: [
        { text: 'Services are provided professionally and in good faith, but without warranties of any kind.' },
        { text: 'To the extent permitted by law, my liability for any claim is limited to the fees paid for the affected work.' },
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
      items: [{ text: 'Questions about these terms? Get in touch through the {{contact}}.' }],
    },
  ],
};
