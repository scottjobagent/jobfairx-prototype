<!--
  CompanyInfoCard
  ---------------
  Editable card for company information (name and billing email).
-->
<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import StatusCard from '@/components/base/StatusCard.vue'
import type { CompanyInfo } from '@/types/account'

interface Props {
  data: CompanyInfo
}

interface Emits {
  (e: 'save', data: CompanyInfo): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isEditing = ref(false)
const form = ref<CompanyInfo>({ ...props.data })

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
        <h2 class="text-xl font-semibold text-text-primary">Company information</h2>
        <button
          v-if="!isEditing"
          type="button"
          @click="startEdit"
          class="p-2 text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors"
          title="Edit company information"
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

      <!-- Company Name -->
      <div class="mb-7">
        <label class="block text-sm font-semibold text-text-secondary mb-1.5">
          Company Name
        </label>
        <div v-if="!isEditing" class="text-base text-text-primary">
          {{ data.companyName }}
        </div>
        <input
          v-else
          v-model="form.companyName"
          type="text"
          class="w-full px-3.5 py-2.5 border border-border-default rounded-lg text-base text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-10"
        />
      </div>

      <!-- Billing Email -->
      <div>
        <label class="block text-sm font-semibold text-text-secondary mb-1.5">
          Billing Email
        </label>
        <div v-if="!isEditing" class="text-base text-text-primary">
          {{ data.billingEmail }}
        </div>
        <input
          v-else
          v-model="form.billingEmail"
          type="email"
          class="w-full px-3.5 py-2.5 border border-border-default rounded-lg text-base text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-10"
        />
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
