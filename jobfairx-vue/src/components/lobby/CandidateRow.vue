<!--
  CandidateRow
  ------------
  One row in a candidate table. Shows avatar, name, job title, time,
  and a slot for tab-specific actions (different buttons appear in
  the Waiting / Interviewing / Interviewed panels in the prototype).
-->
<script setup lang="ts">
import type { Candidate } from '@/types/lobby'

defineProps<{
  candidate: Candidate
}>()
</script>

<template>
  <div
    class="flex items-center gap-4 px-5 py-4 border-b border-border-default last:border-b-0 hover:bg-border-subtle transition-colors"
  >
    <div
      class="w-10 h-10 rounded-full bg-brand-blue-light text-brand-blue text-sm font-semibold flex items-center justify-center shrink-0"
      :aria-label="`${candidate.name} avatar`"
    >
      {{ candidate.initials }}
    </div>

    <div class="flex-1 min-w-0">
      <p class="text-base font-semibold text-text-primary truncate">{{ candidate.name }}</p>
      <p class="text-sm text-text-secondary truncate">{{ candidate.jobTitle }}</p>
    </div>

    <div class="text-sm text-text-secondary text-right hidden sm:block">
      <p>{{ candidate.interviewDate }}</p>
      <p class="font-medium text-text-primary">{{ candidate.interviewTime }}</p>
    </div>

    <div class="flex items-center gap-2">
      <slot name="actions" :candidate="candidate" />
    </div>
  </div>
</template>
