/**
 * Dashboard domain types
 *
 * Mirrors the data shapes used in the HTML prototype's visual.html.
 * Keep these in sync with whatever the real API ends up returning.
 */

/** An event in the employer dashboard's event table. */
export interface DashboardEvent {
  id: string
  name: string
  /** ISO timestamp */
  startsAt: string
  /** ISO timestamp */
  endsAt: string
  /** Human-readable date, e.g. "Apr 22, 2026" */
  date: string
  /** Human-readable time range, e.g. "11:00 AM - 3:00 PM CT" */
  time: string
  location: string
  /** Interview location details, e.g. "Virtual interviews" */
  interviewLocation: string
  /** True if setup is complete */
  setupComplete: boolean
  /** Package tier, e.g. "Growth", "Pro" */
  packageTier: string
  /** e.g. "1/3" or "3/6" */
  jobsCount: string
  /** e.g. "2/5" or "4/Unlimited" */
  seatsCount: string
  /** Number of interviewers assigned */
  interviewerCount: number
  /** Array of job titles for this event */
  jobTitles: string[]
  /** Number of pending candidates */
  pendingCandidates: number
  /** Number of upcoming interviews */
  upcomingCandidates: number
  /** Status flags */
  isSetupIncomplete?: boolean
  isLive?: boolean
}

/** Dashboard view context */
export type DashboardTab = 'upcoming' | 'completed'
