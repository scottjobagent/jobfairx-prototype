<!--
  JobTypeModal
  -----------
  Single-select chip modal for job type.
  STUB: Copy from edit-job.html line 222–238 (chip group pattern).
-->
<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useModal } from '@/composables/useModal'
import { JOB_TYPE_OPTIONS } from '@/data/edit-job-mock'

const { state, close, isOpen } = useModal()

const selected = ref<string | null>(null)

watch(
  () => state.value.payload['jobType'],
  () => {
    selected.value = (state.value.payload['jobType'] as string | undefined) ?? null
  },
)

const submit = (): void => {
  // TODO(dev): wire to job update API; see edit-job.html ~line 222
  // eslint-disable-next-line no-console
  console.log('[JobTypeModal] saving:', { jobType: selected.value })
  close()
}
</script>

<template>
  <BaseModal name="jobType" title="Job type">
    <template #body>
      <div v-if="isOpen('jobType')" class="space-y-4">
        <p class="text-base text-text-secondary">
          Select the job type that best describes this position.
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="type in JOB_TYPE_OPTIONS"
            :key="type"
            type="button"
            :class="[
              'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
              selected === type
                ? 'bg-brand-blue text-text-inverse border-brand-blue'
                : 'bg-surface-raised text-text-secondary border-border-strong hover:border-brand-blue',
            ]"
            @click="selected = type"
          >
            {{ type }}
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
