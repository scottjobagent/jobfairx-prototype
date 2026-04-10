<!--
  ResumeModal
  -----------
  Shows the candidate's resume in an iframe (or a fallback message if
  no resume URL is attached).

  REPRESENTATIVE PATTERN: viewing-only modal — no form, just display
  + close. Demonstrates the wider max-width variant of BaseModal.
-->
<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useModal } from '@/composables/useModal'
import type { Candidate } from '@/types/lobby'

const { state, close, isOpen } = useModal()

const candidate = computed<Candidate | null>(() => {
  const c = state.value.payload['candidate']
  return (c as Candidate | undefined) ?? null
})
</script>

<template>
  <BaseModal name="resume" title="Resume" max-width="max-w-3xl">
    <template #body>
      <div v-if="candidate && isOpen('resume')" class="space-y-4">
        <div class="text-base text-text-secondary">
          <span class="font-semibold text-text-primary">{{ candidate.name }}</span>
          &middot; {{ candidate.jobTitle }}
        </div>

        <div
          v-if="candidate.resumeUrl"
          class="border border-border-default rounded-md overflow-hidden bg-surface-sunken"
        >
          <iframe
            :src="candidate.resumeUrl"
            class="w-full h-[60vh] bg-white"
            title="Candidate resume"
          />
        </div>
        <div
          v-else
          class="border border-dashed border-border-strong rounded-md p-8 text-center text-text-tertiary"
        >
          This candidate hasn't uploaded a resume.
        </div>
      </div>
    </template>
    <template #footer>
      <BaseButton variant="secondary" @click="close()">Close</BaseButton>
    </template>
  </BaseModal>
</template>
