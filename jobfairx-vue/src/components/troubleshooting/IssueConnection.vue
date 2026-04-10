<!--
  IssueConnection
  -------
  Network connection troubleshooting with numbered steps and IT network
  configuration guidance.
-->
<script setup lang="ts">
import AllowlistTable from './AllowlistTable.vue'
import { ALLOWLIST_ENTRIES } from '@/data/troubleshooting-mock'
</script>

<template>
  <div class="space-y-4">
    <div class="text-xs font-bold text-brand-blue uppercase tracking-widest mb-3">Solution</div>

    <p class="text-base text-text-primary">
      Run a network test and check your connection settings. If your camera and microphone work but
      you still can't connect, try this:
    </p>

    <!-- Numbered steps -->
    <ol class="space-y-6 pl-0 list-none">
      <!-- Step 1 -->
      <li class="relative pl-10">
        <div
          class="absolute left-0 top-0 w-6 h-6 bg-brand-blue text-text-inverse rounded-full flex items-center justify-center text-xs font-bold"
        >
          1
        </div>
        <div>
          <div class="font-semibold text-text-primary">Run a network connection test.</div>
          <p class="text-sm text-text-primary mt-1">
            This checks if your network supports JobFairX's WebRTC video technology.
          </p>
          <div
            class="bg-surface-raised border-2 border-dashed border-border-strong rounded p-6 text-center text-sm text-text-tertiary italic mt-3"
          >
            Placeholder: Network test link will be added here once available.
          </div>
        </div>
      </li>

      <!-- Step 2 -->
      <li class="relative pl-10">
        <div
          class="absolute left-0 top-0 w-6 h-6 bg-brand-blue text-text-inverse rounded-full flex items-center justify-center text-xs font-bold"
        >
          2
        </div>
        <div>
          <div class="font-semibold text-text-primary">If the test fails, share this article with your IT team.</div>
          <p class="text-sm text-text-primary mt-1">
            They can use the information below to update your network settings.
          </p>
        </div>
      </li>
    </ol>

    <!-- IT Section -->
    <div class="bg-surface-gray rounded-lg p-7 md:p-8 mt-8">
      <h3 class="text-lg font-bold text-text-primary mb-2">For IT and network teams</h3>
      <p class="text-sm text-text-primary mb-6">
        Use this information to configure your network for JobFairX Interviews. JobFairX uses
        WebRTC for real-time video communication.
      </p>

      <!-- Step 1: Allowlist -->
      <h4 class="text-md font-bold text-text-primary mt-5 mb-4">Step 1: Update your network's allowlist</h4>
      <p class="text-sm text-text-primary mb-4">
        Add these domains, protocols, and port ranges to your approved list (allowlist):
      </p>
      <div class="mb-6">
        <AllowlistTable :entries="ALLOWLIST_ENTRIES" />
      </div>

      <div
        class="bg-surface-raised border-2 border-dashed border-border-strong rounded p-4 text-sm text-text-tertiary italic text-center"
      >
        Placeholder: Your dev team will need to update the domains above with your actual
        STUN/TURN server addresses, signaling server domains, and any media relay infrastructure.
        The ports shown (443 for TCP, 3478 for STUN/TURN) are standard WebRTC defaults.
      </div>

      <!-- Step 2: Rerun test -->
      <h4 class="text-md font-bold text-text-primary mt-6 mb-4">Step 2: Rerun the network test</h4>
      <ol class="space-y-3 pl-0 list-none">
        <li class="relative pl-10">
          <div
            class="absolute left-0 top-0 w-6 h-6 bg-brand-blue text-text-inverse rounded-full flex items-center justify-center text-xs font-bold"
          >
            1
          </div>
          <div class="text-sm text-text-primary">Rerun the network test to confirm everything works.</div>
        </li>
        <li class="relative pl-10">
          <div
            class="absolute left-0 top-0 w-6 h-6 bg-brand-blue text-text-inverse rounded-full flex items-center justify-center text-xs font-bold"
          >
            2
          </div>
          <div class="text-sm text-text-primary">
            If issues remain, download the test results and contact your JobFairX representative for help.
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>
