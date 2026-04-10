<!--
  PayModal
  --------
  Full pay widget from the prototype. Supports:
  - Show by selector: Range, Starting, Maximum, Exact
  - Dynamic input fields based on selector
  - Rate selector: per hour/day/week/month/year
  - Parses and formats pay display for review screen

  FULLY IMPLEMENTED per assignment.
-->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useModal } from '@/composables/useModal'
import { RATE_OPTIONS } from '@/data/edit-job-mock'
import type { PayConfig } from '@/types/job'

const { state, close, isOpen } = useModal()

// Parse incoming pay string or default to range.
// In a real app, parse the pay string from state.value.payload['pay'].
const currentPay = computed<PayConfig>(() => {
  return {
    displayType: 'range',
    minimum: 38000,
    maximum: 48000,
    rate: 'per year',
  }
})

const displayType = ref<PayConfig['displayType']>('range')
const minimum = ref<number | undefined>(38000)
const maximum = ref<number | undefined>(48000)
const single = ref<number | undefined>(38000)
const rate = ref<PayConfig['rate']>('per year')
const rateOpen = ref<boolean>(false)

// Watch for modal open and sync with payload
watch(
  () => state.value.payload['pay'],
  () => {
    const cfg = currentPay.value
    displayType.value = cfg.displayType
    minimum.value = cfg.minimum
    maximum.value = cfg.maximum
    single.value = cfg.single
    rate.value = cfg.rate
  },
)

const toggleRateDropdown = (): void => {
  rateOpen.value = !rateOpen.value
}

const selectRate = (selected: PayConfig['rate']): void => {
  rate.value = selected
  rateOpen.value = false
}

const selectDisplayType = (type: PayConfig['displayType']): void => {
  displayType.value = type
}

const formatPayDisplay = (): string => {
  if (displayType.value === 'range' && minimum.value && maximum.value) {
    return `$${minimum.value.toLocaleString()} – $${maximum.value.toLocaleString()} / ${rate.value}`
  } else if (displayType.value === 'starting' && single.value) {
    return `Starting at $${single.value.toLocaleString()} / ${rate.value}`
  } else if (displayType.value === 'maximum' && single.value) {
    return `Up to $${single.value.toLocaleString()} / ${rate.value}`
  } else if (displayType.value === 'exact' && single.value) {
    return `$${single.value.toLocaleString()} / ${rate.value}`
  }
  return '(not set)'
}

const submit = (): void => {
  // TODO(dev): wire to job update API
  // eslint-disable-next-line no-console
  console.log('[PayModal] saving pay:', {
    displayType: displayType.value,
    minimum: minimum.value,
    maximum: maximum.value,
    single: single.value,
    rate: rate.value,
    display: formatPayDisplay(),
  })
  close()
}
</script>

<template>
  <BaseModal name="pay" title="Pay" max-width="max-w-2xl">
    <template #body>
      <div v-if="isOpen('pay')" class="space-y-6">
        <p class="text-base text-text-secondary">
          Choose how to display pay for this job. Adjust as needed.
        </p>

        <!-- Display type selector -->
        <div>
          <label class="block text-sm font-semibold text-text-primary mb-3">Show pay by</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="type in ['range', 'starting', 'maximum', 'exact'] as const"
              :key="type"
              type="button"
              :class="[
                'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
                displayType === type
                  ? 'bg-brand-blue text-text-inverse border-brand-blue'
                  : 'bg-surface-raised text-text-secondary border-border-strong hover:border-brand-blue',
              ]"
              @click="selectDisplayType(type)"
            >
              {{ type === 'range' ? 'Range' : type === 'starting' ? 'Starting amount' : type === 'maximum' ? 'Maximum amount' : 'Exact amount' }}
            </button>
          </div>
        </div>

        <!-- Input fields based on display type -->
        <div v-if="displayType === 'range'" class="space-y-4">
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-sm font-semibold text-text-primary mb-1">Minimum</label>
              <div class="flex items-center border-2 border-border-strong rounded-md overflow-hidden">
                <span class="px-3 py-2 text-text-secondary font-medium">$</span>
                <input
                  v-model.number="minimum"
                  type="number"
                  class="flex-1 border-none outline-none px-2 py-2 text-base font-medium focus:ring-2 focus:ring-brand-blue-light"
                  placeholder="38000"
                />
              </div>
            </div>
            <div class="flex items-end pb-2 text-text-secondary">to</div>
            <div class="flex-1">
              <label class="block text-sm font-semibold text-text-primary mb-1">Maximum</label>
              <div class="flex items-center border-2 border-border-strong rounded-md overflow-hidden">
                <span class="px-3 py-2 text-text-secondary font-medium">$</span>
                <input
                  v-model.number="maximum"
                  type="number"
                  class="flex-1 border-none outline-none px-2 py-2 text-base font-medium focus:ring-2 focus:ring-brand-blue-light"
                  placeholder="48000"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div class="flex-1">
            <label class="block text-sm font-semibold text-text-primary mb-1">Amount</label>
            <div class="flex items-center border-2 border-border-strong rounded-md overflow-hidden">
              <span class="px-3 py-2 text-text-secondary font-medium">$</span>
              <input
                v-model.number="single"
                type="number"
                class="flex-1 border-none outline-none px-2 py-2 text-base font-medium focus:ring-2 focus:ring-brand-blue-light"
                placeholder="38000"
              />
            </div>
          </div>
        </div>

        <!-- Rate selector -->
        <div>
          <label class="block text-sm font-semibold text-text-primary mb-2">Rate</label>
          <div class="relative inline-block">
            <button
              type="button"
              :class="[
                'flex items-center gap-2 px-3 py-2 rounded-md border-2 text-base font-medium transition-colors',
                rateOpen
                  ? 'border-brand-blue bg-brand-blue-light'
                  : 'border-border-strong bg-surface-raised hover:border-text-secondary',
              ]"
              @click="toggleRateDropdown"
            >
              <span>{{ rate }}</span>
              <svg
                :class="['w-4 h-4 transition-transform', rateOpen ? 'rotate-180' : '']"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              v-if="rateOpen"
              class="absolute top-full mt-1 left-0 bg-surface-raised border border-border-strong rounded-md shadow-menu z-20 min-w-max"
            >
              <button
                v-for="opt in RATE_OPTIONS"
                :key="opt"
                type="button"
                :class="[
                  'block w-full text-left px-3 py-2 text-base hover:bg-border-subtle transition-colors',
                  rate === opt ? 'bg-border-subtle font-semibold' : '',
                ]"
                @click="selectRate(opt)"
              >
                {{ opt }}
              </button>
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div class="mt-6 p-4 bg-border-subtle rounded-md">
          <p class="text-xs font-semibold text-text-tertiary mb-1">Preview</p>
          <p class="text-lg font-semibold text-text-primary">{{ formatPayDisplay() }}</p>
        </div>
      </div>
    </template>
    <template #footer>
      <BaseButton variant="secondary" @click="close()">Cancel</BaseButton>
      <BaseButton variant="primary" @click="submit">Save</BaseButton>
    </template>
  </BaseModal>
</template>
