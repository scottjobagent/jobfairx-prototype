<!--
  StatusCard
  ----------
  Generic card surface used for empty states, info banners, and the
  lobby's panel containers. Just a white surface with a border, rounded
  corners, and the prototype's `card` shadow. Pass any content via slot.
-->
<script setup lang="ts">
interface Props {
  /** Visually flatten — used for nested cards. */
  flat?: boolean
}

withDefaults(defineProps<Props>(), { flat: false })
</script>

<template>
  <div
    :class="[
      'bg-surface-raised rounded-lg border border-border-default',
      flat ? '' : 'shadow-card',
    ]"
  >
    <slot />
  </div>
</template>
