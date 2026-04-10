<!--
  DashboardLayout
  ---------------
  The app shell: fixed dark sidebar on the left + fixed white topbar across the
  top + scrolling main content. Mirrors the layout from visual.html (the
  dashboard view). The `ml-[220px]`/`ml-[60px]` on <main> matches the body's
  `.collapsed` class behavior from the source.
-->
<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import { useLayoutState } from './useLayoutState'

const { sidebarCollapsed } = useLayoutState()
</script>

<template>
  <div>
    <AppSidebar />
    <AppTopbar />
    <main
      class="min-h-[calc(100vh-56px)] mt-[56px] px-7 pt-6 pb-10 transition-[margin-left] duration-200 ease-out"
      :class="sidebarCollapsed ? 'ml-[60px]' : 'ml-[220px]'"
    >
      <router-view />
    </main>
  </div>
</template>
