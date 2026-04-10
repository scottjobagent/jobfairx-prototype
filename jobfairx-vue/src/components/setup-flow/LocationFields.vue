<!--
  LocationFields
  ---------------
  Renders conditional location input fields based on locationType.
  - in-person: location address
  - remote: reside requirement question + optional location
  - hybrid: street address
  - on-the-road: starting location question + optional address
-->
<script setup lang="ts">
import type { LocationType } from '@/types/setup-flow'

interface Props {
  locationType: LocationType
  location: string
  hybridLocation: string
  resideRequired: boolean
  resideLocation: string
  onRoadStarting: boolean
  onRoadAddress: string
}

interface Emits {
  (e: 'update:location', value: string): void
  (e: 'update:hybrid-location', value: string): void
  (e: 'update:reside-required', value: boolean): void
  (e: 'update:reside-location', value: string): void
  (e: 'update:on-road-starting', value: boolean): void
  (e: 'update:on-road-address', value: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <!-- In-person: location address -->
  <div v-if="locationType === 'in-person'" class="space-y-2">
    <label class="block text-lg font-semibold text-text-primary">What is the job location? <span class="text-status-danger">*</span></label>
    <p class="text-sm text-text-secondary">Enter a street address or ZIP code</p>
    <input
      :value="location"
      type="text"
      class="w-full rounded-lg border-2 border-text-tertiary px-5 py-3 text-lg focus:outline-none focus:border-brand-blue"
      placeholder="e.g., Henderson, NV 89052"
      @input="$emit('update:location', ($event.target as HTMLInputElement).value)"
    >
  </div>

  <!-- Hybrid: street address -->
  <div v-else-if="locationType === 'hybrid'" class="space-y-2">
    <label class="block text-lg font-semibold text-text-primary">Street address <span class="text-status-danger">*</span></label>
    <input
      :value="hybridLocation"
      type="text"
      class="w-full rounded-lg border-2 border-text-tertiary px-5 py-3 text-lg focus:outline-none focus:border-brand-blue"
      placeholder="e.g., 123 Main St, San Francisco, CA"
      @input="$emit('update:hybrid-location', ($event.target as HTMLInputElement).value)"
    >
  </div>

  <!-- Remote: reside question -->
  <div v-else-if="locationType === 'remote'" class="space-y-4">
    <div class="space-y-3">
      <label class="block text-lg font-semibold text-text-primary">Are employees required to reside in a specific location?</label>
      <div class="space-y-2">
        <button
          type="button"
          class="w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors"
          :class="resideRequired ? 'border-text-primary bg-border-subtle' : 'border-text-tertiary hover:border-text-primary'"
          @click="$emit('update:reside-required', true)"
        >
          <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="resideRequired ? 'border-text-primary bg-text-primary' : 'border-text-tertiary'">
            <div v-if="resideRequired" class="w-2 h-2 bg-surface-raised rounded-full"></div>
          </div>
          <span class="font-medium">Yes</span>
        </button>
        <button
          type="button"
          class="w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors"
          :class="!resideRequired ? 'border-text-primary bg-border-subtle' : 'border-text-tertiary hover:border-text-primary'"
          @click="$emit('update:reside-required', false)"
        >
          <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="!resideRequired ? 'border-text-primary bg-text-primary' : 'border-text-tertiary'">
            <div v-if="!resideRequired" class="w-2 h-2 bg-surface-raised rounded-full"></div>
          </div>
          <span class="font-medium">No</span>
        </button>
      </div>
    </div>

    <!-- Reside location field (shown if Yes) -->
    <div v-if="resideRequired" class="space-y-2">
      <label class="block text-lg font-semibold text-text-primary">In what location must employees reside? <span class="text-status-danger">*</span></label>
      <input
        :value="resideLocation"
        type="text"
        class="w-full rounded-lg border-2 border-text-tertiary px-5 py-3 text-lg focus:outline-none focus:border-brand-blue"
        placeholder="e.g., United States"
        @input="$emit('update:reside-location', ($event.target as HTMLInputElement).value)"
      >
    </div>
  </div>

  <!-- On-the-road: starting location question -->
  <div v-else-if="locationType === 'on-the-road'" class="space-y-4">
    <div class="space-y-3">
      <label class="block text-lg font-semibold text-text-primary">Does this job have a consistent starting location?</label>
      <div class="space-y-2">
        <button
          type="button"
          class="w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors"
          :class="onRoadStarting ? 'border-text-primary bg-border-subtle' : 'border-text-tertiary hover:border-text-primary'"
          @click="$emit('update:on-road-starting', true)"
        >
          <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="onRoadStarting ? 'border-text-primary bg-text-primary' : 'border-text-tertiary'">
            <div v-if="onRoadStarting" class="w-2 h-2 bg-surface-raised rounded-full"></div>
          </div>
          <span class="font-medium">Yes</span>
        </button>
        <button
          type="button"
          class="w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors"
          :class="!onRoadStarting ? 'border-text-primary bg-border-subtle' : 'border-text-tertiary hover:border-text-primary'"
          @click="$emit('update:on-road-starting', false)"
        >
          <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="!onRoadStarting ? 'border-text-primary bg-text-primary' : 'border-text-tertiary'">
            <div v-if="!onRoadStarting" class="w-2 h-2 bg-surface-raised rounded-full"></div>
          </div>
          <span class="font-medium">No</span>
        </button>
      </div>
    </div>

    <!-- Starting location address (shown if Yes) -->
    <div v-if="onRoadStarting" class="space-y-2">
      <label class="block text-lg font-semibold text-text-primary">Enter the street address of the starting location <span class="text-status-danger">*</span></label>
      <input
        :value="onRoadAddress"
        type="text"
        class="w-full rounded-lg border-2 border-text-tertiary px-5 py-3 text-lg focus:outline-none focus:border-brand-blue"
        placeholder="e.g., 123 Main St, Denver, CO"
        @input="$emit('update:on-road-address', ($event.target as HTMLInputElement).value)"
      >
    </div>
  </div>
</template>
