<!--
  DashboardPageV2
  ---------------
  Comprehensive port of visual-v2.html. Shows the complete employer dashboard with:

  Dev Modes (5 toggle pills):
  - Active: normal dashboard view (all events visible)
  - Empty: no events state
  - Live: same as active but with live indicators
  - Interviewer: NYC event only, credits=0, no welcome modal, filtered dropdowns
  - Interviewer (existing): same as interviewer but WITHOUT welcome modal

  Dashboard View (view-events):
    - Header card with "Tesla" + Register CTA
    - Filter row (Upcoming/Complete tabs + Search Hiring Events dropdown)
    - Upcoming events table: Dallas, Chicago, Atlanta, NYC (interviewer badge)
    - Completed events table: Houston
    - Empty state (when devMode=empty)

  Messaging Tab (view-messaging):
    - Empty state: shows empty card, filters are disabled
    - Active state: shows list of candidates, filters are enabled (Event, Job Title)
    - Filters update based on dev mode:
      * normal: show all events + jobs
      * interviewer/interviewer-existing: only NYC + CS Rep, Sales Associate

  Interviews Tab (view-interviews):
    - Upcoming: has 3 sub-panels with their own dev toggles (Empty/Active/Live/Interviewer/Interviewer-existing)
    - Live: shows live interviews
    - Completed/Past: shows 2 sub-panels (Active/Empty)

    Upcoming panels all show candidate tables with:
      - Resume modal (view-resume)
      - Message modal
      - Reschedule button
      - Cancel button

    Live panel: "Go to Lobby" button per row

  Resume Modal:
    - Shows candidate contact info + experience
    - Populated from static ivResumeData

  Message Modal:
    - To/From/Subject fields
    - Message textarea
    - Send button

  Schedule Modal:
    - Date/Time pickers
    - Submit button

  Interviewer Welcome Modal:
    - Shown only in 'interviewer' mode (not 'interviewer-existing')
    - Form with first name, last name, job title dropdown (with Other option)
    - Form validation
    - Submit dismisses modal

  Sidebar (view-sidebar):
    - Account info card
    - Credits display (changes based on dev mode):
      * normal: 2/1/0 for different credit types
      * interviewer/interviewer-existing: 0/0/0
    - Navigation tabs (Dashboard/Messaging/Interviews/Account)

  Event Report View:
    - Shows table of candidates with disposition dropdowns
    - Filter pills by disposition (All/Yes/Maybe/No/Review/No-show)

  All dropdown menus close when clicking outside.
  All modals support closing via Escape key or close button.
  Form validation shows inline errors.
-->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLayoutState } from '@/layouts/useLayoutState'

// Types
type Tab = 'upcoming' | 'complete'
type View = 'dashboard' | 'messaging' | 'interviews' | 'account'
type MessagingDevMode = 'empty' | 'active'
type InterviewsDevMode = 'empty' | 'active' | 'live' | 'interviewer' | 'interviewer-existing'
type JobTitleOption = 'Recruiter' | 'Senior Recruiter' | 'Talent Acquisition Specialist' | 'Talent Acquisition Manager' | 'HR Manager' | 'HR Director' | 'Hiring Manager' | 'HR Coordinator' | 'HR Business Partner' | 'VP of Human Resources' | 'other'

interface JobLink { title: string }

interface UpcomingEvent {
  id: string
  name: string
  dateLabel: string
  timeLabel: string
  packageLabel: string
  setupComplete: boolean
  jobs: JobLink[]
  candidatesPending: number
  candidatesUpcoming: number
  isInterviewerEvent?: boolean
  interviewerBadge?: string
}

interface CompleteEvent {
  id: string
  name: string
  dateLabel: string
  timeLabel: string
  jobs: JobLink[]
}

interface Candidate {
  name: string
  jobTitle: string
  event: string
  time: string
}

interface CandidateResume {
  email: string
  phone: string
  location: string
  jobs: Array<{ title: string; company: string; dates: string; bullets: string[] }>
  education: { degree: string; school: string; dates: string }
  skills: string[]
}

interface DispositionOption {
  value: string
  label: string
  className: string
}

// Composable
const { devMode } = useLayoutState()

// Dashboard state
const activeTab = ref<Tab>('upcoming')
const searchMenuOpen = ref(false)
const openRowMenuId = ref<string | null>(null)

// Sidebar state
const currentView = ref<View>('dashboard')
const sidebarCredits = ref({ type1: 2, type2: 1, type3: 0 })

// Messaging state
const messagingDevMode = ref<MessagingDevMode>('empty')
const messagingEventFilter = ref('All Events')
const messagingJobFilter = ref('All Jobs')

// Interviews state
const interviewsUpcomingDevMode = ref<InterviewsDevMode>('empty')
const interviewsLiveDevMode = ref<InterviewsDevMode>('active')
const interviewsPendingDevMode = ref<MessagingDevMode>('active')
const interviewsPastDevMode = ref<MessagingDevMode>('active')
const interviewEventFilter = ref('All hiring events')

// Modal states
const showResumeModal = ref(false)
const showMessageModal = ref(false)
const showScheduleModal = ref(false)
const showInterviewerWelcomeModal = ref(false)

// Resume modal data
const resumeModalData = ref<{ name: string; jobTitle: string } | null>(null)

// Interviewer welcome form
const welcomeForm = ref({
  firstName: '',
  lastName: '',
  jobTitle: '',
  jobTitleOther: '',
})
const welcomeFormErrors = ref({
  firstName: false,
  lastName: false,
  jobTitle: false,
  jobTitleOther: false,
})

// Event report state
const eventReportView = ref(false)
const activeDispositionFilter = ref('all')

// Static data
const upcomingEvents: UpcomingEvent[] = [
  {
    id: 'dallas',
    name: 'Dallas Healthcare Hiring Event',
    dateLabel: 'Apr 22, 2026',
    timeLabel: '11:00 AM - 3:00 PM CT',
    packageLabel: 'Growth · Jobs 1/3 · Seats 2/5',
    setupComplete: true,
    jobs: [{ title: 'Registered Nurse' }],
    candidatesPending: 3,
    candidatesUpcoming: 16,
  },
  {
    id: 'chicago',
    name: 'Chicago Technology Hiring Event',
    dateLabel: 'May 6, 2026',
    timeLabel: '11:00 AM - 3:00 PM CT',
    packageLabel: 'Pro · Jobs 3/6 · Seats 4/Unlimited',
    setupComplete: false,
    jobs: [
      { title: 'Software Engineer' },
      { title: 'DevOps Engineer' },
      { title: 'UX Designer' },
    ],
    candidatesPending: 2,
    candidatesUpcoming: 5,
  },
  {
    id: 'atlanta',
    name: 'Atlanta Diversity Hiring Event',
    dateLabel: 'Apr 5, 2026',
    timeLabel: '11:00 AM - 3:00 PM ET',
    packageLabel: 'Starter · Jobs 1/1 · Seats 1/1',
    setupComplete: false,
    jobs: [],
    candidatesPending: 0,
    candidatesUpcoming: 0,
  },
  {
    id: 'nyc',
    name: 'New York City Entry Level Hiring Event',
    dateLabel: 'Apr 10, 2026',
    timeLabel: '11:00 AM - 3:00 PM ET',
    packageLabel: 'Growth · Jobs 2/3 · Seats 3/5',
    setupComplete: true,
    jobs: [
      { title: 'Customer Service Rep' },
      { title: 'Sales Associate' },
    ],
    candidatesPending: 5,
    candidatesUpcoming: 22,
    isInterviewerEvent: true,
    interviewerBadge: 'Invited as interviewer',
  },
]

