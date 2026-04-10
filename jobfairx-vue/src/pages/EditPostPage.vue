<!--
  EditPostPage
  -----------
  Pixel-perfect port of edit-post.html for JobFairX employer dashboard.
  Full TypeScript strict mode support with comprehensive interactivity:

  Sections:
    - Header card with illustration and "Edit your Jobs & Settings" title
    - Incomplete setup banner (conditional based on jobs/interview setup state)
    - Event Details (read-only display)
    - Custom Emails (toggle + rich editor with tags)
    - Interviewing For (job cards, package usage, empty state)
    - Interview Details (expandable: slot count spinner, staffing info)
    - Screening (expandable: per-job management, multiple jobs modal)
    - Application Link (toggle + URL input)
    - Interview Settings (toggle + email input fields)
    - Modals: Add screener question, add screening to multiple jobs
    - Toast notifications
    - Dev toggles for package tier and setup state

  All inline SVG icons. Tailwind-only styling (no scoped styles).
-->

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLayoutState } from '@/layouts/useLayoutState'

// ═══ Types ═══
type SetupState = 'complete' | 'jobs-incomplete' | 'interview-incomplete'
type PackageTier = 'Starter' | 'Growth' | 'Pro'
type ScreeningResponseType = 'yesno' | 'numeric' | ''
type ScreeningMode = 'add' | 'edit'

interface Job {
  id: string
  name: string
  salary: string
  description: string
}

interface ScreeningQuestion {
  id?: string
  text: string
  responseType: ScreeningResponseType
  mustHave: 'yes' | 'no' | ''
  requiredResponse?: 'yes' | 'no'
  requiredMinimum?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
}

interface JobScreening {
  jobIndex: number
  jobName: string
  hasScreening: boolean
  question: ScreeningQuestion | null
}

interface InterviewEmail {
  value: string
}

// ═══ Layout State ═══
const { devMode } = useLayoutState()

// ═══ State: Setup and Package ═══
const setupState = ref<SetupState | null>('interview-incomplete')
const packageTier = ref<PackageTier | null>('Growth')

// ═══ State: Event Details ═══
const eventName = ref('Dallas Healthcare Hiring Event')
const eventDate = ref('April 22, 2026')
const eventTime = ref('11:00 AM – 3:00 PM')

// ═══ State: Jobs ═══
const jobs = ref<Job[]>([
  {
    id: 'rn',
    name: 'Registered Nurse',
    salary: '$55,000 – $72,000 / year, Full-time',
    description: 'We are seeking a compassionate and skilled Registered Nurse to join our healthcare team. The ideal candidate will provide high-quality patient care in a fast-paced environment and collaborate with a multidisciplinary team to ensure the best outco...',
  },
  {
    id: 'ma',
    name: 'Medical Assistant',
    salary: '$38,000 – $48,000 / year, Full-time',
    description: 'Join our growing clinic as a Medical Assistant supporting physicians and nurses in delivering excellent patient care. You will handle clinical and administrative duties including patient intake, vitals, scheduling, and electronic health recor...',
  },
])

// ═══ State: Custom Emails ═══
const customEmailEnabled = ref(false)
const customEmailSectionOpen = ref(false)
const customEmailData = ref({
  from: '',
  subject: '',
  body: '',
})

// ═══ State: Interview Details ═══
const interviewDetailsOpen = ref(false)
const interviewsPerSlot = ref(3)
const startAdvertisingDate = ref('04/07/2026')

// ═══ State: Screening ═══
const screeningOpen = ref(false)
const screeningData = ref<JobScreening[]>([
  { jobIndex: 0, jobName: 'Registered Nurse', hasScreening: false, question: null },
  { jobIndex: 1, jobName: 'Medical Assistant', hasScreening: false, question: null },
])
const currentScreeningJobIndex = ref<number | null>(null)
const currentScreeningMode = ref<ScreeningMode>('add')

// ═══ State: Screener Modal ═══
const addScreenerModalOpen = ref(false)
const questionText = ref('')
const responseType = ref<ScreeningResponseType>('')
const mustHave = ref<'yes' | 'no' | ''>('')
const requiredResponse = ref<'yes' | 'no' | ''>('')
const requiredMinimum = ref<string>('')

// ═══ State: Multiple Screening Modal ═══
const multipleScreeningModalOpen = ref(false)
const multipleScreeningSelected = ref<Set<number>>(new Set())

// ═══ State: Application Link ═══
const appLinkOpen = ref(false)
const appLinkValue = ref('')

// ═══ State: Interview Settings ═══
const interviewSettingsOpen = ref(false)
const interviewerEmails = ref<InterviewEmail[]>([{ value: 'scott@jobfairx.com' }])
const updateRecipientEmails = ref<InterviewEmail[]>([{ value: '' }])
const accommodationsEmails = ref<InterviewEmail[]>([{ value: 'scott@jobfairx.com' }])

// ═══ State: Toast ═══
const toastMessage = ref('')
const toastVisible = ref(false)

// ═══ Computed ═══
const jobsAddedCount = computed(() => jobs.value.length)
const maxJobsForPackage = computed(() => {
  switch (packageTier.value) {
    case 'Starter':
      return 1
    case 'Growth':
      return 3
    case 'Pro':
      return 6
    case null:
      return 3
    default:
      const _: never = packageTier.value
      return _
  }
})

const packageLabel = computed(() => {
  return `${packageTier.value} package · ${jobsAddedCount.value} of ${maxJobsForPackage.value} jobs added`
})

const incompleteSetupVisible = computed(() => setupState.value && setupState.value !== 'complete')

const shouldShowJobsIncomplete = computed(() => setupState.value === 'jobs-incomplete')
const shouldShowInterviewIncomplete = computed(() => setupState.value === 'interview-incomplete')

