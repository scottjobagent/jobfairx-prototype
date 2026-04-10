<!--
  EditJobPage
  -----------
  Pixel-perfect port of edit-job.html. Displays:
    - Page title "Edit job"
    - Review table with 8 fields (title, location locked; jobType, pay, benefits, shift, schedule, description editable)
    - Locked fields show lock icon with hover tooltip "Can't change after posting"
    - Edit buttons open field-specific modals
    - 6 modals: jobType, pay, benefits, shift, schedule, description
    - Chip groups with single-select (jobType, shift, schedule) and multi-select (benefits) modes
    - Pay widget with "Show pay by" dropdown (Range/Starting/Maximum/Exact), rate dropdown (per hour/day/week/month/year)
    - Description truncation (260 char) with expand/collapse
    - Dev toggle to switch between 5 sample jobs (ma, rn, se, devops, ux)
    - Dirty detection and save with beforeunload warning
    - Uses DashboardLayout for sidebar and topbar

  All Tailwind utilities, no scoped styles. Strict TypeScript with noUncheckedIndexedAccess.
-->

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// ───────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────

interface JobData {
  event: string
  eventName: string
  title: string
  location: string
  jobType: string
  pay: string
  benefits: string
  shift: string
  schedule: string
  desc: string
}

interface PayParsed {
  mode: 'range' | 'starting' | 'maximum' | 'exact'
  min: string
  max: string
  single: string
  rate: string
}

// ───────────────────────────────────────────────────────────────
// CONSTANTS
// ───────────────────────────────────────────────────────────────

const JOB_TYPE_OPTIONS: string[] = [
  'Full-time',
  'Part-time',
  'Contract',
  'Temporary',
  'Internship',
]

const BENEFIT_OPTIONS: string[] = [
  'Health insurance',
  'Paid time off',
  'Dental insurance',
  '401(k)',
  'Vision insurance',
  'Flexible schedule',
  'Tuition reimbursement',
  'Life insurance',
  '401(k) matching',
  'Retirement plan',
  'Referral program',
  'Employee discount',
  'Flexible spending account',
  'Health savings account',
  'Relocation assistance',
  'Parental leave',
  'Professional development assistance',
  'Employee assistance program',
  'Other',
]

const SHIFT_OPTIONS: string[] = [
  'Day shift',
  'Night shift',
  'Evening shift',
  'Overnight shift',
  'Other',
  'None',
]

const SCHEDULE_OPTIONS: string[] = [
  'Weekly as needed',
  'Monday to Friday',
  'Rotating weekends',
  'Every weekend',
  'No weekends',
  'Choose your own hours',
  '3×12',
  '5×8',
  '4×10',
  '4×12',
  'Other',
  'None',
]

const DESC_LIMIT = 260

const JOBS: Record<string, JobData> = {
  ma: {
    event: 'dallas',
    eventName: 'Dallas Healthcare Hiring Event',
    title: 'Medical Assistant',
    location: 'Dallas, TX · In person',
    jobType: 'Full-time',
    pay: '$38,000 – $48,000 / year',
    benefits:
      'Health insurance, Dental insurance, Vision insurance, 401(k), Paid time off',
    shift: 'Day shift',
    schedule: 'Monday to Friday',
    desc: 'Join our growing clinic as a Medical Assistant supporting physicians and nurses in delivering excellent patient care. You will handle clinical and administrative duties including patient intake, vitals, scheduling, and electronic health records.\n\nResponsibilities:\n• Patient intake and vitals\n• Assist physicians with exams\n• Maintain accurate EHR records\n• Schedule follow-up appointments\n\nRequirements:\n• Medical Assistant certification\n• 1+ year of clinical experience preferred\n• Strong organizational and communication skills',
  },
  rn: {
    event: 'dallas',
    eventName: 'Dallas Healthcare Hiring Event',
    title: 'Registered Nurse',
    location: 'Dallas, TX · In person',
    jobType: 'Full-time',
    pay: '$55,000 – $72,000 / year',
    benefits:
      'Health insurance, Dental insurance, Vision insurance, 401(k), Paid time off',
    shift: 'Day shift',
    schedule: 'Rotating weekends',
    desc: 'We are seeking a compassionate and skilled Registered Nurse to join our healthcare team. The ideal candidate will provide high-quality patient care in a fast-paced environment and collaborate with a multidisciplinary team to ensure the best outcomes for every patient.\n\nResponsibilities:\n• Assess patient conditions and develop nursing care plans\n• Administer medications and treatments per physician orders\n• Monitor patient progress and document observations\n• Educate patients and families on health management\n\nRequirements:\n• Active RN license in Texas\n• BLS certification\n• Minimum 1 year of clinical experience preferred',
  },
  se: {
    event: 'chicago',
    eventName: 'Chicago Technology Hiring Event',
    title: 'Software Engineer',
    location: 'Chicago, IL · Hybrid',
    jobType: 'Full-time',
    pay: '$115,000 – $145,000 / year',
    benefits:
      'Health insurance, Dental insurance, Vision insurance, 401(k) matching, Paid time off',
    shift: 'Day shift',
    schedule: 'Monday to Friday',
    desc: 'Join our growing engineering team to build and scale our core platform. You\'ll work with modern technologies, collaborate across product and design, and contribute to system architecture decisions.\n\nResponsibilities:\n• Design, build, and maintain high-quality, scalable services\n• Write clean, well-tested, maintainable code\n• Participate in code reviews and architectural discussions\n• Partner with PM and design on new features\n\nRequirements:\n• 3+ years of professional software engineering experience\n• Strong fundamentals in data structures and algorithms\n• Experience with modern web frameworks',
  },
  devops: {
    event: 'chicago',
    eventName: 'Chicago Technology Hiring Event',
    title: 'DevOps Engineer',
    location: 'Chicago, IL · Hybrid',
    jobType: 'Full-time',
    pay: '$125,000 – $155,000 / year',
    benefits:
      'Health insurance, Dental insurance, Vision insurance, 401(k) matching, Paid time off',
    shift: 'Day shift',
    schedule: 'Monday to Friday',
    desc: "We're looking for a DevOps Engineer to own our infrastructure and deployment pipelines. You'll work closely with engineering to build reliable, observable, and secure systems.\n\nResponsibilities:\n• Maintain and improve CI/CD pipelines\n• Manage cloud infrastructure (AWS)\n• Monitor system health and respond to incidents\n• Drive infrastructure-as-code adoption\n\nRequirements:\n• 3+ years of DevOps or SRE experience\n• Strong Linux and scripting skills\n• Experience with Kubernetes, Terraform, and AWS",
  },
  ux: {
    event: 'chicago',
    eventName: 'Chicago Technology Hiring Event',
    title: 'UX Designer',
    location: 'Chicago, IL · Hybrid',
    jobType: 'Full-time',
    pay: '$95,000 – $125,000 / year',
    benefits:
      'Health insurance, Dental insurance, Vision insurance, 401(k) matching, Paid time off',
    shift: 'Day shift',
    schedule: 'Monday to Friday',
    desc: "We're hiring a UX Designer to shape the experience of our product end-to-end. You'll partner with PM and engineering to research, prototype, and ship thoughtful user experiences.\n\nResponsibilities:\n• Lead design for complex product areas\n• Conduct user research and usability testing\n• Prototype and iterate quickly\n• Contribute to and evolve the design system\n\nRequirements:\n• 3+ years of product design experience\n• Strong portfolio demonstrating end-to-end product work\n• Experience with Figma",
  },
}

