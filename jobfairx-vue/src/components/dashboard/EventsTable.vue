<!--
  EventsTable
  -----------
  Displays the main events table with tabs (Upcoming / Completed).
  Wraps multiple EventRow components.
  Matches the table.table-card element in visual.html.
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import StatusCard from '@/components/base/StatusCard.vue'
import Tabs from '@/components/base/Tabs.vue'
import EventRow from './EventRow.vue'
import type { DashboardEvent, DashboardTab } from '@/types/dashboard'

defineProps<{
  events: readonly DashboardEvent[]
}>()

const activeTab = ref<DashboardTab>('upcoming')

const tabs = computed(() => [
  { key: 'upcoming' as const, label: 'Upcoming', count: 4 },
  { key: 'completed' as const, label: 'Completed', count: 0 },
])
</script>

<template>
  <div class="space-y-4">
    <Tabs :tabs="tabs" v-model:active="activeTab" />

    <StatusCard>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-surface-gray border-b border-border-default">
            <tr>
              <th class="text-left py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider w-24">
                Actions
              </th>
              <th class="text-left py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider">
                Event Details
              </th>
              <th class="text-left py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider">
                Interview Location
              </th>
              <th class="text-left py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider">
                Interview Setup
              </th>
              <th class="text-left py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider">
                Job Titles
              </th>
              <th class="text-left py-4 px-6 text-xs font-bold text-text-secondary uppercase tracking-wider">
                Candidates
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border-default">
            <EventRow v-for="event in events" :key="event.id" :event="event" />
          </tbody>
        </table>
      </div>
    </StatusCard>
  </div>
</template>
