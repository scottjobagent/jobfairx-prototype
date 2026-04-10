<!--
  InterviewingPanel
  -----------------
  The "Interviewing" tab. Candidates currently in an active interview.
  Actions: Join (rejoin the room) and End interview (route to feedback).
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

const onJoin = (candidate: Candidate): void => {
  open('joinInterview', { candidate })
}

const onEnd = (candidate: Candidate): void => {
  // The HTML prototype opens the feedback modal as part of ending.
  open('feedback', { candidate })
}
</script>

<template>
  <StatusCard>
    <template v-if="candidates.length > 0">
      <CandidateRow v-for="cand in candidates" :key="cand.id" :candidate="cand">
        <template #actions="{ candidate }">
          <BaseButton variant="primary" size="sm" @click="onJoin(candidate)">Join</BaseButton>
          <BaseButton variant="secondary" size="sm" @click="onEnd(candidate)">
            End interview
          </BaseButton>
        </template>
      </CandidateRow>
    </template>

    <EmptyState
      v-else
      title="No active interviews"
      body="When you start an interview from the Waiting tab, the candidate will appear here."
    />
  </StatusCard>
</template>
