<!--
  BaseModal
  ---------
  Wraps the modal-shell pattern from the HTML prototype:
  fixed full-screen backdrop, centered card, header / body / footer slots.

  Coordinates with `useModal()` so each modal instance only renders when
  its `name` matches the registry's open name. Closes on backdrop click
  and Escape key. Locks body scroll while open.

  Usage:
    <BaseModal name="message" title="Message Candidate" @close="...">
      <template #body>...</template>
      <template #footer>...</template>
    </BaseModal>
-->
<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'
import { useModal } from '@/composables/useModal'

interface Props {
  name: string
  title: string
  /** Tailwind max-width class — defaults to max-w-lg. */
  maxWidth?: string
}

const props = withDefaults(defineProps<Props>(), { maxWidth: 'max-w-lg' })

const emit = defineEmits<{
  close: []
}>()

const { state, close } = useModal()

const isOpen = computed<boolean>(() => state.value.name === props.name)

const handleClose = (): void => {
  close()
  emit('close')
}

const onKey = (e: KeyboardEvent): void => {
  if (e.key === 'Escape' && isOpen.value) handleClose()
}

watch(
  isOpen,
  (open) => {
    if (open) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
    } else {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="handleClose"
      >
        <div
          :class="[
            'w-full bg-surface-raised rounded-lg shadow-modal flex flex-col max-h-[90vh]',
            maxWidth,
          ]"
          role="dialog"
          aria-modal="true"
        >
          <header
            class="flex items-center justify-between px-6 py-4 border-b border-border-default"
          >
            <h2 class="text-xl font-semibold text-text-primary">{{ title }}</h2>
            <button
              type="button"
              class="text-text-tertiary hover:text-text-primary text-2xl leading-none"
              aria-label="Close"
              @click="handleClose"
            >
              &times;
            </button>
          </header>

          <div class="flex-1 overflow-y-auto px-6 py-5">
            <slot name="body" />
          </div>

          <footer
            v-if="$slots.footer"
            class="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-default"
          >
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
