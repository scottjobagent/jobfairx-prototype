<!--
  SharePreviewPage
  ----------------
  Public job fair interview scheduler for job seekers. Displays:
    - Public header (util bar + site nav with JobFairX branding)
    - Left card: Event info + expandable job rows with descriptions
    - Right card: Interview scheduler with job dropdown, time slots, success state
    - Dev toggle: Switch between 1-job (Dallas) and 3-job (Chicago) scenarios

  Interactivity:
    - Job rows: Click to expand/collapse descriptions (chevron rotates)
    - Job dropdown (multi-job events only): Select to show time slots
    - Time slots: Radio selection; shows remaining spots; disables full slots
    - Submit button: Disabled until slot selected; shows success state when clicked
    - Dev toggle: Switch event scenarios; updates URL params

  Data: Static EVENTS data structure (Dallas=1 job, Chicago=3 jobs, Atlanta=1 job)
  Responsive: Single column layout at 900px breakpoint
-->

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

// ─────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────

interface TimeSlot {
  time: string
  remaining: number
}

interface JobData {
  id: string
  title: string
  company: string
  pay: string
  location: string
  desc: string[]
  slots: TimeSlot[]
}

interface EventData {
  title: string
  sub: string
  date: string
  tz: string
  jobs: JobData[]
}

type EventKey = 'dallas' | 'chicago' | 'atlanta'

// ─────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────

