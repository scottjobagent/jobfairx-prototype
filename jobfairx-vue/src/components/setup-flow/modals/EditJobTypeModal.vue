<!--
  EditJobTypeModal
  ----------------
  Edit job type selection from review screen.
  Fully implemented modal following MessageModal pattern.
-->
<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useModal } from '@/composables/useModal'
import { useSetupFlow } from '@/composables/useSetupFlow'
import { JOB_TYPES } from '@/data/setup-flow-mock'
import type { JobType } from '@/types/setup-flow'

const { state, close } = useModal()
const { state: formState, setJobTypes } = useSetupFlow()

const localJobTypes = ref<JobType[]>([...formState.jobTypes])

const toggleType = (type: JobType): void => {
  const idx = localJobTypes.value.indexOf(type)
  if (idx >= 0) {
    localJobTypes.value.splice(idx, 1)
  } else {
    localJobTypes.value.push(type)
  }
}

const save = (): void => {
  if (localJobTypes.value.length > 0) {
    setJobTypes(localJobTypes.value)
    close()
  }
}

watch(
  () => state.value.payload['field'],
  () => {
    localJobTypes.value = [...formState.jobTypes]
  },
)
</script>

<template>
  <BaseModal name="setupReviewJobType" title="Edit job type" maxWidth="max-w-md">
    <template #body>
      <div class="space-y-3">
        <button
          v-for="jt in JOB_TYPES"
          :key="jt.id"
          type="button"
          class="w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors text-left"
          :class="localJobTypes.includes(jt.id as JobType) ? 'border-brand-blue bg-brand-blue-light' : 'border-border-default hover:border-text-tertiary'"
          @click="toggleType(jt.id as JobType)"
        >
          <div class="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0" :class="localJobTypes.includes(jt.id as JobType) ? 'border-brand-blue bg-brand-blue' : 'border-text-tertiary'">
            <svg v-if="localJobTypes.includes(jt.id as JobType)" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span class="font-medium">{{ jt.label }}</span>
        </button>
      </div>
    </template>
    <template #footer>
      <BaseButton variant="secondary" @click="close()">Cancel</BaseButton>
      <BaseButton variant="primary" :disabled="localJobTypes.length === 0" @click="save">Save</BaseButton>
    </template>
  </BaseModal>
</template>
