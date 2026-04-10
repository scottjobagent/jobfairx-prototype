<!--
  DashboardPage
  -------------
  Pixel-perfect port of the `<div class="view active" id="view-events">` block
  in visual.html (lines 812-1057). Shows:
    - Header card (Tesla + Register CTA)
    - Filter row (tab-pills + Search Hiring Events dropdown)
    - Upcoming events table (Dallas / Chicago / Atlanta)
    - Completed events table (Houston) — shown when tab=complete
    - Empty state — shown when devMode=empty

  Interactivity matches visual.html:
    - filterEvents('upcoming'|'complete') → `activeTab`
    - setDevMode('active'|'empty'|'live') → read from useLayoutState
    - toggleMenu(...) on row action dots → per-row `openRowMenu` state
    - toggleDropdown('search-events-menu') → `searchMenuOpen`

  Data rows are static (match visual.html). Click handlers that used to
  `window.open(...)` are no-ops for now since those pages haven't been
  rebuilt yet in Phase 2.
-->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLayoutState } from '@/layouts/useLayoutState'

type Tab = 'upcoming' | 'complete'
type JobLink = { title: string }

interface UpcomingEvent {
  id: string
  name: string
  dateLabel: string
  timeLabel: string
  packageLabel: string // e.g. "Growth · Jobs 1/3 · Seats 2/5"
  setupComplete: boolean // true => green check row; false => needs setup
  jobs: JobLink[]
  candidatesPending: number
  candidatesUpcoming: number
  liveDot?: boolean // show pulsing "Live" indicator (devMode=live)
}

interface CompleteEvent {
  id: string
  name: string
  dateLabel: string
  timeLabel: string
  jobs: JobLink[]
}

const { devMode } = useLayoutState()

const activeTab = ref<Tab>('upcoming')
const searchMenuOpen = ref(false)
const openRowMenuId = ref<string | null>(null)

const filterEvents = (tab: Tab): void => {
  activeTab.value = tab
}

const toggleSearchMenu = (): void => {
  searchMenuOpen.value = !searchMenuOpen.value
}

const toggleRowMenu = (id: string): void => {
  openRowMenuId.value = openRowMenuId.value === id ? null : id
}