// ───────────────────────────────────────────────────────────────
// REACTIVE STATE
// ───────────────────────────────────────────────────────────────

const currentJobId = ref<string>('rn')
const jobData = ref<JobData>({ ...JOBS['rn']! })
const originalData = ref<JobData>({ ...JOBS['rn']! })

// Modal visibility
const openModals = ref<Record<string, boolean>>({
  jobType: false,
  pay: false,
  benefits: false,
  shift: false,
  schedule: false,
  desc: false,
})

// Chip selection state (for modals)
const selectedChips = ref<Record<string, string[]>>({
  jobTypeChips: [],
  benefitsChips: [],
  shiftChips: [],
  scheduleChips: [],
})

// Pay modal state
const payByMode = ref<'range' | 'starting' | 'maximum' | 'exact'>('range')
const payMin = ref<string>('')
const payMax = ref<string>('')
const paySingle = ref<string>('')
const payRate = ref<string>('per year')
const payBySelectOpen = ref<boolean>(false)
const rateSelectOpen = ref<boolean>(false)

// Description textarea
const descTextarea = ref<string>('')
const descExpanded = ref<boolean>(false)

// Dirty flag
const isDirty = computed(() => {
  return JSON.stringify(jobData.value) !== JSON.stringify(originalData.value)
})

// ───────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ───────────────────────────────────────────────────────────────

