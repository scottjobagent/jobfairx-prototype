<!--
  BaseButton
  ----------
  Single button primitive used everywhere in the app. Three variants matching
  the HTML prototype: primary (filled brand blue), secondary (white w/ border),
  and ghost (text-only).

  Use this instead of raw <button> in pages so we can change the look in one
  place. If you need a custom one-off, use Tailwind classes directly — but
  if it appears more than twice, add a variant here.
-->
<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface Props {
  variant?: Variant
  size?: Size
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
})

const classes = computed(() => {
  const base =
    'inline-flex items-center justify-center font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  const variants: Record<Variant, string> = {
    primary:
      'bg-brand-blue text-text-inverse hover:bg-brand-blue-dark border border-brand-blue',
    secondary:
      'bg-surface-raised text-text-primary hover:bg-border-subtle border border-border-strong',
    ghost: 'bg-transparent text-text-primary hover:bg-border-subtle border border-transparent',
  }

  const sizes: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-md',
  }

  return [base, variants[props.variant], sizes[props.size]].join(' ')
})
</script>

<template>
  <button :type="type" :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>
