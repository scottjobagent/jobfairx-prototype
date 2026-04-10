<!--
  DashboardPage
  -----
  Top-level page for /dashboard. Composes:
    - DashboardHeader (page title + "New Event" CTA)
    - EventsTable (events list with upcoming/completed tabs)
    - All modals (mounted once at the page level)

  The page loads mock event data from DASHBOARD_DATA.
  Once the backend is wired up, replace with API calls.
-->
<script setup lang="ts">
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import EventsTable from '@/components/dashboard/EventsTable.vue'

// Stub modals
import EventEditModal from '@/components/dashboard/modals/EventEditModal.vue'
import InterviewSettingsModal from '@/components/dashboard/modals/InterviewSettingsModal.vue'
import SetupCompleteModal from '@/components/dashboard/modals/SetupCompleteModal.vue'
import CancelInterviewModal from '@/components/dashboard/modals/CancelInterviewModal.vue'

import { DASHBOARD_DATA } from '@/data/dashboard-mock'
</script>

<template>
  <main class="container-page max-w-7xl mx-auto pb-16">
    <DashboardHeader />
    <EventsTable :events="DASHBOARD_DATA.upcoming" />

    <!-- Modals (mounted once; activated by useModal()) -->
    <EventEditModal />
    <InterviewSettingsModal />
    <SetupCompleteModal />
    <CancelInterviewModal />
  </main>
</template>
