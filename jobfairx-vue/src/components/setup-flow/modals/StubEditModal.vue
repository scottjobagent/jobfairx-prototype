<!--
  StubEditModal
  -----------
  Generic stub modal for remaining edit fields (benefits, shift, schedule, description).
  Provides placeholder UI matching BaseModal pattern.

  Replace by following EditJobTypeModal or EditPayModal pattern:
  - Read current value from useSetupFlow().state
  - Render form controls
  - Save changes by calling setter from useSetupFlow()
  - Call close() when done

  Usage stubs:
  - setupReviewBenefits → EditBenefitsModal (benefits checkboxes)
  - setupReviewShift → EditShiftModal (shift select dropdown)
  - setupReviewSchedule → EditScheduleModal (schedule select dropdown)
  - setupReviewDescription → EditDescriptionModal (textarea)
-->
<script setup lang="ts">
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useModal } from '@/composables/useModal'

interface Props {
  name: string
  title: string
}

const props = defineProps<Props>()
const { close } = useModal()
</script>

<template>
  <BaseModal :name="props.name" :title="props.title" maxWidth="max-w-md">
    <template #body>
      <div class="py-8 px-4 text-center">
        <p class="text-text-secondary">This modal is a stub. Implement using EditJobTypeModal or EditPayModal as reference.</p>
      </div>
    </template>
    <template #footer>
      <BaseButton variant="secondary" @click="close()">Cancel</BaseButton>
      <BaseButton variant="primary" @click="close()">Save</BaseButton>
    </template>
  </BaseModal>
</template>
