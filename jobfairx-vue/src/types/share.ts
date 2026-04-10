/**
 * Share Preview domain types
 *
 * Mirrors the data shapes used in the HTML prototype's share-preview.html.
 * Keep these in sync with whatever the real API ends up returning.
 */

export interface Job {
  id: string
  title: string
  company: string
  pay: string
  location: string
  desc: string[]
  slots: TimeSlot[]
}

export interface TimeSlot {
  time: string
  remaining: number
}

export interface SharePreviewEvent {
  title: string
  sub: string
  date: string
  tz: string
  jobs: Job[]
}

export interface SubmissionState {
  success: boolean
  jobTitle?: string
  timeSlot?: string
}
