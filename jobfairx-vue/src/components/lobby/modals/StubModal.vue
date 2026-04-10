<!--
  StubModal
  ---------
  Generic placeholder used by every "not yet implemented" modal in this
  folder. Renders BaseModal with the supplied name + title and a friendly
  "stub" body. Each stub modal file just wraps this with its name + title +
  source pointer in a comment.

  When you implement a real modal, delete its stub file and replace it with
  one modeled after MessageModal.vue / ResumeModal.vue / DeclineModal.vue.
-->
<script setup lang="ts">
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useModal } from '@/composables/useModal'

defineProps<{
  name: string
  title: string
  /** Pointer to the original HTML markup so devs can find the source. */
  source: string
}>()

const { close } = useModal()
</script>

<template>
  <BaseModal :name="name" :title="title">
    <template #body>
      <div class="space-y-3 text-base text-text-secondary">
        <p>
          <span class="font-semibold text-text-primary">Stub modal.</span>
          The action button that opens this modal is wired up, but the form
          hasn't been built yet.
        </p>
        <p>
          See
          <code class="px-1.5 py-0.5 bg-border-subtle rounded text-sm">{{ source }}</code>
          in the HTML prototype for the design, and use
          <code class="px-1.5 py-0.5 bg-border-subtle rounded text-sm">MessageModal.vue</code>
          as a structural reference.
        </p>
      </div>
    </template>
    <template #footer>
      <BaseButton variant="secondary" @click="close()">Close</BaseButton>
    </template>
  </BaseModal>
</template>
