export interface JobData {
  title: string
  location: string
  jobType: string
  pay: string
  benefits: string
  shift: string
  schedule: string
  desc: string
}

export interface PayConfig {
  displayType: 'range' | 'starting' | 'maximum' | 'exact'
  minimum?: number
  maximum?: number
  single?: number
  rate: 'per hour' | 'per day' | 'per week' | 'per month' | 'per year'
}
