/**
 * Lobby domain types
 *
 * Mirrors the data shapes used in the HTML prototype's lobby.html.
 * Keep these in sync with whatever the real API ends up returning —
 * the mock data in `src/data/lobby-mock.ts` conforms to these types,
 * so a real API client should produce the same shapes.
 */

/** Which tab of the lobby is currently active. */
export type LobbyTab = 'waiting' | 'interviewing' | 'interviewed' | 'notyet'

/**
 * Dev-only mode toggle from the HTML prototype.
 * - `active`: rooms have candidates in them
 * - `empty`:  no candidates anywhere (empty-state UI)
 * - `live`:   future "real data" mode — currently behaves like `active`
 *
 * In production this toggle goes away; the data source decides.
 */
export type LobbyMode = 'active' | 'empty' | 'live'

/** A candidate sitting in one of the lobby tabs. */
export interface Candidate {
  id: string
  name: string
  /** Job title they applied for, e.g. "Warehouse Associate". */
  jobTitle: string
  /** Pre-formatted display time, e.g. "10:30 AM". */
  interviewTime: string
  /** Pre-formatted display date, e.g. "Today" or "Apr 12". */
  interviewDate: string
  /** Optional resume URL. Undefined if the candidate hasn't uploaded one. */
  resumeUrl?: string
  /** Avatar initials, derived from name if not provided. */
  initials?: string
}

/** The event whose lobby is being displayed (header bar). */
export interface LobbyEvent {
  id: string
  title: string
  /** ISO timestamp. */
  startsAt: string
  /** ISO timestamp. */
  endsAt: string
  /** IANA timezone, e.g. "America/Chicago". */
  timezone: string
  /** Pre-formatted display string for the header, e.g. "Apr 15, 10:00 AM – 2:00 PM CT". */
  displayWindow: string
}

/** Tab metadata used to render the tab strip. */
export interface LobbyTabDef {
  key: LobbyTab
  label: string
  /** Count badge shown next to the label. */
  count: number
}
