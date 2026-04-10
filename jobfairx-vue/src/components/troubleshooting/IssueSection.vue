<!--
  IssueSection
  -------
  Renders a single troubleshooting issue with label, title, and content area.
  Dispatches rendering to specific issue components based on type.
-->
<script setup lang="ts">
import IssueCameraMic from './IssueCameraMic.vue'
import IssueBrowser from './IssueBrowser.vue'
import IssueConnection from './IssueConnection.vue'

interface Props {
  issue: {
    label: string
    title: string
    content: 'camera-mic' | 'browser' | 'connection'
  }
}

defineProps<Props>()
</script>

<template>
  <div class="pb-10 mb-10 border-b border-border-default last:border-b-0">
    <div class="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-1.5">
      {{ issue.label }}
    </div>
    <h2 class="text-2xl font-bold text-text-primary mb-4">{{ issue.title }}</h2>

    <IssueCameraMic v-if="issue.content === 'camera-mic'" />
    <IssueBrowser v-else-if="issue.content === 'browser'" />
    <IssueConnection v-else-if="issue.content === 'connection'" />
  </div>
</template>
