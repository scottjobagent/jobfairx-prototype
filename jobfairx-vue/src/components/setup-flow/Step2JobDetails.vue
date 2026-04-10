<!--
  Step2JobDetails
  ----------------
  Captures job type, pay, benefits, shift, schedule, and job description.
-->
<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useSetupFlow } from '@/composables/useSetupFlow'
import { JOB_TYPES, SHIFT_OPTIONS, SCHEDULE_OPTIONS, BENEFITS_OPTIONS } from '@/data/setup-flow-mock'
import type { JobType } from '@/types/setup-flow'

interface Emits {
  (e: 'back'): void
  (e: 'continue'): void
}

defineEmits<Emits>()

const { state, setJobTypes, setPayType, setPayRange, setShift, setSchedule, setBenefits, setDescription } = useSetupFlow()

const toggleJobType = (type: JobType): void => {
  const current = [...state.jobTypes]
  const idx = current.indexOf(type)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(type)
  }
  setJobTypes(current)
}

const toggleBenefit = (benefit: string): void => {
  const current = [...state.benefits]
  const idx = current.indexOf(benefit)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(benefit)
  }
  setBenefits(current)
}

const displayedPayMin = computed(() => {
  return state.payType === 'hourly'
    ? `$${state.payMin.toFixed(2)}`
    : `$${Math.round(state.payMin).toLocaleString()}`
})

const displayedPayMax = computed(() => {
  return state.payType === 'hourly'
    ? `$${state.payMax.toFixed(2)}`
    : `$${Math.round(state.payMax).toLocaleString()}`
})

const displayedPayUnit = computed(() => {
  return state.payType === 'hourly' ? 'per hour' : 'a year'
})
</script>

<template>
  <div class="space-y-8">
    <h1 class="text-4xl font-bold text-text-primary">Add job details</h1>

    <!-- Job Type -->
    <div class="space-y-3">
      <label class="block text-lg font-semibold text-text-primary">Job type <span class="text-status-danger">*</span></label>
      <div class="space-y-2">
        <button
          v-for="jt in JOB_TYPES"
          :key="jt.id"
          type="button"
          class="w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors text-left"
          :class="state.jobTypes.includes(jt.id as JobType) ? 'border-brand-blue bg-brand-blue-light' : 'border-border-default hover:border-text-tertiary'"
          @click="toggleJobType(jt.id as JobType)"
        >
          <div class="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0" :class="state.jobTypes.includes(jt.id as JobType) ? 'border-brand-blue bg-brand-blue' : 'border-text-tertiary'">
            <svg v-if="state.jobTypes.includes(jt.id as JobType)" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span class="font-medium">{{ jt.label }}</span>
        </button>
      </div>
    </div>

    <!-- Pay -->
    <div class="space-y-3">
      <label class="block text-lg font-semibold text-text-primary">Pay <span class="text-status-danger">*</span></label>
      <div class="flex gap-3 mb-3">
        <button
          type="button"
          class="px-4 py-2 rounded-lg font-medium transition-colors"
          :class="state.payType === 'hourly' ? 'bg-brand-blue text-white' : 'bg-border-subtle text-text-primary hover:bg-border-strong'"
          @click="setPayType('hourly')"
        >
          Hourly
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded-lg font-medium transition-colors"
          :class="state.payType === 'salary' ? 'bg-brand-blue text-white' : 'bg-border-subtle text-text-primary hover:bg-border-strong'"
          @click="setPayType('salary')"
        >
          Salary
        </button>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-1">
          <label class="text-sm text-text-secondary">Minimum</label>
          <input
            :value="displayedPayMin"
            type="text"
            class="w-full rounded-lg border-2 border-text-tertiary px-3 py-2 text-sm focus:outline-none focus:border-brand-blue"
            placeholder="$0"
            @input="setPayRange(parseFloat(($event.target as HTMLInputElement).value.replace(/\D/g, '')) || 0, state.payMax)"
          >
        </div>
        <div class="space-y-1">
          <label class="text-sm text-text-secondary">Maximum</label>
          <input
            :value="displayedPayMax"
            type="text"
            class="w-full rounded-lg border-2 border-text-tertiary px-3 py-2 text-sm focus:outline-none focus:border-brand-blue"
            placeholder="$0"
            @input="setPayRange(state.payMin, parseFloat(($event.target as HTMLInputElement).value.replace(/\D/g, '')) || 0)"
          >
        </div>
      </div>
      <p class="text-sm text-text-secondary">{{ displayedPayMin }} - {{ displayedPayMax }} {{ displayedPayUnit }}</p>
    </div>

    <!-- Shift -->
    <div class="space-y-3">
      <label class="block text-lg font-semibold text-text-primary">Standard Shift</label>
      <select
        :value="state.shift"
        class="w-full rounded-lg border-2 border-text-tertiary px-4 py-3 text-lg focus:outline-none focus:border-brand-blue"
        @change="setShift(($event.target as HTMLSelectElement).value)"
      >
        <option v-for="opt in SHIFT_OPTIONS" :key="opt" :value="opt">
          {{ opt }}
        </option>
      </select>
    </div>

    <!-- Schedule -->
    <div class="space-y-3">
      <label class="block text-lg font-semibold text-text-primary">Weekly Schedule</label>
      <select
        :value="state.schedule"
        class="w-full rounded-lg border-2 border-text-tertiary px-4 py-3 text-lg focus:outline-none focus:border-brand-blue"
        @change="setSchedule(($event.target as HTMLSelectElement).value)"
      >
        <option value="">Select a schedule...</option>
        <option v-for="opt in SCHEDULE_OPTIONS" :key="opt" :value="opt">
          {{ opt }}
        </option>
      </select>
    </div>

    <!-- Benefits -->
    <div class="space-y-3">
      <label class="block text-lg font-semibold text-text-primary">Benefits</label>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="benefit in BENEFITS_OPTIONS"
          :key="benefit"
          type="button"
          class="px-3 py-2 rounded-lg border-2 transition-colors text-sm font-medium text-left"
          :class="state.benefits.includes(benefit) ? 'border-brand-blue bg-brand-blue-light text-brand-blue' : 'border-border-default text-text-primary hover:border-text-tertiary'"
          @click="toggleBenefit(benefit)"
        >
          {{ benefit }}
        </button>
      </div>
    </div>

    <!-- Description -->
    <div class="space-y-3">
      <label class="block text-lg font-semibold text-text-primary">Job description <span class="text-status-danger">*</span></label>
      <textarea
        :value="state.description"
        class="w-full rounded-lg border-2 border-text-tertiary px-4 py-3 text-lg focus:outline-none focus:border-brand-blue"
        rows="6"
        placeholder="Describe the role, responsibilities, and qualifications..."
        @input="setDescription(($event.target as HTMLTextAreaElement).value)"
      ></textarea>
    </div>

    <!-- Back / Continue -->
    <div class="flex items-center justify-between pt-6 border-t border-border-default">
      <BaseButton variant="secondary" size="lg" @click="$emit('back')">
        <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5"></path>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back
      </BaseButton>
      <BaseButton variant="primary" size="lg" @click="$emit('continue')">
        Continue
        <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"></path>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </BaseButton>
    </div>
  </div>
</template>