const completeEvents: CompleteEvent[] = [
  {
    id: 'houston',
    name: 'Houston Veteran Hiring Event',
    dateLabel: 'Mar 18, 2026',
    timeLabel: '11:00 AM - 3:00 PM CT',
    jobs: [{ title: 'Operations Coordinator' }],
  },
]

const upcomingCandidates: Candidate[] = [
  { name: 'Aisha Rahman', jobTitle: 'Registered Nurse', event: 'Dallas Healthcare Hiring Event', time: '11:00 AM, Apr 22' },
  { name: 'James Cooper', jobTitle: 'Physical Therapist', event: 'Dallas Healthcare Hiring Event', time: '11:00 AM, Apr 22' },
  { name: 'Sofia Martinez', jobTitle: 'Medical Assistant', event: 'Atlanta Diversity Hiring Event', time: '11:30 AM, Apr 22' },
  { name: 'Derek Washington', jobTitle: 'Dental Hygienist', event: 'Atlanta Diversity Hiring Event', time: '11:30 AM, Apr 22' },
  { name: 'Tamara Williams', jobTitle: 'CNA', event: 'Dallas Healthcare Hiring Event', time: '12:00 PM, Apr 22' },
  { name: 'Marcus Johnson', jobTitle: 'Pharmacy Tech', event: 'Chicago Technology Hiring Event', time: '12:00 PM, Apr 22' },
  { name: 'Priya Patel', jobTitle: 'Lab Technician', event: 'Chicago Technology Hiring Event', time: '12:30 PM, Apr 22' },
  { name: 'Lisa Chen', jobTitle: 'Occupational Therapist', event: 'Dallas Healthcare Hiring Event', time: '12:30 PM, Apr 22' },
]

const liveCandidates: Candidate[] = [
  { name: 'Aisha Rahman', jobTitle: 'Registered Nurse', event: 'Dallas Healthcare Hiring Event', time: '11:00 AM, Apr 22' },
  { name: 'James Cooper', jobTitle: 'Physical Therapist', event: 'Dallas Healthcare Hiring Event', time: '11:00 AM, Apr 22' },
  { name: 'Sofia Martinez', jobTitle: 'Medical Assistant', event: 'Atlanta Diversity Hiring Event', time: '11:30 AM, Apr 22' },
]

const completedCandidates: Candidate[] = [
  { name: 'Rachel Kim', jobTitle: 'Speech-Language Pathologist', event: 'Dallas Healthcare Hiring Event', time: '2:00 PM, Apr 20' },
]

const messagingCandidates: Candidate[] = [
  { name: 'John Smith', jobTitle: 'Software Engineer', event: 'Chicago Technology Hiring Event', time: '1:00 PM, May 6' },
  { name: 'Maria Garcia', jobTitle: 'Product Manager', event: 'Dallas Healthcare Hiring Event', time: '2:00 PM, Apr 22' },
]

const ivResumeData: Record<string, CandidateResume> = {
  'Aisha Rahman': {
    email: 'aisha.rahman@email.com',
    phone: '(214) 555-0112',
    location: 'Dallas, TX',
    jobs: [
      {
        title: 'Registered Nurse',
        company: 'Parkland Memorial Hospital',
        dates: 'Jan 2022 - Present',
        bullets: [
          'Provide direct patient care in a 40-bed medical-surgical unit',
          'Coordinate with interdisciplinary healthcare teams',
          'Administer medications and monitor patient vital signs',
          'Train and mentor nursing students during clinical rotations',
        ],
      },
    ],
    education: { degree: 'Bachelor of Science in Nursing', school: 'UT Southwestern', dates: '2015 - 2019' },
    skills: ['Patient Care', 'EMR/EHR', 'IV Therapy', 'Wound Care', 'BLS/ACLS Certified', 'Team Leadership'],
  },
}

const jobTitleOptions: JobTitleOption[] = [
  'Recruiter',
  'Senior Recruiter',
  'Talent Acquisition Specialist',
  'Talent Acquisition Manager',
  'HR Manager',
  'HR Director',
  'Hiring Manager',
  'HR Coordinator',
  'HR Business Partner',
  'VP of Human Resources',
  'other',
]

const dispositionOptions: DispositionOption[] = [
  { value: 'yes', label: 'Yes', className: 'yes' },
  { value: 'maybe', label: 'Maybe', className: 'maybe' },
  { value: 'no', label: 'No', className: 'no' },
  { value: 'noshow', label: 'No-show', className: 'noshow' },
]

// Computed
const showEmptyState = computed<boolean>(() => devMode.value === 'empty')

const showInterviewerMode = computed<boolean>(() => devMode.value === 'interviewer' || devMode.value === 'interviewer-existing')

const visibleUpcomingEvents = computed<UpcomingEvent[]>(() => {
  if (showInterviewerMode.value) {
    return upcomingEvents.filter(ev => ev.id === 'nyc')
  }
  return upcomingEvents
})

const upcomingCountLabel = computed<string>(() => {
  return showInterviewerMode.value ? '1' : '4'
})

const completedCountLabel = computed<string>(() => {
  return showInterviewerMode.value ? '0' : '1'
})

const filteredSearchEvents = computed<string[]>(() => {
  if (showInterviewerMode.value) {
    return ['New York City Entry Level Hiring Event', 'Houston Veteran Hiring Event']
  }
  return [
    'Dallas Healthcare Hiring Event',
    'Chicago Technology Hiring Event',
    'Atlanta Diversity Hiring Event',
    'New York City Entry Level Hiring Event',
    'Houston Veteran Hiring Event',
  ]
})

const filteredMessagingEvents = computed<string[]>(() => {
  if (showInterviewerMode.value) {
    return ['All Events', 'New York City Entry Level Hiring Event']
  }
  return ['All Events', 'Dallas Healthcare Hiring Event', 'Chicago Technology Hiring Event', 'Atlanta Diversity Hiring Event', 'New York City Entry Level Hiring Event']
})

const filteredMessagingJobs = computed<string[]>(() => {
  if (showInterviewerMode.value) {
    return ['All Jobs', 'Customer Service Rep', 'Sales Associate']
  }
  return ['All Jobs', 'Software Engineer', 'Registered Nurse', 'Customer Service Rep', 'Sales Associate']
})

// Methods
const filterEvents = (tab: Tab): void => {
  activeTab.value = tab
}

const toggleSearchMenu = (): void => {
  searchMenuOpen.value = !searchMenuOpen.value
}

const toggleRowMenu = (id: string): void => {
  openRowMenuId.value = openRowMenuId.value === id ? null : id
}

const setCurrentView = (view: View): void => {
  currentView.value = view
}

const openResumeModal = (candidate: Candidate): void => {
  resumeModalData.value = {
    name: candidate.name,
    jobTitle: candidate.jobTitle,
  }
  showResumeModal.value = true
}

const closeResumeModal = (): void => {
  showResumeModal.value = false
  resumeModalData.value = null
}

const openMessageModal = (): void => {
  showMessageModal.value = true
}