const EVENTS: Record<EventKey, EventData> = {
  dallas: {
    title: 'Dallas Virtual Interviews',
    sub: 'Dallas, TX · Healthcare employers',
    date: 'Friday, April 17, 2026',
    tz: 'Central Time (CDT)',
    jobs: [
      {
        id: 'rn',
        title: 'Registered Nurse',
        company: 'Baylor Scott & White Health',
        pay: '$65,000 – $88,000 a year, Full-time',
        location: 'Dallas, TX',
        desc: [
          'Provide high-quality patient care in a fast-paced clinical environment. Collaborate with physicians, care teams, and families to develop and execute care plans.',
          'Requirements: Active RN license in Texas, BLS certification, and 1+ year of clinical experience. BSN preferred.',
          'Benefits include competitive pay, medical/dental/vision, 401(k) match, tuition reimbursement, and generous PTO.',
        ],
        slots: [
          { time: '11:00 AM', remaining: 1 },
          { time: '11:30 AM', remaining: 2 },
          { time: '12:00 PM', remaining: 1 },
          { time: '12:30 PM', remaining: 0 },
          { time: '1:00 PM', remaining: 1 },
          { time: '1:30 PM', remaining: 1 },
          { time: '2:00 PM', remaining: 2 },
          { time: '2:30 PM', remaining: 1 },
        ],
      },
    ],
  },
  chicago: {
    title: 'Chicago Virtual Interviews',
    sub: 'Chicago, IL · Technology employers',
    date: 'Thursday, April 23, 2026',
    tz: 'Central Time (CDT)',
    jobs: [
      {
        id: 'se',
        title: 'Software Engineer',
        company: 'Relativity',
        pay: '$120,000 – $155,000 a year, Full-time',
        location: 'Chicago, IL (Hybrid)',
        desc: [
          'Build and ship delightful user-facing features in React and TypeScript. Partner with designers and product managers to define the next generation of our platform.',
          'Requirements: 3+ years of production React experience, strong CSS fundamentals, and a track record of shipping polished UI at scale.',
        ],
        slots: [
          { time: '11:00 AM', remaining: 1 },
          { time: '11:30 AM', remaining: 1 },
          { time: '12:00 PM', remaining: 2 },
          { time: '12:30 PM', remaining: 1 },
          { time: '1:00 PM', remaining: 1 },
          { time: '1:30 PM', remaining: 1 },
          { time: '2:00 PM', remaining: 1 },
          { time: '2:30 PM', remaining: 1 },
        ],
      },
      {
        id: 'devops',
        title: 'DevOps Engineer',
        company: 'Tempus AI',
        pay: '$140,000 – $175,000 a year, Full-time',
        location: 'Chicago, IL (Remote OK)',
        desc: [
          'Own our cloud infrastructure across AWS. Build resilient CI/CD pipelines, improve observability, and champion developer velocity.',
          'Requirements: Strong Terraform + Kubernetes experience, incident response chops, and a pragmatic approach to reliability.',
        ],
        slots: [
          { time: '11:00 AM', remaining: 1 },
          { time: '11:30 AM', remaining: 0 },
          { time: '12:00 PM', remaining: 1 },
          { time: '12:30 PM', remaining: 1 },
          { time: '1:00 PM', remaining: 1 },
          { time: '1:30 PM', remaining: 1 },
          { time: '2:00 PM', remaining: 1 },
          { time: '2:30 PM', remaining: 0 },
        ],
      },
      {
        id: 'ux',
        title: 'UX Designer',
        company: 'Morningstar',
        pay: '$110,000 – $140,000 a year, Full-time',
        location: 'Chicago, IL (Hybrid)',
        desc: [
          'Design delightful end-to-end experiences that help millions of users invest with confidence. Own research, wireframes, prototypes, and hand-off.',
          'Requirements: 4+ years of product design experience, a strong portfolio, and fluency in Figma and modern design systems.',
        ],
        slots: [
          { time: '11:00 AM', remaining: 1 },
          { time: '11:30 AM', remaining: 1 },
          { time: '12:00 PM', remaining: 1 },
          { time: '12:30 PM', remaining: 1 },
          { time: '1:00 PM', remaining: 0 },
          { time: '1:30 PM', remaining: 1 },
          { time: '2:00 PM', remaining: 1 },
          { time: '2:30 PM', remaining: 1 },
        ],
      },
    ],
  },
  atlanta: {
    title: 'Atlanta Virtual Interviews',
    sub: 'Atlanta, GA · Diversity hiring event',
    date: 'Tuesday, April 28, 2026',
    tz: 'Eastern Time (EDT)',
    jobs: [
      {
        id: 'mkt',
        title: 'Marketing Coordinator',
        company: 'Cox Enterprises',
        pay: '$58,000 – $72,000 a year, Full-time',
        location: 'Atlanta, GA',
        desc: [
          'Support the marketing team across campaign execution, content calendars, and performance reporting. A great entry point into a high-growth team.',
          'Requirements: 1-2 years of marketing experience, strong writing skills, and comfort with analytics tools.',
        ],
        slots: [
          { time: '11:00 AM', remaining: 1 },
          { time: '11:30 AM', remaining: 1 },
          { time: '12:00 PM', remaining: 0 },
          { time: '12:30 PM', remaining: 1 },
          { time: '1:00 PM', remaining: 1 },
          { time: '1:30 PM', remaining: 1 },
          { time: '2:00 PM', remaining: 1 },
          { time: '2:30 PM', remaining: 0 },
        ],
      },
    ],
  },
}

// ─────────────────────────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────────────────────────

const currentEventKey = ref<EventKey>('dallas')
const currentEvent = computed((): EventData => EVENTS[currentEventKey.value])
const selectedJobId = ref<string | null>(null)
const selectedSlotIdx = ref<number | null>(null)
const expandedJobId = ref<string | null>(null)
const showSuccess = ref(false)
const successDesc = ref('')
const rootRef = ref<HTMLElement | null>(null)

// ─────────────────────────────────────────────────────────────────────────
// COMPUTED
// ─────────────────────────────────────────────────────────────────────────

const isSingleJob = computed((): boolean => currentEvent.value.jobs.length === 1)

const selectedJob = computed((): JobData | undefined => {
  if (!selectedJobId.value) return undefined
  return currentEvent.value.jobs.find((j) => j.id === selectedJobId.value)
})

const selectedSlot = computed((): TimeSlot | undefined => {
  if (selectedSlotIdx.value === null || !selectedJob.value) return undefined
  return selectedJob.value.slots[selectedSlotIdx.value]
})

const submitDisabled = computed((): boolean => selectedSlotIdx.value === null)

