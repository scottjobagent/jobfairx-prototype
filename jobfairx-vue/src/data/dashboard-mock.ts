/**
 * Mock data for the Dashboard page.
 *
 * Mirrors what visual.html shows in its event table and statistics.
 * Replace these constants with API responses once the backend is wired up.
 * The shapes are defined in `@/types/dashboard`.
 */

import type { DashboardEvent } from '@/types/dashboard'

export const MOCK_EVENTS: readonly DashboardEvent[] = [
  {
    id: 'evt_dallas',
    name: 'Dallas Healthcare Hiring Event',
    startsAt: '2026-04-22T16:00:00Z',
    endsAt: '2026-04-22T20:00:00Z',
    date: 'Apr 22, 2026',
    time: '11:00 AM - 3:00 PM CT',
    location: 'Virtual interviews',
    interviewLocation: 'Virtual interviews',
    setupComplete: true,
    isLive: true,
    packageTier: 'Growth',
    jobsCount: '1/3',
    seatsCount: '2/5',
    interviewerCount: 2,
    jobTitles: ['Registered Nurse'],
    pendingCandidates: 3,
    upcomingCandidates: 16,
  },
  {
    id: 'evt_chicago',
    name: 'Chicago Technology Hiring Event',
    startsAt: '2026-05-06T16:00:00Z',
    endsAt: '2026-05-06T20:00:00Z',
    date: 'May 6, 2026',
    time: '11:00 AM - 3:00 PM CT',
    location: 'Virtual interviews',
    interviewLocation: 'Virtual interviews',
    setupComplete: false,
    isSetupIncomplete: true,
    packageTier: 'Pro',
    jobsCount: '3/6',
    seatsCount: '4/Unlimited',
    interviewerCount: 0,
    jobTitles: ['Software Engineer', 'DevOps Engineer', 'UX Designer'],
    pendingCandidates: 2,
    upcomingCandidates: 5,
  },
  {
    id: 'evt_atlanta',
    name: 'Atlanta Manufacturing Hiring Event',
    startsAt: '2026-05-20T16:00:00Z',
    endsAt: '2026-05-20T20:00:00Z',
    date: 'May 20, 2026',
    time: '11:00 AM - 3:00 PM CT',
    location: 'Virtual interviews',
    interviewLocation: 'Virtual interviews',
    setupComplete: false,
    isSetupIncomplete: true,
    packageTier: 'Growth',
    jobsCount: '1/3',
    seatsCount: '2/5',
    interviewerCount: 0,
    jobTitles: ['Plant Supervisor'],
    pendingCandidates: 1,
    upcomingCandidates: 8,
  },
  {
    id: 'evt_denver',
    name: 'Denver Tech Hiring Event',
    startsAt: '2026-06-01T17:00:00Z',
    endsAt: '2026-06-01T21:00:00Z',
    date: 'Jun 1, 2026',
    time: '12:00 PM - 4:00 PM MT',
    location: 'Virtual interviews',
    interviewLocation: 'Virtual interviews',
    setupComplete: true,
    packageTier: 'Pro',
    jobsCount: '2/6',
    seatsCount: '3/Unlimited',
    interviewerCount: 3,
    jobTitles: ['Full Stack Engineer', 'Data Scientist'],
    pendingCandidates: 5,
    upcomingCandidates: 12,
  },
]

export interface DashboardDataset {
  upcoming: readonly DashboardEvent[]
  completed: readonly DashboardEvent[]
}

export const DASHBOARD_DATA: DashboardDataset = {
  upcoming: MOCK_EVENTS.slice(0, 4),
  completed: [],
}
