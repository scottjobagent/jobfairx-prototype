<!--
  Step3Review
  -----------
  Review screen with locked title/location and editable fields via modals.
  Title and location have lock icons (read-only); other fields have pencils.
-->
<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import ReviewTable from './ReviewTable.vue'
import { useSetupFlow } from '@/composables/useSetupFlow'
import { useModal } from '@/composables/useModal'
import { JOB_TYPES } from '@/data/setup-flow-mock'

interface Emits {
  (e: 'back'): void
  (e: 'confirm'): void
}

defineEmits<Emits>()

const { state } = useSetupFlow()
const { open } = useModal()

const jobTypeLabel = computed(() => {
  const selected = state.jobTypes.map(t => {
    const found = JOB_TYPES.find(j => j.id === t)
    return found?.label ?? t
  })
  return selected.join(', ')
})

const payDisplay = computed(() => {
  const min = state.payType === 'hourly' ? `$${state.payMin.toFixed(2)}` : `$${state.payMin.toLocaleString()}`
  const max = state.payType === 'hourly' ? `$${state.payMax.toFixed(2)}` : `$${state.payMax.toLocaleString()}`
  const unit = state.payType === 'hourly' ? 'per hour' : 'a year'
  return `${min} - ${max} ${unit}`
})

const benefitsDisplay = computed(() => {
  return state.benefits.length > 0 ? state.benefits.join(', ') : '—'
})

const openEditModal = (field: 'jobType' | 'pay' | 'benefits' | 'shift' | 'schedule' | 'description'): void => {
  open(`setupReview${field}`, { field, currentValue: state[field === 'jobType' ? 'jobTypes' : field === 'pay' ? 'payMin' : field] })
}
</script>

<template>
  <div class="space-y-8">
    <h1 class="text-4xl font-bold text-text-primary">Review</h1>

    <ReviewTable>
      <!-- Locked: Job title -->
      <tr class="border-b border-border-default hover:bg-border-subtle">
        <td class="py-4 font-medium text-text-primary">Job title</td>
        <td class="py-4 text-text-primary">{{ state.jobTitle }}</td>
        <td class="py-4 flex justify-end">
          <button
            type="button"
            class="p-2 text-text-tertiary hover:text-text-primary transition-colors"
            title="Use Back to change"
            disabled
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="11" width="16" height="10" rx="2"></rect>
              <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
            </svg>
          </button>
        </td>
      </tr>

      <!-- Locked: Location -->
      <tr class="border-b border-border-default hover:bg-border-subtle">
        <td class="py-4 font-medium text-text-primary">Location</td>
        <td class="py-4 text-text-primary">{{ state.locationType === 'in-person' ? state.location : state.locationType }}</td>
        <td class="py-4 flex justify-end">
          <button
            type="button"
            class="p-2 text-text-tertiary hover:text-text-primary transition-colors"
            title="Use Back to change"
            disabled
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="11" width="16" height="10" rx="2"></rect>
              <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
            </svg>
          </button>
        </td>
      </tr>

      <!-- Editable: Job type -->
      <tr class="border-b border-border-default hover:bg-border-subtle">
        <td class="py-4 font-medium text-text-primary">Job type</td>
        <td class="py-4 text-text-primary">{{ jobTypeLabel }}</td>
        <td class="py-4 flex justify-end">
          <button
            type="button"
            class="p-2 text-text-tertiary hover:text-text-primary transition-colors"
            title="Edit"
            @click="openEditModal('jobType')"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
            </svg>
          </button>
        </td>
      </tr>

      <!-- Editable: Pay -->
      <tr class="border-b border-border-default hover:bg-border-subtle">
        <td class="py-4 font-medium text-text-primary">Pay</td>
        <td class="py-4 text-text-primary">{{ payDisplay }}</td>
        <td class="py-4 flex justify-end">
          <button
            type="button"
            class="p-2 text-text-tertiary hover:text-text-primary transition-colors"
            title="Edit"
            @click="openEditModal('pay')"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
            </svg>
          </button>
        </td>
      </tr>

      <!-- Editable: Benefits -->
      <tr class="border-b border-border-default hover:bg-border-subtle">
        <td class="py-4 font-medium text-text-primary">Benefits</td>
        <td class="py-4 text-text-primary">{{ benefitsDisplay }}</td>
        <td class="py-4 flex justify-end">
          <button
            type="button"
            class="p-2 text-text-tertiary hover:text-text-primary transition-colors"
            title="Edit"
            @click="openEditModal('benefits')"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
            </svg>
          </button>
        </td>
      </tr>

      <!-- Editable: Shift -->
      <tr class="border-b border-border-default hover:bg-border-subtle">
        <td class="py-4 font-medium text-text-primary">Standard Shift</td>
        <td class="py-4 text-text-primary">{{ state.shift || '—' }}</td>
        <td class="py-4 flex justify-end">
          <button
            type="button"
            class="p-2 text-text-tertiary hover:text-text-primary transition-colors"
            title="Edit"
            @click="openEditModal('shift')"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
            </svg>
          </button>
        </td>
      </tr>

      <!-- Editable: Schedule -->
      <tr class="border-b border-border-default hover:bg-border-subtle">
        <td class="py-4 font-medium text-text-primary">Weekly Schedule</td>
        <td class="py-4 text-text-primary">{{ state.schedule || '—' }}</td>
        <td class="py-4 flex justify-end">
          <button
            type="button"
            class="p-2 text-text-tertiary hover:text-text-primary transition-colors"
            title="Edit"
            @click="openEditModal('schedule')"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
            </svg>
          </button>
        </td>
      </tr>

      <!-- Editable: Description (preview + edit button) -->
      <tr class="border-b border-border-default hover:bg-border-subtle">
        <td class="py-4 font-medium text-text-primary">Job description</td>
        <td class="py-4">
          <p class="text-text-primary line-clamp-2">{{ state.description }}</p>
        </td>
        <td class="py-4 flex justify-end">
          <button
            type="button"
            class="p-2 text-text-tertiary hover:text-text-primary transition-colors"
            title="Edit"
            @click="openEditModal('description')"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
            </svg>
          </button>
        </td>
      </tr>
    </ReviewTable>

    <!-- Back / Confirm -->
    <div class="flex items-center justify-between pt-6 border-t border-border-default">
      <BaseButton variant="secondary" size="lg" @click="$emit('back')">
        <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5"></path>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back
      </BaseButton>
      <BaseButton variant="primary" size="lg" @click="$emit('confirm')">
        Confirm
        <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"></path>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </BaseButton>
    </div>
  </div>
</template>
