<!--
  EditPostPage
  ------------
  Edit a job post (edit the jobs at an event). Shows package usage tracking,
  empty state when no jobs (with CTA), and hidden add-row when incomplete.
  Known bug fix: when jobsIncomplete=true, the add-row at the bottom must be
  hidden — this CTA lives inside the empty card instead.

  Modals:
  - EditJobModal: fully built (placeholder)
  - Stubs: other modals
-->
<script setup lang="ts">
import { computed } from 'vue'
import StatusCard from '@/components/base/StatusCard.vue'
import InterviewingForSection from '@/components/edit-post/InterviewingForSection.vue'
import EditJobModal from '@/components/edit-post/modals/EditJobModal.vue'
import { MOCK_EDIT_POST } from '@/data/edit-post-mock'

const state = MOCK_EDIT_POST

const eventDisplayText = computed<string>(() => {
  return `${state.event.title}<br>${state.event.date} · ${state.event.timeRange}`
})

const interviewDetailsText = computed<string>(() => {
  return `${state.interviewDetails.interviewsPerSlot} spots available for each ${state.interviewDetails.slotDurationMins}-minute time slot | Start Advertising Date: ${state.interviewDetails.startAdvertisingDate} | Attendance instructions added`
})
</script>

<template>
  <main class="container-page max-w-2xl mx-auto pb-16">
    <!-- Back link -->
    <a href="#" class="back-link">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      Back to dashboard
    </a>

    <!-- Header card -->
    <div class="header-card">
      <div class="header-text">
        <h1>Edit your Jobs<br />& Settings</h1>
      </div>
      <svg class="header-illustration" viewBox="0 0 140 100" fill="none">
        <rect x="10" y="52" width="110" height="34" rx="4" fill="#f0ebe4" />
        <rect x="22" y="36" width="44" height="32" rx="4" fill="#e0d6ca" />
        <rect
          x="27"
          y="41"
          width="34"
          height="22"
          rx="2"
          fill="#fff"
          stroke="#d4c4b0"
          stroke-width="1"
        />
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

    <!-- Event details section -->
    <StatusCard>
      <div class="section-inner">
        <h2 class="section-title">Event details</h2>
        <div class="section-divider"></div>
        <p class="summary-text" v-html="eventDisplayText"></p>
      </div>
    </StatusCard>

    <!-- Interviewing For section (the main content) -->
    <div class="section-wrapper">
      <div class="section-header">
        <h2 class="section-title">Interviewing For</h2>
        <!-- TODO: incomplete badge when jobsIncomplete=true -->
      </div>
      <div class="section-divider"></div>
      <InterviewingForSection
        :jobs="state.jobs"
        :package-tier="state.package.tier"
        :jobs-used="state.package.jobsUsed"
        :jobs-limit="state.package.jobsLimit"
        :jobs-incomplete="state.jobsIncomplete"
      />
    </div>

    <!-- Interview details section -->
    <StatusCard>
      <div class="section-inner">
        <h2 class="section-title">Interview details</h2>
        <div class="section-divider"></div>
        <p class="summary-text" v-html="interviewDetailsText"></p>
      </div>
    </StatusCard>

    <!-- Modals -->
    <EditJobModal />
  </main>
</template>

<style scoped>
.container-page {
  @apply px-8 pt-8;
}

.back-link {
  @apply inline-flex items-center gap-1.5 text-base font-semibold text-brand-blue no-underline mb-7;
  cursor: pointer;
}

.back-link:hover {
  @apply underline;
}

.back-link svg {
  width: 16px;
  height: 16px;
}

.header-card {
  @apply bg-surface-raised border border-border-strong rounded-lg p-10 mb-7;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-text h1 {
  @apply text-4xl font-bold text-text-primary;
  line-height: 1.25;
}

.header-illustration {
  width: 140px;
  height: 100px;
  flex-shrink: 0;
}

.section-wrapper {
  @apply bg-surface-raised border border-border-strong rounded-lg mb-7 overflow-hidden;
}

.section-header {
  @apply flex items-center justify-between px-9 pt-7;
}

.section-title {
  @apply text-2xl font-bold text-text-primary;
}

.section-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 18px 36px 0;
}

.section-inner {
  padding: 26px 36px 32px;
}

.summary-text {
  @apply text-base text-text-secondary leading-relaxed;
}
</style>
