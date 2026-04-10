<!--
  SharePreviewPage
  ----------------
  Top-level page for the shareable interview request flow.
  Displays event details, jobs list, and a scheduler panel.

  This page is public-facing (no auth required) and allows job seekers
  to browse jobs and request interview slots for a specific event.
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import PublicHeader from '@/components/share-preview/PublicHeader.vue'
import JobsList from '@/components/share-preview/JobsList.vue'
import SchedulerPanel from '@/components/share-preview/SchedulerPanel.vue'
import { getEventByKey } from '@/data/share-preview-mock'
import type { Job, SharePreviewEvent } from '@/types/share'

const route = useRoute()

// Get event key from URL query param or default to 'dallas'
const eventKey = computed<string>(() => {
  const key = route.query['event']
  return typeof key === 'string' ? key.toLowerCase() : 'dallas'
})

const currentEvent = computed<SharePreviewEvent | null>(() => getEventByKey(eventKey.value))

const selectedJob = ref<Job | null>(null)
const selectedSlotIdx = ref<number | null>(null)

// Auto-select job if only one exists
const jobToSelect = computed<Job | null>(() => {
  const ev = currentEvent.value
  if (ev && ev.jobs.length === 1) {
    return ev.jobs[0] ?? null
  }
  return selectedJob.value
})

const handleJobSelect = (job: Job): void => {
  selectedJob.value = job
  selectedSlotIdx.value = null
}

const handleSlotSelect = (slotIdx: number): void => {
  selectedSlotIdx.value = slotIdx
}

const handleClearSelection = (): void => {
  selectedJob.value = null
  selectedSlotIdx.value = null
}
</script>

<template>
  <div class="min-h-screen bg-surface-sunken">
    <PublicHeader />

    <main
      v-if="currentEvent"
      class="max-w-7xl mx-auto px-6 py-8 sm:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 lg:items-start"
    >
      <!-- Left: Jobs list -->
      <div class="lg:col-span-2">
        <JobsList
          :event="currentEvent"
          :selected-job="jobToSelect"
          @select="handleJobSelect"
        />
      </div>

      <!-- Right: Scheduler -->
      <div class="lg:col-span-1 lg:sticky lg:top-8">
        <SchedulerPanel
          :event="currentEvent"
          :selected-job="jobToSelect"
          :selected-slot-idx="selectedSlotIdx"
          @select-slot="handleSlotSelect"
          @clear="handleClearSelection"
        />
      </div>
    </main>
    <div v-else class="max-w-2xl mx-auto p-12 text-center text-text-secondary">
      Event not found.
    </div>
  </div>
</template>
