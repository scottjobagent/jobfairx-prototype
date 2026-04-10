<!--
  LobbyPage
  ---------
  Top-level page for /lobby. Composes:
    - EventHeader (event title + time window)
    - Tabs (waiting / interviewing / interviewed / not yet)
    - one of the four panels based on the active tab
    - All modals (mounted once at the page level)
    - DevModeToggle (delete in production)

  Active tab is local component state — there's no need to push it to a
  composable since only this page cares about it. If we ever deep-link to
  a tab via the URL, swap to a route query param.
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import EventHeader from '@/components/lobby/EventHeader.vue'
import Tabs from '@/components/base/Tabs.vue'
import WaitingPanel from '@/components/lobby/WaitingPanel.vue'
import InterviewingPanel from '@/components/lobby/InterviewingPanel.vue'
import InterviewedPanel from '@/components/lobby/InterviewedPanel.vue'
import NotYetPanel from '@/components/lobby/NotYetPanel.vue'
import DevModeToggle from '@/components/lobby/DevModeToggle.vue'

// Modals — fully built
import MessageModal from '@/components/lobby/modals/MessageModal.vue'
import ResumeModal from '@/components/lobby/modals/ResumeModal.vue'
import DeclineModal from '@/components/lobby/modals/DeclineModal.vue'

// Modals — stubs (replace as features land)
import WelcomeModal from '@/components/lobby/modals/WelcomeModal.vue'
import TeamModal from '@/components/lobby/modals/TeamModal.vue'
import AVCheckModal from '@/components/lobby/modals/AVCheckModal.vue'
import InstructionsModal from '@/components/lobby/modals/InstructionsModal.vue'
import ScheduleModal from '@/components/lobby/modals/ScheduleModal.vue'
import FeedbackModal from '@/components/lobby/modals/FeedbackModal.vue'
import StartInterviewModal from '@/components/lobby/modals/StartInterviewModal.vue'
import JoinInterviewModal from '@/components/lobby/modals/JoinInterviewModal.vue'

import { useLobbyMode } from '@/composables/useLobbyMode'
import { MOCK_EVENT } from '@/data/lobby-mock'
import type { LobbyTab, LobbyTabDef } from '@/types/lobby'

const { dataset } = useLobbyMode()

const activeTab = ref<LobbyTab>('waiting')

const tabs = computed<LobbyTabDef[]>(() => [
  { key: 'waiting', label: 'Waiting', count: dataset.value.waiting.length },
  { key: 'interviewing', label: 'Interviewing', count: dataset.value.interviewing.length },
  { key: 'interviewed', label: 'Interviewed', count: dataset.value.interviewed.length },
  { key: 'notyet', label: 'Not yet', count: dataset.value.notyet.length },
])
</script>

<template>
  <main class="container-page max-w-6xl mx-auto pb-16">
    <EventHeader :event="MOCK_EVENT" />

    <Tabs :tabs="tabs" v-model:active="activeTab" />

    <div class="mt-5">
      <WaitingPanel v-if="activeTab === 'waiting'" :candidates="dataset.waiting" />
      <InterviewingPanel
        v-else-if="activeTab === 'interviewing'"
        :candidates="dataset.interviewing"
      />
      <InterviewedPanel
        v-else-if="activeTab === 'interviewed'"
        :candidates="dataset.interviewed"
      />
      <NotYetPanel v-else :candidates="dataset.notyet" />
    </div>

    <!-- Modals (mounted once; activated by useModal()) -->
    <MessageModal />
    <ResumeModal />
    <DeclineModal />
    <WelcomeModal />
    <TeamModal />
    <AVCheckModal />
    <InstructionsModal />
    <ScheduleModal />
    <FeedbackModal />
    <StartInterviewModal />
    <JoinInterviewModal />

    <DevModeToggle />
  </main>
</template>
