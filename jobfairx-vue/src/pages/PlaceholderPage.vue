<!--
  PlaceholderPage
  ---------------
  Empty page used by router routes that haven't been converted yet
  (Dashboard, Jobs, Candidates). Lets the TopBar nav links work without
  404s while the rest of the app is still being built.
-->
<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <main class="container-page max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold text-text-primary">{{ title }}</h1>
    <p class="mt-2 text-base text-text-secondary">
      This page hasn't been converted from the HTML prototype yet. See the
      <code class="px-1.5 py-0.5 bg-border-subtle rounded text-sm">Employer-Dashboard/</code>
      folder for the source HTML.
    </p>
  </main>
</template>
