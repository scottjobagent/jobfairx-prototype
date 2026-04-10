<!--
  ReviewTable
  -----------
  Generic review table with 3 columns: label | value | action (lock/pencil).
  Wraps the table styling from the prototype.
-->
<script setup lang="ts"></script>

<template>
  <div class="bg-surface-raised rounded-lg shadow-card overflow-hidden">
    <table class="w-full">
      <tbody>
        <slot />
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
}

:deep(td) {
  vertical-align: middle;
  text-align: left;
  padding: 1rem;
}

:deep(td:first-child) {
  width: 20%;
  font-weight: 500;
}

:deep(td:nth-child(2)) {
  width: 60%;
}

:deep(td:nth-child(3)) {
  width: 20%;
  text-align: right;
}
</style>
