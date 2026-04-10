<!--
  SetupFlowPage
  ---------------
  Top-level page for /setup-flow. Owns the 3-step wizard state and composes:
    - Step1TitleLocation (capture job title and location)
    - Step2JobDetails (capture job details: type, pay, benefits, etc.)
    - Step3Review (review with field-edit modals)
    - All review-screen edit modals (mounted once at the page level)

  The wizard is managed by useSetupFlow() composable which provides
  reactive form state across steps.
-->
<script setup lang="ts">
import { ref } from 'vue'
import Step1TitleLocation from '@/components/setup-flow/Step1TitleLocation.vue'
import Step2JobDetails from '@/components/setup-flow/Step2JobDetails.vue'
import Step3Review from '@/components/setup-flow/Step3Review.vue'

// Review modals — fully built
import EditJobTypeModal from '@/components/setup-flow/modals/EditJobTypeModal.vue'
import EditPayModal from '@/components/setup-flow/modals/EditPayModal.vue'

// Review modals — stubs
import EditBenefitsModal from '@/components/setup-flow/modals/EditBenefitsModal.vue'
import EditShiftModal from '@/components/setup-flow/modals/EditShiftModal.vue'
import EditScheduleModal from '@/components/setup-flow/modals/EditScheduleModal.vue'
import EditDescriptionModal from '@/components/setup-flow/modals/EditDescriptionModal.vue'

import { useSetupFlow } from '@/composables/useSetupFlow'

const { step } = useSetupFlow()

const goToStep = (target: 1 | 2 | 3): void => {
  step.value = target
}

const handleStep1Continue = (): void => {
  goToStep(2)
}

const handleStep2Back = (): void => {
  goToStep(1)
}

const handleStep2Continue = (): void => {
  goToStep(3)
}

const handleStep3Back = (): void => {
  goToStep(2)
}

const handleStep3Confirm = (): void => {
  // TODO: submit form to API
  // eslint-disable-next-line no-console
  console.log('[SetupFlowPage] Confirm clicked. Form complete.')
}
</script>

<template>
  <main class="container-page max-w-4xl mx-auto pb-16">
    <!-- Progress bar -->
    <div class="mb-8">
      <div class="flex gap-2">
        <div
          v-for="s in [1, 2, 3]"
          :key="s"
          class="h-1 flex-1 rounded-full transition-colors"
          :class="s <= step ? 'bg-brand-blue' : 'bg-border-default'"
        ></div>
      </div>
      <p class="mt-2 text-sm text-text-secondary">Step {{ step }} of 3</p>
    </div>

    <!-- Step 1: Title & Location -->
    <div v-if="step === 1" class="space-y-8">
      <Step1TitleLocation @continue="handleStep1Continue" />
    </div>

    <!-- Step 2: Job Details -->
    <div v-else-if="step === 2" class="space-y-8">
      <Step2JobDetails @back="handleStep2Back" @continue="handleStep2Continue" />
    </div>

    <!-- Step 3: Review -->
    <div v-else-if="step === 3" class="space-y-8">
      <Step3Review @back="handleStep3Back" @confirm="handleStep3Confirm" />
    </div>

    <!-- Review modals (mounted once; activated by useModal()) -->
    <EditJobTypeModal />
    <EditPayModal />
    <EditBenefitsModal />
    <EditShiftModal />
    <EditScheduleModal />
    <EditDescriptionModal />
  </main>
</template>
