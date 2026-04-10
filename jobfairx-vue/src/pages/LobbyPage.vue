<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// ═════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═════════════════════════════════════════════════════════════
interface ResumeData {
  email: string
  phone: string
  location: string
  jobs: Array<{
    title: string
    company: string
    dates: string
    bullets: string[]
  }>
  education: {
    degree: string
    school: string
    dates: string
  }
  skills: string[]
}

interface MessageItem {
  sender: 'employer' | 'candidate' | 'system'
  name: string
  text: string
  time: string
  detail?: string
}

interface ScheduleSlot {
  date: string
  time: string
}

interface Candidate {
  name: string
  jobTitle: string
  location?: string
  time: string
  date: string
  interviewer?: string
  status?: 'pending' | 'confirmed' | 'completed'
}

// ═════════════════════════════════════════════════════════════
// REACTIVE STATE
// ═════════════════════════════════════════════════════════════

// Current tab
const activeTab = ref<'waiting' | 'interviewing' | 'interviewed' | 'notyet'>('waiting')

// Global lobby mode
const lobbyMode = ref<'active' | 'empty' | 'live'>('empty')

// User menu
const userMenuOpen = ref(false)

// Dots menu
const dotsMenuOpen = ref(false)

// Review section collapse/expand
const reviewSectionCollapsed = ref(false)
const pendingSectionCollapsed = ref(false)

// Live countdown
const liveCountdownText = ref('2h 42m 18s')
let liveCountdownTimer: ReturnType<typeof setTimeout> | null = null

// Modals
const welcomeModalOpen = ref(false)
const teamModalOpen = ref(false)
const avModalOpen = ref(false)
const avStep2Visible = ref(false)
const resumeModalOpen = ref(false)
const msgModalOpen = ref(false)
const declineModalOpen = ref(false)
const scheduleModalOpen = ref(false)
const feedbackModalOpen = ref(false)

// Toast states
const acceptToastVisible = ref(false)
const acceptToastMsg = ref('')
const declineToastVisible = ref(false)
const declineToastMsg = ref('')
let acceptToastTimer: ReturnType<typeof setTimeout> | null = null
let declineToastTimer: ReturnType<typeof setTimeout> | null = null

// Accept/Decline undo state
const acceptedRow = ref<Candidate | null>(null)
let declinedRow: Candidate | null = null
let pendingDeclineCandidate: Candidate | null = null
let skipDeclineWarning = false

// Resume modal
let resumeSourceCandidate: Candidate | null = null

// Message modal
const msgModalTo = ref('')
const msgModalSubtitle = ref('')
const msgMessages = ref<MessageItem[]>([])
const msgTextarea = ref('')
const msgCharCount = ref(0)

// Schedule modal
const scheduleModalTitle = ref('Schedule with Candidate')
const scheduleSlots = ref<ScheduleSlot[]>([{ date: '', time: '' }])
const scheduleTextarea = ref('')

// Decline confirmation
const declineCandidateName = ref('')
const declineDontAsk = ref(false)

// Feedback modal
const fbExperience = ref<string | null>(null)
const fbFollowups = ref<Record<string, string>>({})
const fbText = ref('')
const fbCharCount = ref(0)
const fbShowFollowups = ref(false)

// ═════════════════════════════════════════════════════════════
// STATIC DATA
// ═════════════════════════════════════════════════════════════

const SCHEDULE_TIME_OPTIONS = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
]

const resumeData: Record<string, ResumeData> = {
  'Tamara Williams': {
    email: 'tamara.williams@email.com',
    phone: '(214) 555-0183',
    location: 'Dallas, TX',
    jobs: [
      {
        title: 'Registered Nurse',
        company: 'Baylor Scott & White',
        dates: 'March 2023 - Present',
        bullets: [
          'Provide direct patient care in a 32-bed medical-surgical unit',
          'Administer medications and monitor patient vital signs',
          'Collaborate with physicians on patient treatment plans',
          'Mentor newly hired nurses during onboarding',
          'Maintain accurate electronic health records'
        ]
      },
      {
        title: 'Staff Nurse',
        company: 'Texas Health Resources',
        dates: 'June 2020 - February 2023',
        bullets: [
          'Delivered patient care in emergency and ICU departments',
          'Assisted with patient assessments and care coordination',
          'Participated in quality improvement initiatives'
        ]
      }
    ],
    education: {
      degree: 'Bachelor of Science in Nursing',
      school: 'University of Texas at Arlington',
      dates: '2016 - 2020'
    },
    skills: ['Patient Care', 'EMR/EHR', 'IV Therapy', 'Wound Care', 'BLS/ACLS Certified', 'Team Leadership']
  },
  'Marcus Johnson': {
    email: 'marcus.j@email.com',
    phone: '(469) 555-0247',
    location: 'Dallas, TX',
    jobs: [
      {
        title: 'Web Developer',
        company: 'Digital Solutions Inc.',
        dates: 'January 2022 - Present',
        bullets: [
          'Build responsive web applications using React and Node.js',
          'Optimize site performance and page load speeds',
          'Collaborate with UX designers to implement new features',
          'Write unit tests and maintain CI/CD pipelines'
        ]
      },
      {
        title: 'Junior Developer',
        company: 'StartUp Labs',
        dates: 'August 2019 - December 2021',
        bullets: [
          'Developed front-end components using JavaScript and CSS',
          'Fixed bugs and improved existing codebase',
          'Participated in code reviews and sprint planning'
        ]
      }
    ],
    education: {
      degree: 'B.S. Computer Science',
      school: 'University of North Texas',
      dates: '2015 - 2019'
    },
    skills: ['JavaScript', 'React', 'Node.js', 'HTML/CSS', 'Git', 'REST APIs', 'TypeScript']
  },
  'Priya Patel': {
    email: 'priya.patel@email.com',
    phone: '(972) 555-0391',
    location: 'Dallas, TX',
    jobs: [
      {
        title: 'Frontend Developer',
        company: 'TechForward',
        dates: 'May 2021 - Present',
        bullets: [
          'Develop and maintain customer-facing React applications',
          'Implement responsive designs from Figma mockups',
          'Improve web accessibility to WCAG 2.1 standards',
          'Reduce bundle size by 40% through code splitting'
        ]
      }
    ],
    education: {
      degree: 'B.S. Information Technology',
      school: 'UT Dallas',
      dates: '2017 - 2021'
    },
    skills: ['React', 'TypeScript', 'CSS/Sass', 'Figma', 'Accessibility', 'Jest']
  }
}

const msgData: Record<string, MessageItem[]> = {
  'Tamara Williams': [
    {
      sender: 'employer',
      name: 'You',
      text: 'Hi Tamara, thank you for applying to our Registered Nurse position. We would love to schedule an interview with you during our upcoming hiring event.',
      time: 'Apr 5 at 2:15 PM'
    },
    {
      sender: 'candidate',
      name: 'Tamara Williams',
      text: 'Thank you so much! I am very excited about this opportunity. The interview time works great for me.',
      time: 'Apr 5 at 3:42 PM'
    },
    {
      sender: 'employer',
      name: 'You',
      text: 'Wonderful! You will receive a confirmation with all the details. Looking forward to meeting you.',
      time: 'Apr 5 at 4:10 PM'
    }
  ],
  'Marcus Johnson': [
    {
      sender: 'employer',
      name: 'You',
      text: 'Hi Marcus, we reviewed your application for the Web Developer role and would like to invite you for an interview at our Dallas hiring event.',
      time: 'Apr 4 at 10:00 AM'
    },
    {
      sender: 'candidate',
      name: 'Marcus Johnson',
      text: 'That sounds great! I am available and looking forward to it. Is there anything I should prepare beforehand?',
      time: 'Apr 4 at 11:30 AM'
    },
    {
      sender: 'employer',
      name: 'You',
      text: 'Just be ready to discuss your experience with React and Node.js. We will send you the details shortly.',
      time: 'Apr 4 at 11:45 AM'
    },
    {
      sender: 'system',
      name: 'System',
      text: 'Interview time confirmed:',
      detail: 'Apr 22 at 9:30 AM',
      time: 'Apr 4 at 12:00 PM'
    }
  ],
  'Priya Patel': [
    {
      sender: 'candidate',
      name: 'Priya Patel',
      text: 'Hello! I submitted my application for the Frontend Developer position. I wanted to follow up and express my strong interest in the role.',
      time: 'Apr 3 at 9:15 AM'
    },
    {
      sender: 'employer',
      name: 'You',
      text: 'Hi Priya, thanks for reaching out. We have reviewed your application and would like to invite you to interview during our upcoming event on April 22nd.',
      time: 'Apr 3 at 2:30 PM'
    },
    {
      sender: 'candidate',
      name: 'Priya Patel',
      text: 'That is perfect! I will be there. Thank you for the opportunity.',
      time: 'Apr 3 at 3:05 PM'
    }
  ]
}

// Waiting to interview - Active state
const waitingCandidates: Candidate[] = [
  { name: 'Aisha Rahman', jobTitle: 'Registered Nurse', time: '11:00 AM', date: 'Apr 22, 2026' },
  { name: 'James Cooper', jobTitle: 'Physical Therapist', time: '11:00 AM', date: 'Apr 22, 2026' },
  { name: 'Sofia Martinez', jobTitle: 'Medical Assistant', time: '11:30 AM', date: 'Apr 22, 2026' },
  { name: 'Derek Washington', jobTitle: 'Dental Hygienist', time: '11:30 AM', date: 'Apr 22, 2026' }
]

// Pending interviews (Not Yet Interviewed - Active state)
const pendingCandidates: Candidate[] = [
  { name: 'Tamara Williams', jobTitle: 'Registered Nurse', location: 'Dallas, TX', time: '10:30 AM', date: 'Apr 22, 2026' },
  { name: 'Marcus Johnson', jobTitle: 'Web Developer', location: 'Dallas, TX (Remote)', time: '11:00 AM', date: 'Apr 22, 2026' },
  { name: 'Aisha Mohammed', jobTitle: 'Registered Nurse', location: 'Dallas, TX (On-site)', time: '11:30 AM', date: 'Apr 22, 2026' },
  { name: 'Ryan Cooper', jobTitle: 'Frontend Developer', location: 'Dallas, TX (Remote)', time: '12:00 PM', date: 'Apr 22, 2026' }
]

