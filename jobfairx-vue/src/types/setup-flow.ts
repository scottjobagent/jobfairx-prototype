/**
 * Types for the SetupFlow (job posting wizard)
 * 3-step wizard: title+location → job details → review (with edit modals)
 */

export type LocationType = 'in-person' | 'remote' | 'hybrid' | 'on-the-road'
export type JobType = 'fulltime' | 'parttime' | 'contract' | 'internship'

export interface SetupFlowState {
  // Step 1: Title & Location
  jobTitle: string
  locationType: LocationType
  location: string
  hybridLocation: string
  resideRequired: boolean
  resideLocation: string
  onRoadStarting: boolean
  onRoadAddress: string

  // Step 2: Job Details
  jobTypes: JobType[]
  payType: 'hourly' | 'salary'
  payMin: number
  payMax: number
  benefits: string[]
  shift: string
  schedule: string
  description: string
}

export interface ReviewFieldEditPayload {
  field: 'jobType' | 'pay' | 'benefits' | 'shift' | 'schedule' | 'description'
  currentValue: unknown
}
