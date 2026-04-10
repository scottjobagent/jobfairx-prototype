<!--
  MessageModal
  ------------
  Sends a quick chat message to a waiting candidate. Pulls the active
  candidate out of the modal registry payload.

  REPRESENTATIVE PATTERN: this is one of the three fully built modals
  in the sample. Stubbed modals (instructions, schedule, etc.) should
  follow the same shape — read payload from useModal(), render with
  BaseModal, emit close on submit.
-->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useModal } from '@/composables/useModal'
import type { Candidate } from '@/types/lobby'

const { state, close, isOpen } = useModal()

const candidate = computed<Candidate | null>(() => {
  const c = state.value.payload['candidate']
  return (c as Candidate | undefined) ?? null
})

const message = ref<string>('')

// Reset message text whenever the modal re-opens for a different candidate.
watch(
  () => state.value.payload['candidate'],
  () => {
    message.value = ''
  },
)

const canSend = computed<boolean>(() => message.value.trim().length > 0)

const send = (): void => {
  if (!canSend.value || !candidate.value) return
  // TODO(dev): wire to messaging API.
  // For now, log + close so the modal flow is verifiable end-to-end.
  // eslint-disable-next-line no-console
  console.log('[MessageModal] sending:', {
    candidateId: candidate.value.id,
    body: message.value,
  })
  close()
}
</script>

<template>
  <BaseModal name="message" title="Message candidate">
    <template #body>
      <div v-if="candidate && isOpen('message')" class="space-y-4">
        <div class="text-base text-text-secondary">
          Sending to <span class="font-semibold text-text-primary">{{ candidate.name }}</span>
          &middot; {{ candidate.jobTitle }}
        </div>
        <label class="block">
          <span class="text-sm font-medium text-text-secondary">Message</span>
          <textarea
            v-model="message"
            rows="5"
            class="mt-1 w-full rounded border border-border-strong px-3 py-2 text-base focus:outline-none focus:border-brand-blue"
            placeholder="Hi, we'd like to chat with you about an opportunity…"
          />
        </label>
      </div>
    </template>
    <template #footer>
      <BaseButton variant="secondary" @click="close()">Cancel</BaseButton>
      <BaseButton variant="primary" :disabled="!canSend" @click="send">Send message</BaseButton>
    </template>
  </BaseModal>
</template>