// Close open menus when clicking outside.
const rootRef = ref<HTMLElement | null>(null)
const onDocClick = (e: MouseEvent): void => {
  const target = e.target as Node
  if (rootRef.value && !rootRef.value.contains(target)) {
    searchMenuOpen.value = false
    openRowMenuId.value = null
  }
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

// Static data (mirrors visual.html upcoming tbody rows)
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

// devMode=empty → show empty state instead of tables
const showEmptyState = computed<boolean>(() => devMode.value === 'empty')
// devMode=live → add pulsing green "Live" dot to first row as a visual cue
const isLive = computed<boolean>(() => devMode.value === 'live')
</script>

<template>
  <div ref="rootRef">
    <!-- Empty state (dev toggle: Empty) -->
    <template v-if="showEmptyState">
      <div class="bg-white rounded-[12px] border border-[#d4d2d0] py-7 px-8 mb-5">
        <div class="flex items-center justify-between">
          <h1 class="text-[24px] font-bold text-text-primary">Tesla</h1>
        </div>
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
          class="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-base font-bold bg-brand-blue text-white border-none cursor-pointer transition-all hover:bg-brand-blue-dark mb-8"
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
            class="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-base font-bold bg-brand-blue text-white border-none cursor-pointer transition-all hover:bg-brand-blue-dark"
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
            class="py-3 px-6 text-sm font-bold cursor-pointer rounded-lg transition-all border border-transparent font-inherit"
            :class="
              activeTab === 'upcoming'
                ? 'bg-[#2d2d2d] text-white'
                : 'bg-transparent text-text-secondary hover:bg-[#e8e6e3]'
            "
            @click="filterEvents('upcoming')"
          >
            Upcoming <span class="font-normal ml-0.5" :class="activeTab === 'upcoming' ? 'text-white/60' : ''">3</span>
          </button>
          <button
            type="button"
            class="py-3 px-6 text-sm font-bold cursor-pointer rounded-lg transition-all border border-transparent font-inherit"
            :class="
              activeTab === 'complete'
                ? 'bg-[#2d2d2d] text-white'
                : 'bg-transparent text-text-secondary hover:bg-[#e8e6e3]'
            "
            @click="filterEvents('complete')"
          >
            Complete <span class="font-normal ml-0.5" :class="activeTab === 'complete' ? 'text-white/60' : ''">1</span>
          </button>
        </div>
        <div class="relative flex items-center gap-2.5">
          <button
            type="button"
            class="inline-flex items-center gap-2 py-2.5 px-5 rounded-lg border border-[#d4d2d0] bg-white text-sm font-bold text-brand-blue cursor-pointer transition-all hover:border-brand-blue hover:bg-[#f8faff]"
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
            <button type="button" class="block w-full py-3 px-[18px] text-sm font-medium text-text-primary bg-none border-none text-left cursor-pointer transition-colors hover:bg-[#f3f2ef]">
              Dallas Healthcare - Apr 22
            </button>
            <button type="button" class="block w-full py-3 px-[18px] text-sm font-medium text-text-primary bg-none border-none text-left cursor-pointer transition-colors hover:bg-[#f3f2ef]">
              Chicago Technology - May 6
            </button>
            <button type="button" class="block w-full py-3 px-[18px] text-sm font-medium text-text-primary bg-none border-none text-left cursor-pointer transition-colors hover:bg-[#f3f2ef]">
              Atlanta Diversity - Apr 5
            </button>
            <button type="button" class="block w-full py-3 px-[18px] text-sm font-medium text-text-primary bg-none border-none text-left cursor-pointer transition-colors hover:bg-[#f3f2ef]">
              Houston Veteran - Mar 18
            </button>
          </div>
        </div>
      </div>

      <!-- Upcoming table -->
      <div v-if="activeTab === 'upcoming'" class="bg-white rounded-[12px] border border-[#d4d2d0] overflow-visible">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="text-left text-xs font-bold text-text-secondary uppercase tracking-[0.5px] bg-[#fafaf8] border-b border-[#d4d2d0] py-4 px-[22px]" style="width:90px;">Actions</th>
              <th class="text-left text-xs font-bold text-text-secondary uppercase tracking-[0.5px] bg-[#fafaf8] border-b border-[#d4d2d0] py-4 px-[22px] cursor-pointer select-none hover:text-text-primary">Event Details</th>
              <th class="text-left text-xs font-bold text-text-secondary uppercase tracking-[0.5px] bg-[#fafaf8] border-b border-[#d4d2d0] py-4 px-[22px]">Interview Location</th>
              <th class="text-left text-xs font-bold text-text-secondary uppercase tracking-[0.5px] bg-[#fafaf8] border-b border-[#d4d2d0] py-4 px-[22px]">Interview Setup</th>
              <th class="text-left text-xs font-bold text-text-secondary uppercase tracking-[0.5px] bg-[#fafaf8] border-b border-[#d4d2d0] py-4 px-[22px]">Job Titles</th>
              <th class="text-left text-xs font-bold text-text-secondary uppercase tracking-[0.5px] bg-[#fafaf8] border-b border-[#d4d2d0] py-4 px-[22px]">Candidates</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(ev, idx) in upcomingEvents"
              :key="ev.id"
              class="transition-colors hover:bg-[#f6f5f3] [&>td]:border-b [&>td]:border-[#ebebeb] last:[&>td]:border-b-0"
            >
              <!-- Actions -->
              <td class="py-6 px-[22px] text-sm align-top">
                <div class="flex items-center gap-2 relative">
                  <button
                    type="button"
                    class="w-[38px] h-[38px] rounded-lg border border-[#d4d2d0] bg-white flex items-center justify-center cursor-pointer transition-all text-brand-blue hover:bg-[#f0f5ff] hover:border-brand-blue"
                    title="Edit"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" class="w-[18px] h-[18px]">
                      <path d="M16.293 2.293a2.828 2.828 0 114 4l-11 11a1 1 0 01-.39.242l-4.5 1.5a.75.75 0 01-.942-.942l1.5-4.5a1 1 0 01.242-.39l11.09-11.09z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="w-[38px] h-[38px] rounded-lg border border-[#d4d2d0] bg-white flex items-center justify-center cursor-pointer transition-all text-brand-blue hover:bg-[#f0f5ff] hover:border-brand-blue"
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
                    <button type="button" class="block w-full py-3 px-[18px] text-sm font-medium text-text-primary bg-none border-none text-left cursor-pointer transition-colors hover:bg-[#f3f2ef]">Edit</button>
                    <button type="button" class="block w-full py-3 px-[18px] text-sm font-medium text-text-primary bg-none border-none text-left cursor-pointer transition-colors hover:bg-[#f3f2ef]">Share</button>
                    <button type="button" class="block w-full py-3 px-[18px] text-sm font-medium text-text-primary bg-none border-none text-left cursor-pointer transition-colors hover:bg-[#f3f2ef]">Go to lobby</button>
                  </div>
                </div>
                <button
                  v-if="!ev.setupComplete"
                  type="button"
                  class="inline-flex items-center mt-2 py-[7px] px-[18px] rounded-lg border-none bg-brand-blue text-white text-xs font-bold cursor-pointer transition-colors hover:bg-brand-blue-dark"
                >
                  Complete setup
                </button>
              </td>

              <!-- Event Details -->
              <td class="py-6 px-[22px] text-sm align-top">
                <span class="font-normal text-text-primary text-sm">{{ ev.name }}</span>
                <div class="mt-1">
                  <span class="text-sm text-text-primary font-normal">{{ ev.dateLabel }}</span>
                  <span class="text-sm text-text-tertiary font-normal"> · {{ ev.timeLabel }}</span>
                </div>
                <div class="mt-1 text-sm text-text-tertiary font-normal">{{ ev.packageLabel }}</div>
                <div
                  v-if="!ev.setupComplete"
                  class="inline-flex items-center gap-1.5 py-1 px-3 rounded-md text-xs font-bold mt-2 bg-[#fef2f2] text-[#991b1b]"
                >
                  <svg viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5">
                    <circle cx="12" cy="12" r="10" fill="#991b1b" />
                    <path d="M12 8v4M12 16h.01" stroke="#fff" stroke-width="2" stroke-linecap="round" />
                  </svg>
                  Setup
                </div>
              </td>

              <!-- Interview Location -->
              <td class="py-6 px-[22px] text-sm align-top">
                <div class="text-sm text-text-primary font-normal">Virtual interviews</div>
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
                <div
                  v-if="isLive && idx === 0"
                  class="inline-flex items-center gap-1.5 mt-1.5 text-[13px] font-semibold text-[#166534]"
                >
                  <span class="w-2 h-2 rounded-full bg-[#16a34a] animate-dash-live-pulse"></span>
                  Live now
                </div>
              </td>

              <!-- Interview Setup -->
              <td class="py-6 px-[22px] text-sm align-top">
                <div v-if="ev.setupComplete" class="text-sm text-text-primary font-normal leading-relaxed">
                  <a class="text-brand-blue no-underline text-sm font-normal cursor-pointer">2 interviewers</a>
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
              <td class="py-6 px-[22px] text-sm align-top">
                <template v-if="ev.jobs.length > 0">
                  <div v-for="(job, jidx) in ev.jobs" :key="jidx">
                    <a class="text-brand-blue font-normal text-sm no-underline cursor-pointer hover:underline">
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
              <td class="py-6 px-[22px] text-sm align-top text-text-primary font-normal">
                <div class="text-sm font-normal text-text-primary">{{ ev.candidatesPending }} pending</div>
                <div class="text-sm font-normal text-text-primary">{{ ev.candidatesUpcoming }} upcoming</div>
                <a class="block text-sm text-brand-blue no-underline mt-0.5 font-normal cursor-pointer hover:underline">
                  Manage applicants
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Table footer pagination -->
        <div class="py-3.5 px-5 border-t border-[#ebebeb] flex items-center justify-center">
          <div class="flex items-center gap-1">
            <button type="button" class="h-8 px-3 rounded-md border-none bg-transparent text-[13px] font-medium text-text-tertiary opacity-35 cursor-default">
              ← Previous
            </button>
            <button type="button" class="h-8 px-3 rounded-md border-none bg-[#2d2d2d] text-[13px] font-medium text-white cursor-pointer">
              1
            </button>
            <button type="button" class="h-8 px-3 rounded-md border-none bg-transparent text-[13px] font-medium text-text-tertiary opacity-35 cursor-default">
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
              <th class="text-left text-xs font-bold text-text-secondary uppercase tracking-[0.5px] bg-[#fafaf8] border-b border-[#d4d2d0] py-4 px-[22px]" style="width:90px;">Actions</th>
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
              <td class="py-6 px-[22px] text-sm align-top">
                <div class="flex items-center gap-2 relative">
                  <button
                    type="button"
                    class="w-[38px] h-[38px] rounded-lg border border-[#d4d2d0] bg-white flex items-center justify-center cursor-pointer transition-all text-brand-blue hover:bg-[#f0f5ff] hover:border-brand-blue"
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
                    <button type="button" class="block w-full py-3 px-[18px] text-sm font-medium text-text-primary bg-none border-none text-left cursor-pointer transition-colors hover:bg-[#f3f2ef]">View Event Report</button>
                    <button type="button" class="block w-full py-3 px-[18px] text-sm font-medium text-text-primary bg-none border-none text-left cursor-pointer transition-colors hover:bg-[#f3f2ef]">Export Signups</button>
                  </div>
                </div>
              </td>
              <td class="py-6 px-[22px] text-sm align-top">
                <span class="font-normal text-text-primary text-sm">{{ ev.name }}</span>
                <div class="mt-1">
                  <span class="text-sm text-text-primary font-normal">{{ ev.dateLabel }}</span>
                  <span class="text-sm text-text-tertiary font-normal"> · {{ ev.timeLabel }}</span>
                </div>
              </td>
              <td class="py-6 px-[22px] text-sm align-top">
                <a v-for="(job, jidx) in ev.jobs" :key="jidx" class="block text-brand-blue font-normal text-sm no-underline cursor-pointer hover:underline">
                  {{ job.title }}
                </a>
              </td>
              <td class="py-6 px-[22px] text-sm align-top">
                <a class="block text-sm text-brand-blue no-underline font-normal cursor-pointer hover:underline">
                  View event report
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