// Confirmed interviews (Not Yet Interviewed - Active state, second section)
const confirmedCandidates: Candidate[] = [
  { name: 'Michael Sanchez Reyes', jobTitle: 'Web Developer', location: 'Dallas, TX (Remote)', time: '10:30 AM', date: 'Apr 22, 2026' },
  { name: 'Babar Nawaz', jobTitle: 'Web Developer', location: 'Dallas, TX (Remote)', time: '10:30 AM', date: 'Apr 22, 2026' },
  { name: 'Michael Duvenary', jobTitle: 'Web Developer', location: 'Dallas, TX (Remote)', time: '11:00 AM', date: 'Apr 22, 2026' },
  { name: 'Jonathan Kleve', jobTitle: 'Registered Nurse', location: 'Dallas, TX (On-site)', time: '11:00 AM', date: 'Apr 22, 2026' },
  { name: 'Andy Pham', jobTitle: 'Web Developer', location: 'Dallas, TX (Remote)', time: '11:30 AM', date: 'Apr 22, 2026' },
  { name: 'Sarah Kim', jobTitle: 'Frontend Developer', location: 'Dallas, TX (Remote)', time: '12:00 PM', date: 'Apr 22, 2026' },
  { name: 'David Chen', jobTitle: 'Frontend Developer', location: 'Dallas, TX (Remote)', time: '12:00 PM', date: 'Apr 22, 2026' },
  { name: 'Rachel Torres', jobTitle: 'Full Stack Developer', location: 'Dallas, TX (Remote)', time: '12:30 PM', date: 'Apr 22, 2026' }
]

// Interviewing - Active state
const interviewingCandidates: Candidate[] = [
  { name: 'Aisha Rahman', jobTitle: 'Registered Nurse', time: '11:00 AM', date: 'Apr 22, 2026', interviewer: 'Scott Harrison' },
  { name: 'James Cooper', jobTitle: 'Physical Therapist', time: '11:00 AM', date: 'Apr 22, 2026', interviewer: 'Sarah Johnson' },
  { name: 'Sofia Martinez', jobTitle: 'Medical Assistant', time: '11:30 AM', date: 'Apr 22, 2026', interviewer: 'Mike Chen' }
]

// Interviewed - Active state
const interviewedCandidates: Candidate[] = [
  { name: 'Jennifer Lee', jobTitle: 'Registered Nurse', location: 'Dallas, TX', time: '10:00 AM', date: 'Apr 22, 2026', status: 'completed' },
  { name: 'Thomas Brown', jobTitle: 'Web Developer', location: 'Dallas, TX (Remote)', time: '10:30 AM', date: 'Apr 22, 2026', status: 'completed' },
  { name: 'Lisa Zhang', jobTitle: 'Frontend Developer', location: 'Dallas, TX (Remote)', time: '11:00 AM', date: 'Apr 22, 2026', status: 'completed' }
]

// ═════════════════════════════════════════════════════════════
// COMPUTED PROPERTIES
// ═════════════════════════════════════════════════════════════

const isLiveMode = computed(() => lobbyMode.value === 'live')

const contentMode = computed(() => (lobbyMode.value === 'live' ? 'active' : lobbyMode.value))

// ═════════════════════════════════════════════════════════════
// METHODS
// ═════════════════════════════════════════════════════════════

function switchTab(tab: 'waiting' | 'interviewing' | 'interviewed' | 'notyet') {
  activeTab.value = tab
}

function setLobbyMode(mode: 'active' | 'empty' | 'live') {
  lobbyMode.value = mode
  if (mode === 'live') {
    startLobbyCountdown()
  } else {
    stopLobbyCountdown()
  }
}

function startLobbyCountdown() {
  if (liveCountdownTimer) return
  let totalSeconds = 2 * 3600 + 42 * 60 + 18

  const update = () => {
    if (totalSeconds <= 0) {
      liveCountdownText.value = '0h 0m 0s'
      stopLobbyCountdown()
      return
    }
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    liveCountdownText.value = `${h}h ${m}m ${s}s`
    totalSeconds--
  }

  update()
  liveCountdownTimer = setInterval(update, 1000)
}

function stopLobbyCountdown() {
  if (liveCountdownTimer) {
    clearInterval(liveCountdownTimer)
    liveCountdownTimer = null
  }
}

function toggleReviewSection() {
  reviewSectionCollapsed.value = !reviewSectionCollapsed.value
}

function togglePendingSection() {
  pendingSectionCollapsed.value = !pendingSectionCollapsed.value
}

function acceptInterview(candidate: Candidate) {
  acceptedRow.value = candidate
  acceptToastMsg.value = `${candidate.name}'s interview request accepted`
  acceptToastVisible.value = true

  if (acceptToastTimer) clearTimeout(acceptToastTimer)
  acceptToastTimer = setTimeout(() => {
    acceptToastVisible.value = false
    acceptedRow.value = null
  }, 5000)
}

function undoAccept() {
  if (acceptToastTimer) {
    clearTimeout(acceptToastTimer)
    acceptToastTimer = null
  }
  acceptToastVisible.value = false
  acceptedRow.value = null
}

function declineInterview(candidate: Candidate) {
  pendingDeclineCandidate = candidate
  if (skipDeclineWarning) {
    executeDecline(candidate)
    return
  }
  declineCandidateName.value = candidate.name
  declineModalOpen.value = true
}

function closeDeclineModal() {
  declineModalOpen.value = false
  pendingDeclineCandidate = null
}

function confirmDecline() {
  if (declineDontAsk.value) {
    skipDeclineWarning = true
  }
  declineModalOpen.value = false
  if (pendingDeclineCandidate) {
    executeDecline(pendingDeclineCandidate)
    pendingDeclineCandidate = null
  }
}

function executeDecline(candidate: Candidate) {
  if (declineToastTimer) clearTimeout(declineToastTimer)
  declinedRow = candidate
  declineToastMsg.value = `${candidate.name}'s interview request declined`
  declineToastVisible.value = true

  declineToastTimer = setTimeout(() => {
    declineToastVisible.value = false
    declinedRow = null
  }, 5000)
}

function undoDecline() {
  if (declineToastTimer) {
    clearTimeout(declineToastTimer)
    declineToastTimer = null
  }
  declineToastVisible.value = false
  declinedRow = null
}

function openResumeModal(candidate: Candidate) {
  resumeSourceCandidate = candidate

  msgModalTo.value = candidate.name
  msgModalSubtitle.value = candidate.location ? `${candidate.jobTitle} · ${candidate.location}` : candidate.jobTitle

  resumeModalOpen.value = true
}

function closeResumeModal() {
  resumeModalOpen.value = false
  resumeSourceCandidate = null
}

function acceptFromResume() {
  if (resumeSourceCandidate) {
    acceptInterview(resumeSourceCandidate)
  }
  closeResumeModal()
}

function declineFromResume() {
  if (resumeSourceCandidate) {
    declineInterview(resumeSourceCandidate)
  }
  closeResumeModal()
}

function openMsgModal(candidate: Candidate) {
  msgModalTo.value = `To: ${candidate.name} · ${candidate.jobTitle}`
  msgTextarea.value = ''
  msgCharCount.value = 0

  const firstName = candidate.name.split(' ')[0]
  const messages = msgData[candidate.name] || [
    {
      sender: 'employer' as const,
      name: 'You',
      text: `Hi ${firstName}, we would like to invite you for an interview at our upcoming hiring event.`,
      time: 'Apr 5 at 10:00 AM'
    },
    {
      sender: 'candidate' as const,
      name: candidate.name,
      text: 'Thank you! I look forward to it.',
      time: 'Apr 5 at 11:30 AM'
    }
  ]

  msgMessages.value = messages
  msgModalOpen.value = true
}

function closeMsgModal() {
  msgModalOpen.value = false
}

function updateMsgCharCount() {
  msgCharCount.value = msgTextarea.value.length
}

function sendMessage() {
  if (msgTextarea.value.trim() === '') return

  const now = new Date()
  const timeStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' at ' +
    now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  msgMessages.value.push({
    sender: 'employer',
    name: 'You',
    text: msgTextarea.value,
    time: timeStr
  })

  const toName = msgModalTo.value.replace('To: ', '').split(' · ')[0]
  acceptToastMsg.value = `Message sent to ${toName}`
  acceptToastVisible.value = true

  msgTextarea.value = ''
  msgCharCount.value = 0

  setTimeout(() => {
    acceptToastVisible.value = false
  }, 3000)
}

function openScheduleModal(candidate: Candidate) {
  scheduleModalTitle.value = `Schedule with ${candidate.name}`
  scheduleSlots.value = [{ date: '', time: '' }]
  scheduleTextarea.value = ''
  scheduleModalOpen.value = true
}

function closeScheduleModal() {
  scheduleModalOpen.value = false
}

function addScheduleSlot() {
  scheduleSlots.value.push({ date: '', time: '' })
}

function removeScheduleSlot(index: number) {
  if (scheduleSlots.value.length > 1) {
    scheduleSlots.value.splice(index, 1)
  }
}