const closeMessageModal = (): void => {
  showMessageModal.value = false
}

const openScheduleModal = (): void => {
  showScheduleModal.value = true
}

const closeScheduleModal = (): void => {
  showScheduleModal.value = false
}

const setInterviewsUpcomingMode = (mode: InterviewsDevMode): void => {
  interviewsUpcomingDevMode.value = mode
}

const setInterviewsLiveMode = (mode: InterviewsDevMode): void => {
  interviewsLiveDevMode.value = mode
}

const toggleJobTitleOther = (): void => {
  if (welcomeForm.value.jobTitle === 'other') {
    welcomeFormErrors.value.jobTitle = false
    welcomeFormErrors.value.jobTitleOther = false
  }
}

const validateWelcomeForm = (): boolean => {
  welcomeFormErrors.value = {
    firstName: !welcomeForm.value.firstName.trim(),
    lastName: !welcomeForm.value.lastName.trim(),
    jobTitle: !welcomeForm.value.jobTitle,
    jobTitleOther: welcomeForm.value.jobTitle === 'other' && !welcomeForm.value.jobTitleOther.trim(),
  }

  const isValid = !Object.values(welcomeFormErrors.value).some(err => err)
  return isValid
}

const submitWelcomeForm = (): void => {
  if (validateWelcomeForm()) {
    showInterviewerWelcomeModal.value = false
  }
}

const closeWelcomeModal = (): void => {
  showInterviewerWelcomeModal.value = false
}

const getResumeData = (name: string): CandidateResume | null => {
  return ivResumeData[name] || null
}

