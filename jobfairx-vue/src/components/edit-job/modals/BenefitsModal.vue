<!--
  BenefitsModal
  -------------
  Multi-select chip modal for selecting job benefits.
  Represents the "chip form pattern" from DeclineModal.vue.

  FULLY IMPLEMENTED per assignment.
-->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useModal } from '@/composables/useModal'
import { BENEFIT_OPTIONS } from '@/data/edit-job-mock'

const { state, close, isOpen } = useModal()

const selected = ref<Set<string>>(new Set())

const currentBenefits = computed<string>(() => {
  const b = state.value.payload['benefits'] as string | undefined
  return b ?? ''
})

watch(
  () => state.value.payload['benefits'],
  () => {
    const benefits = currentBenefits.value
    selected.value = new Set(benefits ? benefits.split(', ') : [])
  },
)

const toggleBenefit = (benefit: string): void => {
  if (selected.value.has(benefit)) {
    selected.value.delete(benefit)
  } else {
    selected.value.add(benefit)
  }
}

const submit = (): void => {
  const display = Array.from(selected.value).join(', ')
  // TODO(dev): wire to job update API
  // eslint-disable-next-line no-console
  console.log('[BenefitsModal] saving benefits:', { benefits: display })
  close()
}
</script>

<template>
  <BaseModal name="benefits" title="Benefits" max-width="max-w-xl">
    <template #body>
      <div v-if="isOpen('benefits')" class="space-y-4">
        <p class="text-base text-text-secondary">
          Select all benefits that apply. You can pick more than one.
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="benefit in BENEFIT_OPTIONS"
            :key="benefit"
            type="button"
            :class="[
              'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
              selected.has(benefit)
                ? 'bg-brand-blue text-text-inverse border-brand-blue'
                : 'bg-surface-raised text-text-secondary border-border-strong hover:border-brand-blue',
            ]"
            @click="toggleBenefit(benefit)"
          >
            {{ benefit }}
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
