<!--
  EditJobModal
  -----------
  Stub modal for editing a job. The action button is wired, but the form
  hasn't been fully built. This is a representative modal; other edit
  operations (screening, email, interview settings, etc.) follow the stub
  pattern in separate files.

  SOURCE: edit-post.html ~line 627 (job card "Edit" button)
-->
<script setup lang="ts">
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useModal } from '@/composables/useModal'

const { close } = useModal()
</script>

<template>
  <BaseModal name="editJob" title="Edit Job" max-width="max-w-2xl">
    <template #body>
      <div class="space-y-3 text-base text-text-secondary">
        <p>
          <span class="font-semibold text-text-primary">Stub modal.</span>
          The action button that opens this modal is wired up, but the form
          hasn't been built yet.
        </p>
        <p>
          See
          <code class="px-1.5 py-0.5 bg-border-subtle rounded text-sm">
            edit-post.html ~line 627
          </code>
          in the HTML prototype for the design, and use
          <code class="px-1.5 py-0.5 bg-border-subtle rounded text-sm">
            MessageModal.vue
          </code>
          as a structural reference.
        </p>
      </div>
    </template>
    <template #footer>
      <BaseButton variant="secondary" @click="close()">Close</BaseButton>
    </template>
  </BaseModal>
</template>
