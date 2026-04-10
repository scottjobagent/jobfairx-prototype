<!--
  BillingAddressCard
  ------------------
  Editable card for billing address (street, city, zip, country, state).
-->
<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import StatusCard from '@/components/base/StatusCard.vue'
import type { BillingAddress } from '@/types/account'

interface Props {
  data: BillingAddress
}

interface Emits {
  (e: 'save', data: BillingAddress): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isEditing = ref(false)
const form = ref<BillingAddress>({ ...props.data })

const startEdit = (): void => {
  isEditing.value = true
  form.value = { ...props.data }
}

const cancelEdit = (): void => {
  isEditing.value = false
}

const saveEdit = (): void => {
  emit('save', form.value)
  isEditing.value = false
}
</script>

<template>
  <StatusCard>
    <div class="p-7">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-text-primary">Billing address</h2>
        <button
          v-if="!isEditing"
          type="button"
          @click="startEdit"
          class="p-2 text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors"
          title="Edit billing address"
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

      <div class="grid grid-cols-2 gap-7">
        <!-- Street Address (full width) -->
        <div class="col-span-2">
          <label class="block text-sm font-semibold text-text-secondary mb-1.5">
            Street Address
          </label>
          <div v-if="!isEditing" class="text-base text-text-primary">
            {{ data.street }}
          </div>
          <input
            v-else
            v-model="form.street"
            type="text"
            class="w-full px-3.5 py-2.5 border border-border-default rounded-lg text-base text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-10"
          />
        </div>

        <!-- City -->
        <div>
          <label class="block text-sm font-semibold text-text-secondary mb-1.5">
            City
          </label>
          <div v-if="!isEditing" class="text-base text-text-primary">
            {{ data.city }}
          </div>
          <input
            v-else
            v-model="form.city"
            type="text"
            class="w-full px-3.5 py-2.5 border border-border-default rounded-lg text-base text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-10"
          />
        </div>

        <!-- ZIP Code -->
        <div>
          <label class="block text-sm font-semibold text-text-secondary mb-1.5">
            ZIP Code
          </label>
          <div v-if="!isEditing" class="text-base text-text-primary">
            {{ data.zip }}
          </div>
          <input
            v-else
            v-model="form.zip"
            type="text"
            class="w-full px-3.5 py-2.5 border border-border-default rounded-lg text-base text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-10"
          />
        </div>

        <!-- Country -->
        <div>
          <label class="block text-sm font-semibold text-text-secondary mb-1.5">
            Country
          </label>
          <div v-if="!isEditing" class="text-base text-text-primary">
            {{ data.country }}
          </div>
          <select
            v-else
            v-model="form.country"
            class="w-full px-3.5 py-2.5 border border-border-default rounded-lg text-base text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-10 bg-surface-raised cursor-pointer"
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
          </select>
        </div>

        <!-- State -->
        <div>
          <label class="block text-sm font-semibold text-text-secondary mb-1.5">
            State
          </label>
          <div v-if="!isEditing" class="text-base text-text-primary">
            {{ data.state }}
          </div>
          <select
            v-else
            v-model="form.state"
            class="w-full px-3.5 py-2.5 border border-border-default rounded-lg text-base text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-10 bg-surface-raised cursor-pointer"
          >
            <option value="IL">IL</option>
            <option value="CA">CA</option>
            <option value="NY">NY</option>
          </select>
        </div>
      </div>

      <!-- Edit Actions -->
      <div
        v-if="isEditing"
        class="flex justify-end gap-3 mt-7 pt-5.5 border-t border-border-default"
      >
        <BaseButton variant="secondary" size="md" @click="cancelEdit">
          Cancel
        </BaseButton>
        <BaseButton variant="primary" size="md" @click="saveEdit">
          Save
        </BaseButton>
      </div>
    </div>
  </StatusCard>
</template>
