<!--
  AppSidebar
  ----------
  Pixel-perfect port of the `<nav class="sidebar">` block in visual.html
  (lines 734-780). Dark full-height fixed sidebar with:
    - Collapse button (top)
    - Dashboard / Interviews / Messaging nav items
    - Event Credits panel (bottom): Starter=2, Growth=1, Pro=0 (static per
      developer direction; will be wired up later)

  Tailwind scale notes — `tailwind.config.js` overrides defaults:
    rounded-sm = 6px, rounded = 8px, rounded-md = 10px, rounded-lg = 12px.
  Source values from visual.html:
    .collapse-btn  border-radius 6px  → rounded-sm
    .nav-item      border-radius 10px → rounded-[10px] (or rounded-md)
    .nav-item      padding 16px 18px  → py-4 px-[18px]
    .credits-grid  border-radius 8px  → rounded (DEFAULT)

  Active nav-item uses computed class strings so the base `font-medium` is
  never emitted when active — eliminates any risk of utility-order cascade
  flipping it back under `font-bold`.
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLayoutState } from '@/layouts/useLayoutState'

const { sidebarCollapsed, toggleSidebar } = useLayoutState()
const route = useRoute()

// Dashboard is considered active on /dashboard (and for now, on root).
// Interviews and Messaging routes will be added in Phase 2 — until then
// their nav items are still clickable (no-op) and show the hover state.
const isDashboardActive = computed<boolean>(() => {
  return route.name === 'dashboard' || route.path === '/'
})

// Shared sizing/layout classes for every nav-item.
const navItemBase =
  'flex items-center gap-3.5 rounded-[10px] text-[17px] cursor-pointer transition-all no-underline tracking-[-0.1px] max-[1024px]:!justify-center max-[1024px]:!py-2.5 max-[1024px]:!px-0'

// Build the full class string for a nav-item given its active state.
// NOTE: we emit EITHER `font-medium` or `font-bold`, never both, so there
// is no way for Tailwind's utility ordering to flip the active weight.
const navItemClass = (active: boolean): string => {
  const padding = sidebarCollapsed.value
    ? 'justify-center py-2.5 px-0'
    : 'py-4 px-[18px]'
  const state = active
    ? 'bg-white/[0.18] text-white font-bold [&_svg]:text-white'
    : 'font-medium text-white/85 hover:bg-white/10 hover:text-white'
  return `${navItemBase} ${padding} ${state}`
}
</script>

<template>
  <nav
    class="fixed left-0 top-0 bottom-0 bg-[#2d2d2d] z-[300] flex flex-col overflow-hidden transition-[width] duration-200 ease-out max-[1024px]:!w-[64px]"
    :class="sidebarCollapsed ? 'w-[60px]' : 'w-[220px]'"
  >
    <!-- Collapse button -->
    <div class="pt-[18px] px-4 pb-3 max-[1024px]:hidden">
      <button
        type="button"
        class="flex items-center gap-2.5 py-2 px-2.5 rounded-sm bg-transparent text-[15px] font-semibold text-white/90 hover:bg-white/10 hover:text-white transition-all w-full"
        :class="{ 'justify-center': sidebarCollapsed }"
        title="Collapse sidebar"
        @click="toggleSidebar"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 flex-shrink-0 text-white/90">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
        <span v-if="!sidebarCollapsed">Collapse</span>
      </button>
    </div>

    <!-- Nav items -->
    <div class="flex-1 px-3 py-2 overflow-y-auto">
      <div class="mb-1.5">
        <!-- Dashboard -->
        <a :class="navItemClass(isDashboardActive)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6 flex-shrink-0 text-white/70">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span v-if="!sidebarCollapsed" class="max-[1024px]:hidden">Dashboard</span>
        </a>

        <!-- Interviews -->
        <a :class="navItemClass(false)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6 flex-shrink-0 text-white/70">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
          <span v-if="!sidebarCollapsed" class="max-[1024px]:hidden">Interviews</span>
        </a>

        <!-- Messaging -->
        <a :class="navItemClass(false)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6 flex-shrink-0 text-white/70">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <span v-if="!sidebarCollapsed" class="max-[1024px]:hidden">Messaging</span>
        </a>
      </div>
    </div>

    <!-- Credits panel (hidden when collapsed) -->
    <div
      v-if="!sidebarCollapsed"
      class="px-3 pt-3 pb-4 border-t border-white/10 max-[1024px]:hidden"
    >
      <div class="flex items-center justify-between mb-2.5 px-1">
        <span class="text-[11px] font-bold uppercase tracking-[0.8px] text-white/45">Event Credits</span>
        <a class="text-xs font-semibold text-brand-blue no-underline cursor-pointer hover:underline hover:text-brand-blue-dark">Get Credits</a>
      </div>
      <div class="flex bg-white/[0.06] rounded overflow-hidden">
        <div class="flex-1 text-center pt-2.5 px-1 pb-2">
          <div class="text-[22px] font-extrabold text-white leading-none mb-0.5">2</div>
          <div class="text-[10px] font-bold uppercase tracking-[0.5px] text-white/40">Starter</div>
        </div>
        <div class="flex-1 text-center pt-2.5 px-1 pb-2 border-l border-white/[0.08]">
          <div class="text-[22px] font-extrabold text-white leading-none mb-0.5">1</div>
          <div class="text-[10px] font-bold uppercase tracking-[0.5px] text-white/40">Growth</div>
        </div>
        <div class="flex-1 text-center pt-2.5 px-1 pb-2 border-l border-white/[0.08]">
          <div class="text-[22px] font-extrabold text-white leading-none mb-0.5">0</div>
          <div class="text-[10px] font-bold uppercase tracking-[0.5px] text-white/40">Pro</div>
        </div>
      </div>
    </div>
  </nav>
</template>
