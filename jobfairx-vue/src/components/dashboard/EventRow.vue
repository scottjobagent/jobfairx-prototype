<!--
  EventRow
  --------
  A single row in the events table. Displays event details, status, and action buttons.
  Matches the tr.ev-row elements in visual.html.
-->
<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useModal } from '@/composables/useModal'
import type { DashboardEvent } from '@/types/dashboard'

defineProps<{
  event: DashboardEvent
}>()

const { open } = useModal()

const showMenu = ref(false)

const onEdit = (event: DashboardEvent): void => {
  // TODO: wire to real edit action
  open('eventEdit', { event })
}

const onInterviewSettings = (event: DashboardEvent): void => {
  open('interviewSettings', { event })
}

const onCompleteSetup = (event: DashboardEvent): void => {
  open('setupComplete', { event })
}
</script>

<template>
  <tr class="hover:bg-surface-sunken transition-colors">
    <!-- Actions -->
    <td class="py-6 px-6 whitespace-nowrap">
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="w-10 h-10 rounded border border-border-default hover:bg-brand-blue-light hover:border-brand-blue transition-colors flex items-center justify-center text-brand-blue"
          title="Edit"
          @click="onEdit(event)"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path
              d="M16.293 2.293a2.828 2.828 0 114 4l-11 11a1 1 0 01-.39.242l-4.5 1.5a.75.75 0 01-.942-.942l1.5-4.5a1 1 0 01.242-.39l11.09-11.09z"
            />
          </svg>
        </button>
        <div class="relative">
          <button
            type="button"
            class="w-10 h-10 rounded border border-border-default hover:bg-brand-blue-light hover:border-brand-blue transition-colors flex items-center justify-center text-brand-blue"
            @click="showMenu = !showMenu"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <circle cx="6" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="18" cy="12" r="2" />
            </svg>
          </button>
          <div
            v-if="showMenu"
            class="absolute top-12 left-0 bg-surface-raised border border-border-default rounded-lg shadow-menu z-10 min-w-max"
          >
            <button
              type="button"
              class="w-full px-5 py-3 text-left text-base text-text-primary hover:bg-surface-sunken transition-colors border-b border-border-default last:border-b-0"
              @click="onEdit(event); showMenu = false"
            >
              Edit
            </button>
            <button
              type="button"
              class="w-full px-5 py-3 text-left text-base text-text-primary hover:bg-surface-sunken transition-colors border-b border-border-default last:border-b-0"
            >
              Share
            </button>
            <button
              type="button"
              class="w-full px-5 py-3 text-left text-base text-text-primary hover:bg-surface-sunken transition-colors"
            >
              Go to lobby
            </button>
          </div>
        </div>
        <BaseButton
          v-if="!event.setupComplete"
          variant="primary"
          size="sm"
          @click="onCompleteSetup(event)"
        >
          Complete setup
        </BaseButton>
      </div>
    </td>

    <!-- Event Details -->
    <td class="py-6 px-6">
      <div class="text-base font-normal text-text-primary">{{ event.name }}</div>
      <div class="mt-1 text-base text-text-primary">
        <span class="font-normal">{{ event.date }}</span>
        <span class="text-text-tertiary"> &middot; {{ event.time }}</span>
      </div>
      <div class="mt-2 text-sm text-text-secondary">
        <span>{{ event.packageTier }}</span>
        <span class="text-text-tertiary"> &middot; </span>
        <span>Jobs {{ event.jobsCount }}</span>
        <span class="text-text-tertiary"> &middot; </span>
        <span>Seats {{ event.seatsCount }}</span>
      </div>
      <div v-if="event.isSetupIncomplete" class="mt-2 inline-flex items-center gap-2 text-sm">
        <div class="w-2 h-2 rounded-full bg-status-danger"></div>
        <span class="font-semibold text-status-danger">Setup</span>
      </div>
    </td>

    <!-- Interview Location -->
    <td class="py-6 px-6">
      <div class="text-base text-text-primary">{{ event.interviewLocation }}</div>
      <button type="button" class="mt-2 text-base text-brand-blue underline hover:no-underline">
        Go to lobby
      </button>
      <div v-if="event.setupComplete" class="mt-2 flex items-center gap-2 text-sm font-semibold text-status-success">
        <div class="w-2 h-2 rounded-full bg-status-success"></div>
        Setup complete
      </div>
    </td>

    <!-- Interview Setup -->
    <td class="py-6 px-6">
      <button
        type="button"
        class="text-base text-brand-blue font-normal hover:underline"
        @click="onInterviewSettings(event)"
      >
        {{ event.interviewerCount }} {{ event.interviewerCount === 1 ? 'interviewer' : 'interviewers' }}
      </button>
    </td>

    <!-- Job Titles -->
    <td class="py-6 px-6">
      <div v-for="(job, idx) in event.jobTitles" :key="idx" class="text-base text-brand-blue mb-1 last:mb-0">
        <button type="button" class="hover:underline">{{ job }}</button>
      </div>
    </td>

    <!-- Candidates -->
    <td class="py-6 px-6">
      <div class="text-base text-text-primary">{{ event.pendingCandidates }} pending</div>
      <div class="text-base text-text-primary">{{ event.upcomingCandidates }} upcoming</div>
      <button type="button" class="mt-2 text-base text-brand-blue underline hover:no-underline">
        Manage applicants
      </button>
    </td>
  </tr>
</template>
