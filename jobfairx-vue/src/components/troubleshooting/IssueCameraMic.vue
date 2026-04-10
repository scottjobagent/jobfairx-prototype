<!--
  IssueCameraMic
  -------
  Camera and microphone troubleshooting content with browser-specific
  instructions.
-->
<script setup lang="ts">
import BrowserInstructionsCard from './BrowserInstructionsCard.vue'
import { BROWSER_INSTRUCTIONS } from '@/data/troubleshooting-mock'
</script>

<template>
  <div class="space-y-4">
    <div class="text-xs font-bold text-brand-blue uppercase tracking-widest mb-3">Solution</div>

    <p class="text-base text-text-primary">
      Make sure your browser has permission to use your camera and microphone. Select
      <strong>Allow</strong> when prompted. If that didn't work, visit the
      <a
        href="https://network-test.daily.co/index.html"
        target="_blank"
        rel="noopener noreferrer"
        class="text-brand-blue hover:text-brand-blue-dark font-semibold underline"
      >
        Interview Test page
      </a>
      and follow the instructions below:
    </p>

    <div class="space-y-4">
      <BrowserInstructionsCard
        v-for="instruction in BROWSER_INSTRUCTIONS"
        :key="instruction.name"
        :instruction="instruction"
      />
    </div>
  </div>
</template>
