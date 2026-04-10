<!--
  NotYetPanel
  -----------
  The "Not Yet" tab — candidates scheduled for later in the event.
  Actions: Message and Decline.
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

const onMessage = (candidate: Candidate): void => open('message', { candidate })
const onDecline = (candidate: Candidate): void => open('decline', { candidate })
</script>

<template>
  <StatusCard>
    <template v-if="candidates.length > 0">
      <CandidateRow v-for="cand in candidates" :key="cand.id" :candidate="cand">
        <template #actions="{ candidate }">
          <BaseButton variant="ghost" size="sm" @click="onMessage(candidate)">
            Message
          </BaseButton>
          <BaseButton variant="secondary" size="sm" @click="onDecline(candidate)">
            Decline
          </BaseButton>
        </template>
      </CandidateRow>
    </template>

    <EmptyState
      v-else
      title="No upcoming candidates"
      body="Candidates scheduled for later in the event will appear here."
    />
  </StatusCard>
</template>
