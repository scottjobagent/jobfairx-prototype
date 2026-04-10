/**
 * Domain types for the Edit Post page and Job Posting page
 */

export interface Job {
  id: string
  title: string
  salaryMin: number
  salaryMax: number
  salaryPeriod: string
  employmentType: string
  description: string
}

export interface EditPostEvent {
  title: string
  date: string
  timeRange: string
}

export interface PackageInfo {
  tier: string
  jobsUsed: number
  jobsLimit: number
}

export interface InterviewDetails {
  slotDurationMins: number
  interviewsPerSlot: number
  startAdvertisingDate: string
  attendanceInstructions: boolean
}

export interface EditPostState {
  event: EditPostEvent
  package: PackageInfo
  jobs: Job[]
  jobsIncomplete: boolean
  interviewDetails: InterviewDetails
  interviewIncomplete: boolean
}

export interface JobPostingDetail {
  jobType: string
  pay: string
  location: string
  interviewType: string
}

export interface JobSection {
  title: string
  content: string[]
}

export interface JobPosting {
  id: string
  title: string
  company: string
  location: string
  remoteEligible: boolean
  employment: string
  salaryMin: number
  salaryMax: number
  tags: string[]
  details: JobPostingDetail
  sections: JobSection[]
}