const screeningCount = computed(() => screeningData.value.filter((j) => j.hasScreening).length)

const expectedCandidates = computed(() => interviewsPerSlot.value)
const staffingRecommendation = computed(() => interviewsPerSlot.value)

// ═══ Methods: Toggle Sections ═══
const toggleCustomEmail = (show: boolean): void => {
  customEmailSectionOpen.value = show
  customEmailEnabled.value = show
}

const toggleInterviewDetails = (show: boolean): void => {
  interviewDetailsOpen.value = show
}

const toggleScreening = (show: boolean): void => {
  screeningOpen.value = show
}

const toggleAppLink = (show: boolean): void => {
  appLinkOpen.value = show
}

const toggleInterviewSettings = (show: boolean): void => {
  interviewSettingsOpen.value = show
}

// ═══ Methods: Interview Details ═══
const adjustSlotCount = (delta: number): void => {
  let val = interviewsPerSlot.value + delta
  if (val < 1) val = 1
  if (val > 20) val = 20
  interviewsPerSlot.value = val
}

// ═══ Methods: Screening Modal ═══
const openAddScreener = (jobIndex: number): void => {
  currentScreeningJobIndex.value = jobIndex
  currentScreeningMode.value = 'add'

  // Reset form
  questionText.value = ''
  responseType.value = ''
  mustHave.value = ''
  requiredResponse.value = ''
  requiredMinimum.value = ''

  addScreenerModalOpen.value = true
}

const closeAddScreenerModal = (): void => {
  addScreenerModalOpen.value = false
}

const updateConditionalFields = (): void => {
  // Show/hide conditional fields based on responseType
}

const saveScreenerQuestion = (): void => {
  if (currentScreeningJobIndex.value === null) return

  const jobIndex = currentScreeningJobIndex.value
  const question: ScreeningQuestion = {
    text: questionText.value,
    responseType: responseType.value,
    mustHave: mustHave.value,
    requiredResponse: requiredResponse.value as 'yes' | 'no' | undefined,
    requiredMinimum: requiredMinimum.value as
      | '1'
      | '2'
      | '3'
      | '4'
      | '5'
      | '6'
      | '7'
      | '8'
      | '9'
      | '10'
      | undefined,
  }

  screeningData.value[jobIndex]!.hasScreening = true
  screeningData.value[jobIndex]!.question = question

  closeAddScreenerModal()
  showToast('Screening question added')
}

// ═══ Methods: Multiple Screening Modal ═══
const openMultipleScreening = (): void => {
  multipleScreeningSelected.value.clear()
  multipleScreeningModalOpen.value = true
}

const closeMultipleScreeningModal = (): void => {
  multipleScreeningModalOpen.value = false
}

const toggleJobSelection = (jobIndex: number): void => {
  if (multipleScreeningSelected.value.has(jobIndex)) {
    multipleScreeningSelected.value.delete(jobIndex)
  } else {
    multipleScreeningSelected.value.add(jobIndex)
  }
}

const proceedMultipleScreening = (): void => {
  if (multipleScreeningSelected.value.size === 0) {
    alert('Please select at least one job')
    return
  }

  closeMultipleScreeningModal()

  // Open screener modal for first selected job
  const selected = Array.from(multipleScreeningSelected.value)[0]
  if (selected !== undefined) {
    openAddScreener(selected)
  }
}

// ═══ Methods: Setup State Dev Toggle ═══
const cycleSetupState = (): void => {
  const states: SetupState[] = ['complete', 'jobs-incomplete', 'interview-incomplete']
  const currentIndex = setupState.value ? states.indexOf(setupState.value) : -1
  setupState.value = states[(currentIndex + 1) % states.length] ?? 'complete'
}

const cyclePackageTier = (): void => {
  const tiers: PackageTier[] = ['Starter', 'Growth', 'Pro']
  const currentIndex = packageTier.value ? tiers.indexOf(packageTier.value) : -1
  packageTier.value = tiers[(currentIndex + 1) % tiers.length] ?? 'Growth'
}

// ═══ Methods: Toast ═══
const showToast = (msg: string = 'Changes saved'): void => {
  toastMessage.value = msg
  toastVisible.value = true
  setTimeout(() => {
    toastVisible.value = false
  }, 2500)
}

// ═══ Methods: Navigation ═══
const goBack = (): void => {
  window.history.back()
}

// ═══ Note: All SVG icons are inlined in the template ═══
</script>

