<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

// ════ STATE ════
const currentStep = ref<number>(1)

// Package & Credit info
const packageName = ref<'Starter' | 'Growth' | 'Pro'>('Growth')
const jobsAdded = ref<number>(2)
const totalJobSlots = ref<number>(3)

// Step 1: Post type & Job title & Location
const postType = ref<'template' | 'new'>('new')
const selectedTemplateJob = ref<string | null>(null)
const jobTitle = ref<string>('')
const jobLocationTypeValue = ref<'in-person' | 'remote' | 'hybrid' | 'on-the-road'>('in-person')
const jobLocation = ref<string>('')
const hybridLocation = ref<string>('')
const remoteResideRequired = ref<'yes' | 'no'>('no')
const remoteResideLocation = ref<string>('')
const onRoadHasStartingLocation = ref<'yes' | 'no'>('yes')
const onRoadStartingLocation = ref<string>('')

// Step 2: Job details
const jobTypes = reactive<Record<string, boolean>>({
  'Full-time': true,
  'Part-time': false,
  'Contract': false,
  'Temporary': false,
  'Internship': false
})

const payBy = ref<'range' | 'starting' | 'maximum' | 'exact'>('range')
const payMinimum = ref<string>('22.63')
const payMaximum = ref<string>('27.25')
const paySingle = ref<string>('22.63')
const payRate = ref<'per-hour' | 'per-day' | 'per-week' | 'per-month' | 'per-year'>('per-hour')

const jobBenefits = reactive<Record<string, boolean>>({
  'Health Insurance': false,
  '401(k)': false,
  'Dental Insurance': false,
  'Vision Insurance': false,
  'Paid Time Off': false,
  'Professional Development': false
})

const jobShifts = reactive<Record<string, boolean>>({
  'Morning': false,
  'Afternoon': false,
  'Evening': false,
  'Night': false,
  'Flexible': false
})

const jobSchedule = reactive<Record<string, boolean>>({
  'Monday-Friday': false,
  'Weekend': false,
  'Rotating Schedule': false,
  'On-call': false
})

const jobDescription = ref<string>('')
const importantNoticeAgreed = ref<boolean>(false)

// Step 5: Interview settings
const interviewCount = ref<number>(1)
const interviewerEmails = ref<string[]>([])
const interviewerEmailInput = ref<string>('')

// Step 6: Screening
const screeningQuestions = reactive<Array<{
  id: string
  question: string
  type: 'text' | 'multiple'
  options?: string[]
  conditional?: boolean
  conditionField?: string
}>>([
  {
    id: 'screening-1',
    question: 'What is your availability?',
    type: 'text',
    conditional: false
  }
])

// Errors
const errors = ref<Record<string, string>>({})

// Previous jobs (template data)
const previousJobs = ref<Array<{
  id: string
  title: string
  location: string
  date: string
}>>([
  { id: '1', title: 'Registered Nurse', location: 'Dallas, TX 75201', date: 'March 15th, 2026' },
  { id: '2', title: 'Medical Assistant', location: 'Houston, TX 77001', date: 'February 28th, 2026' },
  { id: '3', title: 'CNA - Certified Nursing Assistant', location: 'Austin, TX 78701', date: 'January 10th, 2026' },
  { id: '4', title: 'Home Health Aide', location: 'San Antonio, TX 78201', date: 'December 5th, 2025' }
])

const previousJobsFiltered = computed(() => {
  const query = jobTitleSearchQuery.value.toLowerCase()
  return query
    ? previousJobs.value.filter(j => j.title.toLowerCase().includes(query))
    : previousJobs.value
})

const jobTitleSearchQuery = ref<string>('')

// Job title suggestions
const jobTitleSuggestions = ref<string[]>([
  'Registered Nurse',
  'Sales Associate',
  'Full Stack Developer',
  'Customer Service Representative',
  'Marketing Manager',
  'Data Analyst',
  'Project Manager',
  'Accountant',
  'Graphic Designer',
  'Human Resources Coordinator'
])

const showJobTitleSuggestions = ref<boolean>(false)

// Review data (Step 3)
const reviewData = computed(() => ({
  jobTitle: jobTitle.value || 'Sales Associate',
  location: jobLocationTypeValue.value === 'in-person' ? 'In person' : jobLocationTypeValue.value === 'remote' ? 'Fully remote' : jobLocationTypeValue.value === 'hybrid' ? 'Hybrid' : 'On the road',
  jobType: Object.entries(jobTypes)
    .filter(([_, selected]) => selected)
    .map(([type]) => type)
    .join(', ') || 'Full-time',
  pay: payBy.value === 'range'
    ? `$${payMinimum.value} - $${payMaximum.value} ${payRate.value}`
    : `$${paySingle.value} ${payRate.value}`,
  benefits: Object.entries(jobBenefits)
    .filter(([_, selected]) => selected)
    .map(([benefit]) => benefit)
    .join(', ') || '—',
  shift: Object.entries(jobShifts)
    .filter(([_, selected]) => selected)
    .map(([shift]) => shift)
    .join(', ') || '—',
  schedule: Object.entries(jobSchedule)
    .filter(([_, selected]) => selected)
    .map(([schedule]) => schedule)
    .join(', ') || '—',
  description: jobDescription.value
}))

// Job cards (Step 4)
const createdJobs = ref<Array<{
  id: string
  title: string
  type: string
  location: string
  pay: string
  description: string
}>>([
  {
    id: 'job-1',
    title: 'Sales Associate',
    type: 'Full-time',
    location: 'In person',
    pay: '$22.63 - $27.25 per hour',
    description: 'We are looking for an enthusiastic Sales Associate to join our team...'
  }
])