const tzAbbrev = computed((): string => {
  const match = currentEvent.value.tz.match(/\((\w+)\)/)
  return match?.[1] ?? 'UTC'
})

// ─────────────────────────────────────────────────────────────────────────
// METHODS
// ─────────────────────────────────────────────────────────────────────────

const loadEvent = (eventKey: EventKey): void => {
  currentEventKey.value = eventKey
  selectedJobId.value = null
  selectedSlotIdx.value = null
  expandedJobId.value = null
  showSuccess.value = false

  // Auto-select first job if single job event
  if (currentEvent.value.jobs.length === 1) {
    const firstJob = currentEvent.value.jobs[0]
    if (firstJob) {
      selectJob(firstJob.id)
      expandedJobId.value = firstJob.id
    }
  }
}

const selectJob = (jobId: string): void => {
  selectedJobId.value = jobId
  selectedSlotIdx.value = null
  showSuccess.value = false
}

const toggleJobExpand = (jobId: string): void => {
  expandedJobId.value = expandedJobId.value === jobId ? null : jobId
  selectJob(jobId)
}

const selectTimeSlot = (slotIdx: number): void => {
  if (!selectedJob.value) return
  const slot = selectedJob.value.slots[slotIdx]
  if (!slot || slot.remaining === 0) return
  selectedSlotIdx.value = slotIdx
}

const handleSubmit = (): void => {
  if (selectedSlotIdx.value === null || !selectedJob.value || !selectedSlot.value) return

  const tz = tzAbbrev.value
  successDesc.value = `Your request for ${selectedJob.value.title} at ${selectedSlot.value.time} ${tz} has been sent. The recruiter will review and email you a confirmation shortly.`
  showSuccess.value = true
}

const getRemainingSpotsText = (remaining: number): string => {
  return `${remaining} spot${remaining === 1 ? '' : 's'} remaining`
}

// Close open dropdowns when clicking outside
const onDocClick = (e: MouseEvent): void => {
  const target = e.target as Node
  if (rootRef.value && !rootRef.value.contains(target)) {
    expandedJobId.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  loadEvent('dallas')
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
})
</script>

