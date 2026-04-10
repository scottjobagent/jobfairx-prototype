<!--
  AddJobRow
  ---------
  The bottom "Create a new job" button row that appears between the job list
  and the capacity panel. HIDDEN when jobsIncomplete=true (bug fix: CTA lives
  in the empty state instead).
-->
<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'

defineProps<{
  /** If true, this row is hidden; CTA lives in the empty state instead. */
  hidden?: boolean
}>()
</script>

<template>
  <div v-if="!hidden" class="add-job-row">
    <BaseButton variant="secondary">Create a new job</BaseButton>
  </div>
</template>

<style scoped>
.add-job-row {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #ebebeb;
}
</style>
