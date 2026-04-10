<!--
  Step1TitleLocation
  ------------------
  Captures job title and location (with type selection).
  Supports in-person, remote, hybrid, on-the-road variants.
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import LocationTypeSelect from './LocationTypeSelect.vue'
import LocationFields from './LocationFields.vue'
import { useSetupFlow } from '@/composables/useSetupFlow'
import { JOB_TITLE_SUGGESTIONS } from '@/data/setup-flow-mock'
import type { LocationType } from '@/types/setup-flow'

const { state, setJobTitle, setLocationType, setLocation, setHybridLocation, setResideRequired, setResideLocation, setOnRoadStarting, setOnRoadAddress } = useSetupFlow()

const showSuggestions = ref(false)
const filteredSuggestions = computed(() => {
  const term = state.jobTitle.toLowerCase()
  return term.length > 0
    ? JOB_TITLE_SUGGESTIONS.filter(s => s.toLowerCase().includes(term))
    : []
})

const selectSuggestion = (suggestion: string): void => {
  setJobTitle(suggestion)
  showSuggestions.value = false
}

const handleContinue = (): void => {
  if (!state.jobTitle.trim()) return
  // Validation could be more comprehensive here
}
</script>

<template>
  <div class="space-y-8">
    <h1 class="text-4xl font-bold text-text-primary">Create a job post</h1>

    <!-- Job title -->
    <div class="space-y-2">
      <label class="block text-lg font-semibold text-text-primary">Job title <span class="text-status-danger">*</span></label>
      <div class="relative">
        <input
          v-model="state.jobTitle"
          type="text"
          class="w-full rounded-lg border-2 border-text-tertiary px-5 py-3 text-lg focus:outline-none focus:border-brand-blue focus:shadow-none"
          placeholder="e.g., Sales Associate, Nurse, Electrician"
          @focus="showSuggestions = true"
          @blur="showSuggestions = false"
        >
        <div v-if="showSuggestions && filteredSuggestions.length > 0" class="absolute top-full left-0 right-0 mt-1 z-10 bg-surface-raised border border-border-default rounded-lg shadow-menu">
          <button
            v-for="s in filteredSuggestions"
            :key="s"
            type="button"
            class="w-full text-left px-5 py-3 hover:bg-border-subtle transition-colors"
            @click="selectSuggestion(s)"
          >
            {{ s }}
          </button>
        </div>
      </div>
    </div>

    <!-- Location type and fields -->
    <div class="space-y-4">
      <LocationTypeSelect
        :model-value="state.locationType"
        @update:model-value="setLocationType"
      />
      <LocationFields
        :location-type="state.locationType"
        :location="state.location"
        :hybrid-location="state.hybridLocation"
        :reside-required="state.resideRequired"
        :reside-location="state.resideLocation"
        :on-road-starting="state.onRoadStarting"
        :on-road-address="state.onRoadAddress"
        @update:location="setLocation"
        @update:hybrid-location="setHybridLocation"
        @update:reside-required="setResideRequired"
        @update:reside-location="setResideLocation"
        @update:on-road-starting="setOnRoadStarting"
        @update:on-road-address="setOnRoadAddress"
      />
    </div>

    <!-- Continue button -->
    <div class="flex justify-end pt-4">
      <BaseButton variant="primary" size="lg" @click="handleContinue">
        Continue
        <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"></path>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </BaseButton>
    </div>
  </div>
</template>
