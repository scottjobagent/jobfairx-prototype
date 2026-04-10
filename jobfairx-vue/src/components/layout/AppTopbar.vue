<!--
  AppTopbar
  ---------
  Pixel-perfect port of the `<header class="topbar">` block in visual.html
  (lines 782-807). Fixed white bar, 56px tall, sitting to the right of the
  sidebar. Contains:
    - JobFairX logo (blue)
    - Dev view toggle (Active / Empty / Live) — kept per developer direction
    - User dropdown trigger (scott@jobfairx.com) with menu
-->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useLayoutState, type DevMode } from '@/layouts/useLayoutState'

const { sidebarCollapsed, devMode, setDevMode } = useLayoutState()

const userMenuOpen = ref(false)
const userTriggerRef = ref<HTMLElement | null>(null)

const toggleUserMenu = (): void => {
  userMenuOpen.value = !userMenuOpen.value
}

const onDocClick = (e: MouseEvent): void => {
  if (!userMenuOpen.value) return
  const el = userTriggerRef.value
  if (el && !el.contains(e.target as Node)) {
    userMenuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

const devModes: Array<{ value: DevMode; label: string }> = [
  { value: 'active', label: 'Active' },
  { value: 'empty', label: 'Empty' },
  { value: 'live', label: 'Live' },
]
</script>

<template>
  <header
    class="fixed top-0 right-0 h-14 bg-white border-b border-[#d4d2d0] flex items-center justify-between px-6 z-[200] transition-[left] duration-200 ease-out"
    :class="sidebarCollapsed ? 'left-[60px]' : 'left-[220px]'"
  >
    <!-- Left: logo + dev toggle -->
    <div class="flex items-center gap-4">
      <a class="text-[22px] font-extrabold text-brand-blue tracking-[-0.5px] no-underline cursor-pointer">
        JobFairX
      </a>
      <div class="flex items-center gap-2 py-[5px] px-3 bg-[#f3f2ef] rounded-sm border border-[#d4d2d0]">
        <span class="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.5px]">View:</span>
        <div class="flex bg-[#e0e0e0] rounded-[4px] overflow-hidden">
          <button
            v-for="mode in devModes"
            :key="mode.value"
            type="button"
            class="py-1 px-2.5 text-[11px] font-bold border-none cursor-pointer transition-all"
            :class="
              devMode === mode.value
                ? 'bg-brand-blue text-white'
                : 'bg-transparent text-text-tertiary'
            "
            @click="setDevMode(mode.value)"
          >
            {{ mode.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Right: user trigger -->
    <div class="flex items-center gap-1">
      <div
        ref="userTriggerRef"
        class="flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded transition-colors relative hover:bg-[#f3f2ef]"
        @click.stop="toggleUserMenu"
      >
        <span class="text-base font-normal text-text-primary">scott@jobfairx.com</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5 text-text-tertiary">
          <path d="M6 9l6 6 6-6" />
        </svg>
        <div
          v-if="userMenuOpen"
          class="absolute top-[42px] right-0 bg-white rounded-[10px] shadow-menu border border-[#d4d2d0] min-w-[220px] z-[500] py-1.5"
        >
          <a class="flex items-center w-full py-3 px-[18px] text-base font-medium text-text-primary bg-none border-none text-left cursor-pointer transition-colors no-underline hover:bg-[#f3f2ef]">
            Account &amp; Billing
          </a>
          <button
            type="button"
            class="flex items-center w-full py-3 px-[18px] text-base font-medium text-text-primary bg-none border-none text-left cursor-pointer transition-colors hover:bg-[#f3f2ef]"
          >
            Give Feedback
          </button>
          <div class="h-px bg-[#ebebeb] my-1"></div>
          <button
            type="button"
            class="flex items-center w-full py-3 px-[18px] text-base font-medium text-text-tertiary bg-none border-none text-left cursor-pointer transition-colors hover:bg-[#f3f2ef]"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
