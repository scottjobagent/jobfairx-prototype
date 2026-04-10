<!--
  PublicHeader
  -----------
  Public JobFairX header with navigation and CTAs.
  Appears at the top of the share preview page.
-->
<script setup lang="ts">
// Static public navigation component
</script>

<template>
  <div class="bg-text-primary text-text-inverse">
    <div class="px-6 py-3 text-center text-sm">
      Are you an employer hiring?
      <a href="#" class="underline font-semibold ml-1.5">Learn more about our hiring events</a>
    </div>
  </div>

  <nav class="bg-surface-raised border-b border-border-strong">
    <div class="max-w-7xl mx-auto px-6 py-5 sm:px-8 flex items-center justify-between">
      <a href="#" class="text-2xl font-black text-brand-blue tracking-tight">JobFairX</a>

      <div class="hidden md:flex gap-8 flex-1 ml-10">
        <a href="#" class="text-base font-semibold text-text-primary hover:text-brand-blue">
          Upcoming Job Fairs
        </a>
        <a href="#" class="text-base font-semibold text-text-primary hover:text-brand-blue">
          Search Jobs
        </a>
        <a href="#" class="text-base font-semibold text-text-primary hover:text-brand-blue">
          FAQ's
        </a>
      </div>

      <div class="flex items-center gap-4">
        <a href="#" class="text-base font-semibold text-text-primary hover:text-brand-blue">
          Sign In
        </a>
        <a
          href="#"
          class="px-5 py-2.5 text-sm font-bold text-text-inverse bg-brand-blue rounded hover:bg-brand-blue-dark"
        >
          Job Seeker Registration
        </a>
      </div>
    </div>
  </nav>
</template>
