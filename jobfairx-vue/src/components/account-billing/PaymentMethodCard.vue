<!--
  PaymentMethodCard
  -----------------
  Displays current payment method or form to update it.
  Fully built modal for editing payment details.
-->
<script setup lang="ts">
import { computed } from 'vue'
import StatusCard from '@/components/base/StatusCard.vue'
import { useModal } from '@/composables/useModal'
import type { PaymentMethod } from '@/types/account'

interface Props {
  data: PaymentMethod
}

interface Emits {
  (e: 'save', data: PaymentMethod): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { open } = useModal()

const brandClass = computed<string>(() => {
  const map: Record<PaymentMethod['cardBrand'], string> = {
    VISA: 'bg-brand-blue-light text-brand-blue',
    MASTERCARD: 'bg-red-50 text-red-700',
    AMEX: 'bg-blue-50 text-blue-700',
    DISCOVER: 'bg-orange-50 text-orange-700',
  }
  return map[props.data.cardBrand]
})

const expiryDisplay = computed<string>(() => {
  const month = String(props.data.expiryMonth).padStart(2, '0')
  return `${month}/${props.data.expiryYear}`
})

const openEditPaymentModal = (): void => {
  open('updatePaymentMethod', { currentPayment: props.data })
}

const handleModalSave = (updatedPayment: PaymentMethod): void => {
  emit('save', updatedPayment)
}
</script>

<template>
  <StatusCard>
    <div class="p-7">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-text-primary">Payment method</h2>
        <button
          type="button"
          @click="openEditPaymentModal"
          class="p-2 text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors"
          title="Edit payment method"
        >
          <svg
            viewBox="0 0 24 24"
            class="w-6 h-6"
            fill="currentColor"
          >
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
      </div>

      <div class="flex items-start gap-4">
        <div
          :class="[
            'inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg',
            brandClass,
          ]"
        >
          {{ data.cardBrand }}
        </div>
        <div>
          <div class="text-base font-medium text-text-primary">
            •••• •••• •••• {{ data.lastFour }}
          </div>
          <div class="text-sm text-text-tertiary mt-0.5">
            Expires {{ expiryDisplay }} · {{ data.nameOnCard }}
          </div>
        </div>
      </div>
    </div>
  </StatusCard>

  <!-- Emit event to trigger modal from parent -->
  <Teleport to="body">
    <div
      v-if="false"
      @update-payment-method="handleModalSave"
    />
  </Teleport>
</template>
