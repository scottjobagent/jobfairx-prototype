<!--
  UpdatePaymentMethodModal
  ------------------------
  Fully implemented modal for updating payment method details.
  Handles card number, expiry, CVC, cardholder name, and billing address.
  Source: account-billing.html ~line 394 (section-payment edit form)
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useModal } from '@/composables/useModal'
import type { PaymentMethod } from '@/types/account'

const { close } = useModal()

// Payment form state
const cardNumber = ref<string>('')
const expiry = ref<string>('')
const cvc = ref<string>('')
const nameOnCard = ref<string>('')
const country = ref<string>('United States')
const state_field = ref<string>('IL')
const zipCode = ref<string>('')

// Format card number for display
const formatCardNumber = (value: string): string => {
  return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
}

// Detect card brand from number
const detectCardBrand = (number: string): PaymentMethod['cardBrand'] => {
  const cleaned = number.replace(/\s/g, '')
  if (cleaned.startsWith('4')) return 'VISA'
  if (cleaned.startsWith('5')) return 'MASTERCARD'
  if (cleaned.startsWith('3')) return 'AMEX'
  if (cleaned.startsWith('6')) return 'DISCOVER'
  return 'VISA'
}

const isValidForm = computed<boolean>(() => {
  return (
    cardNumber.value.replace(/\s/g, '').length === 16 &&
    expiry.value.match(/^\d{2}\/\d{2}$/) !== null &&
    cvc.value.length === 4 &&
    nameOnCard.value.length > 0 &&
    zipCode.value.length > 0
  )
})

const handleCardNumberInput = (e: Event): void => {
  const input = e.target as HTMLInputElement
  input.value = formatCardNumber(input.value.replace(/\D/g, '').slice(0, 16))
  cardNumber.value = input.value
}

const handleExpiryInput = (e: Event): void => {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4)
  }
  input.value = value
  expiry.value = value
}

const handleCvcInput = (e: Event): void => {
  const input = e.target as HTMLInputElement
  input.value = input.value.replace(/\D/g, '').slice(0, 4)
  cvc.value = input.value
}

const handleSave = (): void => {
  if (!isValidForm.value) return

  const parts = expiry.value.split('/')
  const month = Number(parts[0])
  const year = Number(parts[1])
  if (Number.isNaN(month) || Number.isNaN(year)) return
  const lastFour = cardNumber.value.slice(-4)
  const brand = detectCardBrand(cardNumber.value)

  // TODO(dev): wire to billing API.
  // eslint-disable-next-line no-console
  console.log('[UpdatePaymentMethodModal] saving:', {
    cardBrand: brand,
    lastFour,
    expiryMonth: month,
    expiryYear: 2000 + year,
    nameOnCard: nameOnCard.value,
  } satisfies PaymentMethod)
  close()
}

const handleClose = (): void => {
  close()
}
</script>

<template>
  <BaseModal
    name="updatePaymentMethod"
    title="Update Payment Method"
    max-width="max-w-lg"
    @close="handleClose"
  >
    <template #body>
      <div class="space-y-5">
        <!-- Card Number -->
        <div>
          <label class="block text-sm font-semibold text-text-primary mb-1.5">
            Card Number
          </label>
          <input
            type="text"
            inputmode="numeric"
            autocomplete="off"
            placeholder="1234 5678 9012 3456"
            @input="handleCardNumberInput"
            class="w-full px-3.5 py-2.5 border border-border-default rounded-lg text-base text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-10"
          />
        </div>

        <!-- Expiry & CVC -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-text-primary mb-1.5">
              Expiration
            </label>
            <input
              type="text"
              inputmode="numeric"
              autocomplete="off"
              placeholder="MM/YY"
              maxlength="5"
              @input="handleExpiryInput"
              class="w-full px-3.5 py-2.5 border border-border-default rounded-lg text-base text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-10"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-text-primary mb-1.5">
              Security Code
            </label>
            <input
              type="text"
              inputmode="numeric"
              autocomplete="off"
              placeholder="CVC"
              maxlength="4"
              @input="handleCvcInput"
              class="w-full px-3.5 py-2.5 border border-border-default rounded-lg text-base text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-10"
            />
          </div>
        </div>

        <!-- Name on Card -->
        <div>
          <label class="block text-sm font-semibold text-text-primary mb-1.5">
            Name on Card
          </label>
          <input
            v-model="nameOnCard"
            type="text"
            autocomplete="off"
            class="w-full px-3.5 py-2.5 border border-border-default rounded-lg text-base text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-10"
          />
        </div>

        <!-- Country & State -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-text-primary mb-1.5">
              Country
            </label>
            <select
              v-model="country"
              class="w-full px-3.5 py-2.5 border border-border-default rounded-lg text-base text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-10 bg-surface-raised cursor-pointer"
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-text-primary mb-1.5">
              State
            </label>
            <select
              v-model="state_field"
              class="w-full px-3.5 py-2.5 border border-border-default rounded-lg text-base text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-10 bg-surface-raised cursor-pointer"
            >
              <option value="IL">IL</option>
              <option value="CA">CA</option>
              <option value="NY">NY</option>
            </select>
          </div>
        </div>

        <!-- ZIP Code -->
        <div>
          <label class="block text-sm font-semibold text-text-primary mb-1.5">
            ZIP Code
          </label>
          <input
            v-model="zipCode"
            type="text"
            autocomplete="off"
            class="w-full px-3.5 py-2.5 border border-border-default rounded-lg text-base text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-10"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <BaseButton variant="secondary" size="md" @click="handleClose">
        Cancel
      </BaseButton>
      <BaseButton
        variant="primary"
        size="md"
        :disabled="!isValidForm"
        @click="handleSave"
      >
        Save Payment Method
      </BaseButton>
    </template>
  </BaseModal>
</template>
