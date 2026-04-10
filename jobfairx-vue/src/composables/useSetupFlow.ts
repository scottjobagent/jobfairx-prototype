/**
 * useSetupFlow
 *
 * Reactive form state composable for the job posting wizard.
 * Holds all form data across the 3 steps and provides update methods.
 */

import { reactive, ref } from 'vue'
import type { SetupFlowState, LocationType, JobType } from '@/types/setup-flow'

const initialState: SetupFlowState = {
  // Step 1
  jobTitle: '',
  locationType: 'in-person',
  location: 'Henderson, NV 89052',
  hybridLocation: '',
  resideRequired: false,
  resideLocation: '',
  onRoadStarting: true,
  onRoadAddress: '',

  // Step 2
  jobTypes: ['fulltime'],
  payType: 'hourly',
  payMin: 22.63,
  payMax: 27.25,
  benefits: [],
  shift: 'Daytime',
  schedule: '',
  description: 'Sales Associate - customer-facing role with high engagement.',
}

const state = reactive<SetupFlowState>({ ...initialState })

export function useSetupFlow() {
  const step = ref<1 | 2 | 3>(1)

  const setJobTitle = (title: string): void => {
    state.jobTitle = title
  }

  const setLocationType = (type: LocationType): void => {
    state.locationType = type
  }

  const setLocation = (location: string): void => {
    state.location = location
  }

  const setHybridLocation = (location: string): void => {
    state.hybridLocation = location
  }

  const setResideRequired = (required: boolean): void => {
    state.resideRequired = required
  }

  const setResideLocation = (location: string): void => {
    state.resideLocation = location
  }

  const setOnRoadStarting = (starting: boolean): void => {
    state.onRoadStarting = starting
  }

  const setOnRoadAddress = (address: string): void => {
    state.onRoadAddress = address
  }

  const setJobTypes = (types: JobType[]): void => {
    state.jobTypes = types
  }

  const setPayType = (type: 'hourly' | 'salary'): void => {
    state.payType = type
  }

  const setPayRange = (min: number, max: number): void => {
    state.payMin = min
    state.payMax = max
  }

  const setBenefits = (benefits: string[]): void => {
    state.benefits = benefits
  }

  const setShift = (shift: string): void => {
    state.shift = shift
  }

  const setSchedule = (schedule: string): void => {
    state.schedule = schedule
  }

  const setDescription = (description: string): void => {
    state.description = description
  }

  const resetForm = (): void => {
    Object.assign(state, initialState)
    step.value = 1
  }

  return {
    state,
    step,
    setJobTitle,
    setLocationType,
    setLocation,
    setHybridLocation,
    setResideRequired,
    setResideLocation,
    setOnRoadStarting,
    setOnRoadAddress,
    setJobTypes,
    setPayType,
    setPayRange,
    setBenefits,
    setShift,
    setSchedule,
    setDescription,
    resetForm,
  }
}
