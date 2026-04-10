<!--
  TroubleshootingPage
  -------------------
  A standalone troubleshooting guide page for the JobFairX employer dashboard.
  Provides solutions for three common issues:
    1. Camera/microphone not working (browser-specific steps)
    2. Browser compatibility (device support matrix)
    3. Unable to connect to interview platform (network setup for IT teams)

  This page has its own simple header with the JobFairX logo. Does NOT use DashboardLayout.
  All content is static (no interactivity).
-->
<script setup lang="ts">
// This is a static content page with no interactivity required.
// All content is hardcoded to match the HTML source exactly.
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white">
    <!-- Header -->
    <header class="w-full h-14 bg-white border-b border-border-strong">
      <div class="max-w-[820px] mx-auto px-8 h-full flex items-center">
        <a href="#" class="text-[22px] font-black text-brand-blue tracking-tight">JobFairX</a>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 w-full">
      <div class="max-w-[820px] mx-auto px-8 py-12 pb-20">
        <!-- Page title -->
        <h1 class="text-4xl font-bold text-text-primary leading-tight mb-4">
          Troubleshooting Issues With JobFairX's Interview Platform
        </h1>

        <!-- Overview paragraph -->
        <p class="text-lg text-text-secondary leading-relaxed mb-3">
          We're sorry you're having trouble connecting to JobFairX's interview platform. These problems are often caused by network settings, camera or microphone access, or browser compatibility. This article will show you how to fix each one.
        </p>

        <!-- Tip box -->
        <div class="bg-brand-blue-light border-l-4 border-brand-blue rounded-r-[8px] py-4 px-5 my-6 text-base text-text-primary">
          <strong class="font-bold">Tip:</strong> Test your camera and microphone before the interview to make sure your permissions are set correctly.
        </div>

        <!-- ===== Issue 1: Camera/Mic not working ===== -->
        <section class="mb-10 pb-10 border-b border-[#e8e6e3]">
          <div class="text-sm font-bold text-[#d4956b] uppercase tracking-[0.5px] mb-1.5">
            Issue
          </div>
          <h2 class="text-[22px] font-black text-text-primary mb-2">
            Your camera and microphone are not working
          </h2>

          <div class="text-sm font-bold text-brand-blue uppercase tracking-[0.5px] mt-4 mb-1.5">
            Solution
          </div>
          <p class="text-base text-text-primary mb-3">
            Make sure your browser has permission to use your camera and microphone. Select <strong class="font-bold">Allow</strong> when prompted. If that didn't work, visit the <a href="https://network-test.daily.co/index.html" target="_blank" class="text-brand-blue underline font-medium hover:text-brand-blue-dark">Interview Test page</a> and follow the instructions below:
          </p>

          <!-- Chrome -->
          <div class="bg-[#f9f8f6] rounded-md px-6 py-5 my-4">
            <div class="text-md font-bold text-text-primary mb-2">
              Chrome
            </div>
            <ol class="pl-5 m-0 list-decimal">
              <li class="text-base text-text-primary mb-1 leading-relaxed">
                Click or tap the camera icon in the address bar.
              </li>
              <li class="text-base text-text-primary mb-1 leading-relaxed">
                Ensure camera and microphone permissions are set to <strong class="font-bold">Allow</strong>.
              </li>
            </ol>
          </div>

          <!-- Safari -->
          <div class="bg-[#f9f8f6] rounded-md px-6 py-5 my-4">
            <div class="text-md font-bold text-text-primary mb-2">
              Safari
            </div>
            <ol class="pl-5 m-0 list-decimal">
              <li class="text-base text-text-primary mb-1 leading-relaxed">
                Click the camera icon in the address bar.
              </li>
              <li class="text-base text-text-primary mb-1 leading-relaxed">
                Set the camera and microphone to <strong class="font-bold">Always Allowed</strong>.
              </li>
            </ol>
          </div>

          <!-- Edge -->
          <div class="bg-[#f9f8f6] rounded-md px-6 py-5 my-4">
            <div class="text-md font-bold text-text-primary mb-2">
              Edge
            </div>
            <ol class="pl-5 m-0 list-decimal">
              <li class="text-base text-text-primary mb-1 leading-relaxed">
                Click the lock icon in the address bar.
              </li>
              <li class="text-base text-text-primary mb-1 leading-relaxed">
                Set the camera and microphone to <strong class="font-bold">Allow</strong>.
              </li>
            </ol>
          </div>

          <!-- Firefox -->
          <div class="bg-[#f9f8f6] rounded-md px-6 py-5 my-4">
            <div class="text-md font-bold text-text-primary mb-2">
              Firefox
            </div>
            <ol class="pl-5 m-0 list-decimal">
              <li class="text-base text-text-primary mb-1 leading-relaxed">
                On the test screen, click the lock or camera icon to ensure permissions are set to <strong class="font-bold">Allow</strong>.
              </li>
            </ol>
          </div>
        </section>

        <!-- ===== Issue 2: Browser not working ===== -->
        <section class="mb-10 pb-10 border-b border-[#e8e6e3]">
          <div class="text-sm font-bold text-[#d4956b] uppercase tracking-[0.5px] mb-1.5">
            Issue
          </div>
          <h2 class="text-[22px] font-black text-text-primary mb-2">
            Your browser isn't working properly
          </h2>

          <div class="text-sm font-bold text-brand-blue uppercase tracking-[0.5px] mt-4 mb-1.5">
            Solution
          </div>
          <p class="text-base text-text-primary mb-4">
            Use a supported browser. JobFairX's interview platform uses WebRTC technology which requires a modern browser.
          </p>

          <!-- Device cards grid -->
          <div class="grid grid-cols-2 gap-4 my-4">
            <!-- Supported devices -->
            <div class="bg-[#f9f8f6] rounded-md px-6 py-5 border-l-4 border-[#2e7d32]">
              <h4 class="text-base font-bold text-[#2e7d32] mb-2">
                Supported devices and browsers
              </h4>
              <ul class="list-none p-0">
                <li class="text-base text-text-primary py-0.75">Desktop or laptop: Chrome, Firefox, Edge, Safari</li>
                <li class="text-base text-text-primary py-0.75">iPad or iPhone: Safari</li>
                <li class="text-base text-text-primary py-0.75">Android: Chrome, Firefox</li>
              </ul>
            </div>

            <!-- Incompatible devices -->
            <div class="bg-[#f9f8f6] rounded-md px-6 py-5 border-l-4 border-[#d32f2f]">
              <h4 class="text-base font-bold text-[#d32f2f] mb-2">
                Incompatible devices and browsers
              </h4>
              <ul class="list-none p-0">
                <li class="text-base text-text-primary py-0.75">Internet Explorer</li>
                <li class="text-base text-text-primary py-0.75">Chrome on iOS</li>
              </ul>
            </div>
          </div>

          <!-- Note box -->
          <div class="bg-[#fef7ea] border-l-4 border-[#d4956b] rounded-r-[8px] py-3.5 px-5 my-4 text-base text-text-primary">
            <strong class="font-bold">Note:</strong> Using other apps during the interview may turn off the microphone if you're using a phone or tablet. If the interviewer can't hear you, restart your device and re-enter the interview.
          </div>
        </section>

        <!-- ===== Issue 3: Unable to connect ===== -->
        <section>
          <div class="text-sm font-bold text-[#d4956b] uppercase tracking-[0.5px] mb-1.5">
            Issue
          </div>
          <h2 class="text-[22px] font-black text-text-primary mb-2">
            You're unable to connect to the interview platform
          </h2>

          <div class="text-sm font-bold text-brand-blue uppercase tracking-[0.5px] mt-4 mb-1.5">
            Solution
          </div>
          <p class="text-base text-text-primary mb-4">
            Run a network test and check your connection settings. If your camera and microphone work but you still can't connect, try this:
          </p>

          <!-- Numbered steps -->
          <ol class="step-list my-4">
            <li>
              <strong class="font-bold">Run a network connection test.</strong> This checks if your network supports JobFairX's WebRTC video technology.
              <div class="mt-3 mb-3">
                <div class="bg-white border-2 border-dashed border-border-strong rounded-[8px] py-6 px-6 text-center text-base text-text-tertiary italic">
                  Placeholder: Network test link will be added here once available.
                </div>
              </div>
            </li>
            <li>
              <strong class="font-bold">If the test fails, share this article with your IT team.</strong> They can use the information below to update your network settings.
            </li>
          </ol>

          <!-- IT Section -->
          <div class="bg-[#f9f8f6] rounded-lg px-8 py-7 mt-6">
            <h3 class="text-xl font-black text-text-primary mb-4">
              For IT and network teams
            </h3>
            <p class="text-base text-text-primary mb-4">
              Use this information to configure your network for JobFairX Interviews. JobFairX uses WebRTC for real-time video communication.
            </p>

            <!-- Step 1: Update allowlist -->
            <h4 class="text-md font-bold text-text-primary mt-5 mb-2.5">
              Step 1: Update your network's allowlist
            </h4>
            <p class="text-base text-text-primary mb-3">
              Add these domains, protocols, and port ranges to your approved list (allowlist):
            </p>

            <!-- Allowlist table -->
            <div class="bg-white rounded-[8px] border border-border-strong overflow-hidden my-3">
              <!-- Header row -->
              <div class="grid grid-cols-3 px-5 py-3 bg-[#f3f2ef] border-b border-[#f0efed]">
                <span class="text-xs font-bold text-text-secondary uppercase tracking-[0.3px]">Domain</span>
                <span class="text-xs font-bold text-text-secondary uppercase tracking-[0.3px]">Protocol</span>
                <span class="text-xs font-bold text-text-secondary uppercase tracking-[0.3px]">Ports</span>
              </div>
              <!-- Data rows -->
              <div class="grid grid-cols-3 px-5 py-3 border-b border-[#f0efed] text-sm">
                <span class="font-mono font-semibold text-brand-blue">*.jobfairx.com</span>
                <span class="text-text-primary">TCP</span>
                <span class="text-text-primary">443</span>
              </div>
              <div class="grid grid-cols-3 px-5 py-3 border-b border-[#f0efed] text-sm">
                <span class="font-mono font-semibold text-brand-blue">turn.jobfairx.com</span>
                <span class="text-text-primary">TCP, UDP</span>
                <span class="text-text-primary">443, 3478</span>
              </div>
              <div class="grid grid-cols-3 px-5 py-3 text-sm">
                <span class="font-mono font-semibold text-brand-blue">stun.jobfairx.com</span>
                <span class="text-text-primary">TCP, UDP</span>
                <span class="text-text-primary">443, 3478</span>
              </div>
            </div>

            <!-- Placeholder note -->
            <div class="bg-white border-2 border-dashed border-border-strong rounded-[8px] py-6 px-6 text-center text-base text-text-tertiary italic my-3">
              Placeholder: Your dev team will need to update the domains above with your actual STUN/TURN server addresses, signaling server domains, and any media relay infrastructure. The ports shown (443 for TCP, 3478 for STUN/TURN) are standard WebRTC defaults.
            </div>

            <!-- Step 2: Rerun network test -->
            <h4 class="text-md font-bold text-text-primary mt-5 mb-2.5">
              Step 2: Rerun the network test
            </h4>
            <ol class="step-list my-4">
              <li>
                Rerun the network test to confirm everything works.
              </li>
              <li>
                If issues remain, download the test results and contact your JobFairX representative for help.
              </li>
            </ol>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Numbered step counter badges */
.step-list {
  margin: 1rem 0;
  padding-left: 0;
  list-style: none;
  counter-reset: step-counter;
}

.step-list li {
  counter-increment: step-counter;
  padding: 0.625rem 0 0.625rem 2.25rem;
  position: relative;
  font-size: 0.9375rem;
  line-height: 1.6;
}

.step-list li::before {
  content: counter(step-counter);
  position: absolute;
  left: 0;
  top: 0.625rem;
  width: 1.5rem;
  height: 1.5rem;
  background: #0044B3;
  color: #ffffff;
  border-radius: 50%;
  font-size: 0.8125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
