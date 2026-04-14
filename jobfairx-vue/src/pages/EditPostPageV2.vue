<!--
  EditPostPageV2
  ──────────────
  Pixel-perfect port of edit-post-v2.html for JobFairX employer dashboard.
  Full TypeScript strict mode support with comprehensive interactivity:

  Sections:
    - Header card with illustration and "Edit your Jobs & Settings" title
    - Incomplete setup banner (v2: white bg, amber icon, no summary text)
    - Event Details (read-only display)
    - Custom Emails (toggle + rich editor with tags)
    - Interviewing For (job cards, package usage, empty state)
    - Interview Details (expandable: slot count spinner, staffing info)
    - Screening (expandable: per-job management, multiple jobs modal)
    - Application Link (toggle + URL input)
    - Interview Settings (toggle + email chip system with validation)
    - Modals: Add screener question, add screening to multiple jobs
    - Toast notifications
    - Dev toggles for package tier and setup state

  V2-Specific Features:
    - White incomplete banner background (was gray)
    - Amber incomplete badges on sections (#FEF3CD bg, #856404 text, #F0E0A0 border)
    - No "Not set up yet" summary text under Interview Details
    - Email chip system with full validation (regex, duplicates)
    - Keyboard handlers: Enter, Tab, comma, space to add emails
    - Seat indicator: plain text showing package and seat count
    - Package-aware seat limits: Starter=1, Growth=5, Pro=Infinity
    - Shake animation on seat limit exceeded (email stays in input, red border)
    - Seat limit warning message with red icon
    - updateSeatCounter() called when package changes

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
const interviewerEmails = ref<string[]>(['scott@jobfairx.com'])
const interviewerEmailInput = ref('')
const showInterviewerEmailError = ref(false)
const showInterviewerDupeError = ref(false)
const showSeatLimitShake = ref(false)
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

// ═══ Computed: Interview Settings ═══
const PACKAGE_SEAT_LIMITS: Record<string, number> = { Starter: 1, Growth: 5, Pro: Infinity }
const currentSeatLimit = computed(() => {
  const tier = packageTier.value || 'Growth'
  return PACKAGE_SEAT_LIMITS[tier] || 5
})

const interviewerCount = computed(() => interviewerEmails.value.length)

const seatIndicatorText = computed(() => {
  const tier = packageTier.value || 'Growth'
  const limit = PACKAGE_SEAT_LIMITS[tier]
  const count = interviewerCount.value
  if (limit === Infinity) {
    return `${tier} package · ${count} interviewer${count !== 1 ? 's' : ''} added`
  }
  return `${tier} package · ${count} of ${limit} interviewer seat${limit !== 1 ? 's' : ''} used`
})

const showSeatLimitMessage = computed(() => {
  return interviewerCount.value >= currentSeatLimit.value && currentSeatLimit.value !== Infinity
})

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

// ═══ Methods: Interview Settings - Email Validation ═══
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const isDuplicateEmail = (email: string): boolean => {
  return interviewerEmails.value.some((e) => e.toLowerCase() === email.toLowerCase())
}

const clearEmailErrors = (): void => {
  showInterviewerEmailError.value = false
  showInterviewerDupeError.value = false
}

const addInterviewerEmail = (): boolean => {
  const email = interviewerEmailInput.value.trim().replace(/,/g, '').replace(/\s/g, '')
  if (!email) return false

  clearEmailErrors()

  // Validate format
  if (!isValidEmail(email)) {
    showInterviewerEmailError.value = true
    interviewerEmailInput.value = ''
    return false
  }

  // Check duplicate
  if (isDuplicateEmail(email)) {
    showInterviewerDupeError.value = true
    interviewerEmailInput.value = ''
    return false
  }

  // Check seat limit — keep email in input and shake the box
  if (interviewerCount.value >= currentSeatLimit.value && currentSeatLimit.value !== Infinity) {
    showSeatLimitShake.value = true
    setTimeout(() => {
      showSeatLimitShake.value = false
    }, 500)
    return false
  }

  // Add email
  interviewerEmails.value.push(email)
  interviewerEmailInput.value = ''
  return true
}

const removeInterviewerEmail = (index: number): void => {
  interviewerEmails.value.splice(index, 1)
  clearEmailErrors()
}

const handleInterviewerKeydown = (e: KeyboardEvent): void => {
  const input = e.target as HTMLInputElement
  if (e.key === 'Enter' || e.key === ',' || e.key === ' ' || e.key === 'Tab') {
    const hasValue = input.value.trim().replace(/,/g, '').replace(/\s/g, '')
    if (hasValue) {
      e.preventDefault()
      addInterviewerEmail()
    } else if (e.key === ' ' || e.key === ',') {
      e.preventDefault()
    }
  }
}

const handleInterviewerBlur = (): void => {
  const email = interviewerEmailInput.value.trim().replace(/,/g, '').replace(/\s/g, '')
  if (email) {
    addInterviewerEmail()
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

    <!-- Incomplete setup banner (v2: white background) -->
    <div
      v-if="incompleteSetupVisible"
      class="flex items-center justify-between gap-4 bg-white border border-border-strong rounded-lg px-6 py-5 mb-6"
    >
      <div class="flex items-center gap-4 flex-1 min-w-0">
        <div class="w-7 h-7 rounded-full bg-[#FEF3CD] flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="#856404" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
            <path d="M12 8v5" />
            <path d="M12 17h.01" />
          </svg>
        </div>
        <div class="min-w-0">
          <div class="text-sm font-bold text-text-primary mb-0.5">
            {{ shouldShowJobsIncomplete ? 'You haven\'t added any jobs yet' : 'Your interview setup isn\'t finished' }}
          </div>
          <div class="text-sm text-text-secondary leading-relaxed">
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
          class="flex-shrink-0 bg-brand-blue text-white px-5 py-3 rounded-lg text-sm font-bold cursor-pointer hover:bg-[#003399] transition-colors whitespace-nowrap"
        >
          Add jobs
        </button>
        <button
          v-if="shouldShowInterviewIncomplete"
          @click="toggleInterviewDetails(true)"
          class="flex-shrink-0 bg-brand-blue text-white px-5 py-3 rounded-lg text-sm font-bold cursor-pointer hover:bg-[#003399] transition-colors whitespace-nowrap"
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
              <button class="w-8 h-8 flex items-center justify-center text-text-primary rounded hover:bg-[#e8e6e3] text-xl font-bold font-serif transition">B</button>
              <button class="w-8 h-8 flex items-center justify-center text-text-primary rounded hover:bg-[#e8e6e3] text-xl italic font-serif transition">I</button>
            </div>
            <textarea v-model="customEmailData.body" placeholder="Write your custom email message here..." class="w-full min-h-[180px] border-none outline-none p-4 text-md font-normal text-text-primary resize-vertical" />
          </div>

          <!-- Cancel / Update buttons -->
          <div class="flex items-center justify-end gap-4 mt-7 pt-6">
            <button @click="toggleCustomEmail(false)" class="bg-transparent border-none text-brand-blue text-sm font-bold cursor-pointer px-5 py-2.5 rounded-lg hover:bg-brand-blue-light transition">
              Cancel
            </button>
            <button @click="toggleCustomEmail(false); showToast()" class="bg-brand-blue border-none text-white text-base font-bold cursor-pointer px-7 py-3.5 rounded-lg hover:bg-[#003399] transition">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION: INTERVIEWING FOR -->
    <div class="bg-white border border-border-strong rounded-lg mb-6 overflow-hidden">
      <div class="flex items-center justify-between px-9 py-7">
        <div class="flex items-center gap-3">
          <h2 class="text-2xl font-bold text-text-primary">Interviewing For</h2>
          <span v-if="shouldShowJobsIncomplete" class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FEF3CD] text-[#856404] border border-[#F0E0A0] rounded-full text-xs font-semibold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3">
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
        <div class="text-sm text-text-secondary mb-5">{{ packageLabel }}</div>
        <div>
          <!-- Empty state shown when jobs-incomplete -->
          <div v-if="shouldShowJobsIncomplete" class="flex flex-col items-center text-center p-11 bg-white border border-[#ebebeb] rounded-lg mb-1">
            <div class="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-3.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0044B3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="3" y1="13" x2="21" y2="13" />
              </svg>
            </div>
            <div class="text-lg font-bold text-text-primary mb-1.5">No jobs added yet</div>
            <div class="text-sm text-text-secondary mb-4.5 max-w-[380px]">Add your first job so candidates can apply and request interviews.</div>
            <button @click="showToast('Navigate to jobs')" class="px-5.5 py-2.5 bg-white border border-border-strong text-brand-blue text-sm font-bold cursor-pointer rounded-lg hover:bg-brand-blue-light transition">
              Create a new job
            </button>
          </div>

          <!-- Job cards -->
          <div v-if="!shouldShowJobsIncomplete">
            <div v-for="(job, idx) in jobs" :key="job.id" :class="{ 'border-t border-[#ebebeb]': idx > 0 }" class="py-6">
              <div class="flex items-start justify-between">
                <div>
                  <div class="text-lg font-bold text-text-primary">{{ job.name }}</div>
                  <div class="text-sm text-brand-blue underline mt-1.5">{{ job.salary }}</div>
                </div>
                <div class="flex items-center gap-3.5">
                  <button class="inline-flex items-center gap-1.5 px-5.5 py-2.5 rounded-lg border border-border-strong bg-white text-text-primary text-sm font-bold cursor-pointer hover:bg-[#f6f5f3] transition whitespace-nowrap">
                    Edit
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="text-sm text-text-secondary mt-3.5 leading-relaxed">{{ job.description }}</div>
            </div>
          </div>
        </div>

        <div v-if="!shouldShowJobsIncomplete" class="flex gap-3 mt-6 pt-5 border-t border-[#ebebeb]">
          <button @click="showToast('Navigate to jobs')" class="px-5.5 py-2.5 bg-white border border-border-strong text-brand-blue text-sm font-bold cursor-pointer rounded-lg hover:bg-brand-blue-light transition">
            Create a new job
          </button>
        </div>
      </div>
    </div>

    <!-- SECTION: INTERVIEW DETAILS -->
    <div class="bg-white border border-border-strong rounded-lg mb-6 overflow-hidden">
      <div class="flex items-center justify-between px-9 py-7">
        <div class="flex items-center gap-3">
          <h2 class="text-2xl font-bold text-text-primary">Interview details</h2>
          <span v-if="shouldShowInterviewIncomplete" class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FEF3CD] text-[#856404] border border-[#F0E0A0] rounded-full text-xs font-semibold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v5" />
              <path d="M12 17h.01" />
            </svg>
            Incomplete
          </span>
        </div>
        <button
          @click="toggleInterviewDetails(true)"
          class="w-11 h-11 flex items-center justify-center text-brand-blue rounded-lg hover:bg-brand-blue-light transition-colors"
          title="Edit interview details"
        >
          <svg viewBox="0 0 24 24" class="w-6 h-6 fill-brand-blue">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
      </div>
      <div class="h-px bg-[#e0e0e0]" />
      <div class="px-9 py-8">
        <p v-if="!interviewDetailsOpen" class="text-lg text-text-secondary leading-relaxed">
          {{ interviewsPerSlot }} spots available for each 30-minute time slot | Start Advertising Date: {{ startAdvertisingDate }} | Attendance instructions added
        </p>

        <!-- Expandable Interview Details Edit -->
        <div v-if="interviewDetailsOpen">
          <!-- Interview time slot duration (locked) -->
          <div class="mb-8">
            <div class="flex items-center gap-2 text-2xl font-bold text-text-primary mb-2.5">
              Interview time slot duration
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4.5 h-4.5 text-text-secondary">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <p class="text-md text-text-secondary mb-3.5 leading-relaxed">This allows job seekers to select from multiple scheduling options.</p>
            <p class="text-lg text-text-primary font-normal">30 min</p>
          </div>

          <!-- How many interviews per time slot (editable) -->
          <div class="mb-8">
            <div class="text-2xl font-bold text-text-primary mb-2.5">
              How many interviews is your team able to conduct during each time slot? <span class="text-[#991b1b]">*</span>
            </div>
            <p class="text-md text-text-secondary mb-3.5 leading-relaxed">This cap can help optimize the distribution of interviews across time slots. Interview volume may vary based on the roles you post.</p>
            <div class="inline-flex items-center border-2 border-[#a8a8a8] rounded-xl overflow-hidden">
              <button @click="adjustSlotCount(-1)" class="flex items-center justify-center w-11 h-11 bg-surface-sunken cursor-pointer text-text-primary hover:bg-[#e5e4e1] transition">
                <svg width="4" height="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <input type="number" v-model="interviewsPerSlot" class="w-15 h-11 border-l-2 border-r-2 border-[#a8a8a8] text-center text-lg font-bold text-text-primary outline-none bg-white" readonly />
              <button @click="adjustSlotCount(1)" class="flex items-center justify-center w-11 h-11 bg-surface-sunken cursor-pointer text-text-primary hover:bg-[#e5e4e1] transition">
                <svg width="4" height="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
            <p class="text-md text-text-secondary mt-4 leading-relaxed">
              Based on your selection, you can expect to plan for <strong>{{ expectedCandidates }}</strong> candidates to show up per time slot. We recommend staffing 1 interviewer for each expected candidate, so if you don't think you'll be able to staff
              <strong>{{ staffingRecommendation }}</strong> interviewers at the event, we suggest setting a lower number here.
            </p>
          </div>

          <!-- Cancel / Update buttons -->
          <div class="flex items-center justify-end gap-4 mt-7 pt-6">
            <button @click="toggleInterviewDetails(false)" class="bg-transparent border-none text-brand-blue text-sm font-bold cursor-pointer px-5 py-2.5 rounded-lg hover:bg-brand-blue-light transition">
              Cancel
            </button>
            <button @click="toggleInterviewDetails(false); showToast()" class="bg-brand-blue border-none text-white text-base font-bold cursor-pointer px-7 py-3.5 rounded-lg hover:bg-[#003399] transition">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION: SCREENING -->
    <div class="bg-white border border-border-strong rounded-lg mb-6 overflow-hidden">
      <div class="flex items-center justify-between px-9 py-7">
        <h2 class="text-2xl font-bold text-text-primary">Screening</h2>
        <button
          @click="toggleScreening(true)"
          class="w-11 h-11 flex items-center justify-center text-brand-blue rounded-lg hover:bg-brand-blue-light transition-colors"
          title="Edit screening"
        >
          <svg viewBox="0 0 24 24" class="w-6 h-6 fill-brand-blue">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
      </div>
      <div class="h-px bg-[#e0e0e0]" />
      <div class="px-9 py-8">
        <p v-if="!screeningOpen" class="text-lg text-text-secondary leading-relaxed">Screening has been added to {{ screeningCount }} of {{ screeningData.length }} jobs within this event.</p>

        <!-- Expandable Screening Edit -->
        <div v-if="screeningOpen">
          <h3 class="text-2xl font-bold text-text-primary mb-2.5">Screen candidates for your requirements</h3>
          <p class="text-md text-text-secondary mb-6 leading-relaxed">Candidates will answer your screening questions prior to completing an application and will be filtered out based on your requirements.</p>

          <div class="border border-border-strong rounded-lg overflow-hidden mb-5">
            <div v-for="(job, idx) in screeningData" :key="job.jobIndex" :class="{ 'border-t border-[#ebebeb]': idx > 0 }" class="flex items-center justify-between p-5">
              <div class="text-base font-bold text-brand-blue">{{ job.jobName }}</div>
              <div class="flex items-center gap-3">
                <span :class="['inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded', job.hasScreening ? 'bg-[#e8f5e9] text-[#2d7a2d]' : 'bg-surface-sunken text-text-secondary']">
                  {{ job.hasScreening ? 'Screening added' : 'No screening added' }}
                </span>
                <button
                  @click="job.hasScreening ? showToast('Edit screening') : openAddScreener(job.jobIndex)"
                  :class="['px-5.5 py-2.5 rounded-full text-sm font-bold cursor-pointer border-none whitespace-nowrap transition', job.hasScreening ? 'bg-white border-2 border-brand-blue text-brand-blue hover:bg-brand-blue-light' : 'bg-brand-blue text-white hover:bg-[#003399]']"
                >
                  {{ job.hasScreening ? 'Edit' : 'Add screening' }}
                </button>
              </div>
            </div>
          </div>

          <a @click="openMultipleScreening" class="inline-flex items-center gap-1.5 text-brand-blue text-md font-semibold cursor-pointer hover:underline mb-6">
            <span>+</span>
            <span>Add screening to multiple jobs</span>
          </a>

          <div class="flex items-center justify-end gap-4 mt-6 pt-5">
            <button @click="toggleScreening(false)" class="bg-brand-blue border-none text-white text-base font-bold cursor-pointer px-7 py-3.5 rounded-lg hover:bg-[#003399] transition">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION: APPLICATION LINK -->
    <div class="bg-white border border-border-strong rounded-lg mb-6 overflow-hidden">
      <div class="flex items-center justify-between px-9 py-7">
        <h2 class="text-2xl font-bold text-text-primary">Application link</h2>
        <button
          @click="toggleAppLink(true)"
          class="w-11 h-11 flex items-center justify-center text-brand-blue rounded-lg hover:bg-brand-blue-light transition-colors"
          title="Edit application link"
        >
          <svg viewBox="0 0 24 24" class="w-6 h-6 fill-brand-blue">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
      </div>
      <div class="h-px bg-[#e0e0e0]" />
      <div class="px-9 py-8">
        <p v-if="!appLinkOpen" class="text-lg text-text-secondary leading-relaxed">Do you want candidates to complete a job application? Add an application URL.</p>

        <!-- Expandable Application Link Edit -->
        <div v-if="appLinkOpen" class="mt-4">
          <p class="text-sm text-text-secondary mb-2.5">The URL must link to a specific job application</p>
          <input v-model="appLinkValue" type="url" class="w-full px-4 py-3 text-md font-normal text-text-primary border border-border-strong rounded-lg outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100 transition mb-4" />
          <div class="flex items-center justify-end gap-4">
            <button @click="toggleAppLink(false)" class="bg-transparent border-none text-brand-blue text-sm font-bold cursor-pointer px-5 py-2.5 rounded-lg hover:bg-brand-blue-light transition">
              Cancel
            </button>
            <button @click="toggleAppLink(false); showToast()" class="bg-brand-blue border-none text-white text-base font-bold cursor-pointer px-7 py-3.5 rounded-lg hover:bg-[#003399] transition">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION: INTERVIEW SETTINGS -->
    <div class="bg-white border border-border-strong rounded-lg mb-6 overflow-hidden">
      <div class="flex items-center justify-between px-9 py-7">
        <h2 class="text-2xl font-bold text-text-primary">Interview settings</h2>
        <button
          @click="toggleInterviewSettings(true)"
          class="w-11 h-11 flex items-center justify-center text-brand-blue rounded-lg hover:bg-brand-blue-light transition-colors"
          title="Edit interview settings"
        >
          <svg viewBox="0 0 24 24" class="w-6 h-6 fill-brand-blue">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
      </div>
      <div class="h-px bg-[#e0e0e0]" />
      <div class="px-9 py-8">
        <p v-if="!interviewSettingsOpen" class="text-lg text-text-secondary leading-relaxed">{{ interviewerCount }} interviewer(s) added | 1 daily update recipient(s) | 1 accommodations contact(s) | JobFairX Virtual Interviews</p>

        <!-- Expandable Interview Settings Edit -->
        <div v-if="interviewSettingsOpen">
          <!-- Who will be interviewing -->
          <div class="mb-7">
            <div class="text-2xl font-bold text-text-primary mb-2.5">Who will be interviewing candidates?</div>

            <div class="text-lg font-bold text-text-primary mb-1.5">Enter the interviewers' email addresses. <span class="text-[#991b1b]">*</span></div>
            <p class="text-sm text-text-secondary mb-2.5">All interviewers will need a JobFairX account to access the event.</p>

            <!-- Email chip box (v2 specific) -->
            <div :class="['flex flex-wrap items-center gap-2 p-2.5 min-h-12 border rounded-lg cursor-text transition', showSeatLimitShake ? 'animate-pulse border-[#991b1b] ring-2 ring-red-200' : 'border-border-strong hover:border-brand-blue focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-blue-100']">
              <span v-for="(email, idx) in interviewerEmails" :key="idx" class="inline-flex items-center gap-2 bg-surface-sunken border border-border-strong rounded-full px-3.5 py-1.5 text-sm text-text-primary whitespace-nowrap">
                {{ email }}
                <button @click="removeInterviewerEmail(idx)" type="button" class="bg-transparent border-none text-text-secondary cursor-pointer text-lg hover:text-text-primary transition">&times;</button>
              </span>
              <input
                v-model="interviewerEmailInput"
                type="email"
                placeholder="Add email..."
                @keydown="handleInterviewerKeydown"
                @blur="handleInterviewerBlur"
                class="border-none outline-none text-sm font-normal text-text-primary flex-1 min-w-30 px-1.5 py-2 bg-transparent"
              />
            </div>

            <!-- Seat indicator (v2: plain text, not a badge) -->
            <div class="text-xs text-text-secondary mt-2 mb-1">
              <span class="font-medium">{{ packageTier }} package</span>
              <span class="text-text-tertiary mx-1">&middot;</span>
              <span class="font-medium">{{ interviewerCount }} of {{ currentSeatLimit === Infinity ? '∞' : currentSeatLimit }} interviewer seat{{ currentSeatLimit !== 1 ? 's' : '' }} used</span>
            </div>

            <!-- Error messages -->
            <div v-if="showInterviewerEmailError" class="text-xs text-[#991b1b] mt-1.5">Enter a valid email address.</div>
            <div v-if="showInterviewerDupeError" class="text-xs text-[#991b1b] mt-1.5">This email has already been added.</div>

            <!-- Seat limit message (v2: red icon, warning) -->
            <div v-if="showSeatLimitMessage" class="flex items-center gap-2 mt-2.5 text-xs font-medium text-[#991b1b]">
              <svg viewBox="0 0 24 24" fill="#991b1b" class="w-4 h-4">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4" stroke="#fff" stroke-width="2" stroke-linecap="round" />
                <circle cx="12" cy="16" r="1" fill="#fff" />
              </svg>
              All interviewer seats are filled. Remove an interviewer to add someone new.
            </div>
          </div>

          <div class="h-px bg-[#e8e6e3] my-6"></div>

          <!-- Who needs updates -->
          <div class="mb-7">
            <div class="text-2xl font-bold text-text-primary mb-2.5">Who needs to receive updates? <span class="text-[#991b1b]">*</span></div>

            <div class="text-lg font-bold text-text-primary mb-1.5">Enter the email addresses for those who need to receive updates. <span class="text-[#991b1b]">*</span></div>
            <div class="flex flex-wrap items-center gap-2 p-2.5 min-h-12 border border-border-strong rounded-lg cursor-text hover:border-brand-blue focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-blue-100 transition">
              <input type="email" placeholder="Add email..." class="border-none outline-none text-sm font-normal text-text-primary flex-1 min-w-30 px-1.5 py-2 bg-transparent" />
            </div>
            <div class="text-xs text-[#991b1b] mt-1.5 hidden">Enter a valid email address.</div>
          </div>

          <!-- Cancel / Update buttons -->
          <div class="flex items-center justify-end gap-4 mt-7">
            <button @click="toggleInterviewSettings(false)" class="bg-transparent border-none text-brand-blue text-sm font-bold cursor-pointer px-5 py-2.5 rounded-lg hover:bg-brand-blue-light transition">
              Cancel
            </button>
            <button @click="toggleInterviewSettings(false); showToast()" class="bg-brand-blue border-none text-white text-base font-bold cursor-pointer px-7 py-3.5 rounded-lg hover:bg-[#003399] transition">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: Add Screener Question -->
    <div v-if="addScreenerModalOpen" class="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center">
      <div class="bg-white rounded-lg p-8 max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto relative">
        <button @click="closeAddScreenerModal" class="absolute top-5 right-5 bg-none border-none text-text-tertiary text-2xl cursor-pointer w-8 h-8 flex items-center justify-center">
          &times;
        </button>
        <h3 class="text-xl font-bold text-text-primary mb-1">Add Screener Question</h3>

        <form @submit.prevent="saveScreenerQuestion">
          <div class="mb-6">
            <label class="block text-sm font-semibold text-text-primary mb-2">Question Text <span class="text-[#991b1b]">*</span></label>
            <textarea v-model="questionText" placeholder="Enter your screening question..." class="w-full p-3 text-md font-normal text-text-primary border border-border-strong rounded-lg outline-none min-h-24 resize-vertical focus:border-brand-blue focus:ring-2 focus:ring-blue-100" required></textarea>
          </div>

          <div class="flex gap-3 mb-6">
            <div class="flex-1">
              <label class="block text-sm font-semibold text-text-primary mb-2">Response Type <span class="text-[#991b1b]">*</span></label>
              <select v-model="responseType" @change="updateConditionalFields" class="w-full p-3 text-md font-normal text-text-tertiary bg-white border border-border-strong rounded-lg outline-none cursor-pointer focus:border-brand-blue focus:ring-2 focus:ring-blue-100" required>
                <option value="">Select response type</option>
                <option value="yesno">Yes/No</option>
                <option value="numeric">Numeric</option>
              </select>
            </div>
            <div class="flex-1">
              <label class="block text-sm font-semibold text-text-primary mb-2">Must-have qualification <span class="text-[#991b1b]">*</span></label>
              <select v-model="mustHave" class="w-full p-3 text-md font-normal text-text-tertiary bg-white border border-border-strong rounded-lg outline-none cursor-pointer focus:border-brand-blue focus:ring-2 focus:ring-blue-100" required>
                <option value="">Select option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div v-if="responseType === 'yesno'" class="mb-6">
            <label class="block text-sm font-semibold text-text-primary mb-2">Required response <span class="text-[#991b1b]">*</span></label>
            <select v-model="requiredResponse" class="w-full p-3 text-md font-normal text-text-tertiary bg-white border border-border-strong rounded-lg outline-none cursor-pointer focus:border-brand-blue focus:ring-2 focus:ring-blue-100" required>
              <option value="">Select response</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div v-if="responseType === 'numeric'" class="mb-6">
            <label class="block text-sm font-semibold text-text-primary mb-2">Required minimum <span class="text-[#991b1b]">*</span></label>
            <select v-model="requiredMinimum" class="w-full p-3 text-md font-normal text-text-tertiary bg-white border border-border-strong rounded-lg outline-none cursor-pointer focus:border-brand-blue focus:ring-2 focus:ring-blue-100" required>
              <option value="">Select minimum</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="flex gap-3 justify-end mt-7 pt-6">
            <button type="button" @click="closeAddScreenerModal" class="bg-white border border-border-strong text-text-primary px-5.5 py-2.5 rounded-lg text-sm font-bold cursor-pointer hover:bg-[#f6f5f3] transition">
              Cancel
            </button>
            <button type="submit" class="bg-brand-blue border-none text-white px-7 py-3.5 rounded-lg text-base font-bold cursor-pointer hover:bg-[#003399] transition">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: Add Screening to Multiple Jobs -->
    <div v-if="multipleScreeningModalOpen" class="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center">
      <div class="bg-white rounded-lg p-8 max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto relative">
        <button @click="closeMultipleScreeningModal" class="absolute top-5 right-5 bg-none border-none text-text-tertiary text-2xl cursor-pointer w-8 h-8 flex items-center justify-center">
          &times;
        </button>
        <h3 class="text-xl font-bold text-text-primary mb-1">Add screening to multiple jobs</h3>
        <p class="text-sm text-text-secondary mb-6">Set up screening for these jobs <span class="text-[#991b1b]">*</span></p>

        <div class="border border-border-strong rounded-lg overflow-hidden mb-6 max-h-75 overflow-y-auto">
          <div v-for="(job, idx) in screeningData" :key="job.jobIndex" :class="{ 'border-b border-[#ebebeb]': idx < screeningData.length - 1 }" class="flex items-center gap-3 p-3.5">
            <input v-model="multipleScreeningSelected" :value="job.jobIndex" type="checkbox" class="w-4.5 h-4.5 cursor-pointer" />
            <label class="text-md text-text-primary cursor-pointer flex-1">{{ job.jobName }}</label>
          </div>
        </div>

        <div class="flex gap-3 justify-end">
          <button @click="closeMultipleScreeningModal" class="bg-white border border-border-strong text-text-primary px-5.5 py-2.5 rounded-lg text-sm font-bold cursor-pointer hover:bg-[#f6f5f3] transition">
            Cancel
          </button>
          <button @click="proceedMultipleScreening" class="bg-brand-blue border-none text-white px-7 py-3.5 rounded-lg text-base font-bold cursor-pointer hover:bg-[#003399] transition">
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="toastVisible" class="fixed bottom-7 left-1/2 transform -translate-x-1/2 bg-[#2d2d2d] text-white px-6 py-3 rounded-lg text-sm font-semibold z-[10000] shadow-lg">
      {{ toastMessage }}
    </div>

    <!-- Dev Toggles (only show if devMode is active) -->
    <div v-if="devMode" class="fixed bottom-5 right-5 bg-[#1f2937] text-white rounded-full px-3 py-1.5 flex items-center gap-2 text-xs z-[500] shadow-lg">
      <span class="uppercase text-[#9ca3af] font-bold text-[11px] tracking-wider px-2.5">Dev</span>
      <button @click="cycleSetupState" :class="['px-3 py-1.5 rounded-full text-xs font-semibold transition', setupState === 'complete' ? 'bg-brand-blue text-white' : 'bg-transparent text-[#d1d5db] hover:text-white']">
        {{ setupState || 'complete' }}
      </button>
      <button @click="cyclePackageTier" :class="['px-3 py-1.5 rounded-full text-xs font-semibold transition', packageTier ? 'bg-brand-blue text-white' : 'bg-transparent text-[#d1d5db] hover:text-white']">
        {{ packageTier || 'Growth' }}
      </button>
    </div>
  </div>
</template>
