/**
 * Mock data for the Share Preview page.
 *
 * Replace with API responses once the backend is wired up.
 * The shapes are defined in `@/types/share`.
 */

import type { SharePreviewEvent } from '@/types/share'

export const MOCK_EVENTS: Record<string, SharePreviewEvent> = {
  dallas: {
    title: 'Dallas Virtual Interviews',
    sub: 'Dallas, TX · Healthcare employers',
    date: 'Friday, April 17, 2026',
    tz: 'Central Time (CDT)',
    jobs: [
      {
        id: 'rn',
        title: 'Registered Nurse',
        company: 'Baylor Scott & White Health',
        pay: '$65,000 – $88,000 a year, Full-time',
        location: 'Dallas, TX',
        desc: [
          'Provide high-quality patient care in a fast-paced clinical environment. Collaborate with physicians, care teams, and families to develop and execute care plans.',
          'Requirements: Active RN license in Texas, BLS certification, and 1+ year of clinical experience. BSN preferred.',
          'Benefits include competitive pay, medical/dental/vision, 401(k) match, tuition reimbursement, and generous PTO.',
        ],
        slots: [
          { time: '11:00 AM', remaining: 1 },
          { time: '11:30 AM', remaining: 2 },
          { time: '12:00 PM', remaining: 1 },
          { time: '12:30 PM', remaining: 0 },
          { time: '1:00 PM', remaining: 1 },
          { time: '1:30 PM', remaining: 1 },
          { time: '2:00 PM', remaining: 2 },
          { time: '2:30 PM', remaining: 1 },
        ],
      },
    ],
  },
  chicago: {
    title: 'Chicago Virtual Interviews',
    sub: 'Chicago, IL · Technology employers',
    date: 'Thursday, April 23, 2026',
    tz: 'Central Time (CDT)',
    jobs: [
      {
        id: 'se',
        title: 'Software Engineer',
        company: 'Relativity',
        pay: '$120,000 – $155,000 a year, Full-time',
        location: 'Chicago, IL (Hybrid)',
        desc: [
          'Build and ship delightful user-facing features in React and TypeScript. Partner with designers and product managers to define the next generation of our platform.',
          'Requirements: 3+ years of production React experience, strong CSS fundamentals, and a track record of shipping polished UI at scale.',
        ],
        slots: [
          { time: '11:00 AM', remaining: 1 },
          { time: '11:30 AM', remaining: 1 },
          { time: '12:00 PM', remaining: 2 },
          { time: '12:30 PM', remaining: 1 },
          { time: '1:00 PM', remaining: 1 },
          { time: '1:30 PM', remaining: 1 },
          { time: '2:00 PM', remaining: 1 },
          { time: '2:30 PM', remaining: 1 },
        ],
      },
      {
        id: 'devops',
        title: 'DevOps Engineer',
        company: 'Tempus AI',
        pay: '$140,000 – $175,000 a year, Full-time',
        location: 'Chicago, IL (Remote OK)',
        desc: [
          'Own our cloud infrastructure across AWS. Build resilient CI/CD pipelines, improve observability, and champion developer velocity.',
          'Requirements: Strong Terraform + Kubernetes experience, incident response chops, and a pragmatic approach to reliability.',
        ],
        slots: [
          { time: '11:00 AM', remaining: 1 },
          { time: '11:30 AM', remaining: 0 },
          { time: '12:00 PM', remaining: 1 },
          { time: '12:30 PM', remaining: 1 },
          { time: '1:00 PM', remaining: 1 },
          { time: '1:30 PM', remaining: 1 },
          { time: '2:00 PM', remaining: 1 },
          { time: '2:30 PM', remaining: 0 },
        ],
      },
      {
        id: 'ux',
        title: 'UX Designer',
        company: 'Morningstar',
        pay: '$110,000 – $140,000 a year, Full-time',
        location: 'Chicago, IL (Hybrid)',
        desc: [
          'Design delightful end-to-end experiences that help millions of users invest with confidence. Own research, wireframes, prototypes, and hand-off.',
          'Requirements: 4+ years of product design experience, a strong portfolio, and fluency in Figma and modern design systems.',
        ],
        slots: [
          { time: '11:00 AM', remaining: 1 },
          { time: '11:30 AM', remaining: 1 },
          { time: '12:00 PM', remaining: 1 },
          { time: '12:30 PM', remaining: 1 },
          { time: '1:00 PM', remaining: 0 },
          { time: '1:30 PM', remaining: 1 },
          { time: '2:00 PM', remaining: 1 },
          { time: '2:30 PM', remaining: 1 },
        ],
      },
    ],
  },
  atlanta: {
    title: 'Atlanta Virtual Interviews',
    sub: 'Atlanta, GA · Diversity hiring event',
    date: 'Tuesday, April 28, 2026',
    tz: 'Eastern Time (EDT)',
    jobs: [
      {
        id: 'mkt',
        title: 'Marketing Coordinator',
        company: 'Cox Enterprises',
        pay: '$58,000 – $72,000 a year, Full-time',
        location: 'Atlanta, GA',
        desc: [
          'Support the marketing team across campaign execution, content calendars, and performance reporting. A great entry point into a high-growth team.',
          'Requirements: 1-2 years of marketing experience, strong writing skills, and comfort with analytics tools.',
        ],
        slots: [
          { time: '11:00 AM', remaining: 1 },
          { time: '11:30 AM', remaining: 1 },
          { time: '12:00 PM', remaining: 0 },
          { time: '12:30 PM', remaining: 1 },
          { time: '1:00 PM', remaining: 1 },
          { time: '1:30 PM', remaining: 1 },
          { time: '2:00 PM', remaining: 1 },
          { time: '2:30 PM', remaining: 0 },
        ],
      },
    ],
  },
}

export function getEventByKey(key: string): SharePreviewEvent | null {
  const normalized = key.toLowerCase()
  return MOCK_EVENTS[normalized] ?? MOCK_EVENTS['dallas'] ?? null
}
