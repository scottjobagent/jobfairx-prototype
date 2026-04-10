<!--
  TopBar
  ------
  Global app header. In the HTML prototype this lives in every page;
  in the Vue version it's mounted once in App.vue (or in the router layout).

  Contains: brand wordmark, primary nav links, user menu placeholder.
  Nav active state will be wired to the router once more pages exist.
-->
<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/lobby', label: 'Lobby' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/candidates', label: 'Candidates' },
] as const

const isActive = (to: string): boolean => route.path.startsWith(to)

// TODO(dev): pull initials from auth context once it exists.
const userInitials = 'SC' as const
</script>

<template>
  <header
    class="h-14 px-8 flex items-center justify-between bg-surface-raised border-b border-border-strong"
  >
    <div class="flex items-center gap-10">
      <RouterLink to="/" class="text-xl font-extrabold text-brand-blue tracking-tight">
        JobFairX
      </RouterLink>
      <nav class="flex items-center gap-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="[
            'px-3 py-2 text-base font-medium rounded transition-colors',
            isActive(item.to)
              ? 'text-brand-blue bg-brand-blue-light'
              : 'text-text-secondary hover:text-text-primary hover:bg-border-subtle',
          ]"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>

    <div class="flex items-center gap-4">
      <button
        type="button"
        class="w-9 h-9 rounded-full bg-brand-blue text-text-inverse text-sm font-semibold flex items-center justify-center"
        aria-label="User menu"
      >
        {{ userInitials }}
      </button>
    </div>
  </header>
</template>
