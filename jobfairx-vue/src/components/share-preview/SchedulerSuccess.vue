<!--
  SchedulerSuccess
  -----------------
  Success state displayed after interview request is submitted.
  Shows confirmation message and allows reset.
-->
<script setup lang="ts">
interface Props {
  jobTitle: string
  slotTime: string
}

defineProps<Props>()

defineEmits<{
  reset: []
}>()
</script>

<template>
  <div class="text-center py-4">
    <svg class="w-14 h-14 mx-auto mb-3.5 text-status-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>

    <h3 class="text-xl font-black text-text-primary mb-2">Interview requested</h3>

    <p class="text-sm text-text-secondary leading-relaxed mb-5">
      Your request for <strong>{{ jobTitle }}</strong> at <strong>{{ slotTime }}</strong> has been sent.
      The recruiter will review and email you a confirmation shortly.
    </p>
  </div>
</template>