function csvToArray(str: string): string[] {
  if (!str) return []
  return str
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function arrayToCsv(arr: string[]): string {
  return arr.join(', ')
}

function parsePay(str: string): PayParsed {
  const result: PayParsed = {
    mode: 'range',
    min: '',
    max: '',
    single: '',
    rate: 'per year',
  }

  if (!str) return result

  const s = String(str)

  // Extract rate
  const rateMatch = s.match(/\/\s*(hour|day|week|month|year)/i)
  if (rateMatch) {
    result.rate = 'per ' + rateMatch[1]!.toLowerCase()
  }

  // Strip rate for amount parsing
  let amtPart = s.replace(/\/\s*(hour|day|week|month|year).*$/i, '').trim()
  amtPart = amtPart.replace(/^Starting at\s+/i, () => {
    result.mode = 'starting'
    return ''
  })
  amtPart = amtPart.replace(/^Up to\s+/i, () => {
    result.mode = 'maximum'
    return ''
  })

  // Range: "$X – $Y"
  const rangeMatch = amtPart.match(/\$([0-9,.]+)\s*[\u2013\-]\s*\$([0-9,.]+)/)
  if (rangeMatch) {
    result.mode = 'range'
    result.min = rangeMatch[1]!
    result.max = rangeMatch[2]!
    return result
  }

  // Single: "$X"
  const singleMatch = amtPart.match(/\$([0-9,.]+)/)
  if (singleMatch) {
    if (result.mode === 'range') result.mode = 'exact'
    result.single = singleMatch[1]!
  }

  return result
}

function formatPay(
  mode: string,
  min: string,
  max: string,
  single: string,
  rate: string
): string {
  const rateSuffix = rate ? ' / ' + rate.replace(/^per\s+/, '') : ''
  if (mode === 'range') {
    return '$' + (min || '0') + ' – $' + (max || '0') + rateSuffix
  }
  if (mode === 'starting') return 'Starting at $' + (single || '0') + rateSuffix
  if (mode === 'maximum') return 'Up to $' + (single || '0') + rateSuffix
  return '$' + (single || '0') + rateSuffix // exact
}

// ───────────────────────────────────────────────────────────────
// LOAD / RESET JOB
// ───────────────────────────────────────────────────────────────

function loadJob(jobId: string): void {
  if (!JOBS[jobId]) jobId = 'rn'
  currentJobId.value = jobId
  const job = JOBS[jobId]!
  jobData.value = { ...job }
  originalData.value = { ...job }
  descExpanded.value = false
}

// ───────────────────────────────────────────────────────────────
// MODAL: CHIP GROUPS
// ───────────────────────────────────────────────────────────────

function buildChipGroup(
  field: 'jobTypeChips' | 'benefitsChips' | 'shiftChips' | 'scheduleChips',
  selectedValues: string[]
): void {
  selectedChips.value[field] = selectedValues
}

function toggleChip(
  field: 'jobTypeChips' | 'benefitsChips' | 'shiftChips' | 'scheduleChips',
  value: string
): void {
  const mode =
    field === 'benefitsChips' ? 'multi' : ('single' as const)
  const selected = selectedChips.value[field] ?? []

  if (mode === 'multi') {
    const idx = selected.indexOf(value)
    if (idx >= 0) {
      selected.splice(idx, 1)
    } else {
      selected.push(value)
    }
  } else {
    // single mode
    if (selected[0] === value) {
      selected.pop()
    } else {
      selected.length = 0
      selected.push(value)
    }
  }
}

function isChipSelected(
  field: 'jobTypeChips' | 'benefitsChips' | 'shiftChips' | 'scheduleChips',
  value: string
): boolean {
  return (selectedChips.value[field] ?? []).includes(value)
}

// ───────────────────────────────────────────────────────────────
// MODAL: PAY WIDGET
// ───────────────────────────────────────────────────────────────

function populatePayModal(): void {
  const parsed = parsePay(jobData.value.pay)
  payByMode.value = parsed.mode
  payMin.value = parsed.min
  payMax.value = parsed.max
  paySingle.value = parsed.single || parsed.min || ''
  payRate.value = parsed.rate
}

function readPayFromModal(): string {
  return formatPay(payByMode.value, payMin.value, payMax.value, paySingle.value, payRate.value)
}

// ───────────────────────────────────────────────────────────────
// MODAL LIFECYCLE
// ───────────────────────────────────────────────────────────────

function openModal(field: string): void {
  if (field === 'jobType') {
    const current = jobData.value.jobType ? [jobData.value.jobType] : []
    buildChipGroup('jobTypeChips', current)
  } else if (field === 'benefits') {
    const currentBenefits = csvToArray(jobData.value.benefits)
    buildChipGroup('benefitsChips', currentBenefits)
  } else if (field === 'shift') {
    const currentShift = jobData.value.shift ? [jobData.value.shift] : []
    buildChipGroup('shiftChips', currentShift)
  } else if (field === 'schedule') {
    const currentSched = jobData.value.schedule ? [jobData.value.schedule] : []
    buildChipGroup('scheduleChips', currentSched)
  } else if (field === 'pay') {
    populatePayModal()
  } else if (field === 'desc') {
    descTextarea.value = jobData.value.desc || ''
  }

  if (field in openModals.value) {
    openModals.value[field as keyof typeof openModals.value] = true
  }
  document.body.style.overflow = 'hidden'
}

function closeModal(field: string): void {
  if (field in openModals.value) {
    openModals.value[field as keyof typeof openModals.value] = false
  }
  // Restore scroll only if no modals are open
  const anyOpen = Object.values(openModals.value).some((v) => v)
  if (!anyOpen) {
    document.body.style.overflow = ''
  }
}

function saveModal(field: string): void {
  if (field === 'jobType') {
    const vals = selectedChips.value.jobTypeChips ?? []
    jobData.value.jobType = vals[0] ?? ''
  } else if (field === 'benefits') {
    const bvals = selectedChips.value.benefitsChips ?? []
    jobData.value.benefits = arrayToCsv(bvals)
  } else if (field === 'shift') {
    const svals = selectedChips.value.shiftChips ?? []
    jobData.value.shift = svals[0] ?? ''
  } else if (field === 'schedule') {
    const schVals = selectedChips.value.scheduleChips ?? []
    jobData.value.schedule = schVals[0] ?? ''
  } else if (field === 'pay') {
    jobData.value.pay = readPayFromModal()
  } else if (field === 'desc') {
    jobData.value.desc = descTextarea.value
  }

  closeModal(field)
}

// ───────────────────────────────────────────────────────────────
// DESCRIPTION PREVIEW
// ───────────────────────────────────────────────────────────────

const descriptionPreview = computed(() => {
  const desc = jobData.value.desc || ''
  return desc.length > DESC_LIMIT ? desc.substring(0, DESC_LIMIT) : desc
})

const descriptionTruncated = computed(() => {
  return (jobData.value.desc || '').length > DESC_LIMIT
})

function toggleDescPreview(): void {
  descExpanded.value = !descExpanded.value
}

// ───────────────────────────────────────────────────────────────
// SAVE & DIRTY HANDLING
// ───────────────────────────────────────────────────────────────

function saveAll(): void {
  JOBS[currentJobId.value] = { ...jobData.value }
  originalData.value = { ...jobData.value }
  try {
    window.close()
  } catch (e) {
    // Ignore errors from close
  }
  setTimeout(() => {
    if (!window.closed) {
      const eventKey = jobData.value.event ?? 'dallas'
      window.location.href = 'edit-post.html?event=' + eventKey
    }
  }, 150)
}

// ───────────────────────────────────────────────────────────────
// DEV TOGGLE
// ───────────────────────────────────────────────────────────────

function devSwitchJob(jobId: string): void {
  if (isDirty.value) {
    const confirm = window.confirm(
      'Unsaved changes will be lost. Continue?'
    )
    if (!confirm) return
  }
  loadJob(jobId)
}

// ───────────────────────────────────────────────────────────────
// LIFECYCLE
// ───────────────────────────────────────────────────────────────

function handleBeforeUnload(e: BeforeUnloadEvent): void {
  if (isDirty.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

function handleEscapeKey(e: KeyboardEvent): void {
  if (e.key === 'Escape') {
    const anyOpen = Object.values(openModals.value).some((v) => v)
    if (anyOpen) {
      // Close the first open modal
      for (const field in openModals.value) {
        if (openModals.value[field as keyof typeof openModals.value]) {
          closeModal(field)
          break
        }
      }
    }
  }
}

onMounted(() => {
  loadJob('rn')
  window.addEventListener('beforeunload', handleBeforeUnload)
  window.addEventListener('keydown', handleEscapeKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  window.removeEventListener('keydown', handleEscapeKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="bg-surface-sunken min-h-screen px-7 py-6">
    <div class="max-w-[720px] mx-auto py-6 pb-20">
      <!-- Page title card -->
      <div
        class="bg-surface-raised rounded-lg shadow-card p-7 mb-6"
      >
        <h1 class="text-4xl font-bold text-text-primary m-0">Edit job</h1>
      </div>

      <!-- Form card with review table -->
      <div
        class="bg-surface-raised rounded-lg shadow-card p-8 mb-6"
      >
        <div class="text-2xl font-bold text-text-primary mb-6">
          Job details
        </div>

        <table class="w-full border-collapse">
          <!-- Title (locked) -->
          <tr class="border-b border-border-default last:border-0">
            <td class="py-4 align-top text-lg font-bold text-text-primary w-[180px] pr-6 whitespace-nowrap">
              Job title
            </td>
            <td class="py-4 align-top text-lg text-text-primary break-words">
              {{ jobData.title }}
            </td>
            <td class="py-4 align-top w-[40px] text-right pl-4">
              <div
                class="inline-flex items-center justify-center w-8 h-8 rounded-sm text-[#a8a8a8] cursor-help relative group"
                title="Can't change after posting"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-4 h-4"
                >
                  <rect x="4" y="11" width="16" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                <!-- Tooltip on hover -->
                <div
                  class="absolute bottom-full right-8 mb-2 hidden group-hover:block bg-text-primary text-white text-xs font-medium px-2.5 py-1.5 rounded-sm whitespace-nowrap z-10"
                >
                  Can't change after posting
                </div>
              </div>
            </td>
          </tr>

          <!-- Location (locked) -->
          <tr class="border-b border-border-default last:border-0">
            <td class="py-4 align-top text-lg font-bold text-text-tertiary w-[180px] pr-6 whitespace-nowrap">
              Location
            </td>
            <td class="py-4 align-top text-lg text-text-tertiary break-words">
              {{ jobData.location }}
            </td>
            <td class="py-4 align-top w-[40px] text-right pl-4">
              <div
                class="inline-flex items-center justify-center w-8 h-8 rounded-sm text-[#a8a8a8] cursor-help relative group"
                title="Can't change after posting"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-4 h-4"
                >
                  <rect x="4" y="11" width="16" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                <!-- Tooltip on hover -->
                <div
                  class="absolute bottom-full right-8 mb-2 hidden group-hover:block bg-text-primary text-white text-xs font-medium px-2.5 py-1.5 rounded-sm whitespace-nowrap z-10"
                >
                  Can't change after posting
                </div>
              </div>
            </td>
          </tr>

          <!-- Job type -->
          <tr class="border-b border-border-default last:border-0">
            <td class="py-4 align-top text-lg font-bold text-text-primary w-[180px] pr-6 whitespace-nowrap">
              Job type
            </td>
            <td class="py-4 align-top text-lg text-text-primary break-words">
              {{ jobData.jobType || '(Not set)' }}
            </td>
            <td class="py-4 align-top w-[40px] text-right pl-4">
              <button
                @click="openModal('jobType')"
                type="button"
                class="inline-flex items-center justify-center w-8 h-8 rounded-sm border-0 bg-transparent cursor-pointer text-brand-blue transition-colors hover:bg-[#f3f2ef]"
                title="Edit"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-4.5 h-4.5"
                >
                  <path
                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                  />
                </svg>
              </button>
            </td>
          </tr>

          <!-- Pay -->
          <tr class="border-b border-border-default last:border-0">
            <td class="py-4 align-top text-lg font-bold text-text-primary w-[180px] pr-6 whitespace-nowrap">
              Pay
            </td>
            <td class="py-4 align-top text-lg text-text-primary break-words">
              {{ jobData.pay || '(Not set)' }}
            </td>
            <td class="py-4 align-top w-[40px] text-right pl-4">
              <button
                @click="openModal('pay')"
                type="button"
                class="inline-flex items-center justify-center w-8 h-8 rounded-sm border-0 bg-transparent cursor-pointer text-brand-blue transition-colors hover:bg-[#f3f2ef]"
                title="Edit"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-4.5 h-4.5"
                >
                  <path
                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                  />
                </svg>
              </button>
            </td>
          </tr>

          <!-- Benefits -->
          <tr class="border-b border-border-default last:border-0">
            <td class="py-4 align-top text-lg font-bold text-text-primary w-[180px] pr-6 whitespace-nowrap">
              Benefits
            </td>
            <td class="py-4 align-top text-lg text-text-primary break-words">
              {{ jobData.benefits || '(Not set)' }}
            </td>
            <td class="py-4 align-top w-[40px] text-right pl-4">
              <button
                @click="openModal('benefits')"
                type="button"
                class="inline-flex items-center justify-center w-8 h-8 rounded-sm border-0 bg-transparent cursor-pointer text-brand-blue transition-colors hover:bg-[#f3f2ef]"
                title="Edit"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-4.5 h-4.5"
                >
                  <path
                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                  />
                </svg>
              </button>
            </td>
          </tr>

          <!-- Standard Shift -->
          <tr class="border-b border-border-default last:border-0">
            <td class="py-4 align-top text-lg font-bold text-text-primary w-[180px] pr-6 whitespace-nowrap">
              Standard Shift
            </td>
            <td class="py-4 align-top text-lg text-text-primary break-words">
              {{ jobData.shift || '(Not set)' }}
            </td>
            <td class="py-4 align-top w-[40px] text-right pl-4">
              <button
                @click="openModal('shift')"
                type="button"
                class="inline-flex items-center justify-center w-8 h-8 rounded-sm border-0 bg-transparent cursor-pointer text-brand-blue transition-colors hover:bg-[#f3f2ef]"
                title="Edit"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-4.5 h-4.5"
                >
                  <path
                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                  />
                </svg>
              </button>
            </td>
          </tr>

          <!-- Weekly Schedule -->
          <tr class="border-b border-border-default last:border-0">
            <td class="py-4 align-top text-lg font-bold text-text-primary w-[180px] pr-6 whitespace-nowrap">
              Weekly Schedule
            </td>
            <td class="py-4 align-top text-lg text-text-primary break-words">
              {{ jobData.schedule || '(Not set)' }}
            </td>
            <td class="py-4 align-top w-[40px] text-right pl-4">
              <button
                @click="openModal('schedule')"
                type="button"
                class="inline-flex items-center justify-center w-8 h-8 rounded-sm border-0 bg-transparent cursor-pointer text-brand-blue transition-colors hover:bg-[#f3f2ef]"
                title="Edit"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-4.5 h-4.5"
                >
                  <path
                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                  />
                </svg>
              </button>
            </td>
          </tr>

          <!-- Job description -->
          <tr class="border-b border-border-default last:border-0">
            <td class="py-4 align-top text-lg font-bold text-text-primary w-[180px] pr-6 whitespace-nowrap">
              Job description
            </td>
            <td class="py-4 align-top text-lg text-text-primary break-words">
              <div
                :class="[
                  'whitespace-pre-wrap',
                  !descExpanded && 'max-h-[100px] overflow-hidden',
                ]"
              >
                {{ descriptionPreview }}
              </div>
              <button
                v-if="descriptionTruncated"
                @click="toggleDescPreview"
                type="button"
                class="text-brand-blue font-bold text-base cursor-pointer mt-2 bg-none border-0 font-family-inherit p-0 hover:underline"
              >
                {{
                  descExpanded
                    ? 'Show less'
                    : 'Show full description'
                }}
              </button>
            </td>
            <td class="py-4 align-top w-[40px] text-right pl-4">
              <button
                @click="openModal('desc')"
                type="button"
                class="inline-flex items-center justify-center w-8 h-8 rounded-sm border-0 bg-transparent cursor-pointer text-brand-blue transition-colors hover:bg-[#f3f2ef]"
                title="Edit"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-4.5 h-4.5"
                >
                  <path
                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </table>
      </div>

      <!-- Bottom actions -->
      <div
        class="bg-surface-raised rounded-lg shadow-card p-8 flex items-center justify-end"
      >
        <button
          @click="saveAll"
          type="button"
          :disabled="!isDirty"
          class="inline-flex items-center gap-2 py-3.5 px-9 rounded bg-brand-blue text-white text-lg font-bold border-0 cursor-pointer transition-colors hover:bg-brand-blue-dark disabled:bg-[#a8a8a8] disabled:cursor-not-allowed"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-4.5 h-4.5"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Save
        </button>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════
         MODALS
         ═══════════════════════════════════════════════════════════════════ -->

    <!-- Job Type Modal -->
    <Teleport to="body">
      <div
        v-if="openModals.jobType"
        class="fixed inset-0 bg-black/50 flex items-start justify-center z-[1000] overflow-y-auto pt-14 pb-5 px-5"
        @click="closeModal('jobType')"
      >
        <div
          class="bg-surface-raised rounded-lg w-full max-w-[560px] shadow-modal flex flex-col max-h-[calc(100vh-112px)] overflow-hidden"
          @click.stop
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-7 py-6 border-b border-border-default flex-shrink-0"
          >
            <h2 class="text-2xl font-bold text-text-primary">Job type</h2>
            <button
              @click="closeModal('jobType')"
              type="button"
              class="w-8 h-8 rounded-sm bg-transparent border-0 cursor-pointer text-text-secondary flex items-center justify-center transition-colors hover:bg-[#f3f2ef]"
              aria-label="Close"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-5 h-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-7 py-6 overflow-y-auto flex-1">
            <p class="text-base text-text-secondary mb-3.5 leading-relaxed">
              Select the job type that best describes this position.
            </p>
            <div class="flex flex-wrap gap-2.5">
              <button
                v-for="opt in JOB_TYPE_OPTIONS"
                :key="opt"
                @click="toggleChip('jobTypeChips', opt)"
                type="button"
                :class="[
                  'inline-flex items-center gap-1.5 py-1.75 px-3.5 rounded-full border-2 border-transparent bg-[#f0efed] text-sm font-medium text-text-primary cursor-pointer transition-all hover:bg-[#e5e4e1] font-family-inherit',
                  isChipSelected('jobTypeChips', opt) &&
                    'bg-white border-text-primary',
                ]"
              >
                <svg
                  v-if="isChipSelected('jobTypeChips', opt)"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-3.5 h-3.5 flex-shrink-0"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-3.5 h-3.5 flex-shrink-0"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {{ opt }}
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex justify-end gap-2.5 px-7 py-5 border-t border-border-default flex-shrink-0"
          >
            <button
              @click="closeModal('jobType')"
              type="button"
              class="py-2.75 px-5.5 rounded border border-border-strong bg-white text-text-primary text-base font-bold cursor-pointer font-family-inherit transition-colors hover:bg-[#f3f2ef]"
            >
              Cancel
            </button>
            <button
              @click="saveModal('jobType')"
              type="button"
              class="py-2.75 px-6.5 rounded bg-brand-blue text-white text-base font-bold border-0 cursor-pointer font-family-inherit transition-colors hover:bg-brand-blue-dark"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Benefits Modal -->
    <Teleport to="body">
      <div
        v-if="openModals.benefits"
        class="fixed inset-0 bg-black/50 flex items-start justify-center z-[1000] overflow-y-auto pt-14 pb-5 px-5"
        @click="closeModal('benefits')"
      >
        <div
          class="bg-surface-raised rounded-lg w-full max-w-[680px] shadow-modal flex flex-col max-h-[calc(100vh-112px)] overflow-hidden"
          @click.stop
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-7 py-6 border-b border-border-default flex-shrink-0"
          >
            <h2 class="text-2xl font-bold text-text-primary">Benefits</h2>
            <button
              @click="closeModal('benefits')"
              type="button"
              class="w-8 h-8 rounded-sm bg-transparent border-0 cursor-pointer text-text-secondary flex items-center justify-center transition-colors hover:bg-[#f3f2ef]"
              aria-label="Close"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-5 h-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-7 py-6 overflow-y-auto flex-1">
            <p class="text-base text-text-secondary mb-3.5 leading-relaxed">
              Select all benefits that apply. You can pick more than one.
            </p>
            <div class="flex flex-wrap gap-2.5">
              <button
                v-for="opt in BENEFIT_OPTIONS"
                :key="opt"
                @click="toggleChip('benefitsChips', opt)"
                type="button"
                :class="[
                  'inline-flex items-center gap-1.5 py-1.75 px-3.5 rounded-full border-2 border-transparent bg-[#f0efed] text-sm font-medium text-text-primary cursor-pointer transition-all hover:bg-[#e5e4e1] font-family-inherit',
                  isChipSelected('benefitsChips', opt) &&
                    'bg-white border-text-primary',
                ]"
              >
                <svg
                  v-if="isChipSelected('benefitsChips', opt)"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-3.5 h-3.5 flex-shrink-0"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-3.5 h-3.5 flex-shrink-0"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {{ opt }}
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex justify-end gap-2.5 px-7 py-5 border-t border-border-default flex-shrink-0"
          >
            <button
              @click="closeModal('benefits')"
              type="button"
              class="py-2.75 px-5.5 rounded border border-border-strong bg-white text-text-primary text-base font-bold cursor-pointer font-family-inherit transition-colors hover:bg-[#f3f2ef]"
            >
              Cancel
            </button>
            <button
              @click="saveModal('benefits')"
              type="button"
              class="py-2.75 px-6.5 rounded bg-brand-blue text-white text-base font-bold border-0 cursor-pointer font-family-inherit transition-colors hover:bg-brand-blue-dark"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Shift Modal -->
    <Teleport to="body">
      <div
        v-if="openModals.shift"
        class="fixed inset-0 bg-black/50 flex items-start justify-center z-[1000] overflow-y-auto pt-14 pb-5 px-5"
        @click="closeModal('shift')"
      >
        <div
          class="bg-surface-raised rounded-lg w-full max-w-[560px] shadow-modal flex flex-col max-h-[calc(100vh-112px)] overflow-hidden"
          @click.stop
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-7 py-6 border-b border-border-default flex-shrink-0"
          >
            <h2 class="text-2xl font-bold text-text-primary">Standard Shift</h2>
            <button
              @click="closeModal('shift')"
              type="button"
              class="w-8 h-8 rounded-sm bg-transparent border-0 cursor-pointer text-text-secondary flex items-center justify-center transition-colors hover:bg-[#f3f2ef]"
              aria-label="Close"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-5 h-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-7 py-6 overflow-y-auto flex-1">
            <p class="text-base text-text-secondary mb-3.5 leading-relaxed">
              Select the standard shift for this position.
            </p>
            <div class="flex flex-wrap gap-2.5">
              <button
                v-for="opt in SHIFT_OPTIONS"
                :key="opt"
                @click="toggleChip('shiftChips', opt)"
                type="button"
                :class="[
                  'inline-flex items-center gap-1.5 py-1.75 px-3.5 rounded-full border-2 border-transparent bg-[#f0efed] text-sm font-medium text-text-primary cursor-pointer transition-all hover:bg-[#e5e4e1] font-family-inherit',
                  isChipSelected('shiftChips', opt) &&
                    'bg-white border-text-primary',
                ]"
              >
                <svg
                  v-if="isChipSelected('shiftChips', opt)"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-3.5 h-3.5 flex-shrink-0"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-3.5 h-3.5 flex-shrink-0"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {{ opt }}
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex justify-end gap-2.5 px-7 py-5 border-t border-border-default flex-shrink-0"
          >
            <button
              @click="closeModal('shift')"
              type="button"
              class="py-2.75 px-5.5 rounded border border-border-strong bg-white text-text-primary text-base font-bold cursor-pointer font-family-inherit transition-colors hover:bg-[#f3f2ef]"
            >
              Cancel
            </button>
            <button
              @click="saveModal('shift')"
              type="button"
              class="py-2.75 px-6.5 rounded bg-brand-blue text-white text-base font-bold border-0 cursor-pointer font-family-inherit transition-colors hover:bg-brand-blue-dark"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Schedule Modal -->
    <Teleport to="body">
      <div
        v-if="openModals.schedule"
        class="fixed inset-0 bg-black/50 flex items-start justify-center z-[1000] overflow-y-auto pt-14 pb-5 px-5"
        @click="closeModal('schedule')"
      >
        <div
          class="bg-surface-raised rounded-lg w-full max-w-[560px] shadow-modal flex flex-col max-h-[calc(100vh-112px)] overflow-hidden"
          @click.stop
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-7 py-6 border-b border-border-default flex-shrink-0"
          >
            <h2 class="text-2xl font-bold text-text-primary">Weekly Schedule</h2>
            <button
              @click="closeModal('schedule')"
              type="button"
              class="w-8 h-8 rounded-sm bg-transparent border-0 cursor-pointer text-text-secondary flex items-center justify-center transition-colors hover:bg-[#f3f2ef]"
              aria-label="Close"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-5 h-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-7 py-6 overflow-y-auto flex-1">
            <p class="text-base text-text-secondary mb-3.5 leading-relaxed">
              Select the weekly schedule for this position.
            </p>
            <div class="flex flex-wrap gap-2.5">
              <button
                v-for="opt in SCHEDULE_OPTIONS"
                :key="opt"
                @click="toggleChip('scheduleChips', opt)"
                type="button"
                :class="[
                  'inline-flex items-center gap-1.5 py-1.75 px-3.5 rounded-full border-2 border-transparent bg-[#f0efed] text-sm font-medium text-text-primary cursor-pointer transition-all hover:bg-[#e5e4e1] font-family-inherit',
                  isChipSelected('scheduleChips', opt) &&
                    'bg-white border-text-primary',
                ]"
              >
                <svg
                  v-if="isChipSelected('scheduleChips', opt)"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-3.5 h-3.5 flex-shrink-0"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-3.5 h-3.5 flex-shrink-0"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {{ opt }}
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex justify-end gap-2.5 px-7 py-5 border-t border-border-default flex-shrink-0"
          >
            <button
              @click="closeModal('schedule')"
              type="button"
              class="py-2.75 px-5.5 rounded border border-border-strong bg-white text-text-primary text-base font-bold cursor-pointer font-family-inherit transition-colors hover:bg-[#f3f2ef]"
            >
              Cancel
            </button>
            <button
              @click="saveModal('schedule')"
              type="button"
              class="py-2.75 px-6.5 rounded bg-brand-blue text-white text-base font-bold border-0 cursor-pointer font-family-inherit transition-colors hover:bg-brand-blue-dark"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Pay Modal -->
    <Teleport to="body">
      <div
        v-if="openModals.pay"
        class="fixed inset-0 bg-black/50 flex items-start justify-center z-[1000] overflow-y-auto pt-14 pb-5 px-5"
        @click="closeModal('pay')"
      >
        <div
          class="bg-surface-raised rounded-lg w-full max-w-[780px] shadow-modal flex flex-col max-h-[calc(100vh-112px)] overflow-hidden"
          @click.stop
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-7 py-6 border-b border-border-default flex-shrink-0"
          >
            <h2 class="text-2xl font-bold text-text-primary">Pay</h2>
            <button
              @click="closeModal('pay')"
              type="button"
              class="w-8 h-8 rounded-sm bg-transparent border-0 cursor-pointer text-text-secondary flex items-center justify-center transition-colors hover:bg-[#f3f2ef]"
              aria-label="Close"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-5 h-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-7 py-6 overflow-y-auto flex-1">
            <p class="text-base text-text-secondary mb-3.5 leading-relaxed">
              Choose how to display pay for this job. Adjust as needed.
            </p>

            <!-- Range row (show when payByMode === 'range') -->
            <div v-if="payByMode === 'range'" class="flex flex-wrap items-end gap-3.5 mb-4">
              <!-- Show pay by dropdown -->
              <div class="flex flex-col gap-1.5 flex-none">
                <label class="text-base font-bold text-text-primary">
                  Show pay by
                </label>
                <div class="relative inline-block">
                  <button
                    @click="payBySelectOpen = !payBySelectOpen"
                    type="button"
                    class="flex items-center gap-2 py-3 px-4 border-2 border-[#a8a8a8] rounded-md bg-white cursor-pointer text-md font-family-inherit text-text-primary transition-colors hover:border-text-secondary relative min-w-[170px]"
                    :class="payBySelectOpen && 'border-brand-blue'"
                  >
                    <span>Range</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary transition-transform pointer-events-none"
                      :class="payBySelectOpen && 'rotate-180'"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div
                    v-if="payBySelectOpen"
                    class="absolute top-[calc(100%+4px)] left-0 min-w-full bg-white border border-border-strong rounded-md shadow-menu z-10"
                  >
                    <button
                      @click="() => { payByMode = 'range'; payBySelectOpen = false; }"
                      type="button"
                      class="w-full flex items-center gap-2.5 py-3 px-4 text-md text-text-primary cursor-pointer transition-colors hover:bg-[#f3f2ef] bg-[#f3f2ef] font-family-inherit border-0"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="w-4.5 h-4.5 flex-shrink-0"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Range
                    </button>
                    <button
                      @click="() => { payByMode = 'starting'; payBySelectOpen = false; }"
                      type="button"
                      class="w-full flex items-center gap-2.5 py-3 px-4 text-md text-text-primary cursor-pointer transition-colors hover:bg-[#f3f2ef] font-family-inherit border-0"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="w-4.5 h-4.5 flex-shrink-0 invisible"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Starting amount
                    </button>
                    <button
                      @click="() => { payByMode = 'maximum'; payBySelectOpen = false; }"
                      type="button"
                      class="w-full flex items-center gap-2.5 py-3 px-4 text-md text-text-primary cursor-pointer transition-colors hover:bg-[#f3f2ef] font-family-inherit border-0"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="w-4.5 h-4.5 flex-shrink-0 invisible"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Maximum amount
                    </button>
                    <button
                      @click="() => { payByMode = 'exact'; payBySelectOpen = false; }"
                      type="button"
                      class="w-full flex items-center gap-2.5 py-3 px-4 text-md text-text-primary cursor-pointer transition-colors hover:bg-[#f3f2ef] font-family-inherit border-0"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="w-4.5 h-4.5 flex-shrink-0 invisible"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Exact amount
                    </button>
                  </div>
                </div>
              </div>

              <!-- Min input -->
              <div class="flex flex-col gap-1.5 flex-1 min-w-0">
                <label class="text-base font-bold text-text-primary">
                  Minimum
                </label>
                <div
                  class="flex items-center border-2 border-[#a8a8a8] rounded-md overflow-hidden bg-white transition-colors focus-within:border-brand-blue"
                >
                  <span class="py-3 pl-3.5 pr-0 text-lg text-text-secondary font-medium">
                    $
                  </span>
                  <input
                    v-model="payMin"
                    type="text"
                    class="border-0 outline-0 py-3 px-3 text-lg font-family-inherit text-text-primary w-full min-w-0 bg-transparent"
                  />
                </div>
              </div>

              <!-- "to" label -->
              <span class="text-base text-text-secondary px-1 mb-2.5">
                to
              </span>

              <!-- Max input -->
              <div class="flex flex-col gap-1.5 flex-1 min-w-0">
                <label class="text-base font-bold text-text-primary">
                  Maximum
                </label>
                <div
                  class="flex items-center border-2 border-[#a8a8a8] rounded-md overflow-hidden bg-white transition-colors focus-within:border-brand-blue"
                >
                  <span class="py-3 pl-3.5 pr-0 text-lg text-text-secondary font-medium">
                    $
                  </span>
                  <input
                    v-model="payMax"
                    type="text"
                    class="border-0 outline-0 py-3 px-3 text-lg font-family-inherit text-text-primary w-full min-w-0 bg-transparent"
                  />
                </div>
              </div>
            </div>

            <!-- Single amount row (show for starting/maximum/exact) -->
            <div v-if="payByMode !== 'range'" class="flex flex-wrap items-end gap-3.5 mb-4">
              <!-- Show pay by dropdown -->
              <div class="flex flex-col gap-1.5 flex-none">
                <label class="text-base font-bold text-text-primary">
                  Show pay by
                </label>
                <div class="relative inline-block">
                  <button
                    @click="payBySelectOpen = !payBySelectOpen"
                    type="button"
                    class="flex items-center gap-2 py-3 px-4 border-2 border-[#a8a8a8] rounded-md bg-white cursor-pointer text-md font-family-inherit text-text-primary transition-colors hover:border-text-secondary relative min-w-[170px]"
                    :class="payBySelectOpen && 'border-brand-blue'"
                  >
                    <span>
                      {{
                        payByMode === 'starting'
                          ? 'Starting amount'
                          : payByMode === 'maximum'
                            ? 'Maximum amount'
                            : 'Exact amount'
                      }}
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary transition-transform pointer-events-none"
                      :class="payBySelectOpen && 'rotate-180'"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div
                    v-if="payBySelectOpen"
                    class="absolute top-[calc(100%+4px)] left-0 min-w-full bg-white border border-border-strong rounded-md shadow-menu z-10"
                  >
                    <button
                      @click="() => { payByMode = 'range'; payBySelectOpen = false; }"
                      type="button"
                      class="w-full flex items-center gap-2.5 py-3 px-4 text-md text-text-primary cursor-pointer transition-colors hover:bg-[#f3f2ef] font-family-inherit border-0"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="w-4.5 h-4.5 flex-shrink-0 invisible"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Range
                    </button>
                    <button
                      @click="() => { payByMode = 'starting'; payBySelectOpen = false; }"
                      type="button"
                      class="w-full flex items-center gap-2.5 py-3 px-4 text-md text-text-primary cursor-pointer transition-colors hover:bg-[#f3f2ef] bg-[#f3f2ef] font-family-inherit border-0"
                      :class="payByMode === 'starting' && 'bg-[#f3f2ef]'"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="w-4.5 h-4.5 flex-shrink-0"
                        :class="payByMode === 'starting' ? '' : 'invisible'"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Starting amount
                    </button>
                    <button
                      @click="() => { payByMode = 'maximum'; payBySelectOpen = false; }"
                      type="button"
                      class="w-full flex items-center gap-2.5 py-3 px-4 text-md text-text-primary cursor-pointer transition-colors hover:bg-[#f3f2ef] font-family-inherit border-0"
                      :class="payByMode === 'maximum' && 'bg-[#f3f2ef]'"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="w-4.5 h-4.5 flex-shrink-0"
                        :class="payByMode === 'maximum' ? '' : 'invisible'"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Maximum amount
                    </button>
                    <button
                      @click="() => { payByMode = 'exact'; payBySelectOpen = false; }"
                      type="button"
                      class="w-full flex items-center gap-2.5 py-3 px-4 text-md text-text-primary cursor-pointer transition-colors hover:bg-[#f3f2ef] font-family-inherit border-0"
                      :class="payByMode === 'exact' && 'bg-[#f3f2ef]'"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="w-4.5 h-4.5 flex-shrink-0"
                        :class="payByMode === 'exact' ? '' : 'invisible'"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Exact amount
                    </button>
                  </div>
                </div>
              </div>

              <!-- Single amount input -->
              <div class="flex flex-col gap-1.5 flex-1 min-w-0">
                <label class="text-base font-bold text-text-primary">
                  {{
                    payByMode === 'starting'
                      ? 'Starting amount'
                      : payByMode === 'maximum'
                        ? 'Maximum amount'
                        : 'Exact amount'
                  }}
                </label>
                <div
                  class="flex items-center border-2 border-[#a8a8a8] rounded-md overflow-hidden bg-white transition-colors focus-within:border-brand-blue"
                >
                  <span class="py-3 pl-3.5 pr-0 text-lg text-text-secondary font-medium">
                    $
                  </span>
                  <input
                    v-model="paySingle"
                    type="text"
                    class="border-0 outline-0 py-3 px-3 text-lg font-family-inherit text-text-primary w-full min-w-0 bg-transparent"
                  />
                </div>
              </div>
            </div>

            <!-- Rate row (always visible) -->
            <div class="flex flex-wrap items-end gap-3.5">
              <div class="flex flex-col gap-1.5 flex-none">
                <label class="text-base font-bold text-text-primary">
                  Rate
                </label>
                <div class="relative inline-block">
                  <button
                    @click="rateSelectOpen = !rateSelectOpen"
                    type="button"
                    class="flex items-center gap-2 py-3 px-4 border-2 border-[#a8a8a8] rounded-md bg-white cursor-pointer text-md font-family-inherit text-text-primary transition-colors hover:border-text-secondary relative min-w-[170px]"
                    :class="rateSelectOpen && 'border-brand-blue'"
                  >
                    <span>{{ payRate.replace(/^per\s+/, '') }}</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary transition-transform pointer-events-none"
                      :class="rateSelectOpen && 'rotate-180'"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div
                    v-if="rateSelectOpen"
                    class="absolute top-[calc(100%+4px)] left-0 min-w-full bg-white border border-border-strong rounded-md shadow-menu z-10"
                  >
                    <button
                      v-for="rate in ['per hour', 'per day', 'per week', 'per month', 'per year']"
                      :key="rate"
                      @click="() => { payRate = rate; rateSelectOpen = false; }"
                      type="button"
                      class="w-full flex items-center gap-2.5 py-3 px-4 text-md text-text-primary cursor-pointer transition-colors hover:bg-[#f3f2ef] font-family-inherit border-0"
                      :class="payRate === rate && 'bg-[#f3f2ef]'"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="w-4.5 h-4.5 flex-shrink-0"
                        :class="payRate === rate ? '' : 'invisible'"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {{ rate.replace(/^per\s+/, '') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex justify-end gap-2.5 px-7 py-5 border-t border-border-default flex-shrink-0"
          >
            <button
              @click="closeModal('pay')"
              type="button"
              class="py-2.75 px-5.5 rounded border border-border-strong bg-white text-text-primary text-base font-bold cursor-pointer font-family-inherit transition-colors hover:bg-[#f3f2ef]"
            >
              Cancel
            </button>
            <button
              @click="saveModal('pay')"
              type="button"
              class="py-2.75 px-6.5 rounded bg-brand-blue text-white text-base font-bold border-0 cursor-pointer font-family-inherit transition-colors hover:bg-brand-blue-dark"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Description Modal -->
    <Teleport to="body">
      <div
        v-if="openModals.desc"
        class="fixed inset-0 bg-black/50 flex items-start justify-center z-[1000] overflow-y-auto pt-14 pb-5 px-5"
        @click="closeModal('desc')"
      >
        <div
          class="bg-surface-raised rounded-lg w-full max-w-[780px] shadow-modal flex flex-col max-h-[calc(100vh-112px)] overflow-hidden"
          @click.stop
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-7 py-6 border-b border-border-default flex-shrink-0"
          >
            <h2 class="text-2xl font-bold text-text-primary">
              Job description
            </h2>
            <button
              @click="closeModal('desc')"
              type="button"
              class="w-8 h-8 rounded-sm bg-transparent border-0 cursor-pointer text-text-secondary flex items-center justify-center transition-colors hover:bg-[#f3f2ef]"
              aria-label="Close"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-5 h-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-7 py-6 overflow-y-auto flex-1">
            <p class="text-base text-text-secondary mb-3.5 leading-relaxed">
              Edit the job description. You can include responsibilities,
              requirements, and benefits.
            </p>
            <textarea
              v-model="descTextarea"
              class="w-full min-h-[260px] py-3.5 px-4 text-md font-family-inherit text-text-primary border-2 border-[#a8a8a8] rounded-md outline-none resize-vertical leading-relaxed bg-white transition-colors focus:border-brand-blue"
            />
          </div>

          <!-- Footer -->
          <div
            class="flex justify-end gap-2.5 px-7 py-5 border-t border-border-default flex-shrink-0"
          >
            <button
              @click="closeModal('desc')"
              type="button"
              class="py-2.75 px-5.5 rounded border border-border-strong bg-white text-text-primary text-base font-bold cursor-pointer font-family-inherit transition-colors hover:bg-[#f3f2ef]"
            >
              Cancel
            </button>
            <button
              @click="saveModal('desc')"
              type="button"
              class="py-2.75 px-6.5 rounded bg-brand-blue text-white text-base font-bold border-0 cursor-pointer font-family-inherit transition-colors hover:bg-brand-blue-dark"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Dev Toggle -->
    <div
      class="fixed bottom-5 right-5 bg-[#1f2937] text-white rounded-full py-1.5 px-3 flex items-center gap-1 shadow-lg z-[500] flex-wrap max-w-[640px]"
    >
      <span
        class="text-xs font-bold uppercase tracking-[0.5px] text-[#9ca3af] px-3 py-0"
      >
        Job
      </span>
      <button
        v-for="jobId in ['ma', 'rn', 'se', 'devops', 'ux']"
        :key="jobId"
        @click="devSwitchJob(jobId)"
        type="button"
        class="bg-transparent border-0 text-[#d1d5db] font-family-inherit text-xs font-semibold py-1.75 px-3.5 rounded-full cursor-pointer transition-all hover:text-white"
        :class="currentJobId === jobId && 'bg-brand-blue text-white'"
      >
        {{ JOBS[jobId]?.title || jobId }}
      </button>
    </div>
  </div>
</template>