function getTodayISO(): string {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function submitScheduleModal() {
  const completeSlots = scheduleSlots.value.filter((s) => s.date && s.time)
  if (completeSlots.length === 0) return

  closeScheduleModal()
  const msg = completeSlots.length === 1 ? 'Interview time sent to candidate' : 'Interview times sent to candidate'
  acceptToastMsg.value = msg
  acceptToastVisible.value = true
  setTimeout(() => {
    acceptToastVisible.value = false
  }, 3000)
}

function openWelcomeModal() {
  welcomeModalOpen.value = true
}

function closeWelcomeModal() {
  welcomeModalOpen.value = false
}

function openTeamModal() {
  teamModalOpen.value = true
}

function closeTeamModal() {
  teamModalOpen.value = false
}

function openAvModal() {
  avModalOpen.value = true
  avStep2Visible.value = false
}

function closeAvModal() {
  avModalOpen.value = false
}

function goToStep2() {
  avStep2Visible.value = true
}

function openFeedbackModal() {
  userMenuOpen.value = false
  fbExperience.value = null
  fbFollowups.value = {}
  fbText.value = ''
  fbCharCount.value = 0
  fbShowFollowups.value = false
  feedbackModalOpen.value = true
}

function closeFeedbackModal() {
  feedbackModalOpen.value = false
}

function selectExperience(value: string) {
  fbExperience.value = value
  fbShowFollowups.value = true
}

function selectFollowup(group: string, value: string) {
  if (fbFollowups.value[group] === value) {
    delete fbFollowups.value[group]
  } else {
    fbFollowups.value[group] = value
  }
}

function updateFbCount() {
  fbCharCount.value = fbText.value.length
}

function submitFeedback() {
  if (!fbExperience.value) return
  closeFeedbackModal()
  acceptToastMsg.value = 'Thanks for your feedback!'
  acceptToastVisible.value = true
  setTimeout(() => {
    acceptToastVisible.value = false
  }, 2400)
}

function getResumeData(name: string): ResumeData | undefined {
  return resumeData[name]
}

// ═════════════════════════════════════════════════════════════
// LIFECYCLE
// ═════════════════════════════════════════════════════════════

onMounted(() => {
  // Read ?tab= query param
  const params = new URLSearchParams(window.location.search)
  const requested = params.get('tab')
  if (requested && ['waiting', 'interviewing', 'interviewed', 'notyet'].includes(requested)) {
    activeTab.value = requested as 'waiting' | 'interviewing' | 'interviewed' | 'notyet'
  }
})

onUnmounted(() => {
  if (liveCountdownTimer) {
    clearInterval(liveCountdownTimer)
  }
  if (acceptToastTimer) {
    clearTimeout(acceptToastTimer)
  }
  if (declineToastTimer) {
    clearTimeout(declineToastTimer)
  }
})
</script>

<template>
  <!-- ═══ TOP HEADER BAR ═══ -->
  <div class="w-full h-14 bg-white border-b border-border-strong">
    <div class="flex items-center justify-between h-full px-8">
      <a href="visual.html" class="text-2xl font-black text-brand-blue tracking-tighter">JobFairX</a>
      <div class="flex items-center gap-1.5">
        <div
          class="flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg transition-colors hover:bg-opacity-60"
          :class="{ 'bg-gray-100': userMenuOpen }"
          @click="userMenuOpen = !userMenuOpen"
        >
          <!-- User Icon SVG -->
          <svg class="w-5 h-5 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span class="text-base font-medium text-text-primary">scott@jobfairx.com</span>
          <!-- Chevron SVG -->
          <svg class="w-3.5 h-3.5 text-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>

        <!-- User Menu -->
        <div
          v-show="userMenuOpen"
          class="absolute top-11 right-0 bg-white rounded-xl shadow-lg border border-border-default min-w-56 z-50 py-1.5"
        >
          <a href="account-billing.html" class="block w-full px-4.5 py-3 text-base font-medium text-text-primary hover:bg-gray-50 transition-colors">
            Account &amp; Billing
          </a>
          <button
            @click="openFeedbackModal"
            class="block w-full px-4.5 py-3 text-base font-medium text-text-primary hover:bg-gray-50 transition-colors text-left font-sans"
          >
            Give Feedback
          </button>
          <div class="h-px bg-border-default my-1"></div>
          <button class="block w-full px-4.5 py-3 text-base font-medium text-text-tertiary hover:bg-gray-50 transition-colors text-left font-sans">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="px-8 pt-8 pb-0">
    <!-- Breadcrumb -->
    <a href="visual.html" class="inline-flex items-center gap-1.5 text-lg text-brand-blue underline font-bold mb-6">
      <!-- Back Arrow SVG -->
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-text-primary">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      All JobFairX virtual interviews
    </a>

    <!-- Event header -->
    <div class="flex items-start justify-between gap-6 mb-8">
      <div class="flex-1 min-w-0">
        <h1 class="text-4xl font-bold text-text-primary mb-2">Dallas Healthcare Hiring Event</h1>
        <!-- Default event meta -->
        <div v-show="!isLiveMode" class="flex items-center gap-2 text-lg font-normal text-text-secondary whitespace-nowrap flex-nowrap">
          <span class="w-2 h-2 rounded-full bg-text-primary flex-shrink-0"></span>
          <span>Starts in <strong>2 weeks, 3 days</strong></span>
          <span class="text-border-strong">|</span>
          <span>Apr 22, 2026, 11:00 AM - 3:00 PM CT</span>
        </div>
        <!-- Live event meta -->
        <div v-show="isLiveMode" class="flex items-center gap-2 text-lg font-normal text-text-secondary whitespace-nowrap flex-nowrap">
          <span class="w-2 h-2 rounded-full bg-green-600 flex-shrink-0"></span>
          <span style="color: #166534; font-weight: 700;">Event is live</span>
          <span class="text-border-strong">|</span>
          <span>Ends in <strong>{{ liveCountdownText }}</strong></span>
          <span class="text-border-strong">|</span>
          <span>Apr 22, 2026, 11:00 AM - 3:00 PM CT</span>
        </div>
      </div>

      <!-- Three dots menu -->
      <div class="relative flex-shrink-0">
        <button
          @click="dotsMenuOpen = !dotsMenuOpen"
          class="w-10 h-10 rounded-lg border border-border-default bg-white flex items-center justify-center cursor-pointer transition-all hover:bg-gray-100 hover:border-brand-blue"
        >
          <!-- Three dots SVG -->
          <svg viewBox="0 0 24 24" fill="#0044B3" class="w-5 h-5">
            <circle cx="6" cy="12" r="2.3" />
            <circle cx="12" cy="12" r="2.3" />
            <circle cx="18" cy="12" r="2.3" />
          </svg>
        </button>

        <!-- Dots Menu -->
        <div
          v-show="dotsMenuOpen"
          class="absolute top-11 right-0 bg-white rounded-2xl shadow-lg border border-border-default min-w-64 z-50 py-2"
        >
          <button
            @click="dotsMenuOpen = false; openTeamModal()"
            class="block w-full px-6 py-4 text-base font-normal text-text-primary hover:bg-gray-50 transition-colors text-left font-sans"
          >
            Add team members
          </button>
          <button
            @click="dotsMenuOpen = false; openWelcomeModal()"
            class="block w-full px-6 py-4 text-base font-normal text-text-primary hover:bg-gray-50 transition-colors text-left font-sans"
          >
            Update welcome message
          </button>
          <button
            @click="dotsMenuOpen = false; openAvModal()"
            class="flex items-center justify-between w-full px-6 py-4 text-base font-normal text-text-primary hover:bg-gray-50 transition-colors text-left font-sans"
          >
            Test video and audio
            <!-- External icon SVG -->
            <svg class="w-4 h-4 text-text-secondary flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 9v4a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4" />
              <path d="M10 2h4v4" />
              <path d="M7 9L14 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Tabs -->
  <div class="w-full border-b-4 border-border-strong">
    <div class="flex px-8">
      <button
        v-for="(tab, _idx) in ['waiting', 'interviewing', 'interviewed', 'notyet']"
        :key="tab"
        @click="switchTab(tab as any)"
        :class="[
          'flex-1 px-4 py-5 text-center text-base font-normal text-text-secondary cursor-pointer border-b-4 border-transparent -mb-1 transition-all',
          { 'text-text-primary border-b-text-primary font-bold': activeTab === tab }
        ]"
      >
        {{ tab === 'waiting' ? 'Waiting to interview (0)' : tab === 'interviewing' ? 'Interviewing (0)' : tab === 'interviewed' ? 'Interviewed (0)' : 'Not yet interviewed (26)' }}
      </button>
    </div>
  </div>

  <!-- Tab Panels -->
  <div v-show="activeTab === 'waiting'" class="w-full bg-gray-100 px-8 pt-6">
    <!-- Waiting Active -->
    <div v-if="contentMode === 'active'" class="bg-white rounded-2xl p-7 border border-border-strong">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-xl font-bold text-text-primary">4 candidates waiting to interview</h3>
        <div class="flex items-center gap-2">
          <span class="text-text-secondary font-medium">View:</span>
          <div class="flex gap-1 bg-gray-100 px-1 py-1 rounded-lg">
            <button
              @click="setLobbyMode('active')"
              :class="['px-3 py-1 text-sm font-medium rounded transition-all', lobbyMode === 'active' ? 'bg-white text-text-primary' : 'text-text-secondary']"
            >
              Active
            </button>
            <button
              @click="setLobbyMode('empty')"
              :class="['px-3 py-1 text-sm font-medium rounded transition-all', lobbyMode === 'empty' ? 'bg-white text-text-primary' : 'text-text-secondary']"
            >
              Empty
            </button>
            <button
              @click="setLobbyMode('live')"
              :class="['px-3 py-1 text-sm font-medium rounded transition-all', lobbyMode === 'live' ? 'bg-white text-text-primary' : 'text-text-secondary']"
            >
              Live
            </button>
          </div>
        </div>
      </div>

      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="px-4 py-3.5 text-left text-sm font-normal text-text-secondary border-b border-border-default bg-gray-50">Name</th>
            <th class="px-4 py-3.5 text-left text-sm font-normal text-text-secondary border-b border-border-default bg-gray-50">Job title</th>
            <th class="px-4 py-3.5 text-left text-sm font-normal text-text-secondary border-b border-border-default bg-gray-50">Interview time</th>
            <th class="px-4 py-3.5 text-left text-sm font-normal text-text-secondary border-b border-border-default bg-gray-50">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="candidate in waitingCandidates" :key="candidate.name" class="hover:bg-gray-50">
            <td class="px-4 py-5.5 border-b border-gray-100 text-base font-normal text-text-primary">
              <div class="mb-2">{{ candidate.name }}</div>
              <div class="flex items-center gap-1 text-sm">
                <a href="#" @click.prevent="openResumeModal(candidate)" class="text-brand-blue underline cursor-pointer">View resume</a>
                <a href="#" @click.prevent="openMsgModal(candidate)" class="text-brand-blue underline cursor-pointer">Message</a>
              </div>
            </td>
            <td class="px-4 py-5.5 border-b border-gray-100 text-base font-normal text-text-primary">{{ candidate.jobTitle }}</td>
            <td class="px-4 py-5.5 border-b border-gray-100">
              <div class="text-base font-normal text-text-primary">{{ candidate.time }}</div>
              <div class="text-sm text-text-tertiary mt-0.5">{{ candidate.date }}</div>
            </td>
            <td class="px-4 py-5.5 border-b border-gray-100">
              <button class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border-default bg-white text-text-primary font-semibold text-sm hover:bg-gray-50 transition-all">
                <!-- Play icon SVG -->
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" />
                </svg>
                Join interview
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Waiting Empty -->
    <div v-if="contentMode === 'empty'" class="bg-white rounded-2xl p-8 border border-border-strong mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-3xl font-bold text-text-primary mb-1.5">Interviewing has not begun</h3>
          <p class="text-base font-normal text-text-secondary">Candidates will appear here once they start the interview and are waiting for you to join.</p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-text-secondary font-medium">View:</span>
          <div class="flex gap-1 bg-gray-100 px-1 py-1 rounded-lg">
            <button
              @click="setLobbyMode('active')"
              :class="['px-3 py-1 text-sm font-medium rounded transition-all', lobbyMode === 'active' ? 'bg-white text-text-primary' : 'text-text-secondary']"
            >
              Active
            </button>
            <button
              @click="setLobbyMode('empty')"
              :class="['px-3 py-1 text-sm font-medium rounded transition-all', lobbyMode === 'empty' ? 'bg-white text-text-primary' : 'text-text-secondary']"
            >
              Empty
            </button>
            <button
              @click="setLobbyMode('live')"
              :class="['px-3 py-1 text-sm font-medium rounded transition-all', lobbyMode === 'live' ? 'bg-white text-text-primary' : 'text-text-secondary']"
            >
              Live
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Prepare section (shown in empty) -->
    <div v-if="contentMode === 'empty'" class="bg-white rounded-2xl p-7 border border-border-strong">
      <div class="text-xl font-bold text-text-primary mb-6">Prepare for your interview</div>

      <!-- Review candidates -->
      <div class="flex gap-6 py-6 border-b border-gray-200 last:border-0">
        <svg class="w-32 h-24 flex-shrink-0" viewBox="0 0 120 90" fill="none">
          <rect x="10" y="50" width="70" height="6" rx="3" fill="#e8e0d4" />
          <rect x="14" y="56" width="4" height="20" rx="2" fill="#d4c8b8" />
          <rect x="72" y="56" width="4" height="20" rx="2" fill="#d4c8b8" />
          <rect x="22" y="16" width="46" height="34" rx="4" fill="#d6e4f7" />
          <rect x="26" y="20" width="38" height="26" rx="2" fill="#fff" />
          <rect x="42" y="50" width="6" height="4" fill="#c4b8a8" />
          <text x="45" y="38" font-size="18" font-weight="700" fill="#0044B3" text-anchor="middle" font-family="sans-serif">?</text>
          <circle cx="95" cy="30" r="10" fill="#e8a87c" />
          <rect x="85" y="42" width="20" height="24" rx="6" fill="#4a90d9" />
          <rect x="72" y="46" width="16" height="5" rx="2.5" fill="#e8a87c" />
        </svg>
        <div class="flex-1 flex flex-col justify-center">
          <div class="text-lg font-bold text-text-primary mb-1">Review your candidates</div>
          <div class="text-base font-normal text-text-secondary mb-4">You have 10 candidates to review.</div>
          <a href="#" @click.prevent="switchTab('notyet')" class="text-brand-blue font-bold underline text-base w-fit">View candidates</a>
        </div>
      </div>

      <!-- Add team members -->
      <div class="flex gap-6 py-6 border-b border-gray-200 last:border-0">
        <svg class="w-32 h-24 flex-shrink-0" viewBox="0 0 120 90" fill="none">
          <circle cx="35" cy="25" r="10" fill="#e8a87c" />
          <rect x="25" y="37" width="20" height="22" rx="6" fill="#d4956b" />
          <circle cx="65" cy="25" r="10" fill="#c9a87c" />
          <rect x="55" y="37" width="20" height="22" rx="6" fill="#4a90d9" />
          <circle cx="50" cy="18" r="8" fill="#a8c5a8" opacity="0.7" />
          <rect x="42" y="28" width="16" height="18" rx="5" fill="#7da67d" opacity="0.6" />
          <circle cx="95" cy="35" r="14" fill="#f0f5ff" stroke="#0044B3" stroke-width="2" />
          <rect x="93" y="27" width="4" height="16" rx="2" fill="#0044B3" />
          <rect x="87" y="33" width="16" height="4" rx="2" fill="#0044B3" />
        </svg>
        <div class="flex-1 flex flex-col justify-center">
          <div class="text-lg font-bold text-text-primary mb-1">Add hiring team members to the interview</div>
          <div class="text-base font-normal text-text-secondary mb-4">You added 1 team member.</div>
          <button @click="openTeamModal" class="text-brand-blue font-bold underline text-base w-fit">Add team members</button>
        </div>
      </div>

      <!-- Welcome message -->
      <div class="flex gap-6 py-6">
        <svg class="w-32 h-24 flex-shrink-0" viewBox="0 0 120 90" fill="none">
          <rect x="15" y="10" width="60" height="45" rx="5" fill="#d6e4f7" />
          <rect x="20" y="15" width="50" height="35" rx="3" fill="#fff" />
          <rect x="40" y="55" width="10" height="6" fill="#c4b8a8" />
          <rect x="30" y="60" width="30" height="4" rx="2" fill="#d4c8b8" />
          <rect x="26" y="22" width="38" height="14" rx="4" fill="#e8f4e8" />
          <rect x="28" y="25" width="20" height="2.5" rx="1" fill="#7da67d" />
          <rect x="28" y="30" width="14" height="2.5" rx="1" fill="#7da67d" opacity="0.6" />
          <circle cx="95" cy="35" r="18" fill="#fef3e2" opacity="0.6" />
          <circle cx="100" cy="45" r="12" fill="#fde8d0" opacity="0.5" />
        </svg>
        <div class="flex-1 flex flex-col justify-center">
          <div class="text-lg font-bold text-text-primary mb-1">Personalize welcome message</div>
          <div class="text-base font-normal text-text-secondary mb-4">Candidates will be able to see your welcome message when they enter your lobby.</div>
          <button @click="openWelcomeModal" class="text-brand-blue font-bold underline text-base w-fit">Update welcome message</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Interviewing Tab -->
  <div v-show="activeTab === 'interviewing'" class="w-full bg-gray-100 px-8 pt-6">
    <div v-if="contentMode === 'active'" class="bg-white rounded-2xl p-7 border border-border-strong">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-xl font-bold text-text-primary">3 live interviews in progress</h3>
        <div class="flex items-center gap-2">
          <span class="text-text-secondary font-medium">View:</span>
          <div class="flex gap-1 bg-gray-100 px-1 py-1 rounded-lg">
            <button
              @click="setLobbyMode('active')"
              :class="['px-3 py-1 text-sm font-medium rounded transition-all', lobbyMode === 'active' ? 'bg-white text-text-primary' : 'text-text-secondary']"
            >
              Active
            </button>
            <button
              @click="setLobbyMode('empty')"
              :class="['px-3 py-1 text-sm font-medium rounded transition-all', lobbyMode === 'empty' ? 'bg-white text-text-primary' : 'text-text-secondary']"
            >
              Empty
            </button>
            <button
              @click="setLobbyMode('live')"
              :class="['px-3 py-1 text-sm font-medium rounded transition-all', lobbyMode === 'live' ? 'bg-white text-text-primary' : 'text-text-secondary']"
            >
              Live
            </button>
          </div>
        </div>
      </div>

      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="px-4 py-3.5 text-left text-sm font-normal text-text-secondary border-b border-border-default bg-gray-50">Name</th>
            <th class="px-4 py-3.5 text-left text-sm font-normal text-text-secondary border-b border-border-default bg-gray-50">Job title</th>
            <th class="px-4 py-3.5 text-left text-sm font-normal text-text-secondary border-b border-border-default bg-gray-50">Interview time</th>
            <th class="px-4 py-3.5 text-left text-sm font-normal text-text-secondary border-b border-border-default bg-gray-50">Interviewer</th>
            <th class="px-4 py-3.5 text-left text-sm font-normal text-text-secondary border-b border-border-default bg-gray-50">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="candidate in interviewingCandidates" :key="candidate.name" class="hover:bg-gray-50">
            <td class="px-4 py-5.5 border-b border-gray-100 text-base font-normal text-text-primary">
              <div class="mb-2">{{ candidate.name }}</div>
              <div class="flex items-center gap-1 text-sm">
                <a href="#" @click.prevent="openResumeModal(candidate)" class="text-brand-blue underline cursor-pointer">View resume</a>
                <a href="#" @click.prevent="openMsgModal(candidate)" class="text-brand-blue underline cursor-pointer">Message</a>
              </div>
            </td>
            <td class="px-4 py-5.5 border-b border-gray-100 text-base font-normal text-text-primary">{{ candidate.jobTitle }}</td>
            <td class="px-4 py-5.5 border-b border-gray-100 text-base font-normal text-text-primary">{{ candidate.time }}</td>
            <td class="px-4 py-5.5 border-b border-gray-100 text-base text-text-primary">{{ candidate.interviewer }}</td>
            <td class="px-4 py-5.5 border-b border-gray-100">
              <div class="inline-flex items-center border border-border-default rounded-lg">
                <button class="px-3.5 py-2 text-sm font-semibold text-text-primary hover:bg-green-100 hover:text-green-700 transition-all border-r border-border-default flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" />
                  </svg>
                  Rejoin
                </button>
                <button class="px-3.5 py-2 text-sm font-semibold text-text-primary hover:bg-red-100 hover:text-red-700 transition-all">End</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="contentMode === 'empty'" class="bg-white rounded-2xl p-8 border border-border-strong">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-3xl font-bold text-text-primary mb-1.5">No active interviews</h3>
          <p class="text-base font-normal text-text-secondary">Interviews will appear here when candidates join.</p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-text-secondary font-medium">View:</span>
          <div class="flex gap-1 bg-gray-100 px-1 py-1 rounded-lg">
            <button
              @click="setLobbyMode('active')"
              :class="['px-3 py-1 text-sm font-medium rounded transition-all', lobbyMode === 'active' ? 'bg-white text-text-primary' : 'text-text-secondary']"
            >
              Active
            </button>
            <button
              @click="setLobbyMode('empty')"
              :class="['px-3 py-1 text-sm font-medium rounded transition-all', lobbyMode === 'empty' ? 'bg-white text-text-primary' : 'text-text-secondary']"
            >
              Empty
            </button>
            <button
              @click="setLobbyMode('live')"
              :class="['px-3 py-1 text-sm font-medium rounded transition-all', lobbyMode === 'live' ? 'bg-white text-text-primary' : 'text-text-secondary']"
            >
              Live
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Interviewed Tab -->
  <div v-show="activeTab === 'interviewed'" class="w-full bg-gray-100 px-8 pt-6">
    <div v-if="contentMode === 'active'" class="bg-white rounded-2xl p-7 border border-border-strong">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-xl font-bold text-text-primary">3 candidates completed interviews</h3>
        <div class="flex items-center gap-2">
          <span class="text-text-secondary font-medium">View:</span>
          <div class="flex gap-1 bg-gray-100 px-1 py-1 rounded-lg">
            <button
              @click="setLobbyMode('active')"
              :class="['px-3 py-1 text-sm font-medium rounded transition-all', lobbyMode === 'active' ? 'bg-white text-text-primary' : 'text-text-secondary']"
            >
              Active
            </button>
            <button
              @click="setLobbyMode('empty')"
              :class="['px-3 py-1 text-sm font-medium rounded transition-all', lobbyMode === 'empty' ? 'bg-white text-text-primary' : 'text-text-secondary']"
            >
              Empty
            </button>
            <button
              @click="setLobbyMode('live')"
              :class="['px-3 py-1 text-sm font-medium rounded transition-all', lobbyMode === 'live' ? 'bg-white text-text-primary' : 'text-text-secondary']"
            >
              Live
            </button>
          </div>
        </div>
      </div>

      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="px-4 py-3.5 text-left text-sm font-normal text-text-secondary border-b border-border-default bg-gray-50">Name</th>
            <th class="px-4 py-3.5 text-left text-sm font-normal text-text-secondary border-b border-border-default bg-gray-50">Job title</th>
            <th class="px-4 py-3.5 text-left text-sm font-normal text-text-secondary border-b border-border-default bg-gray-50">Interview time</th>
            <th class="px-4 py-3.5 text-left text-sm font-normal text-text-secondary border-b border-border-default bg-gray-50">Disposition</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="candidate in interviewedCandidates" :key="candidate.name" class="hover:bg-gray-50">
            <td class="px-4 py-5.5 border-b border-gray-100 text-base font-normal text-text-primary">
              <div class="mb-2">{{ candidate.name }}</div>
              <div class="flex items-center gap-1 text-sm">
                <a href="#" @click.prevent="openResumeModal(candidate)" class="text-brand-blue underline cursor-pointer">View resume</a>
                <a href="#" @click.prevent="openMsgModal(candidate)" class="text-brand-blue underline cursor-pointer">Message</a>
              </div>
            </td>
            <td class="px-4 py-5.5 border-b border-gray-100 text-base font-normal text-text-primary">{{ candidate.jobTitle }}</td>
            <td class="px-4 py-5.5 border-b border-gray-100">
              <div class="text-base font-normal text-text-primary">{{ candidate.time }}</div>
              <div class="text-sm text-text-tertiary mt-0.5">{{ candidate.date }}</div>
            </td>
            <td class="px-4 py-5.5 border-b border-gray-100">
              <div class="relative inline-flex items-center border border-border-default rounded-lg">
                <button class="px-3.5 py-2 text-sm font-semibold text-green-700 hover:bg-green-100 transition-all border-r border-border-default">✓ Yes</button>
                <button class="px-3.5 py-2 text-sm font-semibold text-text-primary hover:bg-blue-100 transition-all">Change</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="contentMode === 'empty'" class="bg-white rounded-2xl p-8 border border-border-strong">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-3xl font-bold text-text-primary mb-1.5">No completed interviews yet</h3>
          <p class="text-base font-normal text-text-secondary">Interviews will appear here once they're complete.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Not Yet Interviewed Tab -->
  <div v-show="activeTab === 'notyet'" class="w-full bg-gray-100 px-8 pt-6 pb-8">
    <!-- Active state -->
    <div v-if="contentMode === 'active'">
      <!-- Pending section -->
      <div class="bg-white rounded-2xl border border-border-strong mb-6">
        <div
          class="px-7 py-6 flex items-center cursor-pointer gap-2.5"
          @click="togglePendingSection"
        >
          <svg
            :class="['w-5 h-5 text-text-primary transition-transform', pendingSectionCollapsed && 'rotate-180']"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 15 12 9 18 15" />
          </svg>
          <h3 class="text-xl font-bold text-text-secondary">4 candidates awaiting your response</h3>
          <div class="flex items-center gap-2 ml-auto">
            <span class="text-text-secondary font-medium">View:</span>
            <div class="flex gap-1 bg-gray-100 px-1 py-1 rounded-lg">
              <button
                @click.stop="setLobbyMode('active')"
                :class="['px-3 py-1 text-sm font-medium rounded transition-all', lobbyMode === 'active' ? 'bg-white text-text-primary' : 'text-text-secondary']"
              >
                Active
              </button>
              <button
                @click.stop="setLobbyMode('empty')"
                :class="['px-3 py-1 text-sm font-medium rounded transition-all', lobbyMode === 'empty' ? 'bg-white text-text-primary' : 'text-text-secondary']"
              >
                Empty
              </button>
              <button
                @click.stop="setLobbyMode('live')"
                :class="['px-3 py-1 text-sm font-medium rounded transition-all', lobbyMode === 'live' ? 'bg-white text-text-primary' : 'text-text-secondary']"
              >
                Live
              </button>
            </div>
          </div>
        </div>

        <div v-show="!pendingSectionCollapsed" class="border-t border-gray-200">
          <table class="w-full border-collapse">
            <thead>
              <tr>
                <th class="px-4 py-3.5 text-left text-sm font-normal text-text-secondary border-b border-border-default bg-gray-50">Name</th>
                <th class="px-4 py-3.5 text-left text-sm font-normal text-text-secondary border-b border-border-default bg-gray-50">Job title</th>
                <th class="px-4 py-3.5 text-left text-sm font-normal text-text-secondary border-b border-border-default bg-gray-50">Interview time</th>
                <th class="px-4 py-3.5 text-left text-sm font-normal text-text-secondary border-b border-border-default bg-gray-50">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="candidate in pendingCandidates" :key="candidate.name" class="hover:bg-gray-50" v-show="declinedRow?.name !== candidate.name">
                <td class="px-4 py-5.5 border-b border-gray-100 text-base font-normal text-text-primary">
                  <div class="mb-2">{{ candidate.name }}</div>
                  <div class="flex items-center gap-1 text-sm">
                    <a href="#" @click.prevent="openResumeModal(candidate)" class="text-brand-blue underline cursor-pointer">View resume</a>
                    <a href="#" @click.prevent="openMsgModal(candidate)" class="text-brand-blue underline cursor-pointer">Message</a>
                  </div>
                </td>
                <td class="px-4 py-5.5 border-b border-gray-100">
                  <div class="text-base font-normal text-text-primary">{{ candidate.jobTitle }}</div>
                  <div class="text-sm text-text-tertiary mt-0.5">{{ candidate.location }}</div>
                </td>
                <td class="px-4 py-5.5 border-b border-gray-100">
                  <div class="text-base font-normal text-text-primary">{{ candidate.time }}</div>
                  <div class="text-sm text-text-tertiary mt-0.5">{{ candidate.date }}</div>
                </td>
                <td class="px-4 py-5.5 border-b border-gray-100">
                  <div class="inline-flex items-center border border-border-default rounded-lg">
                    <button @click="acceptInterview(candidate)" class="px-3.5 py-2 text-sm font-semibold text-text-primary hover:bg-green-100 hover:text-green-700 transition-all border-r border-border-default">
                      Accept
                    </button>
                    <button @click="declineInterview(candidate)" class="px-3.5 py-2 text-sm font-semibold text-text-primary hover:bg-red-100 hover:text-red-700 transition-all border-r border-border-default">
                      Decline
                    </button>
                    <button @click="openScheduleModal(candidate)" class="px-3.5 py-2 text-sm font-semibold text-text-primary hover:bg-blue-100 transition-all">
                      Reschedule
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Confirmed section -->
      <div class="bg-white rounded-2xl border border-border-strong">
        <div
          class="px-7 py-6 flex items-center cursor-pointer gap-2.5"
          @click="toggleReviewSection"
        >
          <svg
            :class="['w-5 h-5 text-text-primary transition-transform', reviewSectionCollapsed && 'rotate-180']"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 15 12 9 18 15" />
          </svg>
          <h3 class="text-xl font-bold text-text-secondary">18 candidates with upcoming interviews</h3>
        </div>

        <div v-show="!reviewSectionCollapsed" class="border-t border-gray-200">
          <table class="w-full border-collapse">
            <thead>
              <tr>
                <th class="px-4 py-3.5 text-left text-sm font-normal text-text-secondary border-b border-border-default bg-gray-50">Name</th>
                <th class="px-4 py-3.5 text-left text-sm font-normal text-text-secondary border-b border-border-default bg-gray-50">Job title</th>
                <th class="px-4 py-3.5 text-left text-sm font-normal text-text-secondary border-b border-border-default bg-gray-50">Interview time</th>
                <th class="px-4 py-3.5 text-left text-sm font-normal text-text-secondary border-b border-border-default bg-gray-50">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="candidate in confirmedCandidates" :key="candidate.name" class="hover:bg-gray-50">
                <td class="px-4 py-5.5 border-b border-gray-100 text-base font-normal text-text-primary">
                  <div class="mb-2">{{ candidate.name }}</div>
                  <div class="flex items-center gap-1 text-sm">
                    <a href="#" @click.prevent="openResumeModal(candidate)" class="text-brand-blue underline cursor-pointer">View resume</a>
                    <a href="#" @click.prevent="openMsgModal(candidate)" class="text-brand-blue underline cursor-pointer">Message</a>
                  </div>
                </td>
                <td class="px-4 py-5.5 border-b border-gray-100">
                  <div class="text-base font-normal text-text-primary">{{ candidate.jobTitle }}</div>
                  <div class="text-sm text-text-tertiary mt-0.5">{{ candidate.location }}</div>
                </td>
                <td class="px-4 py-5.5 border-b border-gray-100">
                  <div class="text-base font-normal text-text-primary">{{ candidate.time }}</div>
                  <div class="text-sm text-text-tertiary mt-0.5">{{ candidate.date }}</div>
                </td>
                <td class="px-4 py-5.5 border-b border-gray-100">
                  <div class="inline-flex items-center border border-border-default rounded-lg">
                    <button @click="openScheduleModal(candidate)" class="px-3.5 py-2 text-sm font-semibold text-text-primary hover:bg-blue-100 transition-all border-r border-border-default">
                      Reschedule
                    </button>
                    <button @click="declineInterview(candidate)" class="px-3.5 py-2 text-sm font-semibold text-text-primary hover:bg-red-100 hover:text-red-700 transition-all">
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="contentMode === 'empty'">
      <div class="bg-white rounded-2xl border border-border-strong p-7 mb-6">
        <div class="flex items-center">
          <h3 class="text-3xl font-bold text-text-primary">No candidates awaiting your response</h3>
          <div class="flex items-center gap-2 ml-auto">
            <span class="text-text-secondary font-medium">View:</span>
            <div class="flex gap-1 bg-gray-100 px-1 py-1 rounded-lg">
              <button
                @click="setLobbyMode('active')"
                :class="['px-3 py-1 text-sm font-medium rounded transition-all', lobbyMode === 'active' ? 'bg-white text-text-primary' : 'text-text-secondary']"
              >
                Active
              </button>
              <button
                @click="setLobbyMode('empty')"
                :class="['px-3 py-1 text-sm font-medium rounded transition-all', lobbyMode === 'empty' ? 'bg-white text-text-primary' : 'text-text-secondary']"
              >
                Empty
              </button>
              <button
                @click="setLobbyMode('live')"
                :class="['px-3 py-1 text-sm font-medium rounded transition-all', lobbyMode === 'live' ? 'bg-white text-text-primary' : 'text-text-secondary']"
              >
                Live
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-border-strong p-7">
        <h3 class="text-3xl font-bold text-text-primary">You have no upcoming interviews</h3>
      </div>
    </div>
  </div>

  <!-- ═══ WELCOME MESSAGE MODAL ═══ -->
  <Teleport to="body">
    <div
      v-show="welcomeModalOpen"
      class="fixed inset-0 bg-black/45 z-50 flex items-center justify-center"
      @click="closeWelcomeModal"
    >
      <div
        class="bg-white rounded-2xl w-96 max-w-[90vw] p-8 relative"
        @click.stop
      >
        <button
          @click="closeWelcomeModal"
          class="absolute top-6 right-6 text-3xl text-text-secondary hover:text-text-primary transition-colors"
        >
          &times;
        </button>

        <h2 class="text-2xl font-bold text-text-primary mb-6">Update welcome message</h2>

        <div class="text-base font-normal text-text-primary mb-2">Message *</div>
        <div class="text-sm text-text-secondary mb-4">Candidates will see this when they enter the interview lobby. Keep it short and simple.</div>

        <div class="bg-gray-50 rounded-lg border border-border-default mb-6 overflow-hidden">
          <div class="flex gap-1 px-4 py-3 bg-gray-100 border-b border-border-default">
            <button class="w-8 h-8 rounded hover:bg-gray-200 flex items-center justify-center font-bold">B</button>
            <button class="w-8 h-8 rounded hover:bg-gray-200 flex items-center justify-center italic">I</button>
            <button class="w-8 h-8 rounded hover:bg-gray-200 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <path d="M5 3h8M5 7h8M5 11h8M2 3h0M2 7h0M2 11h0" />
              </svg>
            </button>
          </div>
          <textarea class="w-full p-4 resize-none font-inherit text-base outline-none" placeholder="" rows="6"></textarea>
        </div>

        <div class="flex justify-end gap-3">
          <button
            @click="closeWelcomeModal"
            class="px-6 py-2.5 text-base font-bold text-text-primary hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button class="px-7 py-2.5 text-base font-bold text-white bg-brand-blue hover:bg-brand-blue-dark rounded-lg transition-colors">
            Save
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ═══ ADD TEAM MEMBERS MODAL ═══ -->
  <Teleport to="body">
    <div
      v-show="teamModalOpen"
      class="fixed inset-0 bg-black/45 z-50 flex items-center justify-center"
      @click="closeTeamModal"
    >
      <div
        class="bg-white rounded-2xl w-96 max-w-[90vw] p-8 relative"
        @click.stop
      >
        <button
          @click="closeTeamModal"
          class="absolute top-6 right-6 text-3xl text-text-secondary hover:text-text-primary transition-colors"
        >
          &times;
        </button>

        <h2 class="text-2xl font-bold text-text-primary mb-2">Add hiring team members</h2>
        <p class="text-base font-normal text-text-secondary mb-6">Invite hiring team members to help you out. They'll receive an email invite.</p>

        <div class="text-base font-normal text-text-primary mb-2">Email: *</div>
        <div class="text-sm text-text-secondary mb-4">Separate each email with a comma</div>

        <div class="relative mb-6">
          <input type="text" placeholder="" class="w-full px-4 py-3 border border-border-default rounded-lg outline-none focus:border-brand-blue" />
          <div class="absolute right-3 top-3 text-text-secondary">
            <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
              <circle cx="8" cy="8" r="6" />
              <circle cx="5.5" cy="8" r="1" fill="#fff" />
              <circle cx="8" cy="8" r="1" fill="#fff" />
              <circle cx="10.5" cy="8" r="1" fill="#fff" />
            </svg>
          </div>
        </div>

        <div class="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div class="text-sm font-bold text-text-primary mb-3">Invited (1)</div>
          <div class="text-sm text-text-secondary">scott@jobfairx.com</div>
        </div>

        <div class="flex justify-end gap-3">
          <button
            @click="closeTeamModal"
            class="px-6 py-2.5 text-base font-bold text-text-primary hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button class="px-7 py-2.5 text-base font-bold text-white bg-brand-blue hover:bg-brand-blue-dark rounded-lg transition-colors">
            Send
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ═══ AV TEST MODAL ═══ -->
  <Teleport to="body">
    <div
      v-show="avModalOpen"
      class="fixed inset-0 bg-black/55 z-50 flex items-center justify-center"
      @click="closeAvModal"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
        @click.stop
      >
        <button
          @click="closeAvModal"
          class="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-text-secondary text-2xl z-10 transition-colors"
        >
          &times;
        </button>

        <!-- Step 1 -->
        <div v-show="!avStep2Visible" class="px-10 py-16 text-center">
          <h2 class="text-2xl font-bold text-text-primary mb-8">To join the interview, allow microphone access</h2>

          <svg class="w-72 h-52 mx-auto mb-8" viewBox="0 0 280 200" fill="none">
            <ellipse cx="140" cy="115" rx="105" ry="85" fill="#f5deb3" opacity="0.35" />
            <ellipse cx="125" cy="125" rx="80" ry="70" fill="#f5deb3" opacity="0.25" />
            <rect x="50" y="40" width="180" height="115" rx="8" fill="#3a6b7c" />
            <rect x="57" y="46" width="166" height="102" rx="4" fill="#c8dae4" />
            <rect x="62" y="51" width="156" height="92" rx="2" fill="#dde8f0" />
            <circle cx="140" cy="43" r="2" fill="#5a8a9a" />
            <rect x="86" y="66" width="108" height="62" rx="5" fill="#fff" stroke="#e0e0e0" stroke-width="1" />
            <rect x="96" y="75" width="14" height="10" rx="2" fill="#3a6b7c" />
            <polygon points="110,76 116,80 110,84" fill="#3a6b7c" />
            <rect x="122" y="76" width="54" height="3.5" rx="1.5" fill="#c8c8c8" />
            <rect x="122" y="82" width="36" height="3.5" rx="1.5" fill="#d8d8d8" />
            <rect x="99" y="94" width="7" height="12" rx="3.5" fill="#3a6b7c" />
            <path d="M96 103 C96 108 109 108 109 103" stroke="#3a6b7c" stroke-width="1.2" fill="none" />
            <rect x="101.5" y="107" width="2" height="3.5" fill="#3a6b7c" />
            <rect x="122" y="96" width="54" height="3.5" rx="1.5" fill="#c8c8c8" />
            <rect x="122" y="102" width="40" height="3.5" rx="1.5" fill="#d8d8d8" />
            <rect x="96" y="115" width="16" height="12" rx="3" fill="#2e7d32" />
            <polyline points="100,121 103,124.5 108,118" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round" />
            <rect x="38" y="155" width="204" height="7" rx="3.5" fill="#3a6b7c" />
            <rect x="115" y="151" width="50" height="4" rx="2" fill="#5a8a9a" />
          </svg>

          <p class="text-lg text-text-secondary mb-12">For others to hear you, your browser will request access to your microphone</p>

          <button
            @click="goToStep2"
            class="px-7 py-3 text-lg font-bold text-white bg-brand-blue hover:bg-brand-blue-dark rounded-lg transition-colors"
          >
            Give access
          </button>
        </div>

        <!-- Step 2 -->
        <div v-show="avStep2Visible" class="p-9">
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-text-primary mb-1">Test video and audio connection</h2>
            <p class="text-base text-text-secondary">Checking your connection helps ensure a smooth interview experience.</p>
          </div>

          <div class="flex gap-6 border-b border-gray-200 mb-5 pb-5">
            <button class="text-base font-semibold text-text-primary border-b-2 border-text-primary">Settings</button>
            <button class="text-base font-normal text-text-secondary">Backgrounds</button>
          </div>

          <div class="flex gap-5">
            <!-- Left -->
            <div class="flex-1">
              <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-4">
                <svg class="w-6 h-6 flex-shrink-0 mb-3" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L1 22h22L12 2z" fill="#d4956b" stroke="#c17f59" stroke-width="0.8" />
                  <text x="12" y="18" font-size="12" font-weight="800" fill="#fff" text-anchor="middle" font-family="sans-serif">!</text>
                </svg>
                <div class="text-sm text-text-secondary">
                  <strong class="block text-text-primary mb-1">Network Access Reminder</strong>
                  If your company has a restrictive network, ask your IT team to update your settings before conducting interviews.
                </div>
              </div>

              <div class="bg-gradient-to-b from-sky-400 to-blue-300 rounded-2xl aspect-video flex items-center justify-center">
                <div class="text-center text-white">
                  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" class="w-14 h-14 mx-auto mb-2">
                    <rect x="4" y="12" width="40" height="30" rx="4" />
                    <polygon points="44,20 58,14 58,38 44,32" />
                    <circle cx="24" cy="27" r="6" />
                  </svg>
                  <p class="text-sm">Camera preview</p>
                </div>
              </div>
            </div>

            <!-- Right -->
            <div class="w-64 flex flex-col gap-3.5">
              <!-- Microphone -->
              <div class="bg-gray-100 rounded-2xl p-4">
                <div class="text-base font-bold text-text-primary mb-2.5">Microphone</div>
                <select class="w-full px-3 py-2 border border-border-default rounded-lg text-sm font-inherit mb-2.5">
                  <option>Default - MacBook Pro M...</option>
                </select>
                <div class="flex items-center gap-1.5 mb-2">
                  <span class="text-xs text-text-secondary whitespace-nowrap">Microphone Input:</span>
                  <div class="flex gap-1 flex-1">
                    <div class="w-2 h-3 rounded-sm bg-green-600"></div>
                    <div class="w-2 h-3 rounded-sm bg-green-600"></div>
                    <div class="w-2 h-3 rounded-sm bg-green-600"></div>
                    <div class="w-2 h-3 rounded-sm bg-green-600"></div>
                    <div class="w-2 h-3 rounded-sm bg-green-600"></div>
                    <div class="w-2 h-3 rounded-sm bg-gray-300"></div>
                    <div class="w-2 h-3 rounded-sm bg-gray-300"></div>
                    <div class="w-2 h-3 rounded-sm bg-gray-300"></div>
                  </div>
                </div>
                <label class="flex items-center gap-2 cursor-pointer text-sm text-text-primary">
                  <input type="checkbox" class="hidden peer" />
                  <div class="w-5 h-5 border-2 border-border-default rounded peer-checked:bg-brand-blue peer-checked:border-brand-blue flex items-center justify-center">
                    <svg v-if="true" viewBox="0 0 12 12" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3">
                      <polyline points="2 6 4.5 9 10 3" />
                    </svg>
                  </div>
                  Suppress background noise
                </label>
              </div>

              <!-- Speaker -->
              <div class="bg-gray-100 rounded-2xl p-4">
                <div class="text-base font-bold text-text-primary mb-2.5">Speaker</div>
                <select class="w-full px-3 py-2 border border-border-default rounded-lg text-sm font-inherit mb-2.5">
                  <option>Default - MacBook Pro S...</option>
                </select>
                <button class="text-sm font-bold text-brand-blue hover:underline">Test speaker</button>
              </div>

              <!-- Camera -->
              <div class="bg-gray-100 rounded-2xl p-4">
                <div class="text-base font-bold text-text-primary mb-2.5">Camera</div>
                <select class="w-full px-3 py-2 border border-border-default rounded-lg text-sm font-inherit mb-2.5">
                  <option>MacBook Pro Camera</option>
                </select>
                <label class="flex items-center gap-2 cursor-pointer text-sm text-text-primary mb-2">
                  <input type="checkbox" checked class="hidden peer" />
                  <div class="w-5 h-5 border-2 border-brand-blue bg-brand-blue rounded peer-checked:border-brand-blue flex items-center justify-center">
                    <svg viewBox="0 0 12 12" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3">
                      <polyline points="2 6 4.5 9 10 3" />
                    </svg>
                  </div>
                  Mirror my video
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-sm text-text-primary">
                  <input type="checkbox" class="hidden peer" />
                  <div class="w-5 h-5 border-2 border-border-default rounded peer-checked:bg-brand-blue peer-checked:border-brand-blue flex items-center justify-center">
                    <svg v-if="true" viewBox="0 0 12 12" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3">
                      <polyline points="2 6 4.5 9 10 3" />
                    </svg>
                  </div>
                  Blur background
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ═══ RESUME MODAL ═══ -->
  <Teleport to="body">
    <div
      v-show="resumeModalOpen"
      class="fixed inset-0 bg-black/45 z-50 flex items-center justify-center overflow-y-auto"
      @click="closeResumeModal"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-2xl my-8 relative mx-4"
        @click.stop
      >
        <div class="px-8 py-6 border-b border-gray-200">
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="text-2xl font-bold text-text-primary">
                <span v-if="resumeSourceCandidate" id="resumeName">{{ resumeSourceCandidate.name }}</span>
              </div>
              <div v-if="resumeSourceCandidate" class="text-base text-text-secondary mt-1">
                {{ resumeSourceCandidate.jobTitle }}<span v-if="resumeSourceCandidate.location"> · {{ resumeSourceCandidate.location }}</span>
              </div>
            </div>
            <button
              @click="closeResumeModal"
              class="text-3xl text-text-secondary hover:text-text-primary transition-colors"
            >
              &times;
            </button>
          </div>

          <div v-if="resumeSourceCandidate" class="flex gap-4 text-sm text-text-secondary">
            <span>{{ getResumeData(resumeSourceCandidate.name)?.email || 'candidate@email.com' }}</span>
            <span>{{ getResumeData(resumeSourceCandidate.name)?.phone || '(555) 555-0000' }}</span>
            <span>{{ getResumeData(resumeSourceCandidate.name)?.location || resumeSourceCandidate.location || 'Dallas, TX' }}</span>
          </div>
        </div>

        <div class="px-8 py-6">
          <div v-if="resumeSourceCandidate && getResumeData(resumeSourceCandidate.name)" id="resumeBody">
            <div v-for="job in getResumeData(resumeSourceCandidate.name)?.jobs" :key="job.title + job.company" class="mb-6">
              <div class="text-lg font-bold text-text-primary mb-1">{{ job.title }}</div>
              <div class="text-base text-text-secondary mb-1">{{ job.company }}</div>
              <div class="text-sm text-text-tertiary mb-3">{{ job.dates }}</div>
              <ul class="list-disc list-inside space-y-1">
                <li v-for="bullet in job.bullets" :key="bullet" class="text-base text-text-secondary">{{ bullet }}</li>
              </ul>
            </div>

            <div class="border-t border-gray-200 py-6 mt-6">
              <div class="text-lg font-bold text-text-primary mb-3">Education</div>
              <div class="text-base text-text-primary">{{ getResumeData(resumeSourceCandidate.name)?.education.degree }}</div>
              <div class="text-base text-text-secondary">{{ getResumeData(resumeSourceCandidate.name)?.education.school }}</div>
              <div class="text-sm text-text-tertiary">{{ getResumeData(resumeSourceCandidate.name)?.education.dates }}</div>
            </div>

            <div class="border-t border-gray-200 py-6 mt-6">
              <div class="text-lg font-bold text-text-primary mb-3">Skills</div>
              <div class="flex flex-wrap gap-2">
                <span v-for="skill in getResumeData(resumeSourceCandidate.name)?.skills" :key="skill" class="px-3 py-1.5 bg-gray-100 text-text-secondary text-sm rounded-full">
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="resumeSourceCandidate && pendingCandidates.some(c => c.name === resumeSourceCandidate?.name)" class="px-8 py-6 border-t border-gray-200 flex items-center gap-3">
          <button @click="acceptFromResume" class="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors">
            Accept
          </button>
          <button @click="declineFromResume" class="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors">
            Decline
          </button>
          <button @click="resumeSourceCandidate &amp;&amp; openScheduleModal(resumeSourceCandidate); closeResumeModal()" class="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            Reschedule
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ═══ MESSAGE MODAL ═══ -->
  <Teleport to="body">
    <div
      v-show="msgModalOpen"
      class="fixed inset-0 bg-black/45 z-50 flex items-center justify-center"
      @click="closeMsgModal"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col relative"
        @click.stop
      >
        <div class="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <div class="text-lg font-bold text-text-primary">Send Message</div>
            <div class="text-base text-text-secondary">{{ msgModalTo }}</div>
          </div>
          <button
            @click="closeMsgModal"
            class="text-3xl text-text-secondary hover:text-text-primary transition-colors"
          >
            &times;
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div v-for="(msg, idx) in msgMessages" :key="idx" class="flex" :class="{ 'flex-row-reverse': msg.sender === 'employer' }">
            <div
              :class="[
                'rounded-2xl px-4 py-2.5 max-w-xs',
                msg.sender === 'employer' ? 'bg-blue-100 text-text-primary' : msg.sender === 'system' ? 'bg-gray-100 text-text-primary' : 'bg-gray-50 text-text-primary'
              ]"
            >
              {{ msg.text }}
              <div v-if="msg.detail" class="text-sm font-semibold text-text-primary mt-1">{{ msg.detail }}</div>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-200">
          <div class="text-right text-sm text-text-secondary mb-3">
            <span id="msgCharCount">{{ msgCharCount }}</span> / 2000
          </div>
          <textarea
            v-model="msgTextarea"
            @input="updateMsgCharCount"
            maxlength="2000"
            placeholder="Write a message..."
            class="w-full px-4 py-3 border border-border-default rounded-lg resize-none outline-none focus:border-brand-blue mb-3"
            rows="4"
          ></textarea>
          <div class="flex justify-end gap-3">
            <button
              @click="closeMsgModal"
              class="px-6 py-2.5 text-base font-bold text-text-primary hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              @click="sendMessage"
              class="px-6 py-2.5 text-base font-bold text-white bg-brand-blue hover:bg-brand-blue-dark rounded-lg transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ═══ SCHEDULE MODAL ═══ -->
  <Teleport to="body">
    <div
      v-show="scheduleModalOpen"
      class="fixed inset-0 bg-black/45 z-50 flex items-center justify-center"
      @click="closeScheduleModal"
    >
      <div
        class="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col relative"
        @click.stop
      >
        <div class="px-6 py-5 border-b border-border-default flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-text-primary">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-text-primary">{{ scheduleModalTitle }}</h3>
          </div>
          <button
            @click="closeScheduleModal"
            class="w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5.5 h-5.5 text-text-tertiary">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-6 py-6">
          <div class="space-y-5 mb-6">
            <div v-for="(slot, idx) in scheduleSlots" :key="idx" class="flex gap-5 items-end">
              <div class="flex-1">
                <label class="block text-sm font-semibold text-text-primary mb-2">Interview Date <span class="text-red-700">*</span></label>
                <input
                  v-model="slot.date"
                  type="date"
                  :min="getTodayISO()"
                  class="w-full px-3.5 py-3 border border-border-default rounded-lg text-sm font-inherit outline-none focus:border-brand-blue"
                />
              </div>
              <div class="flex-1">
                <label class="block text-sm font-semibold text-text-primary mb-2">Start Time (CDT) <span class="text-red-700">*</span></label>
                <select v-model="slot.time" class="w-full px-3.5 py-3 border border-border-default rounded-lg text-sm font-inherit outline-none focus:border-brand-blue">
                  <option value="">Start time</option>
                  <option v-for="time in SCHEDULE_TIME_OPTIONS" :key="time" :value="time">{{ time }}</option>
                </select>
              </div>
              <button
                v-if="scheduleSlots.length > 1"
                @click="removeScheduleSlot(idx)"
                class="w-8 h-11 rounded flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <button
            @click="addScheduleSlot"
            class="flex items-center gap-2.5 text-sm font-semibold text-brand-blue hover:underline mb-6"
          >
            <span class="w-5.5 h-5.5 rounded-full bg-brand-blue text-white flex items-center justify-center text-base font-bold">+</span>
            Suggest multiple times
          </button>

          <label class="block text-sm font-semibold text-text-primary mb-2">Message to Candidate</label>
          <textarea
            v-model="scheduleTextarea"
            placeholder="Type your message here."
            class="w-full px-4 py-3 border border-border-default rounded-lg resize-none outline-none focus:border-brand-blue"
            rows="5"
          ></textarea>
        </div>

        <div class="px-6 py-4.5 border-t border-border-default flex justify-end gap-3">
          <button
            @click="closeScheduleModal"
            class="px-5 py-2.5 text-sm font-semibold text-text-primary hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="submitScheduleModal"
            class="px-5 py-2.5 text-sm font-semibold text-white bg-brand-blue hover:bg-brand-blue-dark rounded-lg transition-colors flex items-center gap-1.5"
          >
            Send
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ═══ DECLINE CONFIRMATION MODAL ═══ -->
  <Teleport to="body">
    <div
      v-show="declineModalOpen"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      @click="closeDeclineModal"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-md p-8 relative"
        @click.stop
      >
        <div class="text-2xl font-bold text-text-primary mb-4">Decline interview request</div>
        <div class="text-base text-text-secondary mb-6">
          Are you sure you want to decline the interview request from <span class="font-semibold">{{ declineCandidateName }}</span>? This action can't be undone and the candidate will be removed from your list.
        </div>

        <label class="flex items-center gap-2.5 cursor-pointer mb-6">
          <input v-model="declineDontAsk" type="checkbox" class="w-4 h-4 rounded border border-border-default accent-brand-blue" />
          <span class="text-sm text-text-secondary">Don't show this message when I decline</span>
        </label>

        <div class="flex justify-end gap-3">
          <button
            @click="closeDeclineModal"
            class="px-6 py-2.5 text-base font-bold text-text-primary hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmDecline"
            class="px-6 py-2.5 text-base font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ═══ FEEDBACK MODAL ═══ -->
  <Teleport to="body">
    <div
      v-show="feedbackModalOpen"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-5 overflow-y-auto"
      @click="closeFeedbackModal"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-2xl p-10 relative my-8"
        @click.stop
      >
        <button
          @click="closeFeedbackModal"
          class="absolute top-5 right-5 w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center text-text-tertiary text-2xl transition-colors"
        >
          &times;
        </button>

        <div class="text-3xl font-bold text-text-primary mb-1.5">Give Feedback</div>
        <div class="text-base text-text-tertiary mb-7">Help us make JobFairX better for you</div>

        <div class="mb-7">
          <div class="text-base font-bold text-text-primary mb-3.5">How's your experience? <span class="text-red-600">*</span></div>
          <div class="flex gap-2.5 justify-between">
            <button
              @click="selectExperience('amazing')"
              :class="[
                'flex flex-col items-center gap-2 px-2 py-4 rounded-2xl border-2 transition-all',
                fbExperience === 'amazing' ? 'border-brand-blue bg-blue-50' : 'border-gray-200 bg-white hover:border-brand-blue'
              ]"
            >
              <span class="text-4xl">😊</span>
              <span class="text-sm font-semibold" :class="fbExperience === 'amazing' ? 'text-brand-blue' : 'text-text-secondary'">Amazing</span>
            </button>
            <button
              @click="selectExperience('good')"
              :class="[
                'flex flex-col items-center gap-2 px-2 py-4 rounded-2xl border-2 transition-all',
                fbExperience === 'good' ? 'border-brand-blue bg-blue-50' : 'border-gray-200 bg-white hover:border-brand-blue'
              ]"
            >
              <span class="text-4xl">🙂</span>
              <span class="text-sm font-semibold" :class="fbExperience === 'good' ? 'text-brand-blue' : 'text-text-secondary'">Good</span>
            </button>
            <button
              @click="selectExperience('okay')"
              :class="[
                'flex flex-col items-center gap-2 px-2 py-4 rounded-2xl border-2 transition-all',
                fbExperience === 'okay' ? 'border-brand-blue bg-blue-50' : 'border-gray-200 bg-white hover:border-brand-blue'
              ]"
            >
              <span class="text-4xl">😐</span>
              <span class="text-sm font-semibold" :class="fbExperience === 'okay' ? 'text-brand-blue' : 'text-text-secondary'">Okay</span>
            </button>
            <button
              @click="selectExperience('poor')"
              :class="[
                'flex flex-col items-center gap-2 px-2 py-4 rounded-2xl border-2 transition-all',
                fbExperience === 'poor' ? 'border-brand-blue bg-blue-50' : 'border-gray-200 bg-white hover:border-brand-blue'
              ]"
            >
              <span class="text-4xl">😕</span>
              <span class="text-sm font-semibold" :class="fbExperience === 'poor' ? 'text-brand-blue' : 'text-text-secondary'">Poor</span>
            </button>
            <button
              @click="selectExperience('terrible')"
              :class="[
                'flex flex-col items-center gap-2 px-2 py-4 rounded-2xl border-2 transition-all',
                fbExperience === 'terrible' ? 'border-brand-blue bg-blue-50' : 'border-gray-200 bg-white hover:border-brand-blue'
              ]"
            >
              <span class="text-4xl">😠</span>
              <span class="text-sm font-semibold" :class="fbExperience === 'terrible' ? 'text-brand-blue' : 'text-text-secondary'">Terrible</span>
            </button>
          </div>
        </div>

        <!-- Followup cards (shown when rating selected) -->
        <div v-show="fbShowFollowups" class="mb-7 space-y-3">
          <div class="text-base font-bold text-text-primary mb-3.5">A few quick follow-ups <span class="font-normal text-text-tertiary">(optional)</span></div>

          <!-- Ease of setup -->
          <div class="flex items-center justify-between gap-5 p-4.5 bg-blue-50 border border-gray-200 rounded-2xl">
            <div>
              <div class="text-base font-bold text-text-primary mb-1">How easy was it to get started?</div>
              <div class="text-sm text-text-secondary">Signing up, adding jobs, going live</div>
            </div>
            <div class="flex gap-2 flex-shrink-0">
              <button
                @click="selectFollowup('setup', 'great')"
                :class="[
                  'px-3.5 py-2 text-sm font-semibold rounded-full border-2 transition-all',
                  fbFollowups['setup'] === 'great' ? 'border-brand-blue bg-blue-100 text-brand-blue' : 'border-gray-200 text-text-secondary hover:border-brand-blue'
                ]"
              >
                👍 Great
              </button>
              <button
                @click="selectFollowup('setup', 'okay')"
                :class="[
                  'px-3.5 py-2 text-sm font-semibold rounded-full border-2 transition-all',
                  fbFollowups['setup'] === 'okay' ? 'border-brand-blue bg-blue-100 text-brand-blue' : 'border-gray-200 text-text-secondary hover:border-brand-blue'
                ]"
              >
                👌 Okay
              </button>
              <button
                @click="selectFollowup('setup', 'needs-work')"
                :class="[
                  'px-3.5 py-2 text-sm font-semibold rounded-full border-2 transition-all',
                  fbFollowups['setup'] === 'needs-work' ? 'border-brand-blue bg-blue-100 text-brand-blue' : 'border-gray-200 text-text-secondary hover:border-brand-blue'
                ]"
              >
                👎 Needs work
              </button>
            </div>
          </div>

          <!-- Quality of candidates -->
          <div class="flex items-center justify-between gap-5 p-4.5 bg-blue-50 border border-gray-200 rounded-2xl">
            <div>
              <div class="text-base font-bold text-text-primary mb-1">Quality of candidates you met?</div>
              <div class="text-sm text-text-secondary">Fit, relevance, and engagement of the applicants</div>
            </div>
            <div class="flex gap-2 flex-shrink-0">
              <button
                @click="selectFollowup('candidates', 'great')"
                :class="[
                  'px-3.5 py-2 text-sm font-semibold rounded-full border-2 transition-all',
                  fbFollowups['candidates'] === 'great' ? 'border-brand-blue bg-blue-100 text-brand-blue' : 'border-gray-200 text-text-secondary hover:border-brand-blue'
                ]"
              >
                👍 Great
              </button>
              <button
                @click="selectFollowup('candidates', 'okay')"
                :class="[
                  'px-3.5 py-2 text-sm font-semibold rounded-full border-2 transition-all',
                  fbFollowups['candidates'] === 'okay' ? 'border-brand-blue bg-blue-100 text-brand-blue' : 'border-gray-200 text-text-secondary hover:border-brand-blue'
                ]"
              >
                👌 Okay
              </button>
              <button
                @click="selectFollowup('candidates', 'needs-work')"
                :class="[
                  'px-3.5 py-2 text-sm font-semibold rounded-full border-2 transition-all',
                  fbFollowups['candidates'] === 'needs-work' ? 'border-brand-blue bg-blue-100 text-brand-blue' : 'border-gray-200 text-text-secondary hover:border-brand-blue'
                ]"
              >
                👎 Needs work
              </button>
            </div>
          </div>

          <!-- Interview experience -->
          <div class="flex items-center justify-between gap-5 p-4.5 bg-blue-50 border border-gray-200 rounded-2xl">
            <div>
              <div class="text-base font-bold text-text-primary mb-1">How was the interview experience?</div>
              <div class="text-sm text-text-secondary">Video, audio, scheduling, reliability during interviews</div>
            </div>
            <div class="flex gap-2 flex-shrink-0">
              <button
                @click="selectFollowup('interview', 'great')"
                :class="[
                  'px-3.5 py-2 text-sm font-semibold rounded-full border-2 transition-all',
                  fbFollowups['interview'] === 'great' ? 'border-brand-blue bg-blue-100 text-brand-blue' : 'border-gray-200 text-text-secondary hover:border-brand-blue'
                ]"
              >
                👍 Great
              </button>
              <button
                @click="selectFollowup('interview', 'okay')"
                :class="[
                  'px-3.5 py-2 text-sm font-semibold rounded-full border-2 transition-all',
                  fbFollowups['interview'] === 'okay' ? 'border-brand-blue bg-blue-100 text-brand-blue' : 'border-gray-200 text-text-secondary hover:border-brand-blue'
                ]"
              >
                👌 Okay
              </button>
              <button
                @click="selectFollowup('interview', 'needs-work')"
                :class="[
                  'px-3.5 py-2 text-sm font-semibold rounded-full border-2 transition-all',
                  fbFollowups['interview'] === 'needs-work' ? 'border-brand-blue bg-blue-100 text-brand-blue' : 'border-gray-200 text-text-secondary hover:border-brand-blue'
                ]"
              >
                👎 Needs work
              </button>
            </div>
          </div>
        </div>

        <!-- Textarea -->
        <div class="mb-7">
          <div class="text-base font-bold text-text-primary mb-2.5">Anything else? <span class="font-normal text-text-tertiary">(optional)</span></div>
          <div class="relative">
            <textarea
              v-model="fbText"
              @input="updateFbCount"
              maxlength="500"
              placeholder="Tell us more about your experience..."
              class="w-full px-4 py-3 border border-border-default rounded-2xl resize-none outline-none focus:border-brand-blue"
              rows="4"
            ></textarea>
            <div class="absolute bottom-3 right-4 text-xs text-text-tertiary pointer-events-none">
              <span>{{ fbCharCount }}</span>/500
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-3">
          <button
            @click="closeFeedbackModal"
            class="px-6 py-3 text-base font-bold text-text-primary hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="submitFeedback"
            :disabled="!fbExperience"
            class="px-6 py-3 text-base font-bold text-white rounded-lg transition-colors"
            :class="fbExperience ? 'bg-brand-blue hover:bg-brand-blue-dark' : 'bg-gray-300 cursor-not-allowed'"
          >
            Submit feedback
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ═══ TOASTS ═══ -->
  <Teleport to="body">
    <div
      v-show="acceptToastVisible"
      class="fixed bottom-7 left-1/2 transform -translate-x-1/2 bg-text-primary text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-4 max-w-sm"
    >
      <span class="text-sm font-semibold">{{ acceptToastMsg }}</span>
      <button @click="undoAccept" class="text-sm font-bold underline hover:opacity-80">Undo</button>
    </div>

    <div
      v-show="declineToastVisible"
      class="fixed bottom-7 left-1/2 transform -translate-x-1/2 bg-text-primary text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-4 max-w-sm"
    >
      <span class="text-sm font-semibold">{{ declineToastMsg }}</span>
      <button @click="undoDecline" class="text-sm font-bold underline hover:opacity-80">Undo</button>
    </div>
  </Teleport>
</template>
