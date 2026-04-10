/**
 * Mock data for the Lobby page.
 *
 * Mirrors what lobby.html shows in its three demo modes:
 *   - active: 4 candidates waiting, 1 interviewing, 2 interviewed, 1 not-yet
 *   - empty:  no candidates anywhere
 *   - live:   placeholder for "real data" — currently same as active
 *
 * Replace these constants with API responses once the backend is wired up.
 * The shapes are defined in `@/types/lobby`.
 */

import type { Candidate, LobbyEvent, LobbyMode } from '@/types/lobby'

export const MOCK_EVENT: LobbyEvent = {
  id: 'evt_chicago_apr15',
  title: 'Chicago Hiring Event',
  startsAt: '2026-04-15T15:00:00Z',
  endsAt: '2026-04-15T19:00:00Z',
  timezone: 'America/Chicago',
  displayWindow: 'Apr 15, 10:00 AM – 2:00 PM CT',
}

const initials = (name: string): string =>
  name
    .split(' ')
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()

const c = (
  id: string,
  name: string,
  jobTitle: string,
  interviewTime: string,
  interviewDate: string,
  resumeUrl?: string,
): Candidate => ({
  id,
  name,
  jobTitle,
  interviewTime,
  interviewDate,
  initials: initials(name),
  ...(resumeUrl !== undefined ? { resumeUrl } : {}),
})

const ACTIVE_WAITING: readonly Candidate[] = [
  c('cand_001', 'Aisha Rahman', 'Warehouse Associate', '10:30 AM', 'Today', '/mock/aisha.pdf'),
  c('cand_002', 'James Cooper', 'Forklift Operator', '10:45 AM', 'Today', '/mock/james.pdf'),
  c('cand_003', 'Sofia Martinez', 'Warehouse Associate', '11:00 AM', 'Today'),
  c('cand_004', 'Derek Washington', 'Shift Lead', '11:15 AM', 'Today', '/mock/derek.pdf'),
]

const ACTIVE_INTERVIEWING: readonly Candidate[] = [
  c('cand_010', 'Maria Lopez', 'Warehouse Associate', '10:15 AM', 'Today', '/mock/maria.pdf'),
]

const ACTIVE_INTERVIEWED: readonly Candidate[] = [
  c('cand_020', 'Kevin Park', 'Forklift Operator', '9:45 AM', 'Today', '/mock/kevin.pdf'),
  c('cand_021', 'Tasha Williams', 'Warehouse Associate', '9:30 AM', 'Today'),
]

const ACTIVE_NOTYET: readonly Candidate[] = [
  c('cand_030', 'Brandon Lee', 'Shift Lead', '12:00 PM', 'Today'),
]

const EMPTY: readonly Candidate[] = []

export interface LobbyDataset {
  waiting: readonly Candidate[]
  interviewing: readonly Candidate[]
  interviewed: readonly Candidate[]
  notyet: readonly Candidate[]
}

export const LOBBY_DATA: Record<LobbyMode, LobbyDataset> = {
  active: {
    waiting: ACTIVE_WAITING,
    interviewing: ACTIVE_INTERVIEWING,
    interviewed: ACTIVE_INTERVIEWED,
    notyet: ACTIVE_NOTYET,
  },
  empty: {
    waiting: EMPTY,
    interviewing: EMPTY,
    interviewed: EMPTY,
    notyet: EMPTY,
  },
  // "live" reuses active data until the real backend is wired up.
  live: {
    waiting: ACTIVE_WAITING,
    interviewing: ACTIVE_INTERVIEWING,
    interviewed: ACTIVE_INTERVIEWED,
    notyet: ACTIVE_NOTYET,
  },
}