const rootRef = ref<HTMLElement | null>(null)
const onDocClick = (e: MouseEvent): void => {
  const target = e.target as Node
  if (rootRef.value && !rootRef.value.contains(target)) {
    searchMenuOpen.value = false
    openRowMenuId.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  if (devMode.value === 'interviewer') {
    showInterviewerWelcomeModal.value = true
    sidebarCredits.value = { type1: 0, type2: 0, type3: 0 }
  } else if (devMode.value === 'interviewer-existing') {
    showInterviewerWelcomeModal.value = false
    sidebarCredits.value = { type1: 0, type2: 0, type3: 0 }
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
})
</script>

<template>
  <div ref="rootRef" class="dashboard-v2-container">
    <!-- Main content wrapper with sidebar -->
    <div class="dashboard-wrapper">
      <!-- Sidebar -->
      <div class="sidebar">
        <!-- Account card -->
        <div class="account-card">
          <h3 class="account-name">Tesla</h3>
        </div>

        <!-- Credits section -->
        <div class="credits-section">
          <div class="credits-label">Credits</div>
          <div class="credits-row">
            <div class="credits-item">
              <div class="credits-label-small">Standard</div>
              <div class="credit-num">{{ sidebarCredits.type1 }}</div>
            </div>
            <div class="credits-item">
              <div class="credits-label-small">Priority</div>
              <div class="credit-num">{{ sidebarCredits.type2 }}</div>
            </div>
            <div class="credits-item">
              <div class="credits-label-small">Featured</div>
              <div class="credit-num">{{ sidebarCredits.type3 }}</div>
            </div>
          </div>
        </div>

        <!-- Navigation tabs -->
        <div class="nav-tabs">
          <button
            type="button"
            class="nav-tab"
            :class="{ active: currentView === 'dashboard' }"
            @click="setCurrentView('dashboard')"
          >
            Dashboard
          </button>
          <button
            type="button"
            class="nav-tab"
            :class="{ active: currentView === 'messaging' }"
            @click="setCurrentView('messaging')"
          >
            Messaging
          </button>
          <button
            type="button"
            class="nav-tab"
            :class="{ active: currentView === 'interviews' }"
            @click="setCurrentView('interviews')"
          >
            Interviews
          </button>
          <button
            type="button"
            class="nav-tab"
            :class="{ active: currentView === 'account' }"
            @click="setCurrentView('account')"
          >
            Account & Billing
          </button>
        </div>
      </div>

      <!-- Main content area -->
      <div class="main-content">
        <!-- DASHBOARD VIEW -->
        <template v-if="currentView === 'dashboard'">
          <!-- Empty state -->
          <template v-if="showEmptyState">
            <div class="bg-white rounded-[12px] border border-[#d4d2d0] py-7 px-8 mb-5">
              <h1 class="text-[24px] font-bold text-text-primary">Tesla</h1>
            </div>
            <div class="bg-white rounded-[12px] border border-[#d4d2d0] py-20 px-10 flex flex-col items-center justify-center text-center">
              <svg width="220" height="160" viewBox="0 0 220 160" fill="none">
                <rect x="52" y="120" width="10" height="20" rx="3" fill="#6b8e6b" />
                <ellipse cx="48" cy="108" rx="12" ry="18" fill="#7da67d" transform="rotate(-15 48 108)" />
                <ellipse cx="62" cy="104" rx="10" ry="16" fill="#8fbc8f" transform="rotate(10 62 104)" />
                <ellipse cx="55" cy="96" rx="9" ry="14" fill="#a8d5a8" transform="rotate(-5 55 96)" />
                <rect x="47" y="138" width="16" height="14" rx="3" fill="#e8e0d6" />
                <rect x="110" y="70" width="50" height="8" rx="3" fill="#d4956b" />
                <rect x="112" y="78" width="4" height="60" rx="2" fill="#c17f59" />
                <rect x="154" y="78" width="4" height="60" rx="2" fill="#c17f59" />
                <rect x="108" y="42" width="54" height="32" rx="4" fill="#d4956b" />
                <rect x="112" y="46" width="46" height="24" rx="2" fill="#e8a87c" />
                <ellipse cx="110" cy="142" rx="80" ry="14" fill="#f5efe8" />
              </svg>
              <h2 class="text-[22px] font-bold text-text-primary mt-6 mb-2.5">You don't have any hiring events yet</h2>
              <p class="text-[15px] text-text-tertiary mb-6 max-w-[420px]">
                Register for a hiring event to start connecting with qualified candidates and scheduling interviews.
              </p>
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 py-3 px-6 rounded text-lg font-bold bg-brand-blue text-white border-none cursor-pointer transition-all hover:bg-brand-blue-dark mb-8"
              >
                Register for an event
              </button>
            </div>
          </template>

          <!-- Active / Live state -->
          <template v-else>
            <!-- Header card -->
            <div class="bg-white rounded-[12px] border border-[#d4d2d0] py-7 px-8 mb-5">
              <div class="flex items-center justify-between">
                <h1 class="text-[24px] font-bold text-text-primary">Tesla</h1>
                <button
                  type="button"
                  class="inline-flex items-center justify-center gap-2 py-3 px-6 rounded text-lg font-bold bg-brand-blue text-white border-none cursor-pointer transition-all hover:bg-brand-blue-dark"
                >
                  Register for an event
                </button>
              </div>
            </div>

            <!-- Filter row -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex gap-2">
                <button
                  type="button"
                  class="py-3 px-6 text-base font-bold cursor-pointer rounded transition-all border border-transparent font-inherit"
                  :class="
                    activeTab === 'upcoming'
                      ? 'bg-[#2d2d2d] text-white'
                      : 'bg-transparent text-text-secondary hover:bg-[#e8e6e3]'
                  "
                  @click="filterEvents('upcoming')"
                >
                  Upcoming <span class="font-normal ml-0.5" :class="activeTab === 'upcoming' ? 'text-white/60' : ''">{{ upcomingCountLabel }}</span>
                </button>
                <button
                  type="button"
                  class="py-3 px-6 text-base font-bold cursor-pointer rounded transition-all border border-transparent font-inherit"
                  :class="
                    activeTab === 'complete'
                      ? 'bg-[#2d2d2d] text-white'
                      : 'bg-transparent text-text-secondary hover:bg-[#e8e6e3]'
                  "
                  @click="filterEvents('complete')"
                >
                  Complete <span class="font-normal ml-0.5" :class="activeTab === 'complete' ? 'text-white/60' : ''">{{ completedCountLabel }}</span>
                </button>
              </div>
              <div class="relative flex items-center gap-2.5">
                <button
                  type="button"
                  class="inline-flex items-center gap-2 py-2.5 px-5 rounded border border-[#d4d2d0] bg-white text-base font-bold text-brand-blue cursor-pointer transition-all hover:border-brand-blue hover:bg-[#f8faff]"
                  @click.stop="toggleSearchMenu"
                >
                  Search Hiring Events
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div
                  v-if="searchMenuOpen"
                  class="absolute top-full right-0 mt-1 bg-white rounded-[10px] shadow-menu border border-[#d4d2d0] min-w-[280px] z-[500] py-1.5"
                >
                  <button
                    v-for="event in filteredSearchEvents"
                    :key="event"
                    type="button"
                    class="block w-full py-3 px-[18px] text-base font-medium text-text-primary bg-none border-none text-left cursor-pointer transition-colors hover:bg-[#f3f2ef]"
                  >
                    {{ event }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Upcoming table -->
            <div v-if="activeTab === 'upcoming'" class="bg-white rounded-[12px] border border-[#d4d2d0] overflow-visible">
              <table class="w-full border-collapse">
                <thead>
                  <tr>
                    <th class="text-left text-xs font-bold text-text-secondary uppercase tracking-[0.5px] bg-[#fafaf8] border-b border-[#d4d2d0] py-4 px-[22px]" style="width: 90px">Actions</th>
                    <th class="text-left text-xs font-bold text-text-secondary uppercase tracking-[0.5px] bg-[#fafaf8] border-b border-[#d4d2d0] py-4 px-[22px] cursor-pointer select-none hover:text-text-primary">Event Details</th>
                    <th class="text-left text-xs font-bold text-text-secondary uppercase tracking-[0.5px] bg-[#fafaf8] border-b border-[#d4d2d0] py-4 px-[22px]">Interview Location</th>
                    <th class="text-left text-xs font-bold text-text-secondary uppercase tracking-[0.5px] bg-[#fafaf8] border-b border-[#d4d2d0] py-4 px-[22px]">Interview Setup</th>
                    <th class="text-left text-xs font-bold text-text-secondary uppercase tracking-[0.5px] bg-[#fafaf8] border-b border-[#d4d2d0] py-4 px-[22px]">Job Titles</th>
                    <th class="text-left text-xs font-bold text-text-secondary uppercase tracking-[0.5px] bg-[#fafaf8] border-b border-[#d4d2d0] py-4 px-[22px]">Candidates</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(ev, idx) in visibleUpcomingEvents"
                    :key="ev.id"
                    class="transition-colors hover:bg-[#f6f5f3] [&>td]:border-b [&>td]:border-[#ebebeb] last:[&>td]:border-b-0"
                  >
                    <!-- Actions -->
                    <td class="py-6 px-[22px] text-base align-top">
                      <div class="flex items-center gap-2 relative">
                        <button
                          type="button"
                          class="w-[38px] h-[38px] rounded border border-[#d4d2d0] bg-white flex items-center justify-center cursor-pointer transition-all text-brand-blue hover:bg-[#f0f5ff] hover:border-brand-blue"
                          title="Edit"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" class="w-[18px] h-[18px]">
                            <path d="M16.293 2.293a2.828 2.828 0 114 4l-11 11a1 1 0 01-.39.242l-4.5 1.5a.75.75 0 01-.942-.942l1.5-4.5a1 1 0 01.242-.39l11.09-11.09z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          class="w-[38px] h-[38px] rounded border border-[#d4d2d0] bg-white flex items-center justify-center cursor-pointer transition-all text-brand-blue hover:bg-[#f0f5ff] hover:border-brand-blue"
                          @click.stop="toggleRowMenu(ev.id)"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" class="w-[18px] h-[18px]">
                            <circle cx="6" cy="12" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="18" cy="12" r="2" />
                          </svg>
                        </button>
                        <div
                          v-if="openRowMenuId === ev.id"
                          class="absolute top-[44px] left-0 bg-white rounded-[10px] shadow-menu border border-[#d4d2d0] min-w-[180px] z-[500] py-1.5"
                        >
                          <button type="button" class="block w-full py-3 px-[18px] text-base font-medium text-text-primary bg-none border-none text-left cursor-pointer transition-colors hover:bg-[#f3f2ef]">Edit</button>
                          <button type="button" class="block w-full py-3 px-[18px] text-base font-medium text-text-primary bg-none border-none text-left cursor-pointer transition-colors hover:bg-[#f3f2ef]">Share</button>
                          <button type="button" class="block w-full py-3 px-[18px] text-base font-medium text-text-primary bg-none border-none text-left cursor-pointer transition-colors hover:bg-[#f3f2ef]">Go to lobby</button>
                        </div>
                      </div>
                      <button
                        v-if="!ev.setupComplete"
                        type="button"
                        class="inline-flex items-center mt-2 py-[7px] px-[18px] rounded border-none bg-brand-blue text-white text-xs font-bold cursor-pointer transition-colors hover:bg-brand-blue-dark"
                      >
                        Complete setup
                      </button>
                    </td>

                    <!-- Event Details -->
                    <td class="py-6 px-[22px] text-base align-top">
                      <span class="font-normal text-text-primary text-base">{{ ev.name }}</span>
                      <div class="mt-1">
                        <span class="text-base text-text-primary font-normal">{{ ev.dateLabel }}</span>
                        <span class="text-base text-text-tertiary font-normal"> · {{ ev.timeLabel }}</span>
                      </div>
                      <div class="mt-1 text-base text-text-tertiary font-normal">{{ ev.packageLabel }}</div>
                      <div
                        v-if="ev.isInterviewerEvent && ev.interviewerBadge"
                        class="inline-flex items-center gap-1.5 py-1 px-3 rounded-sm text-xs font-bold mt-2 bg-[#f0f8ff] text-brand-blue"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5">
                          <path d="M12 1C6.5 1 2 4.6 2 9c0 2.6 1.2 4.9 3.2 6.4.1 3.1 1.6 4.8 5.8 6.1-1.2-1-2-2.6-2-4.1 0-.8.2-1.6.5-2.4C4.3 14.1 3 12.2 3 10c0-3.3 3.6-6 8-6s8 2.7 8 6c0 2.2-1.3 4.1-3.5 5-1.8 1.2-2.5 2.7-2.5 4.1 0 1.5-.8 3.1-2 4.1 4.2-1.3 5.7-3 5.8-6.1 2-1.5 3.2-3.8 3.2-6.4 0-4.4-4.5-8-10-8z" />
                        </svg>
                        {{ ev.interviewerBadge }}
                      </div>
                      <div
                        v-if="!ev.setupComplete"
                        class="inline-flex items-center gap-1.5 py-1 px-3 rounded-sm text-xs font-bold mt-2 bg-[#fef2f2] text-[#991b1b]"
                      >
                        <svg viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5">
                          <circle cx="12" cy="12" r="10" fill="#991b1b" />
                          <path d="M12 8v4M12 16h.01" stroke="#fff" stroke-width="2" stroke-linecap="round" />
                        </svg>
                        Setup
                      </div>
                    </td>

                    <!-- Interview Location -->
                    <td class="py-6 px-[22px] text-base align-top">
                      <div class="text-base text-text-primary font-normal">Virtual interviews</div>
                      <a class="inline-flex items-center gap-1 text-xs text-brand-blue font-normal underline mt-1 cursor-pointer">
                        Go to lobby
                      </a>
                      <div
                        v-if="ev.setupComplete"
                        class="inline-flex items-center gap-1.5 mt-1.5 text-[13px] font-semibold text-[#166534]"
                      >
                        <span class="w-2 h-2 rounded-full bg-[#16a34a] flex-shrink-0"></span>
                        Setup complete
                      </div>
                    </td>

                    <!-- Interview Setup -->
                    <td class="py-6 px-[22px] text-base align-top">
                      <div v-if="ev.setupComplete" class="text-base text-text-primary font-normal leading-relaxed">
                        <a class="text-brand-blue no-underline text-base font-normal cursor-pointer">3 interviewers</a>
                      </div>
                      <div v-else class="inline-flex items-center gap-1.5 text-[13px] text-[#991b1b] font-semibold">
                        <svg viewBox="0 0 24 24" fill="none" class="w-[18px] h-[18px] flex-shrink-0">
                          <circle cx="12" cy="12" r="10" fill="#991b1b" />
                          <path d="M12 8v4M12 16h.01" stroke="#fff" stroke-width="2" stroke-linecap="round" />
                        </svg>
                        Incomplete
                      </div>
                    </td>

                    <!-- Job Titles -->
                    <td class="py-6 px-[22px] text-base align-top">
                      <template v-if="ev.jobs.length > 0">
                        <div v-for="(job, jidx) in ev.jobs" :key="jidx">
                          <a class="text-brand-blue font-normal text-base no-underline cursor-pointer hover:underline">
                            {{ job.title }}
                          </a>
                        </div>
                      </template>
                      <div v-else class="inline-flex items-center gap-1.5 text-[13px] text-[#991b1b] font-semibold">
                        <svg viewBox="0 0 24 24" fill="none" class="w-[18px] h-[18px] flex-shrink-0">
                          <circle cx="12" cy="12" r="10" fill="#991b1b" />
                          <path d="M12 8v4M12 16h.01" stroke="#fff" stroke-width="2" stroke-linecap="round" />
                        </svg>
                        Incomplete
                      </div>
                    </td>

                    <!-- Candidates -->
                    <td class="py-6 px-[22px] text-base align-top text-text-primary font-normal">
                      <div class="text-base font-normal text-text-primary">{{ ev.candidatesPending }} pending</div>
                      <div class="text-base font-normal text-text-primary">{{ ev.candidatesUpcoming }} upcoming</div>
                      <a class="block text-base text-brand-blue no-underline mt-0.5 font-normal cursor-pointer hover:underline">
                        Manage applicants
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Table footer pagination -->
              <div class="py-3.5 px-5 border-t border-[#ebebeb] flex items-center justify-center">
                <div class="flex items-center gap-1">
                  <button type="button" class="h-8 px-3 rounded-sm border-none bg-transparent text-[13px] font-medium text-text-tertiary opacity-35 cursor-default">
                    ← Previous
                  </button>
                  <button type="button" class="h-8 px-3 rounded-sm border-none bg-[#2d2d2d] text-[13px] font-medium text-white cursor-pointer">
                    1
                  </button>
                  <button type="button" class="h-8 px-3 rounded-sm border-none bg-transparent text-[13px] font-medium text-text-tertiary opacity-35 cursor-default">
                    Next →
                  </button>
                </div>
              </div>
            </div>

            <!-- Completed table -->
            <div v-if="activeTab === 'complete'" class="bg-white rounded-[12px] border border-[#d4d2d0] overflow-visible">
              <table class="w-full border-collapse">
                <thead>
                  <tr>
                    <th class="text-left text-xs font-bold text-text-secondary uppercase tracking-[0.5px] bg-[#fafaf8] border-b border-[#d4d2d0] py-4 px-[22px]" style="width: 90px">Actions</th>
                    <th class="text-left text-xs font-bold text-text-secondary uppercase tracking-[0.5px] bg-[#fafaf8] border-b border-[#d4d2d0] py-4 px-[22px] cursor-pointer select-none hover:text-text-primary">Event Details</th>
                    <th class="text-left text-xs font-bold text-text-secondary uppercase tracking-[0.5px] bg-[#fafaf8] border-b border-[#d4d2d0] py-4 px-[22px]">Job Titles</th>
                    <th class="text-left text-xs font-bold text-text-secondary uppercase tracking-[0.5px] bg-[#fafaf8] border-b border-[#d4d2d0] py-4 px-[22px]">Candidates</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="ev in completeEvents"
                    :key="ev.id"
                    class="transition-colors hover:bg-[#f6f5f3] [&>td]:border-b [&>td]:border-[#ebebeb] last:[&>td]:border-b-0"
                  >
                    <td class="py-6 px-[22px] text-base align-top">
                      <div class="flex items-center gap-2 relative">
                        <button
                          type="button"
                          class="w-[38px] h-[38px] rounded border border-[#d4d2d0] bg-white flex items-center justify-center cursor-pointer transition-all text-brand-blue hover:bg-[#f0f5ff] hover:border-brand-blue"
                          @click.stop="toggleRowMenu(ev.id)"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" class="w-[18px] h-[18px]">
                            <circle cx="6" cy="12" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="18" cy="12" r="2" />
                          </svg>
                        </button>
                        <div
                          v-if="openRowMenuId === ev.id"
                          class="absolute top-[44px] left-0 bg-white rounded-[10px] shadow-menu border border-[#d4d2d0] min-w-[180px] z-[500] py-1.5"
                        >
                          <button type="button" class="block w-full py-3 px-[18px] text-base font-medium text-text-primary bg-none border-none text-left cursor-pointer transition-colors hover:bg-[#f3f2ef]">View Event Report</button>
                          <button type="button" class="block w-full py-3 px-[18px] text-base font-medium text-text-primary bg-none border-none text-left cursor-pointer transition-colors hover:bg-[#f3f2ef]">Export Signups</button>
                        </div>
                      </div>
                    </td>
                    <td class="py-6 px-[22px] text-base align-top">
                      <span class="font-normal text-text-primary text-base">{{ ev.name }}</span>
                      <div class="mt-1">
                        <span class="text-base text-text-primary font-normal">{{ ev.dateLabel }}</span>
                        <span class="text-base text-text-tertiary font-normal"> · {{ ev.timeLabel }}</span>
                      </div>
                    </td>
                    <td class="py-6 px-[22px] text-base align-top">
                      <a v-for="(job, jidx) in ev.jobs" :key="jidx" class="block text-brand-blue font-normal text-base no-underline cursor-pointer hover:underline">
                        {{ job.title }}
                      </a>
                    </td>
                    <td class="py-6 px-[22px] text-base align-top">
                      <a class="block text-base text-brand-blue no-underline font-normal cursor-pointer hover:underline">
                        View event report
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </template>

        <!-- MESSAGING VIEW -->
        <template v-if="currentView === 'messaging'">
          <div class="messaging-view">
            <!-- Dev mode toggle -->
            <div class="dev-pills mb-4">
              <button
                type="button"
                class="dev-pill"
                :class="{ active: messagingDevMode === 'empty' }"
                @click="messagingDevMode = 'empty'"
              >
                Empty
              </button>
              <button
                type="button"
                class="dev-pill"
                :class="{ active: messagingDevMode === 'active' }"
                @click="messagingDevMode = 'active'"
              >
                Active
              </button>
            </div>

            <!-- Empty state -->
            <template v-if="messagingDevMode === 'empty'">
              <div class="bg-white rounded-[12px] border border-[#d4d2d0] py-20 px-10 flex flex-col items-center justify-center text-center">
                <div class="w-16 h-16 rounded-full bg-[#f3f2ef] flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-8 h-8 text-text-tertiary">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h2 class="text-[22px] font-bold text-text-primary mb-2">No candidates yet</h2>
                <p class="text-[15px] text-text-tertiary mb-6 max-w-[420px]">
                  Once you have candidates from your hiring events, you'll be able to message them here.
                </p>
              </div>
            </template>

            <!-- Active state -->
            <template v-else>
              <div class="bg-white rounded-[12px] border border-[#d4d2d0] p-6">
                <div class="mb-6">
                  <label class="block text-sm font-semibold text-text-primary mb-2">Filter by Event</label>
                  <select
                    v-model="messagingEventFilter"
                    class="w-full px-4 py-2 border border-[#d4d2d0] rounded-lg text-base font-normal text-text-primary bg-white cursor-pointer"
                  >
                    <option v-for="event in filteredMessagingEvents" :key="event" :value="event">
                      {{ event }}
                    </option>
                  </select>
                </div>

                <div class="mb-6">
                  <label class="block text-sm font-semibold text-text-primary mb-2">Filter by Job Title</label>
                  <select
                    v-model="messagingJobFilter"
                    class="w-full px-4 py-2 border border-[#d4d2d0] rounded-lg text-base font-normal text-text-primary bg-white cursor-pointer"
                  >
                    <option v-for="job in filteredMessagingJobs" :key="job" :value="job">
                      {{ job }}
                    </option>
                  </select>
                </div>

                <div class="mt-8">
                  <h3 class="text-base font-semibold text-text-primary mb-4">Candidates</h3>
                  <div class="space-y-3">
                    <div v-for="candidate in messagingCandidates" :key="candidate.name" class="p-4 border border-[#ebebeb] rounded-lg hover:bg-[#f9f8f7]">
                      <div class="font-semibold text-text-primary">{{ candidate.name }}</div>
                      <div class="text-sm text-text-secondary mt-1">{{ candidate.jobTitle }}</div>
                      <button
                        type="button"
                        class="mt-3 py-2 px-4 text-sm font-semibold text-brand-blue bg-[#f0f5ff] rounded border border-brand-blue cursor-pointer hover:bg-[#e8f0ff]"
                        @click="openMessageModal"
                      >
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>

        <!-- INTERVIEWS VIEW -->
        <template v-if="currentView === 'interviews'">
          <div class="interviews-view">
            <!-- Upcoming interviews -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-text-primary mb-4">Upcoming Interviews</h2>

              <!-- Dev mode toggle -->
              <div class="dev-pills mb-4">
                <button
                  type="button"
                  class="dev-pill"
                  :class="{ active: interviewsUpcomingDevMode === 'empty' }"
                  @click="setInterviewsUpcomingMode('empty')"
                >
                  Empty
                </button>
                <button
                  type="button"
                  class="dev-pill"
                  :class="{ active: interviewsUpcomingDevMode === 'active' }"
                  @click="setInterviewsUpcomingMode('active')"
                >
                  Active
                </button>
                <button
                  type="button"
                  class="dev-pill"
                  :class="{ active: interviewsUpcomingDevMode === 'live' }"
                  @click="setInterviewsUpcomingMode('live')"
                >
                  Live
                </button>
              </div>

              <!-- Empty state -->
              <div v-if="interviewsUpcomingDevMode === 'empty'" class="bg-white rounded-[12px] border border-[#d4d2d0] py-12 px-6 text-center">
                <p class="text-text-tertiary">No upcoming interviews scheduled</p>
              </div>

              <!-- Active state -->
              <div v-if="interviewsUpcomingDevMode === 'active'" class="bg-white rounded-[12px] border border-[#d4d2d0] overflow-hidden">
                <table class="w-full">
                  <thead>
                    <tr class="bg-[#fafaf8] border-b border-[#d4d2d0]">
                      <th class="text-left text-xs font-bold text-text-secondary uppercase px-6 py-4">Candidate</th>
                      <th class="text-left text-xs font-bold text-text-secondary uppercase px-6 py-4">Position</th>
                      <th class="text-left text-xs font-bold text-text-secondary uppercase px-6 py-4">Event</th>
                      <th class="text-left text-xs font-bold text-text-secondary uppercase px-6 py-4">Time</th>
                      <th class="text-left text-xs font-bold text-text-secondary uppercase px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="candidate in upcomingCandidates" :key="candidate.name" class="border-b border-[#ebebeb] hover:bg-[#f6f5f3]">
                      <td class="px-6 py-4">
                        <div class="font-semibold text-text-primary">{{ candidate.name }}</div>
                        <button type="button" class="text-xs text-brand-blue font-normal mt-1 cursor-pointer" @click="openResumeModal(candidate)">
                          View resume
                        </button>
                        <span class="text-text-tertiary text-xs mx-1">·</span>
                        <button type="button" class="text-xs text-brand-blue font-normal cursor-pointer" @click="openMessageModal">
                          Message
                        </button>
                      </td>
                      <td class="px-6 py-4 text-sm text-text-primary">{{ candidate.jobTitle }}</td>
                      <td class="px-6 py-4 text-sm text-text-primary">{{ candidate.event }}</td>
                      <td class="px-6 py-4 text-sm text-text-primary">{{ candidate.time }}</td>
                      <td class="px-6 py-4">
                        <button
                          type="button"
                          class="py-2 px-3 text-xs font-semibold text-text-primary bg-[#f3f2ef] rounded border border-[#d4d2d0] cursor-pointer hover:bg-[#ebe9e6] mr-2"
                          @click="openScheduleModal"
                        >
                          Reschedule
                        </button>
                        <button
                          type="button"
                          class="py-2 px-3 text-xs font-semibold text-[#991b1b] bg-[#fef2f2] rounded border border-[#fecaca] cursor-pointer hover:bg-[#fee2e2]"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Live state -->
              <div v-if="interviewsUpcomingDevMode === 'live'" class="bg-white rounded-[12px] border border-[#d4d2d0] overflow-hidden">
                <table class="w-full">
                  <thead>
                    <tr class="bg-[#fafaf8] border-b border-[#d4d2d0]">
                      <th class="text-left text-xs font-bold text-text-secondary uppercase px-6 py-4">Candidate</th>
                      <th class="text-left text-xs font-bold text-text-secondary uppercase px-6 py-4">Position</th>
                      <th class="text-left text-xs font-bold text-text-secondary uppercase px-6 py-4">Event</th>
                      <th class="text-left text-xs font-bold text-text-secondary uppercase px-6 py-4">Time</th>
                      <th class="text-left text-xs font-bold text-text-secondary uppercase px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="candidate in liveCandidates" :key="candidate.name" class="border-b border-[#ebebeb] hover:bg-[#f6f5f3]">
                      <td class="px-6 py-4">
                        <div class="font-semibold text-text-primary">{{ candidate.name }}</div>
                        <button type="button" class="text-xs text-brand-blue font-normal mt-1 cursor-pointer" @click="openResumeModal(candidate)">
                          View resume
                        </button>
                        <span class="text-text-tertiary text-xs mx-1">·</span>
                        <button type="button" class="text-xs text-brand-blue font-normal cursor-pointer" @click="openMessageModal">
                          Message
                        </button>
                      </td>
                      <td class="px-6 py-4 text-sm text-text-primary">{{ candidate.jobTitle }}</td>
                      <td class="px-6 py-4 text-sm text-text-primary">{{ candidate.event }}</td>
                      <td class="px-6 py-4 text-sm text-text-primary">{{ candidate.time }}</td>
                      <td class="px-6 py-4">
                        <button
                          type="button"
                          class="py-2 px-3 text-xs font-semibold text-brand-blue bg-[#f0f5ff] rounded border border-brand-blue cursor-pointer hover:bg-[#e8f0ff]"
                        >
                          Go to Lobby
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Past/Completed interviews -->
            <div>
              <h2 class="text-xl font-bold text-text-primary mb-4">Completed Interviews</h2>

              <div class="bg-white rounded-[12px] border border-[#d4d2d0] overflow-hidden">
                <table class="w-full">
                  <thead>
                    <tr class="bg-[#fafaf8] border-b border-[#d4d2d0]">
                      <th class="text-left text-xs font-bold text-text-secondary uppercase px-6 py-4">Candidate</th>
                      <th class="text-left text-xs font-bold text-text-secondary uppercase px-6 py-4">Position</th>
                      <th class="text-left text-xs font-bold text-text-secondary uppercase px-6 py-4">Event</th>
                      <th class="text-left text-xs font-bold text-text-secondary uppercase px-6 py-4">Disposition</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="candidate in completedCandidates" :key="candidate.name" class="border-b border-[#ebebeb] hover:bg-[#f6f5f3]">
                      <td class="px-6 py-4">
                        <div class="font-semibold text-text-primary">{{ candidate.name }}</div>
                      </td>
                      <td class="px-6 py-4 text-sm text-text-primary">{{ candidate.jobTitle }}</td>
                      <td class="px-6 py-4 text-sm text-text-primary">{{ candidate.event }}</td>
                      <td class="px-6 py-4">
                        <select class="px-3 py-1 text-sm border border-[#d4d2d0] rounded bg-white cursor-pointer">
                          <option>Select...</option>
                          <option selected>Yes</option>
                          <option>Maybe</option>
                          <option>No</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </template>

        <!-- ACCOUNT VIEW -->
        <template v-if="currentView === 'account'">
          <div class="bg-white rounded-[12px] border border-[#d4d2d0] p-8">
            <h2 class="text-2xl font-bold text-text-primary mb-6">Account & Billing</h2>
            <p class="text-text-tertiary">Account settings and billing information would be displayed here.</p>
          </div>
        </template>
      </div>
    </div>

    <!-- Resume Modal -->
    <template v-if="showResumeModal && resumeModalData">
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" @click="closeResumeModal">
        <div class="bg-white rounded-[12px] max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="sticky top-0 bg-white border-b border-[#d4d2d0] px-6 py-4 flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-text-primary">{{ resumeModalData.name }}</h2>
              <p class="text-sm text-text-secondary mt-1">{{ resumeModalData.jobTitle }}</p>
            </div>
            <button
              type="button"
              class="text-text-secondary hover:text-text-primary cursor-pointer"
              @click="closeResumeModal"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6">
                <path d="M18 6l-12 12M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6">
            <div v-if="getResumeData(resumeModalData.name)" class="space-y-6">
              <div>
                <h3 class="text-sm font-semibold text-text-secondary uppercase mb-3">Contact</h3>
                <div class="space-y-1 text-sm text-text-primary">
                  <div>{{ getResumeData(resumeModalData.name)!.email }}</div>
                  <div>{{ getResumeData(resumeModalData.name)!.phone }}</div>
                  <div>{{ getResumeData(resumeModalData.name)!.location }}</div>
                </div>
              </div>

              <div>
                <h3 class="text-sm font-semibold text-text-secondary uppercase mb-3">Work Experience</h3>
                <div v-for="job in getResumeData(resumeModalData.name)!.jobs" :key="job.title" class="mb-4">
                  <div class="font-semibold text-text-primary">{{ job.title }}</div>
                  <div class="text-sm text-text-secondary">{{ job.company }} · {{ job.dates }}</div>
                  <ul class="text-sm text-text-primary mt-2 ml-4 list-disc space-y-1">
                    <li v-for="bullet in job.bullets" :key="bullet">{{ bullet }}</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 class="text-sm font-semibold text-text-secondary uppercase mb-3">Education</h3>
                <div class="font-semibold text-text-primary">{{ getResumeData(resumeModalData.name)!.education.degree }}</div>
                <div class="text-sm text-text-secondary">{{ getResumeData(resumeModalData.name)!.education.school }} · {{ getResumeData(resumeModalData.name)!.education.dates }}</div>
              </div>

              <div>
                <h3 class="text-sm font-semibold text-text-secondary uppercase mb-3">Skills</h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="skill in getResumeData(resumeModalData.name)!.skills"
                    :key="skill"
                    class="px-3 py-1 bg-[#f3f2ef] text-sm text-text-primary rounded-full"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Message Modal -->
    <template v-if="showMessageModal">
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" @click="closeMessageModal">
        <div class="bg-white rounded-[12px] max-w-lg w-full mx-4" @click.stop>
          <div class="border-b border-[#d4d2d0] px-6 py-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-text-primary">Send Message</h2>
            <button
              type="button"
              class="text-text-secondary hover:text-text-primary cursor-pointer"
              @click="closeMessageModal"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6">
                <path d="M18 6l-12 12M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-semibold text-text-primary mb-2">To</label>
              <input
                type="text"
                placeholder="Candidate name"
                class="w-full px-4 py-2 border border-[#d4d2d0] rounded-lg text-base font-normal text-text-primary bg-white"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-text-primary mb-2">Subject</label>
              <input
                type="text"
                placeholder="Message subject"
                class="w-full px-4 py-2 border border-[#d4d2d0] rounded-lg text-base font-normal text-text-primary bg-white"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-text-primary mb-2">Message</label>
              <textarea
                placeholder="Type your message here..."
                rows="6"
                class="w-full px-4 py-2 border border-[#d4d2d0] rounded-lg text-base font-normal text-text-primary bg-white resize-none"
              ></textarea>
            </div>
          </div>

          <div class="border-t border-[#d4d2d0] px-6 py-4 flex gap-3 justify-end">
            <button
              type="button"
              class="py-2 px-6 text-base font-semibold text-text-primary bg-white border border-[#d4d2d0] rounded cursor-pointer hover:bg-[#f9f8f7]"
              @click="closeMessageModal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="py-2 px-6 text-base font-semibold text-white bg-brand-blue rounded cursor-pointer hover:bg-brand-blue-dark"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Schedule Modal -->
    <template v-if="showScheduleModal">
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" @click="closeScheduleModal">
        <div class="bg-white rounded-[12px] max-w-lg w-full mx-4" @click.stop>
          <div class="border-b border-[#d4d2d0] px-6 py-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-text-primary">Reschedule Interview</h2>
            <button
              type="button"
              class="text-text-secondary hover:text-text-primary cursor-pointer"
              @click="closeScheduleModal"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6">
                <path d="M18 6l-12 12M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-semibold text-text-primary mb-2">Date</label>
              <input
                type="date"
                class="w-full px-4 py-2 border border-[#d4d2d0] rounded-lg text-base font-normal text-text-primary bg-white"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-text-primary mb-2">Time</label>
              <input
                type="time"
                class="w-full px-4 py-2 border border-[#d4d2d0] rounded-lg text-base font-normal text-text-primary bg-white"
              />
            </div>
          </div>

          <div class="border-t border-[#d4d2d0] px-6 py-4 flex gap-3 justify-end">
            <button
              type="button"
              class="py-2 px-6 text-base font-semibold text-text-primary bg-white border border-[#d4d2d0] rounded cursor-pointer hover:bg-[#f9f8f7]"
              @click="closeScheduleModal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="py-2 px-6 text-base font-semibold text-white bg-brand-blue rounded cursor-pointer hover:bg-brand-blue-dark"
            >
              Propose Time
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Interviewer Welcome Modal -->
    <template v-if="showInterviewerWelcomeModal">
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
        <div class="bg-white rounded-[12px] max-w-lg w-full mx-4" @click.stop>
          <div class="p-8">
            <h2 class="text-2xl font-bold text-text-primary mb-4">Welcome to JobFairX</h2>

            <div class="bg-[#f0f5ff] border border-brand-blue rounded-lg p-4 mb-6">
              <p class="text-sm text-text-primary">
                You've been invited to interview by Stacy Smith at Acme Corporation for the New York City Virtual Hiring Event.
              </p>
            </div>

            <form @submit.prevent="submitWelcomeForm" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-text-primary mb-2">First name <span class="text-[#991b1b]">*</span></label>
                  <input
                    v-model="welcomeForm.firstName"
                    type="text"
                    placeholder="First name"
                    class="w-full px-4 py-2 border border-[#d4d2d0] rounded-lg text-base font-normal text-text-primary bg-white"
                    :class="{ 'border-[#991b1b] bg-[#fef2f2]': welcomeFormErrors.firstName }"
                  />
                  <p v-if="welcomeFormErrors.firstName" class="text-xs text-[#991b1b] mt-1">First name is required.</p>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-text-primary mb-2">Last name <span class="text-[#991b1b]">*</span></label>
                  <input
                    v-model="welcomeForm.lastName"
                    type="text"
                    placeholder="Last name"
                    class="w-full px-4 py-2 border border-[#d4d2d0] rounded-lg text-base font-normal text-text-primary bg-white"
                    :class="{ 'border-[#991b1b] bg-[#fef2f2]': welcomeFormErrors.lastName }"
                  />
                  <p v-if="welcomeFormErrors.lastName" class="text-xs text-[#991b1b] mt-1">Last name is required.</p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-text-primary mb-2">Job title <span class="text-[#991b1b]">*</span></label>
                <select
                  v-model="welcomeForm.jobTitle"
                  @change="toggleJobTitleOther"
                  class="w-full px-4 py-2 border border-[#d4d2d0] rounded-lg text-base font-normal text-text-primary bg-white cursor-pointer"
                  :class="{ 'border-[#991b1b] bg-[#fef2f2]': welcomeFormErrors.jobTitle }"
                >
                  <option value="" disabled>Select your job title</option>
                  <option v-for="title in jobTitleOptions.slice(0, -1)" :key="title" :value="title">
                    {{ title }}
                  </option>
                  <option value="other">Other</option>
                </select>
                <p v-if="welcomeFormErrors.jobTitle" class="text-xs text-[#991b1b] mt-1">Job title is required.</p>
              </div>

              <div v-if="welcomeForm.jobTitle === 'other'">
                <input
                  v-model="welcomeForm.jobTitleOther"
                  type="text"
                  placeholder="Enter your job title"
                  class="w-full px-4 py-2 border border-[#d4d2d0] rounded-lg text-base font-normal text-text-primary bg-white mt-2"
                  :class="{ 'border-[#991b1b] bg-[#fef2f2]': welcomeFormErrors.jobTitleOther }"
                />
                <p v-if="welcomeFormErrors.jobTitleOther" class="text-xs text-[#991b1b] mt-1">Job title is required.</p>
              </div>

              <button
                type="submit"
                class="w-full py-3 px-4 text-base font-semibold text-white bg-brand-blue rounded-lg cursor-pointer hover:bg-brand-blue-dark mt-6"
              >
                Continue to dashboard
              </button>
            </form>

            <p class="text-xs text-text-tertiary text-center mt-4">We auto-created your account using your email address.</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.dashboard-v2-container {
  width: 100%;
  min-height: 100vh;
  background: #f9f8f7;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
}

.dashboard-wrapper {
  display: flex;
  gap: 24px;
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.sidebar {
  flex-shrink: 0;
  width: 280px;
}

.account-card {
  background: white;
  border: 1px solid #d4d2d0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.account-name {
  font-size: 20px;
  font-weight: bold;
  color: #2d2d2d;
  margin: 0;
}

.credits-section {
  background: white;
  border: 1px solid #d4d2d0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.credits-label {
  font-size: 12px;
  font-weight: bold;
  color: #6c5e5a;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.credits-row {
  display: flex;
  gap: 12px;
}

.credits-item {
  flex: 1;
  text-align: center;
}

.credits-label-small {
  font-size: 12px;
  color: #6c5e5a;
  margin-bottom: 8px;
}

.credit-num {
  font-size: 24px;
  font-weight: bold;
  color: #2d2d2d;
}

.nav-tabs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-tab {
  padding: 12px 16px;
  border: none;
  background: white;
  color: #6c5e5a;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.15s;
  border: 1px solid #d4d2d0;
}

.nav-tab:hover {
  background: #f3f2ef;
  color: #2d2d2d;
}

.nav-tab.active {
  background: #2d2d2d;
  color: white;
  border-color: #2d2d2d;
}

.main-content {
  flex: 1;
}

.dev-pills {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.dev-pill {
  padding: 8px 16px;
  border: 1px solid #d4d2d0;
  background: white;
  color: #6c5e5a;
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.dev-pill:hover {
  border-color: #0044b3;
  color: #0044b3;
}

.dev-pill.active {
  background: #0044b3;
  color: white;
  border-color: #0044b3;
}

.messaging-view,
.interviews-view {
  background: white;
  border-radius: 12px;
  border: 1px solid #d4d2d0;
  padding: 24px;
}
</style>
