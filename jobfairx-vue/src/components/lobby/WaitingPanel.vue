<!--
  WaitingPanel
  ------------
  The "Waiting" tab in the Lobby. Shows candidates queued for an interview.
  Each row has Resume / Message / Start Interview / Decline buttons.

  Action wiring uses useModal() so the actual modal components decide
  what they need; this panel only fires intent.
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

const onResume = (candidate: Candidate): void => {
  if (!candidate.resumeUrl) return
  open('resume', { candidate })
}

const onMessage = (candidate: Candidate): void => {
  open('message', { candidate })
}

const onStartInterview = (candidate: Candidate): void => {
  // TODO(dev): wire to real "start interview" action.
  // For now, just demonstrate intent through the modal registry.
  open('startInterview', { candidate })
}

const onDecline = (candidate: Candidate): void => {
  open('decline', { candidate })
}
</script>

<template>
  <StatusCard>
    <template v-if="candidates.length > 0">
      <CandidateRow v-for="cand in candidates" :key="cand.id" :candidate="cand">
        <template #actions="{ candidate }">
          <BaseButton
            variant="ghost"
            size="sm"
            :disabled="!candidate.resumeUrl"
            @click="onResume(candidate)"
          >
            Resume
          </BaseButton>
          <BaseButton variant="ghost" size="sm" @click="onMessage(candidate)">
            Message
          </BaseButton>
          <BaseButton variant="primary" size="sm" @click="onStartInterview(candidate)">
            Start interview
          </BaseButton>
          <BaseButton variant="secondary" size="sm" @click="onDecline(candidate)">
            Decline
          </BaseButton>
        </template>
      </CandidateRow>
    </template>

    <EmptyState
      v-else
      title="No candidates waiting"
      body="When job seekers join your event, they'll show up here. You can also share the event link to invite more applicants."
    />
  </StatusCard>
</template>
