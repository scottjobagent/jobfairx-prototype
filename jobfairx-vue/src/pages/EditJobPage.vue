<!--
  EditJobPage
  -----------
  Review and edit job details. This page mirrors the edit-job.html prototype.

  Structure:
  - Title card (locked)
  - Review table with locked title/location rows (lock icon + tooltip)
  - Editable field rows (pencil icon)
  - Description with preview truncation + expand toggle
  - Six modals for field editing (pay fully built, benefits fully built, others stubbed)
  - Save button at bottom
  - Dev job selector (bottom right)
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useModal } from '@/composables/useModal'
import { useEditJob } from '@/composables/useEditJob'
import { JOBS } from '@/data/edit-job-mock'
import type { JobData } from '@/types/job'

// Components
import ReviewRow from '@/components/edit-job/ReviewRow.vue'
import PayModal from '@/components/edit-job/modals/PayModal.vue'
import BenefitsModal from '@/components/edit-job/modals/BenefitsModal.vue'
import JobTypeModal from '@/components/edit-job/modals/JobTypeModal.vue'
import ShiftModal from '@/components/edit-job/modals/ShiftModal.vue'
import ScheduleModal from '@/components/edit-job/modals/ScheduleModal.vue'
import DescriptionModal from '@/components/edit-job/modals/DescriptionModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()
const { open } = useModal()

// Get job from URL query param
const jobParam = computed<string>(() => {
  const q = router.currentRoute.value.query['job'] as string | undefined
  return q && q in JOBS ? q : 'rn'
})

const currentJobData = computed<JobData>(() => {
  const fallback = JOBS['rn']
  if (!fallback) {
    throw new Error('Mock data missing required "rn" job entry')
  }
  return JOBS[jobParam.value] ?? fallback
})

const editJob = useEditJob(currentJobData.value)

// Description preview (truncate to 260 chars)
const descPreviewLimit = 260
const descriptionPreview = computed<string>(() => {
  const full = editJob.data.value.desc
  return full.length > descPreviewLimit ? full.slice(0, descPreviewLimit) + '…' : full
})

const showFullDescription = ref<boolean>(false)

const toggleDescriptionExpand = (): void => {
  showFullDescription.value = !showFullDescription.value
}

// Open modals
const openJobTypeModal = (): void => {
  open('jobType', { jobType: editJob.data.value.jobType })
}
const openPayModal = (): void => {
  open('pay', { pay: editJob.data.value.pay })
}
const openBenefitsModal = (): void => {
  open('benefits', { benefits: editJob.data.value.benefits })
}
const openShiftModal = (): void => {
  open('shift', { shift: editJob.data.value.shift })
}
const openScheduleModal = (): void => {
  open('schedule', { schedule: editJob.data.value.schedule })
}
const openDescriptionModal = (): void => {
  open('desc', { desc: editJob.data.value.desc })
}

const saveJob = (): void => {
  // TODO(dev): wire to job update API
  // eslint-disable-next-line no-console
  console.log('[EditJobPage] saving job:', editJob.data.value)
  editJob.save()
}

const switchJob = (jobId: string): void => {
  router.push({ query: { job: jobId } })
}
</script>

<template>
  <main class="min-h-screen bg-surface-sunken">
    <div class="container-page max-w-2xl mx-auto pb-16">
      <!-- Page title -->
      <div class="bg-surface-raised rounded-lg shadow-card p-7 mb-6">
        <h1 class="text-4xl font-bold text-text-primary">Edit job</h1>
      </div>

      <!-- Review table card -->
      <div class="bg-surface-raised rounded-lg shadow-card p-8 mb-6">
        <h2 class="text-2xl font-bold text-text-primary mb-6">Job details</h2>

        <table class="w-full">
          <!-- Title (LOCKED) -->
          <ReviewRow
            label="Job title"
            :value="currentJobData.title"
            is-locked
            @edit="openJobTypeModal"
          />

          <!-- Location (LOCKED) -->
          <ReviewRow
            label="Location"
            :value="currentJobData.location"
            is-locked
            @edit="openJobTypeModal"
          />

          <!-- Job type -->
          <ReviewRow
            label="Job type"
            :value="editJob.data.value.jobType"
            @edit="openJobTypeModal"
          />

          <!-- Pay -->
          <ReviewRow label="Pay" :value="editJob.data.value.pay" @edit="openPayModal" />

          <!-- Benefits -->
          <ReviewRow
            label="Benefits"
            :value="editJob.data.value.benefits"
            @edit="openBenefitsModal"
          />

          <!-- Shift -->
          <ReviewRow label="Standard Shift" :value="editJob.data.value.shift" @edit="openShiftModal" />

          <!-- Schedule -->
          <ReviewRow
            label="Weekly Schedule"
            :value="editJob.data.value.schedule"
            @edit="openScheduleModal"
          />

          <!-- Description -->
          <tr class="border-b border-border-default py-4">
            <td class="w-44 pr-6 py-4 text-md font-semibold text-text-primary align-top whitespace-nowrap">
              Job description
            </td>
            <td class="py-4 pr-4 text-md text-text-primary align-top break-words">
              <div class="whitespace-pre-wrap text-text-secondary text-sm leading-relaxed">
                <div v-if="!showFullDescription" class="line-clamp-5">
                  {{ descriptionPreview }}
                </div>
                <div v-else>
                  {{ editJob.data.value.desc }}
                </div>
              </div>
              <button
                v-if="editJob.data.value.desc.length > descPreviewLimit"
                type="button"
                class="mt-2 text-brand-blue font-semibold text-sm hover:underline"
                @click="toggleDescriptionExpand"
              >
                {{ showFullDescription ? 'Show less' : 'Show full description' }}
              </button>
            </td>
            <td class="py-4 pl-4 w-10 text-right align-top">
              <button
                type="button"
                class="inline-flex items-center justify-center w-8 h-8 rounded text-brand-blue hover:bg-border-subtle transition-colors"
                aria-label="Edit"
                @click="openDescriptionModal"
              >
                <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              </button>
            </td>
          </tr>
        </table>
      </div>

      <!-- Save button -->
      <div class="flex justify-end gap-3">
        <BaseButton variant="secondary" @click="editJob.reset">Cancel</BaseButton>
        <BaseButton variant="primary" @click="saveJob" :disabled="!editJob.isDirty"
          >Save changes</BaseButton
        >
      </div>
    </div>

    <!-- Modals (all mounted once at page level) -->
    <PayModal />
    <BenefitsModal />
    <JobTypeModal />
    <ShiftModal />
    <ScheduleModal />
    <DescriptionModal />

    <!-- Dev job switcher (bottom right) -->
    <div class="fixed bottom-6 right-6 bg-gray-800 text-white rounded-full shadow-lg p-2 flex items-center gap-2 flex-wrap max-w-xs z-40">
      <span class="text-xs font-bold uppercase tracking-wide text-gray-400 px-3">Jobs:</span>
      <button
        v-for="id in Object.keys(JOBS)"
        :key="id"
        type="button"
        :class="[
          'px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
          jobParam === id
            ? 'bg-brand-blue text-text-inverse'
            : 'bg-transparent text-gray-300 hover:text-white',
        ]"
        @click="switchJob(id)"
      >
        {{ id.toUpperCase() }}
      </button>
    </div>
  </main>
</template>