const progressPercentage = computed(() => (currentStep.value / 7) * 100)

// ════ METHODS ════

// Step navigation
const goToStep = (step: number) => {
  if (step >= 1 && step <= 7) {
    currentStep.value = step
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const continueFromStep = (fromStep: number) => {
  if (validateStep(fromStep)) {
    goToStep(fromStep + 1)
  }
}

const goBack = () => {
  if (currentStep.value > 1) {
    goToStep(currentStep.value - 1)
  }
}

// Validation
const validateStep = (step: number): boolean => {
  errors.value = {}

  if (step === 1) {
    if (postType.value === 'template') {
      if (!selectedTemplateJob.value) {
        errors.value.template = 'Please select a job to use as a template.'
        return false
      }
    } else {
      if (!jobTitle.value.trim()) {
        errors.value.jobTitle = 'Add a job title.'
        return false
      }

      if (jobLocationTypeValue.value === 'in-person' && !jobLocation.value.trim()) {
        errors.value.jobLocation = 'Add a job location.'
        return false
      }
      if (jobLocationTypeValue.value === 'hybrid' && !hybridLocation.value.trim()) {
        errors.value.hybridLocation = 'Add a street address.'
        return false
      }
      if (jobLocationTypeValue.value === 'remote' && remoteResideRequired.value === 'yes' && !remoteResideLocation.value.trim()) {
        errors.value.remoteReside = 'Add a location.'
        return false
      }
      if (jobLocationTypeValue.value === 'on-the-road' && onRoadHasStartingLocation.value === 'yes' && !onRoadStartingLocation.value.trim()) {
        errors.value.onRoadAddress = 'Add an address.'
        return false
      }
    }
    return true
  }

  if (step === 2) {
    const hasJobType = Object.values(jobTypes).some(v => v)
    if (!hasJobType) {
      errors.value.jobType = 'Please select at least one job type.'
      return false
    }

    const payValue = payBy.value === 'range' ? payMinimum.value && payMaximum.value : paySingle.value
    if (!payValue) {
      errors.value.pay = 'Please enter pay information.'
      return false
    }

    if (!importantNoticeAgreed.value) {
      errors.value.importantNotice = 'You must agree to the important notice.'
      return false
    }
    return true
  }

  return true
}

// Step 1 handlers
const selectPostType = (type: 'template' | 'new') => {
  postType.value = type
  selectedTemplateJob.value = null
  jobTitleSearchQuery.value = ''
}

const selectTemplateJob = (jobId: string) => {
  selectedTemplateJob.value = selectedTemplateJob.value === jobId ? null : jobId
}

const selectJobTitleSuggestion = (suggestion: string) => {
  jobTitle.value = suggestion
  showJobTitleSuggestions.value = false
}

const toggleJobTitleSuggestions = () => {
  showJobTitleSuggestions.value = !showJobTitleSuggestions.value
}

const selectLocationTypeOption = (option: 'in-person' | 'remote' | 'hybrid' | 'on-the-road') => {
  jobLocationTypeValue.value = option
}

const selectResideOption = (option: 'yes' | 'no') => {
  remoteResideRequired.value = option
}

// Step 2 handlers
const toggleChip = (chipKey: string, group: 'types' | 'benefits' | 'shifts' | 'schedule') => {
  if (group === 'types') {
    jobTypes[chipKey as keyof typeof jobTypes] = !jobTypes[chipKey as keyof typeof jobTypes]
  } else if (group === 'benefits') {
    jobBenefits[chipKey as keyof typeof jobBenefits] = !jobBenefits[chipKey as keyof typeof jobBenefits]
  } else if (group === 'shifts') {
    jobShifts[chipKey as keyof typeof jobShifts] = !jobShifts[chipKey as keyof typeof jobShifts]
  } else if (group === 'schedule') {
    jobSchedule[chipKey as keyof typeof jobSchedule] = !jobSchedule[chipKey as keyof typeof jobSchedule]
  }
}

const selectPayBy = (option: 'range' | 'starting' | 'maximum' | 'exact') => {
  payBy.value = option
}

const selectPayRate = (option: 'per-hour' | 'per-day' | 'per-week' | 'per-month' | 'per-year') => {
  payRate.value = option
}

// Step 5 handlers
const incrementInterviewCount = () => {
  if (interviewCount.value < 10) interviewCount.value++
}

const decrementInterviewCount = () => {
  if (interviewCount.value > 1) interviewCount.value--
}

const addInterviewerEmail = () => {
  const email = interviewerEmailInput.value.trim()
  if (email && !interviewerEmails.value.includes(email)) {
    interviewerEmails.value.push(email)
    interviewerEmailInput.value = ''
  }
}

const removeInterviewerEmail = (index: number) => {
  interviewerEmails.value.splice(index, 1)
}

// Step 6 handlers
const addScreeningQuestion = () => {
  const newId = `screening-${screeningQuestions.length + 1}`
  screeningQuestions.push({
    id: newId,
    question: '',
    type: 'text',
    conditional: false
  })
}

const removeScreeningQuestion = (id: string) => {
  const idx = screeningQuestions.findIndex(q => q.id === id)
  if (idx !== -1) {
    screeningQuestions.splice(idx, 1)
  }
}

const updateScreeningQuestion = (id: string, field: string, value: any) => {
  const question = screeningQuestions.find(q => q.id === id)
  if (question) {
    (question as any)[field] = value
  }
}

// Step 4 handlers
const duplicateJob = (jobId: string) => {
  const jobToDuplicate = createdJobs.value.find(j => j.id === jobId)
  if (jobToDuplicate) {
    const newJob = {
      ...jobToDuplicate,
      id: `job-${Date.now()}`
    }
    createdJobs.value.push(newJob)
  }
}

const removeJob = (jobId: string) => {
  const idx = createdJobs.value.findIndex(j => j.id === jobId)
  if (idx !== -1) {
    createdJobs.value.splice(idx, 1)
  }
}

const editJob = (_jobId: string) => {
  // Would navigate back to Step 2 with this job's data populated
  goToStep(2)
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- ════ PROGRESS BAR ════ -->
    <div class="fixed top-14 left-60 right-0 h-1 bg-border-default z-90 transition-all duration-200">
      <div
        class="h-full bg-brand-blue transition-all duration-400"
        :style="{ width: `${progressPercentage}%` }"
      />
    </div>

    <!-- ════ MAIN CONTENT ════ -->
    <div class="bg-gray-100 min-h-[calc(100vh-56px)] pt-6 pb-10">
      <div class="max-w-2xl mx-auto px-7">
        <!-- ════ STEP 1: CREATE A JOB POST ════ -->
        <div v-show="currentStep === 1">
          <h1 class="text-4xl font-bold text-text-primary mb-10">Create a job post</h1>

          <div class="bg-white rounded-lg p-8 mb-6 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <span class="text-base text-text-secondary">
                <strong class="text-text-primary font-semibold">{{ packageName }}</strong> package
                <span class="text-text-tertiary mx-1">·</span>
                <strong class="text-text-primary font-semibold">{{ jobsAdded }}</strong> of
                <strong class="text-text-primary font-semibold">{{ totalJobSlots }}</strong> jobs added
              </span>
            </div>

            <!-- Post type selection -->
            <div class="mb-6">
              <label class="text-lg font-bold text-text-primary mb-5 block">
                How would you like to post your job? <span class="text-red-900">*</span>
              </label>

              <div class="space-y-3">
                <!-- Template option -->
                <div
                  class="flex gap-3 cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  :class="{ 'bg-gray-50': postType === 'template' }"
                  @click="selectPostType('template')"
                >
                  <div class="w-5 h-5 border-2 border-gray-400 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
                    :class="{ 'border-text-primary': postType === 'template' }">
                    <div v-if="postType === 'template'" class="w-2.5 h-2.5 bg-text-primary rounded-full" />
                  </div>
                  <div>
                    <div class="text-base font-semibold text-text-primary">Use a previous job as a template</div>
                    <div class="text-xs font-semibold text-gray-600 mt-1">Save time</div>
                  </div>
                </div>

                <!-- New post option -->
                <div
                  class="flex gap-3 cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  :class="{ 'bg-gray-50': postType === 'new' }"
                  @click="selectPostType('new')"
                >
                  <div class="w-5 h-5 border-2 border-gray-400 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
                    :class="{ 'border-text-primary': postType === 'new' }">
                    <div v-if="postType === 'new'" class="w-2.5 h-2.5 bg-text-primary rounded-full" />
                  </div>
                  <div class="text-base font-semibold text-text-primary">Create a brand new post</div>
                </div>
              </div>
            </div>

            <!-- Template jobs list -->
            <div v-if="postType === 'template'" class="mt-6 pt-6 border-t border-border-default">
              <div class="mb-4">
                <input
                  v-model="jobTitleSearchQuery"
                  type="text"
                  placeholder="Search by job title"
                  class="w-full px-4 py-2 border border-border-default rounded-lg text-base text-text-primary placeholder-text-tertiary"
                />
              </div>

              <div class="mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                </svg>
                <span class="text-sm font-semibold text-text-secondary">
                  {{ previousJobsFiltered.length }} result{{ previousJobsFiltered.length !== 1 ? 's' : '' }}
                </span>
              </div>

              <div class="space-y-2 mb-4">
                <div
                  v-for="job in previousJobsFiltered"
                  :key="job.id"
                  class="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  :class="{ 'bg-gray-50': selectedTemplateJob === job.id }"
                  @click="selectTemplateJob(job.id)"
                >
                  <svg
                    class="w-5 h-5 text-brand-blue flex-shrink-0 mt-1"
                    :class="{ 'opacity-0': selectedTemplateJob !== job.id }"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <div class="flex-1">
                    <div class="font-semibold text-text-primary">{{ job.title }}</div>
                    <div class="text-sm text-text-tertiary">{{ job.location }} · {{ job.date }}</div>
                  </div>
                </div>
              </div>

              <div v-if="previousJobsFiltered.length === 0" class="text-sm text-text-tertiary py-4">
                No jobs match your search.
              </div>

              <div v-if="errors.template" class="text-red-900 text-sm font-semibold mt-4">
                {{ errors.template }}
              </div>
            </div>

            <!-- New post fields -->
            <div v-if="postType === 'new'" class="mt-6 pt-6 border-t border-border-default space-y-6">
              <!-- Job title -->
              <div>
                <label class="block text-base font-bold text-text-primary mb-2">
                  Job title <span class="text-red-900">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="jobTitle"
                    type="text"
                    placeholder=""
                    class="w-full px-4 py-2 border border-border-default rounded-lg text-base text-text-primary placeholder-text-tertiary"
                    @focus="toggleJobTitleSuggestions"
                    @input="showJobTitleSuggestions = true"
                  />

                  <!-- Job title suggestions dropdown -->
                  <div
                    v-if="showJobTitleSuggestions"
                    class="absolute top-full left-0 right-0 mt-1 bg-white border border-border-default rounded-lg shadow-lg z-50"
                  >
                    <div
                      v-for="suggestion in jobTitleSuggestions"
                      :key="suggestion"
                      class="px-4 py-3 hover:bg-gray-50 cursor-pointer text-base text-text-primary"
                      @click="selectJobTitleSuggestion(suggestion)"
                    >
                      {{ suggestion }}
                    </div>
                  </div>
                </div>
                <div v-if="errors.jobTitle" class="text-red-900 text-sm font-semibold mt-2">
                  {{ errors.jobTitle }}
                </div>
              </div>

              <!-- Location type -->
              <div>
                <label class="block text-base font-bold text-text-primary mb-3">
                  Job location type <span class="text-red-900">*</span>
                </label>
                <div class="border border-border-default rounded-lg overflow-hidden">
                  <button
                    class="w-full px-4 py-3 text-left flex items-center justify-between bg-white hover:bg-gray-50"
                  >
                    <span class="text-base text-text-primary">
                      {{
                        jobLocationTypeValue === 'in-person'
                          ? 'In person'
                          : jobLocationTypeValue === 'remote'
                          ? 'Fully remote'
                          : jobLocationTypeValue === 'hybrid'
                          ? 'Hybrid'
                          : 'On the road'
                      }}
                    </span>
                    <svg class="w-5 h-5 text-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  <div class="border-t border-border-default space-y-0">
                    <button
                      v-for="option in ['in-person', 'remote', 'hybrid', 'on-the-road']"
                      :key="option"
                      class="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
                      :class="{ 'bg-gray-50': jobLocationTypeValue === option }"
                      @click="selectLocationTypeOption(option as any)"
                    >
                      <svg
                        class="w-5 h-5 text-brand-blue flex-shrink-0"
                        :class="{ 'opacity-0': jobLocationTypeValue !== option }"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span class="text-base text-text-primary flex-1 text-left">
                        {{
                          option === 'in-person'
                            ? 'In person'
                            : option === 'remote'
                            ? 'Fully remote: no on-site work required'
                            : option === 'hybrid'
                            ? 'Hybrid: some on-site work required'
                            : 'On the road'
                        }}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Location fields (conditional) -->
              <div v-if="jobLocationTypeValue === 'in-person'">
                <label class="block text-base font-bold text-text-primary mb-2">
                  What is the job location? <span class="text-red-900">*</span>
                </label>
                <div class="text-sm text-text-secondary mb-2">Enter a street address or ZIP code</div>
                <input
                  v-model="jobLocation"
                  type="text"
                  placeholder=""
                  class="w-full px-4 py-2 border border-border-default rounded-lg text-base text-text-primary"
                />
                <div v-if="errors.jobLocation" class="text-red-900 text-sm font-semibold mt-2">
                  {{ errors.jobLocation }}
                </div>
              </div>

              <div v-if="jobLocationTypeValue === 'hybrid'">
                <label class="block text-base font-bold text-text-primary mb-2">
                  Street address <span class="text-red-900">*</span>
                </label>
                <input
                  v-model="hybridLocation"
                  type="text"
                  placeholder=""
                  class="w-full px-4 py-2 border border-border-default rounded-lg text-base text-text-primary"
                />
                <div v-if="errors.hybridLocation" class="text-red-900 text-sm font-semibold mt-2">
                  {{ errors.hybridLocation }}
                </div>
              </div>

              <div v-if="jobLocationTypeValue === 'remote'" class="space-y-4">
                <div>
                  <label class="block text-base font-semibold text-text-primary mb-3">
                    Are employees required to reside in a specific location?
                  </label>
                  <div class="space-y-3">
                    <label class="flex items-center gap-3 cursor-pointer">
                      <div class="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center"
                        :class="{ 'border-text-primary': remoteResideRequired === 'yes' }">
                        <div v-if="remoteResideRequired === 'yes'" class="w-2.5 h-2.5 bg-text-primary rounded-full" />
                      </div>
                      <span class="text-base text-text-primary">Yes</span>
                    </label>
                    <label class="flex items-center gap-3 cursor-pointer">
                      <div class="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center"
                        :class="{ 'border-text-primary': remoteResideRequired === 'no' }">
                        <div v-if="remoteResideRequired === 'no'" class="w-2.5 h-2.5 bg-text-primary rounded-full" />
                      </div>
                      <span class="text-base text-text-primary" @click="selectResideOption('no')">No</span>
                    </label>
                  </div>
                </div>

                <div v-if="remoteResideRequired === 'yes'">
                  <label class="block text-base font-bold text-text-primary mb-2">
                    In what location must employees reside? <span class="text-red-900">*</span>
                  </label>
                  <input
                    v-model="remoteResideLocation"
                    type="text"
                    placeholder=""
                    class="w-full px-4 py-2 border border-border-default rounded-lg text-base text-text-primary"
                  />
                  <div v-if="errors.remoteReside" class="text-red-900 text-sm font-semibold mt-2">
                    {{ errors.remoteReside }}
                  </div>
                </div>
              </div>

              <div v-if="jobLocationTypeValue === 'on-the-road'" class="space-y-4">
                <div>
                  <label class="block text-base font-semibold text-text-primary mb-3">
                    Does this job have a consistent starting location?
                  </label>
                  <div class="space-y-3">
                    <label class="flex items-center gap-3 cursor-pointer">
                      <div class="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center"
                        :class="{ 'border-text-primary': onRoadHasStartingLocation === 'yes' }">
                        <div v-if="onRoadHasStartingLocation === 'yes'" class="w-2.5 h-2.5 bg-text-primary rounded-full" />
                      </div>
                      <span class="text-base text-text-primary">Yes</span>
                    </label>
                    <label class="flex items-center gap-3 cursor-pointer">
                      <div class="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center"
                        :class="{ 'border-text-primary': onRoadHasStartingLocation === 'no' }">
                        <div v-if="onRoadHasStartingLocation === 'no'" class="w-2.5 h-2.5 bg-text-primary rounded-full" />
                      </div>
                      <span class="text-base text-text-primary">No</span>
                    </label>
                  </div>
                </div>

                <div v-if="onRoadHasStartingLocation === 'yes'">
                  <label class="block text-base font-bold text-text-primary mb-2">
                    Enter the street address of the starting location <span class="text-red-900">*</span>
                  </label>
                  <input
                    v-model="onRoadStartingLocation"
                    type="text"
                    placeholder=""
                    class="w-full px-4 py-2 border border-border-default rounded-lg text-base text-text-primary"
                  />
                  <div v-if="errors.onRoadAddress" class="text-red-900 text-sm font-semibold mt-2">
                    {{ errors.onRoadAddress }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Continue button -->
          <div class="flex justify-end">
            <button
              class="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-dark transition-colors"
              @click="continueFromStep(1)"
            >
              Continue
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>

        <!-- ════ STEP 2: ADD JOB DETAILS ════ -->
        <div v-show="currentStep === 2" class="space-y-6">
          <div class="bg-white rounded-lg p-8 mb-6 shadow-sm">
            <h2 class="text-4xl font-bold text-text-primary mb-8">Add job details</h2>

            <!-- Job type -->
            <div class="mb-8">
              <label class="block text-base font-bold text-text-primary mb-3">
                Job type <span class="text-red-900">*</span>
              </label>
              <div v-if="errors.jobType" class="text-red-900 text-sm font-semibold mb-3">
                {{ errors.jobType }}
              </div>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="(selected, type) in jobTypes"
                  :key="type"
                  class="px-4 py-2 rounded-full font-semibold text-sm border-2 transition-colors"
                  :class="
                    selected
                      ? 'border-brand-blue bg-white text-brand-blue'
                      : 'border-gray-300 bg-white text-text-primary hover:border-gray-400'
                  "
                  @click="toggleChip(type, 'types')"
                >
                  <svg
                    v-if="selected"
                    class="inline w-4 h-4 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {{ type }}
                </button>
              </div>
            </div>

            <!-- Pay section -->
            <div class="mb-8 pb-8 border-b border-border-default">
              <label class="block text-base font-bold text-text-primary mb-2">
                Pay <span class="text-red-900">*</span>
              </label>
              <div v-if="errors.pay" class="text-red-900 text-sm font-semibold mb-3">
                {{ errors.pay }}
              </div>

              <div class="text-sm text-text-secondary mb-4">
                Review the pay we estimated for your job and adjust as needed. Check your local minimum wage.
              </div>

              <div class="space-y-4">
                <!-- Pay type selector -->
                <div class="flex items-center gap-4">
                  <label class="text-sm text-text-secondary font-semibold">Show pay by</label>
                  <div class="border border-border-default rounded-lg overflow-hidden">
                    <button class="px-4 py-2 text-base text-text-primary hover:bg-gray-50">
                      {{
                        payBy === 'range'
                          ? 'Range'
                          : payBy === 'starting'
                          ? 'Starting amount'
                          : payBy === 'maximum'
                          ? 'Maximum amount'
                          : 'Exact amount'
                      }}
                    </button>
                    <div class="border-l border-border-default space-y-0">
                      <button
                        v-for="option in ['range', 'starting', 'maximum', 'exact']"
                        :key="option"
                        class="w-full px-4 py-2 text-left text-base hover:bg-gray-50 flex items-center gap-2"
                        :class="{ 'bg-gray-50': payBy === option }"
                        @click="selectPayBy(option as any)"
                      >
                        <svg
                          class="w-5 h-5 text-brand-blue flex-shrink-0"
                          :class="{ 'opacity-0': payBy !== option }"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {{
                          option === 'range'
                            ? 'Range'
                            : option === 'starting'
                            ? 'Starting amount'
                            : option === 'maximum'
                            ? 'Maximum amount'
                            : 'Exact amount'
                        }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Range inputs -->
                <div v-if="payBy === 'range'" class="flex items-end gap-4">
                  <div class="flex-1">
                    <label class="block text-sm text-text-secondary font-semibold mb-2">Minimum</label>
                    <div class="flex items-center gap-2 border border-border-default rounded-lg px-3">
                      <span class="text-text-secondary">$</span>
                      <input
                        v-model="payMinimum"
                        type="text"
                        class="flex-1 py-2 border-0 text-base text-text-primary"
                      />
                    </div>
                  </div>
                  <span class="text-text-secondary font-semibold">to</span>
                  <div class="flex-1">
                    <label class="block text-sm text-text-secondary font-semibold mb-2">Maximum</label>
                    <div class="flex items-center gap-2 border border-border-default rounded-lg px-3">
                      <span class="text-text-secondary">$</span>
                      <input
                        v-model="payMaximum"
                        type="text"
                        class="flex-1 py-2 border-0 text-base text-text-primary"
                      />
                    </div>
                  </div>
                </div>

                <!-- Single amount inputs -->
                <div v-else class="flex items-end gap-4">
                  <div class="flex-1">
                    <label class="block text-sm text-text-secondary font-semibold mb-2">Amount</label>
                    <div class="flex items-center gap-2 border border-border-default rounded-lg px-3">
                      <span class="text-text-secondary">$</span>
                      <input
                        v-model="paySingle"
                        type="text"
                        class="flex-1 py-2 border-0 text-base text-text-primary"
                      />
                    </div>
                  </div>
                </div>

                <!-- Rate selector -->
                <div class="flex items-center gap-4">
                  <label class="text-sm text-text-secondary font-semibold">Rate</label>
                  <div class="border border-border-default rounded-lg overflow-hidden">
                    <button class="px-4 py-2 text-base text-text-primary hover:bg-gray-50">
                      {{
                        payRate === 'per-hour'
                          ? 'per hour'
                          : payRate === 'per-day'
                          ? 'per day'
                          : payRate === 'per-week'
                          ? 'per week'
                          : payRate === 'per-month'
                          ? 'per month'
                          : 'per year'
                      }}
                    </button>
                    <div class="border-l border-border-default space-y-0">
                      <button
                        v-for="option in ['per-hour', 'per-day', 'per-week', 'per-month', 'per-year']"
                        :key="option"
                        class="w-full px-4 py-2 text-left text-base hover:bg-gray-50 flex items-center gap-2"
                        :class="{ 'bg-gray-50': payRate === option }"
                        @click="selectPayRate(option as any)"
                      >
                        <svg
                          class="w-5 h-5 text-brand-blue flex-shrink-0"
                          :class="{ 'opacity-0': payRate !== option }"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {{
                          option === 'per-hour'
                            ? 'per hour'
                            : option === 'per-day'
                            ? 'per day'
                            : option === 'per-week'
                            ? 'per week'
                            : option === 'per-month'
                            ? 'per month'
                            : 'per year'
                        }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Benefits -->
            <div class="mb-8">
              <label class="block text-base font-bold text-text-primary mb-3">Benefits</label>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="(selected, benefit) in jobBenefits"
                  :key="benefit"
                  class="px-4 py-2 rounded-full font-semibold text-sm border-2 transition-colors"
                  :class="
                    selected
                      ? 'border-brand-blue bg-white text-brand-blue'
                      : 'border-gray-300 bg-white text-text-primary hover:border-gray-400'
                  "
                  @click="toggleChip(benefit, 'benefits')"
                >
                  <svg
                    v-if="selected"
                    class="inline w-4 h-4 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {{ benefit }}
                </button>
              </div>
            </div>

            <!-- Shifts -->
            <div class="mb-8">
              <label class="block text-base font-bold text-text-primary mb-3">Standard Shift</label>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="(selected, shift) in jobShifts"
                  :key="shift"
                  class="px-4 py-2 rounded-full font-semibold text-sm border-2 transition-colors"
                  :class="
                    selected
                      ? 'border-brand-blue bg-white text-brand-blue'
                      : 'border-gray-300 bg-white text-text-primary hover:border-gray-400'
                  "
                  @click="toggleChip(shift, 'shifts')"
                >
                  <svg
                    v-if="selected"
                    class="inline w-4 h-4 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {{ shift }}
                </button>
              </div>
            </div>

            <!-- Schedule -->
            <div class="mb-8">
              <label class="block text-base font-bold text-text-primary mb-3">Weekly Schedule</label>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="(selected, schedule) in jobSchedule"
                  :key="schedule"
                  class="px-4 py-2 rounded-full font-semibold text-sm border-2 transition-colors"
                  :class="
                    selected
                      ? 'border-brand-blue bg-white text-brand-blue'
                      : 'border-gray-300 bg-white text-text-primary hover:border-gray-400'
                  "
                  @click="toggleChip(schedule, 'schedule')"
                >
                  <svg
                    v-if="selected"
                    class="inline w-4 h-4 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {{ schedule }}
                </button>
              </div>
            </div>

            <!-- Job description -->
            <div class="mb-8">
              <label class="block text-base font-bold text-text-primary mb-2">Job description</label>
              <textarea
                v-model="jobDescription"
                class="w-full px-4 py-3 border border-border-default rounded-lg text-base text-text-primary placeholder-text-tertiary"
                rows="6"
                placeholder="Describe the job and key responsibilities..."
              />
            </div>

            <!-- Important notice -->
            <div class="border border-red-200 rounded-lg p-5 bg-red-50">
              <div class="font-bold text-text-primary mb-2">
                <span class="text-red-900">*</span> Important notice
              </div>
              <div class="text-sm text-text-secondary mb-3">
                By posting this job, you agree to comply with all applicable employment laws and regulations.
              </div>
              <label class="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  v-model="importantNoticeAgreed"
                  class="mt-1"
                />
                <span class="text-sm text-text-primary">I understand and agree to these terms</span>
              </label>
              <div v-if="errors.importantNotice" class="text-red-900 text-sm font-semibold mt-2">
                {{ errors.importantNotice }}
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="flex justify-between">
            <button
              class="flex items-center gap-2 px-6 py-3 bg-white border border-border-default text-text-primary font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              @click="goBack"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back
            </button>
            <button
              class="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-dark transition-colors"
              @click="continueFromStep(2)"
            >
              Continue
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>

        <!-- ════ STEP 3: REVIEW ════ -->
        <div v-show="currentStep === 3" class="space-y-6">
          <div class="bg-white rounded-lg p-8 mb-6 shadow-sm">
            <h2 class="text-4xl font-bold text-text-primary mb-8">Review</h2>

            <div class="mb-6 font-bold text-text-secondary">Job details</div>

            <table class="w-full">
              <tbody class="divide-y divide-border-default">
                <tr class="hover:bg-gray-50">
                  <td class="py-4 pr-4 text-base text-text-primary font-semibold w-32">Job title</td>
                  <td class="py-4 pr-4 text-base text-text-primary">{{ reviewData.jobTitle }}</td>
                  <td class="py-4 w-12 flex justify-center">
                    <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <rect x="4" y="11" width="16" height="10" rx="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                  </td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="py-4 pr-4 text-base text-text-primary font-semibold">Location</td>
                  <td class="py-4 pr-4 text-base text-text-primary">{{ reviewData.location }}</td>
                  <td class="py-4 w-12 flex justify-center">
                    <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <rect x="4" y="11" width="16" height="10" rx="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                  </td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="py-4 pr-4 text-base text-text-primary font-semibold">Job type</td>
                  <td class="py-4 pr-4 text-base text-text-primary">{{ reviewData.jobType }}</td>
                  <td class="py-4 w-12 flex justify-center">
                    <button class="p-1 hover:bg-gray-200 rounded-lg transition-colors" title="Edit">
                      <svg class="w-5 h-5 text-text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="py-4 pr-4 text-base text-text-primary font-semibold">Pay</td>
                  <td class="py-4 pr-4 text-base text-text-primary">{{ reviewData.pay }}</td>
                  <td class="py-4 w-12 flex justify-center">
                    <button class="p-1 hover:bg-gray-200 rounded-lg transition-colors" title="Edit">
                      <svg class="w-5 h-5 text-text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="py-4 pr-4 text-base text-text-primary font-semibold">Benefits</td>
                  <td class="py-4 pr-4 text-base text-text-primary">{{ reviewData.benefits }}</td>
                  <td class="py-4 w-12 flex justify-center">
                    <button class="p-1 hover:bg-gray-200 rounded-lg transition-colors" title="Edit">
                      <svg class="w-5 h-5 text-text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="py-4 pr-4 text-base text-text-primary font-semibold">Standard Shift</td>
                  <td class="py-4 pr-4 text-base text-text-primary">{{ reviewData.shift }}</td>
                  <td class="py-4 w-12 flex justify-center">
                    <button class="p-1 hover:bg-gray-200 rounded-lg transition-colors" title="Edit">
                      <svg class="w-5 h-5 text-text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="py-4 pr-4 text-base text-text-primary font-semibold">Weekly Schedule</td>
                  <td class="py-4 pr-4 text-base text-text-primary">{{ reviewData.schedule }}</td>
                  <td class="py-4 w-12 flex justify-center">
                    <button class="p-1 hover:bg-gray-200 rounded-lg transition-colors" title="Edit">
                      <svg class="w-5 h-5 text-text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="py-4 pr-4 text-base text-text-primary font-semibold">Job description</td>
                  <td class="py-4 pr-4 text-base text-text-primary">
                    <div class="text-sm text-text-secondary line-clamp-2">{{ reviewData.description || '(Not provided)' }}</div>
                  </td>
                  <td class="py-4 w-12 flex justify-center">
                    <button class="p-1 hover:bg-gray-200 rounded-lg transition-colors" title="Edit">
                      <svg class="w-5 h-5 text-text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Navigation -->
          <div class="flex justify-between">
            <button
              class="flex items-center gap-2 px-6 py-3 bg-white border border-border-default text-text-primary font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              @click="goToStep(2)"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back
            </button>
            <button
              class="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-dark transition-colors"
              @click="goToStep(4)"
            >
              Confirm
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>

        <!-- ════ STEP 4: JOB DETAILS CONFIRMATION ════ -->
        <div v-show="currentStep === 4" class="space-y-6">
          <h2 class="text-4xl font-bold text-text-primary mb-8">Your Jobs</h2>

          <div class="grid gap-6">
            <div v-for="job in createdJobs" :key="job.id" class="bg-white rounded-lg p-8 shadow-sm">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-2xl font-bold text-text-primary">{{ job.title }}</h3>
                  <div class="text-base text-text-secondary mt-1">{{ job.location }} · {{ job.type }}</div>
                </div>
                <div class="flex gap-2">
                  <button
                    class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                    @click="editJob(job.id)"
                  >
                    <svg class="w-5 h-5 text-text-primary" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                  </button>
                  <button
                    class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Duplicate"
                    @click="duplicateJob(job.id)"
                  >
                    <svg class="w-5 h-5 text-text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                  </button>
                  <button
                    class="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete"
                    @click="removeJob(job.id)"
                  >
                    <svg class="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="text-base text-text-secondary mb-4">{{ job.pay }}</div>

              <div class="text-sm text-text-secondary line-clamp-3">{{ job.description }}</div>
            </div>
          </div>

          <!-- Add another job or continue -->
          <div class="flex justify-between mt-8">
            <button
              class="flex items-center gap-2 px-6 py-3 bg-white border border-border-default text-text-primary font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              @click="goBack"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back
            </button>
            <button
              class="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-dark transition-colors"
              @click="goToStep(5)"
            >
              Continue
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>

        <!-- ════ STEP 5: INTERVIEW SETTINGS ════ -->
        <div v-show="currentStep === 5" class="space-y-6">
          <div class="bg-white rounded-lg p-8 mb-6 shadow-sm">
            <h2 class="text-4xl font-bold text-text-primary mb-8">Interview Settings</h2>

            <!-- Interview count -->
            <div class="mb-8">
              <label class="block text-base font-bold text-text-primary mb-4">
                How many interviews do you want to conduct?
              </label>
              <div class="flex items-center gap-4">
                <button
                  class="w-12 h-12 border border-border-default rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  @click="decrementInterviewCount"
                >
                  −
                </button>
                <span class="text-2xl font-bold text-text-primary w-12 text-center">{{ interviewCount }}</span>
                <button
                  class="w-12 h-12 border border-border-default rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  @click="incrementInterviewCount"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Interviewer emails -->
            <div>
              <label class="block text-base font-bold text-text-primary mb-3">Add interviewers</label>
              <div class="flex gap-2 mb-4">
                <input
                  v-model="interviewerEmailInput"
                  type="email"
                  placeholder="Enter email address"
                  class="flex-1 px-4 py-2 border border-border-default rounded-lg text-base text-text-primary placeholder-text-tertiary"
                  @keydown.enter="addInterviewerEmail"
                />
                <button
                  class="px-4 py-2 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-dark transition-colors"
                  @click="addInterviewerEmail"
                >
                  Add
                </button>
              </div>

              <div class="flex flex-wrap gap-2">
                <div
                  v-for="(email, index) in interviewerEmails"
                  :key="index"
                  class="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full text-sm text-text-primary"
                >
                  {{ email }}
                  <button
                    class="ml-1 hover:opacity-70 transition-opacity"
                    @click="removeInterviewerEmail(index)"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="flex justify-between">
            <button
              class="flex items-center gap-2 px-6 py-3 bg-white border border-border-default text-text-primary font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              @click="goBack"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back
            </button>
            <button
              class="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-dark transition-colors"
              @click="goToStep(6)"
            >
              Continue
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>

        <!-- ════ STEP 6: SCREENING ════ -->
        <div v-show="currentStep === 6" class="space-y-6">
          <div class="bg-white rounded-lg p-8 mb-6 shadow-sm">
            <h2 class="text-4xl font-bold text-text-primary mb-8">Screening Questions</h2>

            <div class="space-y-6">
              <div v-for="question in screeningQuestions" :key="question.id" class="border border-border-default rounded-lg p-6">
                <div class="flex items-start justify-between mb-4">
                  <input
                    :value="question.question"
                    type="text"
                    placeholder="Enter screening question"
                    class="flex-1 px-4 py-2 border border-border-default rounded-lg text-base text-text-primary"
                    @input="updateScreeningQuestion(question.id, 'question', ($event.target as HTMLInputElement).value)"
                  />
                  <button
                    class="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    @click="removeScreeningQuestion(question.id)"
                  >
                    <svg class="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>

                <div class="flex items-center gap-4">
                  <label class="text-base font-semibold text-text-primary">Question type:</label>
                  <select
                    :value="question.type"
                    class="px-4 py-2 border border-border-default rounded-lg text-base text-text-primary"
                    @change="updateScreeningQuestion(question.id, 'type', ($event.target as HTMLSelectElement).value)"
                  >
                    <option value="text">Short answer</option>
                    <option value="multiple">Multiple choice</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Add question button -->
            <button
              class="mt-6 px-4 py-2 border border-brand-blue text-brand-blue font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              @click="addScreeningQuestion"
            >
              + Add Screening Question
            </button>
          </div>

          <!-- Navigation -->
          <div class="flex justify-between">
            <button
              class="flex items-center gap-2 px-6 py-3 bg-white border border-border-default text-text-primary font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              @click="goBack"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back
            </button>
            <button
              class="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-dark transition-colors"
              @click="goToStep(7)"
            >
              Continue
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>

        <!-- ════ STEP 7: REVIEW INTERVIEW DETAILS ════ -->
        <div v-show="currentStep === 7" class="space-y-6">
          <div class="bg-white rounded-lg p-8 mb-6 shadow-sm">
            <h2 class="text-4xl font-bold text-text-primary mb-8">Review Interview Details</h2>

            <!-- Interview settings review -->
            <div class="space-y-6">
              <div class="border-b border-border-default pb-6">
                <div class="font-bold text-text-secondary mb-2">Number of interviews</div>
                <div class="text-base text-text-primary">{{ interviewCount }}</div>
              </div>

              <div>
                <div class="font-bold text-text-secondary mb-3">Interviewers</div>
                <div class="space-y-2">
                  <div v-for="(email, index) in interviewerEmails" :key="index" class="flex items-center gap-3">
                    <div class="text-base text-text-primary">{{ email }}</div>
                  </div>
                  <div v-if="interviewerEmails.length === 0" class="text-base text-text-tertiary">No interviewers added</div>
                </div>
              </div>

              <div class="border-t border-border-default pt-6">
                <div class="font-bold text-text-secondary mb-2">Screening questions</div>
                <div class="space-y-3">
                  <div v-for="(question, index) in screeningQuestions" :key="question.id" class="text-base text-text-primary">
                    {{ index + 1 }}. {{ question.question || '(Untitled question)' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="flex justify-between">
            <button
              class="flex items-center gap-2 px-6 py-3 bg-white border border-border-default text-text-primary font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              @click="goBack"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back
            </button>
            <button
              class="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              @click="goToStep(1); currentStep = 1"
            >
              Complete Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
