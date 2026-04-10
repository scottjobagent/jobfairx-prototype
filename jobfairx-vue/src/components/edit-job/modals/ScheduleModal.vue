<!--
  ScheduleModal
  -------------
  Single-select chip modal for weekly schedule.
  STUB: Copy from edit-job.html line 364–380 (chip group pattern).
-->
<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useModal } from '@/composables/useModal'
import { SCHEDULE_OPTIONS } from '@/data/edit-job-mock'

const { state, close, isOpen } = useModal()

const selected = ref<string | null>(null)

watch(
  () => state.value.payload['schedule'],
  () => {
    selected.value = (state.value.payload['schedule'] as string | undefined) ?? null
  },
)

const submit = (): void => {
  // TODO(dev): wire to job update API; see edit-job.html ~line 364
  // eslint-disable-next-line no-console
  console.log('[ScheduleModal] saving:', { schedule: selected.value })
  close()
}
</script>

<template>
  <BaseModal name="schedule" title="Weekly Schedule">
    <template #body>
      <div v-if="isOpen('schedule')" class="space-y-4">
        <p class="text-base text-text-secondary">
          Select the weekly schedule for this position.
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="sched in SCHEDULE_OPTIONS"
            :key="sched"
            type="button"
            :class="[
              'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
              selected === sched
                ? 'bg-brand-blue text-text-inverse border-brand-blue'
                : 'bg-surface-raised text-text-secondary border-border-strong hover:border-brand-blue',
            ]"
            @click="selected = sched"
          >
            {{ sched }}
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
