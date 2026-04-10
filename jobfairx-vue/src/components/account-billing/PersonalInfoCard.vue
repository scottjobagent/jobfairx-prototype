<!--
  PersonalInfoCard
  ----------------
  Editable card for personal information (first/last name, company, title, email, phone).
  Displays values by default; shows input fields when editing.
-->
<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import StatusCard from '@/components/base/StatusCard.vue'
import type { PersonalInfo } from '@/types/account'

interface Props {
  data: PersonalInfo
}

interface Emits {
  (e: 'save', data: PersonalInfo): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isEditing = ref(false)
const form = ref<PersonalInfo>({ ...props.data })

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
        <h2 class="text-xl font-semibold text-text-primary">Your information</h2>
        <button
          v-if="!isEditing"
          type="button"
          @click="startEdit"
          class="p-2 text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors"
          title="Edit your information"
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
        <!-- First Name -->
        <div>
          <label class="block text-sm font-semibold text-text-secondary mb-1.5">
            First Name
          </label>
          <div v-if="!isEditing" class="text-base text-text-primary">
            {{ data.firstName }}
          </div>
          <input
            v-else
            v-model="form.firstName"
            type="text"
            class="w-full px-3.5 py-2.5 border border-border-default rounded-lg text-base text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-10"
          />
        </div>

        <!-- Last Name -->
        <div>
          <label class="block text-sm font-semibold text-text-secondary mb-1.5">
            Last Name
          </label>
          <div v-if="!isEditing" class="text-base text-text-primary">
            {{ data.lastName }}
          </div>
          <input
            v-else
            v-model="form.lastName"
            type="text"
            class="w-full px-3.5 py-2.5 border border-border-default rounded-lg text-base text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-10"
          />
        </div>

        <!-- Company Name -->
        <div>
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

        <!-- Job Title -->
        <div>
          <label class="block text-sm font-semibold text-text-secondary mb-1.5">
            Job Title
          </label>
          <div v-if="!isEditing" class="text-base text-text-primary">
            {{ data.jobTitle }}
          </div>
          <input
            v-else
            v-model="form.jobTitle"
            type="text"
            class="w-full px-3.5 py-2.5 border border-border-default rounded-lg text-base text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-10"
          />
        </div>

        <!-- Email (full width) -->
        <div class="col-span-2">
          <label class="block text-sm font-semibold text-text-secondary mb-1.5">
            Email
          </label>
          <div v-if="!isEditing" class="text-base text-text-primary">
            {{ data.email }}
          </div>
          <input
            v-else
            v-model="form.email"
            type="email"
            class="w-full px-3.5 py-2.5 border border-border-default rounded-lg text-base text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-10"
          />
        </div>

        <!-- Phone (full width) -->
        <div class="col-span-2">
          <label class="block text-sm font-semibold text-text-secondary mb-1.5">
            Phone
          </label>
          <div v-if="!isEditing" class="text-base text-text-primary">
            {{ data.phone }}
          </div>
          <input
            v-else
            v-model="form.phone"
            type="tel"
            class="w-full px-3.5 py-2.5 border border-border-default rounded-lg text-base text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-10"
          />
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
