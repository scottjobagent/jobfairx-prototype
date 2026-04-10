<!--
  IssueBrowser
  -------
  Browser compatibility troubleshooting showing supported and incompatible
  devices/browsers.
-->
<script setup lang="ts">
import DeviceCompatibilityCard from './DeviceCompatibilityCard.vue'
import { DEVICE_CARDS } from '@/data/troubleshooting-mock'
</script>

<template>
  <div class="space-y-4">
    <div class="text-xs font-bold text-brand-blue uppercase tracking-widest mb-3">Solution</div>

    <p class="text-base text-text-primary">
      Use a supported browser. JobFairX's interview platform uses WebRTC technology which requires
      a modern browser.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DeviceCompatibilityCard v-for="card in DEVICE_CARDS" :key="card.title" :card="card" />
    </div>

    <div class="bg-yellow-50 border-l-4 border-l-yellow-700 rounded-r p-4 text-sm text-text-primary">
      <strong>Note:</strong> Using other apps during the interview may turn off the microphone if
      you're using a phone or tablet. If the interviewer can't hear you, restart your device and
      re-enter the interview.
    </div>
  </div>
</template>
