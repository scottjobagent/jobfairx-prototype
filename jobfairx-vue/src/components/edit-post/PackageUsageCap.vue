<!--
  PackageUsageCap
  ---------------
  Displays "Growth package • 2 of 3 jobs added" and the capacity-full panel.
  Follows the pattern from the HTML prototype where the meta line shows the
  count and is_full styling triggers the capacity warning.
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  tier: string
  jobsUsed: number
  jobsLimit: number
}

const props = defineProps<Props>()

const isFull = computed<boolean>(() => props.jobsUsed >= props.jobsLimit)

const capacityText = computed<string>(() => {
  const remaining = props.jobsLimit - props.jobsUsed
  return remaining === 0
    ? `You've reached your ${props.tier} package limit. Upgrade for more jobs.`
    : `You can add ${remaining} more job${remaining === 1 ? '' : 's'} to your ${props.tier} package.`
})
</script>

<template>
  <div>
    <!-- Meta line: "Growth package • 2 of 3 jobs added" -->
    <div :class="['pkg-meta', { 'is-full': isFull }]">
      <span class="pkg-check">✓</span>
      {{ tier }} package<span class="pkg-sep">·</span>{{ jobsUsed }} of {{ jobsLimit }}
      jobs added
    </div>

    <!-- Capacity-full panel (shown when at limit) -->
    <div v-if="isFull" class="pkg-capacity-panel">
      <div class="pkg-cap-title">You've reached your package limit</div>
      <div class="pkg-cap-sub">{{ capacityText }}</div>
    </div>
  </div>
</template>

<style scoped>
.pkg-meta {
  font-size: 13px;
  color: #595959;
  line-height: 1.5;
  margin-bottom: 20px;
}

.pkg-meta.is-full {
  color: #2d2d2d;
  font-weight: 600;
}

.pkg-check {
  display: none;
  color: #0044b3;
  font-weight: 700;
  margin-right: 6px;
}

.is-full .pkg-check {
  display: inline;
}

.pkg-sep {
  color: #9ca3af;
  margin: 0 4px;
}

.pkg-capacity-panel {
  padding: 18px 20px;
  background: #fafafa;
  border: 1px solid #ebebeb;
  border-radius: 8px;
  margin-top: 24px;
  border-left: 3px solid #0044b3;
}

.pkg-cap-title {
  font-size: 14px;
  font-weight: 600;
  color: #2d2d2d;
  margin-bottom: 4px;
}

.pkg-cap-sub {
  font-size: 13px;
  color: #595959;
}
</style>
