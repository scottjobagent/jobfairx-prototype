<!--
  ShiftModal
  ----------
  Single-select chip modal for standard shift.
  STUB: Copy from edit-job.html line 346–362 (chip group pattern).
-->
<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useModal } from '@/composables/useModal'
import { SHIFT_OPTIONS } from '@/data/edit-job-mock'

const { state, close, isOpen } = useModal()

const selected = ref<string | null>(null)

watch(
  () => state.value.payload['shift'],
  () => {
    selected.value = (state.value.payload['shift'] as string | undefined) ?? null
  },
)

const submit = (): void => {
  // TODO(dev): wire to job update API; see edit-job.html ~line 346
  // eslint-disable-next-line no-console
  console.log('[ShiftModal] saving:', { shift: selected.value })
  close()
}
</script>

<template>
  <BaseModal name="shift" title="Standard Shift">
    <template #body>
      <div v-if="isOpen('shift')" class="space-y-4">
        <p class="text-base text-text-secondary">
          Select the standard shift for this position.
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="shift in SHIFT_OPTIONS"
            :key="shift"
            type="button"
            :class="[
              'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
              selected === shift
                ? 'bg-brand-blue text-text-inverse border-brand-blue'
                : 'bg-surface-raised text-text-secondary border-border-strong hover:border-brand-blue',
            ]"
            @click="selected = shift"
          >
            {{ shift }}
          </button>
        </div>
      </div>
    </template>
    <template #footer>
      <BaseButton variant="secondary" @click="close()">Cancel</BaseButton>
      <BaseButton variant="primary" @click="submit">Save</BaseButton>
    </template>
  </BaseModal>
</template>