<template>
  <div ref="rootRef" class="min-h-screen bg-surface-sunken">
    <!-- ─── Util bar ─── -->
    <div class="bg-slate-900 text-white text-center py-2.5 px-4 text-sm">
      Are you an employer hiring?
      <a href="#" class="text-white underline font-semibold ml-1.5"
        >Learn more about our hiring events →</a
      >
    </div>

    <!-- ─── Site nav ─── -->
    <nav class="bg-white border-b border-border-default h-18 flex items-center px-10">
      <div class="max-w-6xl w-full mx-auto flex items-center gap-10">
        <!-- Logo -->
        <a href="#" class="text-2xl font-black text-brand-blue" style="letter-spacing: -0.5px"
          >JobFairX</a
        >

        <!-- Nav links (hidden below 900px) -->
        <div class="hidden md:flex gap-8 flex-1">
          <a href="#" class="text-md font-semibold text-text-primary hover:text-brand-blue"
            >Upcoming Job Fairs</a
          >
          <a href="#" class="text-md font-semibold text-text-primary hover:text-brand-blue"
            >Search Jobs</a
          >
          <a href="#" class="text-md font-semibold text-text-primary hover:text-brand-blue"
            >FAQ's</a
          >
        </div>

        <!-- Right side: Sign In + CTA -->
        <div class="flex items-center gap-6">
          <a href="#" class="text-md font-semibold text-text-primary hover:text-brand-blue"
            >Sign In</a
          >
          <a
            href="#"
            class="bg-brand-blue text-white px-5 py-2.5 rounded font-bold text-base hover:bg-brand-blue-dark transition-colors"
            >Job Seeker Registration</a
          >
        </div>
      </div>
    </nav>

    <!-- ─── Page content ─── -->
    <div class="max-w-6xl mx-auto my-8 px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-6 lg:my-8 items-start" style="max-width: 1100px">
      <!-- ═══════════════════════════════════════════════════════════════ -->
      <!-- LEFT CARD: Event info + jobs list -->
      <!-- ═══════════════════════════════════════════════════════════════ -->
      <div class="lg:col-span-2 bg-white rounded-lg border border-border-strong p-8">
        <!-- Event title + sub -->
        <h1 class="text-3xl font-black text-text-primary mb-1">{{ currentEvent.title }}</h1>
        <p class="text-base text-text-tertiary">{{ currentEvent.sub }}</p>

        <!-- Divider -->
        <div class="h-px bg-border-default my-6 mb-2"></div>

        <!-- Jobs list -->
        <div>
          <div v-for="job in currentEvent.jobs" :key="job.id">
            <div
              class="border-b border-border-default py-4.5 px-1 cursor-pointer transition-colors"
              :class="{
                'bg-blue-50': selectedJobId === job.id && !isSingleJob,
                'hover:bg-surface-sunken': true,
              }"
              @click="toggleJobExpand(job.id)"
            >
              <!-- Job head: title, company, meta, chevron -->
              <div class="flex items-start justify-between gap-3">
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-bold text-brand-blue underline mb-1">{{ job.title }}</h3>
                  <p class="text-base text-text-secondary">{{ job.company }}</p>
                  <p class="text-base text-text-secondary">{{ job.pay }}</p>
                  <p class="text-base text-text-secondary">{{ job.location }}</p>
                </div>

                <!-- Chevron -->
                <svg
                  class="w-6 h-6 text-text-secondary flex-shrink-0 transition-transform"
                  :style="{
                    transform:
                      expandedJobId === job.id ? 'rotate(180deg)' : 'rotate(0deg)',
                  }"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>

              <!-- Job description (expandable) -->
              <div v-if="expandedJobId === job.id" class="pt-3.5 text-base text-text-secondary leading-7">
                <div v-for="(paragraph, idx) in job.desc" :key="`para-${idx}`" class="mb-2.5 last:mb-0">
                  {{ paragraph }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════ -->
      <!-- RIGHT CARD: Scheduler -->
      <!-- ═══════════════════════════════════════════════════════════════ -->
      <div class="bg-white rounded-lg border border-border-strong p-7 lg:sticky lg:top-6">
        <!-- Content block (hidden when success shown) -->
        <div v-show="!showSuccess">
          <!-- Title -->
          <h2 class="text-2xl font-black text-text-primary mb-3">Request your interview</h2>

          <!-- Method indicator -->
          <div class="flex items-center gap-2 text-base text-text-secondary mb-1">
            <svg
              class="w-4.5 h-4.5 text-text-primary flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="2" y="6" width="14" height="12" rx="2" />
              <path d="M22 8l-6 4 6 4V8z" />
            </svg>
            <span>This will be a virtual interview on JobFairX</span>
          </div>

          <!-- Method description -->
          <p class="text-sm text-text-tertiary ml-6 mb-5"></p>

          <!-- Divider -->
          <div class="h-px bg-border-default my-5"></div>

          <!-- Job picker -->
          <div class="mb-5">
            <label v-if="!isSingleJob" class="block text-base font-semibold text-text-primary mb-1.5">
              Job title <span class="text-red-900">*</span>
            </label>

            <!-- Multi-job: dropdown -->
            <div v-if="!isSingleJob">
              <select
                v-model="selectedJobId"
                class="w-full px-3.5 py-3 text-base font-sans border border-border-strong rounded bg-white text-text-primary focus:outline-none focus:border-brand-blue cursor-pointer"
                @change="selectedSlotIdx = null; showSuccess = false"
              >
                <option value="">Please select a job...</option>
                <option v-for="job in currentEvent.jobs" :key="job.id" :value="job.id">
                  {{ job.title }} — {{ job.company }}
                </option>
              </select>
            </div>

            <!-- Single-job: static label -->
            <div v-else>
              <div class="text-base font-semibold text-text-primary py-1">
                {{ currentEvent.jobs[0]?.title }}
              </div>
              <div class="text-sm text-text-tertiary font-medium mt-0.5">
                {{ currentEvent.jobs[0]?.company }} · {{ currentEvent.jobs[0]?.location }}
              </div>
            </div>
          </div>

          <!-- Time block (shown when job selected) -->
          <div v-if="selectedJobId">
            <!-- Label -->
            <div class="text-base font-semibold text-text-primary mb-1.5">Select a time</div>

            <!-- Timezone -->
            <div class="flex items-center gap-1.5 text-sm text-text-tertiary mb-3.5">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{{ currentEvent.tz }}</span>
            </div>

            <!-- Date -->
            <div class="text-base font-bold text-text-primary mb-4">{{ currentEvent.date }}</div>

            <!-- Time slots -->
            <div class="border border-border-default rounded-md overflow-hidden mb-4">
              <div
                v-for="(slot, idx) in selectedJob?.slots ?? []"
                :key="`slot-${idx}`"
                class="flex items-center gap-3 px-4 py-3.5 border-b border-border-default last:border-b-0 cursor-pointer transition-colors"
                :class="{
                  'bg-blue-50': selectedSlotIdx === idx,
                  'hover:bg-surface-sunken': slot.remaining > 0,
                  'opacity-55 cursor-not-allowed': slot.remaining === 0,
                }"
                @click="selectTimeSlot(idx)"
              >
                <!-- Radio button -->
                <div
                  class="w-4.5 h-4.5 rounded-full border-2 border-border-strong flex-shrink-0 bg-white"
                  :class="{
                    'border-brand-blue': selectedSlotIdx === idx,
                  }"
                >
                  <div
                    v-if="selectedSlotIdx === idx"
                    class="w-full h-full flex items-center justify-center"
                  >
                    <div class="w-2 h-2 rounded-full bg-brand-blue"></div>
                  </div>
                </div>

                <!-- Time -->
                <div class="text-base font-bold text-text-primary">
                  {{ slot.time }}
                  <span class="text-sm text-text-secondary font-medium ml-1.5">{{ tzAbbrev }}</span>
                </div>

                <!-- Remaining spots -->
                <div class="text-sm text-text-tertiary ml-auto">
                  {{ getRemainingSpotsText(slot.remaining) }}
                </div>
              </div>
            </div>

            <!-- Submit button -->
            <button
              :disabled="submitDisabled"
              class="w-full px-3.5 py-3.5 rounded bg-brand-blue text-white font-bold text-md transition-colors"
              :class="{
                'hover:bg-brand-blue-dark': !submitDisabled,
                'bg-gray-400 cursor-not-allowed': submitDisabled,
              }"
              @click="handleSubmit"
            >
              Request interview
            </button>
          </div>
        </div>

        <!-- Success block -->
        <div v-if="showSuccess" class="text-center py-4">
          <svg
            class="w-14 h-14 text-status-success-dark mx-auto mb-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="M22 4L12 14.01l-3-3" />
          </svg>
          <h3 class="text-xl font-black text-text-primary mb-2">Interview requested</h3>
          <p class="text-base text-text-secondary leading-6">{{ successDesc }}</p>
        </div>
      </div>
    </div>

    <!-- ─── Dev toggle ─── -->
    <div class="fixed bottom-5 right-5 bg-gray-900 text-white rounded-full shadow-xl px-3 py-1.5 flex items-center gap-1 z-50 text-xs">
      <span class="text-xs font-bold uppercase tracking-wide text-gray-400 px-3 py-0">Dev</span>
      <button
        class="text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all"
        :class="{
          'bg-brand-blue text-white': currentEventKey === 'dallas',
          'text-gray-300 hover:text-white': currentEventKey !== 'dallas',
        }"
        @click="loadEvent('dallas')"
      >
        1 job
      </button>
      <button
        class="text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all"
        :class="{
          'bg-brand-blue text-white': currentEventKey === 'chicago',
          'text-gray-300 hover:text-white': currentEventKey !== 'chicago',
        }"
        @click="loadEvent('chicago')"
      >
        3 jobs
      </button>
    </div>
  </div>
</template>
