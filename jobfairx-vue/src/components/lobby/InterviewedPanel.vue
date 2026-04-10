<!--
  InterviewedPanel
  ----------------
  The "Interviewed" tab. Candidates whose interview is complete.
  Actions: View feedback / Schedule follow-up / Decline.
-->
<script setup lang="ts">
import StatusCard from '@/components/base/StatusCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import CandidateRow from './CandidateRow.vue'
import EmptyState from './EmptyState.vue'
import { useModal } from '@/composables/useModal'
import type { Candidate } from '@/types/lobby'

defineProps<{
  candidates: readonly Candidate[]
}>()

const { open } = useModal()

const onFeedback = (candidate: Candidate): void => open('feedback', { candidate })
const onSchedule = (candidate: Candidate): void => open('schedule', { candidate })
const onDecline = (candidate: Candidate): void => open('decline', { candidate })
</script>

<template>
  <StatusCard>
    <template v-if="candidates.length > 0">
      <CandidateRow v-for="cand in candidates" :key="cand.id" :candidate="cand">
        <template #actions="{ candidate }">
          <BaseButton variant="ghost" size="sm" @click="onFeedback(candidate)">
            Feedback
          </BaseButton>
          <BaseButton variant="primary" size="sm" @click="onSchedule(candidate)">
            Schedule follow-up
          </BaseButton>
          <BaseButton variant="secondary" size="sm" @click="onDecline(candidate)">
            Decline
          </BaseButton>
        </template>
      </CandidateRow>
    </template>

    <EmptyState
      v-else
      title="No completed interviews yet"
      body="Once you finish an interview, the candidate will appear here for follow-up."
    />
  </StatusCard>
</template>
