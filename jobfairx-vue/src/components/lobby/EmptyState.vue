<!--
  EmptyState
  ----------
  Generic empty-state placeholder used in each lobby panel when there are
  no candidates. Title + body text + optional CTA slot.
-->
<script setup lang="ts">
defineProps<{
  title: string
  body: string
}>()
</script>

<template>
  <div class="px-6 py-16 text-center">
    <h3 class="text-xl font-semibold text-text-primary mb-2">{{ title }}</h3>
    <p class="text-base text-text-secondary max-w-md mx-auto">{{ body }}</p>
    <div v-if="$slots.cta" class="mt-6">
      <slot name="cta" />
    </div>
  </div>
</template>
