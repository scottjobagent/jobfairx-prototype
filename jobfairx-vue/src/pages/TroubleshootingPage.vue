<!--
  TroubleshootingPage
  ---------
  Top-level page for /troubleshooting. Displays help content for employers
  experiencing technical issues with the JobFairX interview platform.

  Composes:
    - Page header with title and overview
    - Tip banner
    - Three issue sections (camera/mic, browser, connection)
-->
<script setup lang="ts">
import IssueSection from '@/components/troubleshooting/IssueSection.vue'

const issues = [
  {
    label: 'Issue',
    title: 'Your camera and microphone are not working',
    content: 'camera-mic' as const,
  },
  {
    label: 'Issue',
    title: "Your browser isn't working properly",
    content: 'browser' as const,
  },
  {
    label: 'Issue',
    title: 'You\'re unable to connect to the interview platform',
    content: 'connection' as const,
  },
]
</script>

<template>
  <main class="container-page max-w-3xl mx-auto pb-20">
    <!-- Page header -->
    <h1 class="text-4xl font-bold text-text-primary mb-4">
      Troubleshooting Issues With JobFairX's Interview Platform
    </h1>

    <p class="text-lg text-text-secondary mb-6 leading-relaxed">
      We're sorry you're having trouble connecting to JobFairX's interview platform. These problems
      are often caused by network settings, camera or microphone access, or browser compatibility.
      This article will show you how to fix each one.
    </p>

    <!-- Tip banner -->
    <div class="bg-brand-blue-light border-l-4 border-l-brand-blue rounded-r p-5 mb-10">
      <p class="text-sm text-text-primary">
        <strong>Tip:</strong> Test your camera and microphone before the interview to make sure
        your permissions are set correctly.
      </p>
    </div>

    <!-- Issues -->
    <div>
      <IssueSection v-for="(issue, idx) in issues" :key="idx" :issue="issue" />
    </div>
  </main>
</template>
