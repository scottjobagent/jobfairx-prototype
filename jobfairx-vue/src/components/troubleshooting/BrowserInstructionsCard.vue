<!--
  BrowserInstructionsCard
  -------
  Displays browser-specific instructions for camera and microphone setup.
  Shows browser name and ordered list of steps.
-->
<script setup lang="ts">
import type { BrowserInstructions } from '@/types/troubleshooting'

defineProps<{
  instruction: BrowserInstructions
}>()
</script>

<template>
  <div class="bg-surface-gray rounded-md p-5 md:p-6">
    <div class="text-md font-semibold text-text-primary mb-3">{{ instruction.name }}</div>
    <ol class="pl-5 space-y-1">
      <li v-for="(step, idx) in instruction.steps" :key="idx" class="text-sm text-text-primary list-decimal">
        {{ step }}
      </li>
    </ol>
  </div>
</template>
