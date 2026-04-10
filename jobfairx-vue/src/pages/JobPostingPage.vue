<!--
  JobPostingPage
  ---------------
  Job posting landing page. Displays job details, event context, and actions
  (Schedule interview, Save).

  Source: Employer-Dashboard/job-posting.html
-->
<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import StatusCard from '@/components/base/StatusCard.vue'
import type { JobPosting } from '@/types/job-post'

// Mock data — replace with API call when backend lands
const job = ref<JobPosting>({
  id: 'job-1',
  title: 'Registered Nurse',
  company: 'JobFairX Healthcare Partners',
  location: 'Dallas, TX',
  remoteEligible: true,
  employment: 'Full-time',
  salaryMin: 55000,
  salaryMax: 72000,
  tags: ['Full-time', '$55,000 – $72,000/year', 'Remote eligible', 'Healthcare'],
  details: {
    jobType: 'Full-time',
    pay: '$55,000 – $72,000 a year',
    location: 'Dallas, TX (Remote eligible)',
    interviewType: 'Virtual interview via video',
  },
  sections: [
    {
      title: 'Responsibilities',
      content: [
        'Provide direct patient care including assessment, planning, implementation, and evaluation',
        'Administer medications and treatments as prescribed by physicians',
        'Monitor and record patient conditions, vital signs, and medical information',
        'Collaborate with doctors, specialists, and other healthcare professionals',
        'Educate patients and families on health management and disease prevention',
        'Maintain accurate and detailed patient records',
      ],
    },
    {
      title: 'Requirements',
      content: [
        'Active RN license in the state of Texas',
        'Bachelor of Science in Nursing (BSN) preferred',
        'Minimum 1 year of clinical nursing experience',
        'BLS and ACLS certification required',
        'Strong communication and critical thinking skills',
        'Experience with electronic health records (EHR) systems',
      ],
    },
    {
      title: 'Benefits',
      content: [
        'Comprehensive health, dental, and vision insurance',
        '401(k) with employer match',
        'Paid time off and holiday pay',
        'Continuing education reimbursement',
        'Flexible scheduling options',
      ],
    },
  ],
})

const event = ref({
  title: 'Dallas Healthcare Hiring Event',
  date: 'April 22, 2026',
  time: '11:00 AM – 3:00 PM CT',
  type: 'Virtual interviews',
})

const handleSchedule = (): void => {
  // TODO: wire to modal or form
  console.log('Schedule interview clicked')
}

const handleSave = (): void => {
  // TODO: wire to save action
  console.log('Save job clicked')
}
</script>

<template>
  <main class="bg-surface-sunken min-h-screen">
    <div class="container-page max-w-3xl mx-auto pb-16">
      <!-- Event context banner -->
      <div
        class="mt-6 mb-4 bg-brand-blue-light border border-blue-300 rounded-lg p-5 flex items-center gap-4"
      >
        <div
          class="w-12 h-12 rounded-md bg-brand-blue flex items-center justify-center flex-shrink-0"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="w-6 h-6 text-text-inverse"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div>
          <h2 class="text-md font-semibold text-brand-blue">{{ event.title }}</h2>
          <p class="text-sm text-text-secondary mt-1">
            {{ event.date }} • {{ event.time }} • {{ event.type }}
          </p>
        </div>
      </div>

      <!-- Job header card -->
      <StatusCard class="mb-4">
        <div class="p-7">
          <h1 class="text-3xl font-bold text-text-primary mb-1.5">{{ job.title }}</h1>
          <div class="text-lg font-semibold text-brand-blue mb-1">{{ job.company }}</div>
          <div class="text-sm text-text-secondary mb-4">{{ job.location }}</div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="(tag, idx) in job.tags"
              :key="idx"
              class="px-3.5 py-1.5 rounded-full text-sm font-medium bg-surface-sunken text-text-primary"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Action buttons -->
          <div class="flex gap-2.5">
            <BaseButton variant="primary" @click="handleSchedule">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="w-4 h-4"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Schedule an interview
            </BaseButton>
            <BaseButton variant="secondary" @click="handleSave">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="w-4 h-4"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
              Save
            </BaseButton>
          </div>
        </div>
      </StatusCard>

      <!-- Job details card -->
      <StatusCard class="mb-4">
        <div class="p-7">
          <h2 class="text-xl font-bold text-text-primary mb-4">Job details</h2>
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="w-5 h-5 text-text-tertiary flex-shrink-0 mt-0.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <div>
                <div class="text-xs text-text-tertiary">Job type</div>
                <div class="text-sm font-medium text-text-primary">{{ job.details.jobType }}</div>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="w-5 h-5 text-text-tertiary flex-shrink-0 mt-0.5"
              >
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
              <div>
                <div class="text-xs text-text-tertiary">Pay</div>
                <div class="text-sm font-medium text-text-primary">{{ job.details.pay }}</div>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="w-5 h-5 text-text-tertiary flex-shrink-0 mt-0.5"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <div class="text-xs text-text-tertiary">Location</div>
                <div class="text-sm font-medium text-text-primary">{{ job.details.location }}</div>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="w-5 h-5 text-text-tertiary flex-shrink-0 mt-0.5"
              >
                <path d="M15 10l-4 4l6 6l4-16l-18 7l4 2l2 6l3-4" />
              </svg>
              <div>
                <div class="text-xs text-text-tertiary">Interview type</div>
                <div class="text-sm font-medium text-text-primary">{{ job.details.interviewType }}</div>
              </div>
            </div>
          </div>
        </div>
      </StatusCard>

      <!-- Full description -->
      <StatusCard>
        <div class="p-7">
          <h2 class="text-xl font-bold text-text-primary mb-4">Full job description</h2>

          <p class="text-sm text-text-secondary mb-5 leading-relaxed">
            We are seeking a compassionate and skilled Registered Nurse to join our healthcare
            team. The ideal candidate will provide high-quality patient care in a fast-paced
            environment and collaborate with a multidisciplinary team.
          </p>

          <div v-for="(section, idx) in job.sections" :key="idx" class="mb-5">
            <h3 class="text-lg font-bold text-text-primary mb-2.5">{{ section.title }}</h3>
            <ul class="space-y-1">
              <li v-for="(item, itemIdx) in section.content" :key="itemIdx">
                <span class="text-sm text-text-secondary leading-relaxed">
                  • {{ item }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </StatusCard>
    </div>
  </main>
</template>
