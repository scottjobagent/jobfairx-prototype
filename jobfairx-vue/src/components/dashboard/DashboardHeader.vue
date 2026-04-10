<!--
  DashboardHeader
  ---------------
  The page header with company name and "New Event" CTA button.
  Matches the layout of the header-card section in visual.html.
-->
<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'

interface Props {
  /** Company name to display */
  companyName?: string
}

withDefaults(defineProps<Props>(), { companyName: 'Skyline Company' })
</script>

<template>
  <div class="mb-5 bg-surface-raised rounded-lg border border-border-default p-7">
    <div class="flex items-center justify-between">
      <h1 class="text-4xl font-bold text-text-primary">{{ companyName }}</h1>
      <BaseButton variant="primary" size="lg">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
          <path d="M12 5v14M5 12h14" />
        </svg>
        New event
      </BaseButton>
    </div>
  </div>
</template>
