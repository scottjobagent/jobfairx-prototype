<!--
  DescriptionModal
  ----------------
  Textarea modal for editing job description.
  STUB: Copy from edit-job.html line 382–398 (textarea pattern).
-->
<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useModal } from '@/composables/useModal'

const { state, close, isOpen } = useModal()

const description = ref<string>('')

watch(
  () => state.value.payload['desc'],
  () => {
    description.value = (state.value.payload['desc'] as string | undefined) ?? ''
  },
)

const submit = (): void => {
  // TODO(dev): wire to job update API; see edit-job.html ~line 382
  // eslint-disable-next-line no-console
  console.log('[DescriptionModal] saving:', { description: description.value })
  close()
}
</script>

<template>
  <BaseModal name="desc" title="Job description" max-width="max-w-2xl">
    <template #body>
      <div v-if="isOpen('desc')" class="space-y-4">
        <p class="text-base text-text-secondary">
          Edit the job description. You can include responsibilities, requirements, and benefits.
        </p>
        <textarea
          v-model="description"
          rows="12"
          class="w-full rounded border-2 border-border-strong px-3 py-2 text-base font-medium focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue-light transition-colors"
          placeholder="Add job description here…"
        />
      </div>
    </template>
    <template #footer>
      <BaseButton variant="secondary" @click="close()">Cancel</BaseButton>
      <BaseButton variant="primary" @click="submit">Save</BaseButton>
    </template>
  </BaseModal>
</template>
