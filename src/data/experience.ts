export interface TimelineStep {
  title: string;
  period: string;
  bodyHtml: string;
}

export const experience: TimelineStep[] = [
  {
    title: 'Senior Full-Stack Developer · TechCorp',
    period: '2023 — Present',
    bodyHtml:
      'Leading a team of 5 engineers building a <strong>real-time analytics platform</strong>. Architected the micro-services backend, cutting deploy times by 60%. Drove adoption of TypeScript across the org.',
  },
  {
    title: 'Full-Stack Developer · StartupHub',
    period: '2021 — 2023',
    bodyHtml:
      'Shipped 3 products from 0→1 across fintech and e-commerce verticals. Built <strong>payment integrations</strong> processing $2M+ monthly. Mentored 2 junior developers.',
  },
  {
    title: 'Frontend Engineer · DesignLab',
    period: '2019 — 2021',
    bodyHtml:
      'Developed responsive, accessible UIs for enterprise clients. Implemented a <strong>component library</strong> used across 8 projects, reducing dev time by 35%.',
  },
  {
    title: 'BSc Computer Science · State University',
    period: '2015 — 2019',
    bodyHtml:
      'Graduated with honors. Led the campus <strong>hackathon club</strong> (50+ members). Won 2 national coding competitions.',
  },
];