<template>
  <div class="max-w-[820px] mx-auto px-8 py-8 pb-16">
    <!-- Back link -->
    <a
      @click="goBack"
      class="inline-flex items-center gap-1.5 text-base text-brand-blue font-bold mb-7 cursor-pointer hover:underline"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      Back to dashboard
    </a>

    <!-- Header card -->
    <div class="bg-white border border-border-strong rounded-lg px-10 py-10 mb-7 flex items-center justify-between">
      <div>
        <h1 class="text-5xl font-bold text-text-primary leading-tight">Edit your Jobs<br />& Settings</h1>
      </div>
      <!-- Illustration SVG -->
      <svg class="w-[140px] h-[100px] flex-shrink-0" viewBox="0 0 140 100" fill="none">
        <rect x="10" y="52" width="110" height="34" rx="4" fill="#f0ebe4" />
        <rect x="22" y="36" width="44" height="32" rx="4" fill="#e0d6ca" />
        <rect x="27" y="41" width="34" height="22" rx="2" fill="#fff" stroke="#d4c4b0" stroke-width="1" />
        <rect x="31" y="48" width="24" height="2" rx="1" fill="#d4d2d0" />
        <rect x="31" y="53" width="18" height="2" rx="1" fill="#d4d2d0" />
        <circle cx="92" cy="40" r="11" fill="#8fbc8f" opacity="0.7" />
        <circle cx="100" cy="33" r="9" fill="#7da67d" opacity="0.8" />
        <circle cx="86" cy="31" r="7" fill="#a8d5a8" opacity="0.6" />
        <rect x="90" y="50" width="4" height="18" rx="2" fill="#c17f59" />
        <rect x="76" y="58" width="6" height="12" rx="2" fill="#d4956b" opacity="0.5" />
        <circle cx="54" cy="28" r="8" fill="#f0c8a0" />
        <rect x="48" y="36" width="13" height="9" rx="3" fill="#0044B3" opacity="0.8" />
      </svg>
    </div>

    <!-- Incomplete setup banner -->
    <div
      v-if="incompleteSetupVisible"
      class="flex items-center justify-between gap-4 bg-status-danger-bg border border-status-danger-border border-l-4 border-l-[#991b1b] rounded-md px-6 py-5 mb-6"
    >
      <div class="flex items-center gap-4 flex-1 min-w-0">
        <div class="w-8 h-8 rounded-full bg-[#991b1b] flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
            <path d="M12 8v5" />
            <path d="M12 17h.01" />
          </svg>
        </div>
        <div class="min-w-0">
          <div class="text-md font-bold text-[#991b1b] mb-0.5">
            {{ shouldShowJobsIncomplete ? 'You haven\'t added any jobs yet' : 'Your interview setup isn\'t finished' }}
          </div>
          <div class="text-sm text-[#7f1d1d] leading-relaxed">
            {{
              shouldShowJobsIncomplete
                ? 'Add your first job so candidates can apply and request interviews.'
                : 'Finish your interview details so candidates can sign up for time slots.'
            }}
          </div>
        </div>
      </div>
      <div class="flex gap-2.5 flex-shrink-0">
        <button
          v-if="shouldShowJobsIncomplete"
          @click="showToast('Navigate to jobs')"
          class="flex-shrink-0 bg-[#991b1b] text-white px-5 py-3 rounded-lg text-sm font-bold cursor-pointer hover:bg-[#7f1d1d] transition-colors whitespace-nowrap"
        >
          Add jobs
        </button>
        <button
          v-if="shouldShowInterviewIncomplete"
          @click="toggleInterviewDetails(true)"
          class="flex-shrink-0 bg-[#991b1b] text-white px-5 py-3 rounded-lg text-sm font-bold cursor-pointer hover:bg-[#7f1d1d] transition-colors whitespace-nowrap"
        >
          Set up interviews
        </button>
      </div>
    </div>

    <!-- SECTION: Event Details -->
    <div class="bg-white border border-border-strong rounded-lg mb-6 overflow-hidden">
      <div class="flex items-center justify-between px-9 py-7">
        <h2 class="text-2xl font-bold text-text-primary">Event details</h2>
      </div>
      <div class="h-px bg-[#e0e0e0]" />
      <div class="px-9 py-8">
        <p class="text-lg text-text-secondary leading-relaxed">
          {{ eventName }}<br />
          {{ eventDate }} &middot; {{ eventTime }}
        </p>
      </div>
    </div>

    <!-- SECTION: Custom Emails -->
    <div class="bg-white border border-border-strong rounded-lg mb-6 overflow-hidden">
      <div class="flex items-center justify-between px-9 py-7">
        <h2 class="text-2xl font-bold text-text-primary">Custom emails</h2>
        <button
          @click="toggleCustomEmail(true)"
          class="w-11 h-11 flex items-center justify-center text-brand-blue rounded-lg hover:bg-brand-blue-light transition-colors"
          title="Edit custom emails"
        >
          <svg viewBox="0 0 24 24" class="w-6 h-6 fill-brand-blue">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
      </div>
      <div class="h-px bg-[#e0e0e0]" />
      <div class="px-9 py-8">
        <div class="flex items-center gap-3.5">
          <label class="relative w-12 h-7 flex-shrink-0">
            <input v-model="customEmailEnabled" @change="toggleCustomEmail(customEmailEnabled)" type="checkbox" class="opacity-0 w-0 h-0" />
            <span :class="['absolute inset-0 rounded-full transition-colors duration-200', customEmailEnabled ? 'bg-brand-blue' : 'bg-border-strong']">
              <span
                :class="['absolute w-5.5 h-5.5 bg-white rounded-full transition-transform duration-200', customEmailEnabled ? 'translate-x-[20px] bottom-0.5 right-0.5' : 'translate-x-0.5 bottom-0.5 left-0.5']"
              />
            </span>
          </label>
          <span class="text-lg text-text-primary font-semibold">Send a custom email to all candidates</span>
        </div>

        <!-- Expandable Custom Email Section -->
        <div v-if="customEmailSectionOpen" class="mt-6">
          <h3 class="text-2xl font-bold text-text-primary mb-3 mt-6">How this works</h3>
          <p class="text-md text-text-secondary leading-relaxed mb-7">
            When a candidate is invited to your event, they'll receive your custom email instead of the default JobFairX invitation. This lets you personalize the message with your company's voice and any details candidates should know before the interview.
          </p>

          <h3 class="text-2xl font-bold text-text-primary mb-3">Things to include</h3>
          <ul class="space-y-2.5 mb-7">
            <li class="flex items-start gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0044B3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 flex-shrink-0 mt-0.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span class="text-md text-text-secondary leading-relaxed">A warm greeting that reflects your company culture</span>
            </li>
            <li class="flex items-start gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0044B3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 flex-shrink-0 mt-0.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span class="text-md text-text-secondary leading-relaxed">Details about the interview format, duration, or what to expect</span>
            </li>
            <li class="flex items-start gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0044B3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 flex-shrink-0 mt-0.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span class="text-md text-text-secondary leading-relaxed">Any preparation steps candidates should complete beforehand</span>
            </li>
          </ul>

          <!-- Email form -->
          <div class="border border-border-strong rounded-md overflow-hidden mb-5">
            <div class="flex items-center px-5 py-3.5 border-b border-[#e8e6e3] gap-3">
              <span class="text-base text-text-secondary whitespace-nowrap min-w-15">To</span>
              <div class="flex items-center gap-2 flex-wrap flex-1">
                <span class="inline-flex items-center bg-surface-sunken border border-border-strong rounded px-3 py-1 text-sm font-semibold text-text-primary">All new applicants</span>
              </div>
            </div>
            <div class="flex items-center px-5 py-3.5 border-b border-[#e8e6e3] gap-3">
              <span class="text-base text-text-secondary whitespace-nowrap min-w-15">From</span>
              <select class="px-3 py-1.5 text-base bg-white border border-border-strong rounded text-text-tertiary cursor-pointer">
                <option>Select an email address</option>
                <option>scott@jobfairx.com</option>
              </select>
            </div>
            <div class="flex items-center px-5 py-3.5 border-b border-[#e8e6e3] gap-3 flex-wrap">
              <span class="text-base text-text-secondary whitespace-nowrap min-w-15">Subject</span>
              <div class="flex items-center gap-2 flex-wrap flex-1">
                <span class="inline-flex items-center bg-surface-sunken border border-border-strong rounded px-3 py-1 text-sm font-semibold text-text-primary">Applicant's first name</span>
                <input v-model="customEmailData.subject" type="text" placeholder=", you're invited to interview at Dallas Healthcare Hiring Event" class="border-none outline-none text-md font-normal text-text-primary flex-1 min-w-24 bg-white" />
              </div>
            </div>
            <div class="flex items-center px-5 py-3.5 gap-3 flex-wrap">
              <span class="text-base text-text-secondary whitespace-nowrap min-w-15">Greeting</span>
              <div class="flex items-center gap-2 flex-wrap flex-1">
                <span class="text-md text-text-primary">Hi</span>
                <span class="inline-flex items-center bg-surface-sunken border border-border-strong rounded px-3 py-1 text-sm font-semibold text-text-primary">Applicant's first name</span>
                <span class="text-md text-text-primary">,</span>
              </div>
            </div>
          </div>

          <!-- Rich text editor -->
          <div class="border border-border-strong rounded-md overflow-hidden mb-5">
            <div class="flex items-center px-3 py-2 bg-surface-sunken border-b border-border-strong gap-1">
              <button class="w-8 h-8 flex items-center justify-center rounded text-text-primary font-black hover:bg-[#e8e6e3] transition-colors font-noto" title="Bold">B</button>
              <button class="w-8 h-8 flex items-center justify-center rounded text-text-primary italic hover:bg-[#e8e6e3] transition-colors font-serif" title="Italic">I</button>
              <button class="w-8 h-8 flex items-center justify-center rounded text-text-primary hover:bg-[#e8e6e3] transition-colors" title="List">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="2" cy="3" r="1.5" />
                  <rect x="5" y="2" width="10" height="2" rx="1" />
                  <circle cx="2" cy="8" r="1.5" />
                  <rect x="5" y="7" width="10" height="2" rx="1" />
                  <circle cx="2" cy="13" r="1.5" />
                  <rect x="5" y="12" width="10" height="2" rx="1" />
                </svg>
              </button>
            </div>
            <textarea v-model="customEmailData.body" placeholder="Write your custom email message here..." class="w-full min-h-[180px] border-none outline-none p-3.5 text-md font-normal text-text-primary resize-vertical bg-white leading-relaxed" />
          </div>

          <div class="flex items-center gap-2.5 text-base text-text-secondary mb-7">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="8" cy="8" r="6.5" />
              <path d="M8 5v0m0 2.5v4" stroke-linecap="round" />
            </svg>
            <span>
              Use <span class="inline-flex items-center bg-surface-sunken border border-border-strong rounded px-3 py-1 text-sm font-semibold text-text-primary mx-1">Applicant's first name</span>
              to personalize each email automatically.
            </span>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-4 mt-7 pt-6">
            <button @click="toggleCustomEmail(false)" class="bg-transparent border-none text-base font-bold text-brand-blue cursor-pointer px-5.5 py-2.5 rounded hover:bg-brand-blue-light transition-colors">
              Cancel
            </button>
            <button
              @click="toggleCustomEmail(false); showToast()"
              class="bg-brand-blue border-none text-lg font-bold text-white cursor-pointer px-7 py-3.5 rounded hover:bg-brand-blue-dark transition-colors"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION: Interviewing For -->
    <div :class="['bg-white border rounded-lg mb-6 overflow-hidden', shouldShowJobsIncomplete ? 'border-status-danger-border' : 'border-border-strong']">
      <div class="flex items-center justify-between px-9 py-7">
        <div class="flex items-center gap-3">
          <h2 class="text-2xl font-bold text-text-primary">Interviewing For</h2>
          <span v-if="shouldShowJobsIncomplete" class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#fee2e2] text-[#991b1b] rounded-full text-xs font-bold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v5" />
              <path d="M12 17h.01" />
            </svg>
            Incomplete
          </span>
        </div>
      </div>
      <div class="h-px bg-[#e0e0e0]" />
      <div class="px-9 py-8">
        <div class="text-sm text-text-secondary leading-relaxed mb-5">{{ packageLabel }}</div>

        <!-- Job cards -->
        <div v-if="!shouldShowJobsIncomplete" class="space-y-0">
          <div v-for="(job, idx) in jobs" :key="job.id" :class="['py-6.5', idx > 0 ? 'border-t border-[#ebebeb]' : '']">
            <div class="flex items-start justify-between">
              <div>
                <div class="text-2xl font-bold text-text-primary">{{ job.name }}</div>
                <div class="text-base text-brand-blue underline mt-1.5">{{ job.salary }}</div>
              </div>
              <div class="flex items-center gap-3.5">
                <button
                  @click="showToast('Opening job editor...')"
                  class="inline-flex items-center gap-1.5 px-5.5 py-2.5 rounded border border-border-strong bg-white text-base font-bold text-text-primary cursor-pointer hover:bg-[#f6f5f3] hover:border-text-primary transition-colors whitespace-nowrap"
                >
                  Edit
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="text-base text-text-tertiary mt-3.5 leading-relaxed">{{ job.description }}</div>
          </div>

          <!-- Add job button -->
          <div class="flex gap-3 mt-6 pt-5 border-t border-[#ebebeb]">
            <button @click="showToast('Navigate to job creation')" class="px-5.5 py-2.5 rounded border border-border-strong bg-white text-base font-bold text-brand-blue cursor-pointer hover:bg-brand-blue-light hover:border-brand-blue transition-colors">
              Create a new job
            </button>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="shouldShowJobsIncomplete" class="flex flex-col items-center text-center py-11 px-6 bg-white border border-[#ebebeb] rounded-md mb-1">
          <div class="w-14 h-14 rounded-full bg-brand-blue-light flex items-center justify-center mb-3.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="#0044B3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6.5 h-6.5">
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="3" y1="13" x2="21" y2="13" />
            </svg>
          </div>
          <div class="text-xl font-bold text-text-primary mb-1.5">No jobs added yet</div>
          <div class="text-base text-text-secondary leading-relaxed max-w-sm">Add your first job so candidates can apply and request interviews.</div>
          <button @click="showToast('Navigate to job creation')" class="px-5.5 py-2.5 rounded border border-border-strong bg-white text-base font-bold text-brand-blue cursor-pointer hover:bg-brand-blue-light hover:border-brand-blue transition-colors mt-4.5">
            Create a new job
          </button>
        </div>
      </div>
    </div>

    <!-- SECTION: Interview Details -->
    <div :class="['bg-white border rounded-lg mb-6 overflow-hidden', shouldShowInterviewIncomplete ? 'border-status-danger-border' : 'border-border-strong']">
      <div class="flex items-center justify-between px-9 py-7">
        <div class="flex items-center gap-3">
          <h2 class="text-2xl font-bold text-text-primary">Interview details</h2>
          <span v-if="shouldShowInterviewIncomplete" class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#fee2e2] text-[#991b1b] rounded-full text-xs font-bold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v5" />
              <path d="M12 17h.01" />
            </svg>
            Incomplete
          </span>
        </div>
        <button @click="toggleInterviewDetails(true)" class="w-11 h-11 flex items-center justify-center text-brand-blue rounded-lg hover:bg-brand-blue-light transition-colors" title="Edit interview details">
          <svg viewBox="0 0 24 24" class="w-6 h-6 fill-brand-blue">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
      </div>
      <div class="h-px bg-[#e0e0e0]" />
      <div class="px-9 py-8">
        <p v-if="!interviewDetailsOpen" class="text-lg text-text-secondary leading-relaxed">2 spots available for each 30-minute time slot | Start Advertising Date: {{ startAdvertisingDate }} | Attendance instructions added</p>
        <p v-if="shouldShowInterviewIncomplete && !interviewDetailsOpen" class="flex items-center gap-2 text-[#991b1b] font-semibold text-lg mt-3.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 flex-shrink-0">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v5" />
            <path d="M12 17h.01" />
          </svg>
          Not set up yet — add your time slots, start advertising date, and attendance instructions.
        </p>

        <!-- Expandable interview details -->
        <div v-if="interviewDetailsOpen" class="mt-8">
          <!-- Interview time slot duration (locked) -->
          <div class="mb-8">
            <div class="flex items-center gap-2 text-2xl font-black text-text-primary mb-2.5">
              Interview time slot duration
              <svg viewBox="0 0 24 24" fill="none" stroke="#767676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4.5 h-4.5 flex-shrink-0">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <p class="text-md text-text-secondary leading-relaxed mb-3.5">This allows job seekers to select from multiple scheduling options.</p>
            <p class="text-lg text-text-primary font-normal">30 min</p>
          </div>

          <!-- How many interviews per time slot (editable) -->
          <div class="mb-8">
            <div class="text-2xl font-black text-text-primary mb-2.5">
              How many interviews is your team able to conduct during each time slot?
              <span class="text-[#991b1b]">*</span>
            </div>
            <p class="text-md text-text-secondary leading-relaxed mb-3.5">This cap can help optimize the distribution of interviews across time slots. Interview volume may vary based on the roles you post.</p>

            <div class="inline-flex items-center border-2 border-[#a8a8a8] rounded-md overflow-hidden">
              <button @click="adjustSlotCount(-1)" class="w-11 h-11 flex items-center justify-center bg-surface-sunken text-text-primary hover:bg-[#e5e4e1] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <input
                v-model.number="interviewsPerSlot"
                type="number"
                class="w-16 h-11 border-l-2 border-r-2 border-[#a8a8a8] text-center text-lg font-bold text-text-primary outline-none bg-white"
                min="1"
                max="20"
                readonly
              />
              <button @click="adjustSlotCount(1)" class="w-11 h-11 flex items-center justify-center bg-surface-sunken text-text-primary hover:bg-[#e5e4e1] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>

            <p class="text-md text-text-secondary leading-relaxed mt-4">
              Based on your selection, you can expect to plan for <strong>{{ expectedCandidates }}</strong> candidates to show up per time slot. We recommend staffing 1 interviewer for each expected candidate, so if you don't think you'll be able to
              staff <strong>{{ staffingRecommendation }}</strong> interviewers at the event, we suggest setting a lower number here.
            </p>
          </div>

          <!-- Cancel / Update buttons -->
          <div class="flex items-center justify-end gap-4 mt-7 pt-6">
            <button @click="toggleInterviewDetails(false)" class="bg-transparent border-none text-base font-bold text-brand-blue cursor-pointer px-5.5 py-2.5 rounded hover:bg-brand-blue-light transition-colors">
              Cancel
            </button>
            <button @click="toggleInterviewDetails(false); showToast()" class="bg-brand-blue border-none text-lg font-bold text-white cursor-pointer px-7 py-3.5 rounded hover:bg-brand-blue-dark transition-colors">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION: Screening -->
    <div class="bg-white border border-border-strong rounded-lg mb-6 overflow-hidden">
      <div class="flex items-center justify-between px-9 py-7">
        <h2 class="text-2xl font-bold text-text-primary">Screening</h2>
        <button @click="toggleScreening(true)" class="w-11 h-11 flex items-center justify-center text-brand-blue rounded-lg hover:bg-brand-blue-light transition-colors" title="Edit screening">
          <svg viewBox="0 0 24 24" class="w-6 h-6 fill-brand-blue">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
      </div>
      <div class="h-px bg-[#e0e0e0]" />
      <div class="px-9 py-8">
        <p v-if="!screeningOpen" class="text-lg text-text-secondary leading-relaxed">Screening has been added to {{ screeningCount }} of {{ screeningData.length }} jobs within this event.</p>

        <!-- Expandable screening edit -->
        <div v-if="screeningOpen">
          <h3 class="text-2xl font-black text-text-primary mb-2.5 mt-0">Screen candidates for your requirements</h3>
          <p class="text-md text-text-secondary leading-relaxed mb-6">Candidates will answer your screening questions prior to completing an application and will be filtered out based on your requirements.</p>

          <!-- Jobs list -->
          <div class="border border-border-strong rounded-md overflow-hidden mb-5">
            <div v-for="(jobScreen, idx) in screeningData" :key="idx" :class="['flex items-center justify-between p-4.5 border-b border-[#ebebeb]', idx === screeningData.length - 1 ? 'border-b-0' : '']">
              <div class="text-lg font-bold text-brand-blue min-w-35">{{ jobScreen.jobName }}</div>
              <div class="flex items-center gap-3">
                <span :class="['inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded', jobScreen.hasScreening ? 'bg-[#e8f5e9] text-[#2d7a2d]' : 'bg-surface-sunken text-text-tertiary']">
                  {{ jobScreen.hasScreening ? 'Screening added' : 'No screening added' }}
                </span>
                <button
                  @click="openAddScreener(idx)"
                  :class="['rounded-full border-none cursor-pointer font-bold transition-colors whitespace-nowrap', jobScreen.hasScreening ? 'px-4 py-1.5 text-lg bg-white border-2 border-brand-blue text-brand-blue hover:bg-brand-blue-light' : 'px-5.5 py-2.5 text-base bg-brand-blue text-white hover:bg-brand-blue-dark']"
                >
                  {{ jobScreen.hasScreening ? 'Edit' : 'Add screening' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Multiple jobs link -->
          <a @click="openMultipleScreening()" class="inline-flex items-center gap-1.5 text-brand-blue text-md font-semibold cursor-pointer no-underline hover:underline mb-6">
            <span>+</span>
            <span>Add screening to multiple jobs</span>
          </a>

          <!-- Close button -->
          <div class="flex items-center justify-end gap-4 mt-6 pt-5">
            <button @click="toggleScreening(false)" class="bg-brand-blue text-white border-none px-7 py-3.5 rounded text-lg font-bold cursor-pointer hover:bg-brand-blue-dark transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION: Application Link -->
    <div class="bg-white border border-border-strong rounded-lg mb-6 overflow-hidden">
      <div class="flex items-center justify-between px-9 py-7">
        <h2 class="text-2xl font-bold text-text-primary">Application link</h2>
        <button @click="toggleAppLink(true)" class="w-11 h-11 flex items-center justify-center text-brand-blue rounded-lg hover:bg-brand-blue-light transition-colors" title="Edit application link">
          <svg viewBox="0 0 24 24" class="w-6 h-6 fill-brand-blue">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
      </div>
      <div class="h-px bg-[#e0e0e0]" />
      <div class="px-9 py-8">
        <p v-if="!appLinkOpen" class="text-lg text-text-secondary leading-relaxed">Do you want candidates to complete a job application? Add an application URL.</p>

        <!-- Expandable application link edit -->
        <div v-if="appLinkOpen" class="mt-4">
          <p class="text-base text-text-secondary mb-2.5">The URL must link to a specific job application</p>
          <input
            v-model="appLinkValue"
            type="url"
            placeholder="https://..."
            class="w-full px-4 py-3 text-md font-normal text-text-primary border border-border-strong rounded focus:border-brand-blue focus:ring-2 focus:ring-opacity-15 focus:ring-brand-blue outline-none"
          />
          <div class="flex items-center justify-end gap-4 mt-4 pt-0">
            <button @click="toggleAppLink(false)" class="bg-transparent border-none text-base font-bold text-brand-blue cursor-pointer px-5.5 py-2.5 rounded hover:bg-brand-blue-light transition-colors">
              Cancel
            </button>
            <button @click="toggleAppLink(false); showToast()" class="bg-brand-blue border-none text-lg font-bold text-white cursor-pointer px-7 py-3.5 rounded hover:bg-brand-blue-dark transition-colors">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION: Interview Settings -->
    <div class="bg-white border border-border-strong rounded-lg mb-6 overflow-hidden">
      <div class="flex items-center justify-between px-9 py-7">
        <h2 class="text-2xl font-bold text-text-primary">Interview settings</h2>
        <button @click="toggleInterviewSettings(true)" class="w-11 h-11 flex items-center justify-center text-brand-blue rounded-lg hover:bg-brand-blue-light transition-colors" title="Edit interview settings">
          <svg viewBox="0 0 24 24" class="w-6 h-6 fill-brand-blue">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
      </div>
      <div class="h-px bg-[#e0e0e0]" />
      <div class="px-9 py-8">
        <p v-if="!interviewSettingsOpen" class="text-lg text-text-secondary leading-relaxed">
          {{ interviewerEmails.length }} interviewer(s) added | {{ updateRecipientEmails.length }} daily update recipient(s) | {{ accommodationsEmails.length }} accommodations contact(s) | JobFairX Virtual Interviews
        </p>

        <!-- Expandable interview settings edit -->
        <div v-if="interviewSettingsOpen" class="mt-6">
          <!-- Who will be interviewing -->
          <div class="mb-7">
            <div class="text-2xl font-black text-text-primary mb-2.5">Who will be interviewing candidates?</div>
            <p class="text-base text-text-secondary mb-3">Separate emails with commas.</p>

            <div class="text-lg font-bold text-text-primary mb-1.5">
              Enter the interviewers' email addresses. <span class="text-[#991b1b]">*</span>
            </div>
            <p class="text-base text-text-secondary mb-2.5">All interviewers will need a JobFairX account to access the event.</p>

            <div class="flex items-center flex-wrap gap-2 p-2.5 min-h-12 border border-border-strong rounded cursor-text focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-opacity-15 focus-within:ring-brand-blue transition-colors">
              <span v-for="(email, idx) in interviewerEmails" :key="idx" class="inline-flex items-center gap-2 bg-surface-sunken border border-border-strong rounded-full px-3.5 py-1.5 text-base text-text-primary">
                {{ email.value }}
                <button @click="interviewerEmails.splice(idx, 1)" class="bg-none border-none text-text-tertiary cursor-pointer hover:text-text-primary font-semibold text-lg leading-none p-0">&times;</button>
              </span>
              <input type="email" placeholder="Add email..." class="border-none outline-none text-base font-normal text-text-primary flex-1 min-w-30 p-0 bg-transparent" />
            </div>
          </div>

          <div class="h-px bg-[#e8e6e3] my-6" />

          <!-- Who needs updates -->
          <div class="mb-7">
            <div class="text-2xl font-black text-text-primary mb-2.5">
              Who needs to receive updates? <span class="text-[#991b1b]">*</span>
            </div>

            <div class="text-lg font-bold text-text-primary mb-1.5">
              Enter the email addresses for those who need to receive updates. <span class="text-[#991b1b]">*</span>
            </div>
            <div class="flex items-center flex-wrap gap-2 p-2.5 min-h-12 border border-border-strong rounded cursor-text focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-opacity-15 focus-within:ring-brand-blue transition-colors">
              <input type="email" placeholder="Add email..." class="border-none outline-none text-base font-normal text-text-primary flex-1 min-w-30 p-0 bg-transparent" />
            </div>
          </div>

          <div class="h-px bg-[#e8e6e3] my-6" />

          <!-- Cancel / Update buttons -->
          <div class="flex items-center justify-end gap-4 mt-0 pt-0">
            <button @click="toggleInterviewSettings(false)" class="bg-transparent border-none text-base font-bold text-brand-blue cursor-pointer px-5.5 py-2.5 rounded hover:bg-brand-blue-light transition-colors">
              Cancel
            </button>
            <button @click="toggleInterviewSettings(false); showToast()" class="bg-brand-blue border-none text-lg font-bold text-white cursor-pointer px-7 py-3.5 rounded hover:bg-brand-blue-dark transition-colors">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: Add Screener Question -->
    <div v-if="addScreenerModalOpen" class="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-8 max-w-[500px] w-full max-h-[90vh] overflow-y-auto relative">
        <button @click="closeAddScreenerModal()" class="absolute top-5 right-5 bg-none border-none text-2xl text-text-tertiary cursor-pointer w-8 h-8 flex items-center justify-center hover:text-text-primary">
          &times;
        </button>

        <h3 class="text-xl font-bold text-text-primary mb-1">Add Screener Question</h3>

        <form @submit.prevent="saveScreenerQuestion" class="mt-6">
          <!-- Question Text -->
          <div class="mb-6">
            <label class="block text-base font-semibold text-text-primary mb-2">
              Question Text
              <span class="text-[#991b1b]">*</span>
            </label>
            <textarea
              v-model="questionText"
              placeholder="Enter your screening question..."
              required
              class="w-full px-4 py-3 text-md font-normal text-text-primary border border-border-strong rounded focus:border-brand-blue focus:ring-2 focus:ring-opacity-15 focus:ring-brand-blue outline-none min-h-24 resize-vertical"
            />
          </div>

          <!-- Response Type & Must-have -->
          <div class="flex gap-3 mb-6">
            <div class="flex-1">
              <label class="block text-base font-semibold text-text-primary mb-2">
                Response Type
                <span class="text-[#991b1b]">*</span>
              </label>
              <select
                v-model="responseType"
                @change="updateConditionalFields"
                required
                class="w-full px-4 py-3 text-md font-normal text-text-primary border border-border-strong rounded focus:border-brand-blue focus:ring-2 focus:ring-opacity-15 focus:ring-brand-blue outline-none bg-white cursor-pointer"
              >
                <option value="">Select response type</option>
                <option value="yesno">Yes/No</option>
                <option value="numeric">Numeric</option>
              </select>
            </div>
            <div class="flex-1">
              <label class="block text-base font-semibold text-text-primary mb-2">
                Must-have qualification
                <span class="text-[#991b1b]">*</span>
              </label>
              <select
                v-model="mustHave"
                required
                class="w-full px-4 py-3 text-md font-normal text-text-primary border border-border-strong rounded focus:border-brand-blue focus:ring-2 focus:ring-opacity-15 focus:ring-brand-blue outline-none bg-white cursor-pointer"
              >
                <option value="">Select option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <!-- Conditional: Required Response (for Yes/No) -->
          <div v-if="responseType === 'yesno'" class="mb-6">
            <label class="block text-base font-semibold text-text-primary mb-2">
              Required response
              <span class="text-[#991b1b]">*</span>
            </label>
            <select
              v-model="requiredResponse"
              required
              class="w-full px-4 py-3 text-md font-normal text-text-primary border border-border-strong rounded focus:border-brand-blue focus:ring-2 focus:ring-opacity-15 focus:ring-brand-blue outline-none bg-white cursor-pointer"
            >
              <option value="">Select response</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <!-- Conditional: Required Minimum (for Numeric) -->
          <div v-if="responseType === 'numeric'" class="mb-6">
            <label class="block text-base font-semibold text-text-primary mb-2">
              Required minimum
              <span class="text-[#991b1b]">*</span>
            </label>
            <select
              v-model="requiredMinimum"
              required
              class="w-full px-4 py-3 text-md font-normal text-text-primary border border-border-strong rounded focus:border-brand-blue focus:ring-2 focus:ring-opacity-15 focus:ring-brand-blue outline-none bg-white cursor-pointer"
            >
              <option value="">Select minimum</option>
              <option v-for="n in 10" :key="n" :value="String(n)">{{ n }}</option>
            </select>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 justify-end mt-7">
            <button type="button" @click="closeAddScreenerModal()" class="bg-white border border-border-strong text-text-primary px-5.5 py-2.5 rounded text-base font-bold cursor-pointer hover:bg-[#f6f5f3] transition-colors">
              Cancel
            </button>
            <button type="submit" class="bg-brand-blue text-white px-7 py-3.5 rounded text-lg font-bold cursor-pointer hover:bg-brand-blue-dark transition-colors">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: Add Screening to Multiple Jobs -->
    <div v-if="multipleScreeningModalOpen" class="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-8 max-w-[500px] w-full max-h-[90vh] overflow-y-auto relative">
        <button @click="closeMultipleScreeningModal()" class="absolute top-5 right-5 bg-none border-none text-2xl text-text-tertiary cursor-pointer w-8 h-8 flex items-center justify-center hover:text-text-primary">
          &times;
        </button>

        <h3 class="text-xl font-bold text-text-primary mb-1">Add screening to multiple jobs</h3>
        <p class="text-base text-text-secondary mb-6">
          Set up screening for these jobs <span class="text-[#991b1b]">*</span>
        </p>

        <!-- Jobs list -->
        <div class="max-h-[300px] overflow-y-auto border border-border-strong rounded-lg mb-5">
          <div v-for="(jobScreen, idx) in screeningData" :key="idx" :class="['flex items-center gap-3 p-3.5 border-b border-[#ebebeb]', idx === screeningData.length - 1 ? 'border-b-0' : '']">
            <input
              type="checkbox"
              :id="`job-${idx}-multi`"
              :checked="multipleScreeningSelected.has(idx)"
              @change="toggleJobSelection(idx)"
              :disabled="jobScreen.hasScreening"
              class="cursor-pointer w-4.5 h-4.5"
            />
            <label :for="`job-${idx}-multi`" :class="['text-md text-text-primary cursor-pointer flex-1', jobScreen.hasScreening ? 'text-text-tertiary cursor-not-allowed' : '']">
              {{ jobScreen.jobName }}
              <span v-if="jobScreen.hasScreening" class="text-text-tertiary"> (has screening associated)</span>
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 justify-end">
          <button @click="closeMultipleScreeningModal()" class="bg-white border border-border-strong text-text-primary px-5.5 py-2.5 rounded text-base font-bold cursor-pointer hover:bg-[#f6f5f3] transition-colors">
            Cancel
          </button>
          <button @click="proceedMultipleScreening()" class="bg-brand-blue text-white px-7 py-3.5 rounded text-lg font-bold cursor-pointer hover:bg-brand-blue-dark transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Toast notification -->
    <div
      v-if="toastVisible"
      :class="['fixed bottom-7 left-1/2 -translate-x-1/2 bg-text-primary text-white px-6 py-3 rounded text-base font-semibold z-[10000] shadow-lg transition-opacity duration-300', toastVisible ? 'opacity-100' : 'opacity-0']"
    >
      {{ toastMessage }}
    </div>

    <!-- Dev toggles (fixed bottom-right) -->
    <div v-if="devMode" class="fixed bottom-7 right-5 bg-[#1f2937] text-white rounded-full py-1.5 px-1.5 flex items-center gap-1 shadow-lg z-[500] text-sm">
      <span class="text-xs font-bold uppercase tracking-0.5px text-[#9ca3af] px-2.5 pl-3">State</span>
      <button
        @click="cycleSetupState"
        :class="['bg-transparent border-none text-xs font-semibold px-3.5 py-1.5 rounded-full cursor-pointer transition-all', setupState !== 'complete' ? 'bg-brand-blue text-white' : 'text-[#d1d5db] hover:text-white']"
      >
        {{ setupState === 'complete' ? 'Complete' : setupState === 'jobs-incomplete' ? 'Jobs-Inc' : 'Interview-Inc' }}
      </button>
      <span class="text-xs font-bold uppercase tracking-0.5px text-[#9ca3af] px-2.5">Pkg</span>
      <button
        @click="cyclePackageTier"
        :class="['bg-transparent border-none text-xs font-semibold px-3.5 py-1.5 rounded-full cursor-pointer transition-all', 'text-[#d1d5db] hover:text-white']"
      >
        {{ packageTier }}
      </button>
    </div>
  </div>
</template>
