<!--
  DeclineModal
  ------------
  Decline a candidate with an optional reason. The HTML prototype shows
  reason chips + a free-text field; this Vue version mirrors that.

  REPRESENTATIVE PATTERN: form modal with selectable chips and a
  destructive primary action. Stub modals that need a similar shape
  (feedback, schedule, etc.) can copy this file as a starting point.
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

const REASONS = [
  'Not enough experience',
  'Wrong location',
  'Position filled',
  'Schedule mismatch',
  'Other',
] as const
type Reason = (typeof REASONS)[number]

const selected = ref<Reason | null>(null)
const note = ref<string>('')

watch(
  () => state.value.payload['candidate'],
  () => {
    selected.value = null
    note.value = ''
  },
)

const submit = (): void => {
  if (!candidate.value) return
  // TODO(dev): wire to decline API.
  // eslint-disable-next-line no-console
  console.log('[DeclineModal] declining:', {
    candidateId: candidate.value.id,
    reason: selected.value,
    note: note.value,
  })
  close()
}
</script>

<template>
  <BaseModal name="decline" title="Decline candidate">
    <template #body>
      <div v-if="candidate && isOpen('decline')" class="space-y-5">
        <div class="text-base text-text-secondary">
          Declining
          <span class="font-semibold text-text-primary">{{ candidate.name }}</span>
          &middot; {{ candidate.jobTitle }}
        </div>

        <div>
          <p class="text-sm font-medium text-text-secondary mb-2">Reason</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="reason in REASONS"
              :key="reason"
              type="button"
              :class="[
                'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
                selected === reason
                  ? 'bg-brand-blue text-text-inverse border-brand-blue'
                  : 'bg-surface-raised text-text-secondary border-border-strong hover:border-brand-blue',
              ]"
              @click="selected = reason"
            >
              {{ reason }}
            </button>
          </div>
        </div>

        <label class="block">
          <span class="text-sm font-medium text-text-secondary">
            Internal note <span class="text-text-tertiary">(optional)</span>
          </span>
          <textarea
            v-model="note"
            rows="3"
            class="mt-1 w-full rounded border border-border-strong px-3 py-2 text-base focus:outline-none focus:border-brand-blue"
            placeholder="Only your team will see this."
          />
        </label>
      </div>
    </template>
    <template #footer>
      <BaseButton variant="secondary" @click="close()">Cancel</BaseButton>
      <BaseButton variant="primary" @click="submit">Decline candidate</BaseButton>
    </template>
  </BaseModal>
</template>
