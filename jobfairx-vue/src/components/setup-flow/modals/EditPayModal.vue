<!--
  EditPayModal
  -----------
  Edit pay range from review screen.
  Fully implemented modal following MessageModal pattern.
-->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useModal } from '@/composables/useModal'
import { useSetupFlow } from '@/composables/useSetupFlow'

const { state, close } = useModal()
const { state: formState, setPayType, setPayRange } = useSetupFlow()

const payType = ref<'hourly' | 'salary'>(formState.payType)
const payMin = ref(formState.payMin)
const payMax = ref(formState.payMax)

const displayedPayMin = computed(() => {
  return payType.value === 'hourly'
    ? `$${payMin.value.toFixed(2)}`
    : `$${Math.round(payMin.value).toLocaleString()}`
})

const displayedPayMax = computed(() => {
  return payType.value === 'hourly'
    ? `$${payMax.value.toFixed(2)}`
    : `$${Math.round(payMax.value).toLocaleString()}`
})

const displayedPayUnit = computed(() => {
  return payType.value === 'hourly' ? 'per hour' : 'a year'
})

const save = (): void => {
  setPayType(payType.value)
  setPayRange(payMin.value, payMax.value)
  close()
}

watch(
  () => state.value.payload['field'],
  () => {
    payType.value = formState.payType
    payMin.value = formState.payMin
    payMax.value = formState.payMax
  },
)
</script>

<template>
  <BaseModal name="setupReviewPay" title="Edit pay" maxWidth="max-w-md">
    <template #body>
      <div class="space-y-4">
        <div class="flex gap-3">
          <button
            type="button"
            class="px-4 py-2 rounded-lg font-medium transition-colors"
            :class="payType === 'hourly' ? 'bg-brand-blue text-white' : 'bg-border-subtle text-text-primary hover:bg-border-strong'"
            @click="payType = 'hourly'"
          >
            Hourly
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg font-medium transition-colors"
            :class="payType === 'salary' ? 'bg-brand-blue text-white' : 'bg-border-subtle text-text-primary hover:bg-border-strong'"
            @click="payType = 'salary'"
          >
            Salary
          </button>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-sm font-medium text-text-secondary">Minimum</label>
            <input
              v-model.number="payMin"
              type="number"
              class="w-full rounded-lg border-2 border-text-tertiary px-3 py-2 text-sm focus:outline-none focus:border-brand-blue"
              placeholder="0"
            >
          </div>
          <div class="space-y-1">
            <label class="text-sm font-medium text-text-secondary">Maximum</label>
            <input
              v-model.number="payMax"
              type="number"
              class="w-full rounded-lg border-2 border-text-tertiary px-3 py-2 text-sm focus:outline-none focus:border-brand-blue"
              placeholder="0"
            >
          </div>
        </div>

        <p class="text-sm text-text-secondary">{{ displayedPayMin }} - {{ displayedPayMax }} {{ displayedPayUnit }}</p>
      </div>
    </template>
    <template #footer>
      <BaseButton variant="secondary" @click="close()">Cancel</BaseButton>
      <BaseButton variant="primary" @click="save">Save</BaseButton>
    </template>
  </BaseModal>
</template>
