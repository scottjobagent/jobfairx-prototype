<!--
  App
  ---
  Root component. Mounts the TopBar once and renders the active route below.
  Default route is /lobby for this sample so the dev sees the converted page
  immediately on `npm run dev`.
-->
<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopBar from '@/components/layout/TopBar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface-raised">
    <TopBar />
    <RouterView />
  </div>
</template>
