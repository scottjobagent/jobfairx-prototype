<!--
  JobPostingPage
  ──────────────
  Pixel-perfect port of job-posting.html. Displays:
    - Simple topbar with JobFairX logo (no sidebar, standalone page)
    - Event context banner (Dallas Healthcare Hiring Event, April 22, 2026)
    - Job header card (Registered Nurse, JobFairX Healthcare Partners, Dallas, TX)
    - Job tags (Full-time, salary, Remote eligible, Healthcare)
    - Action buttons (Schedule an interview, Save)
    - Job details card (4 rows: Job type, Pay, Location, Interview type)
    - Full job description card (Responsibilities, Requirements, Benefits sections)

  This is a static read-only page. No interactivity required.
  Data is hardcoded to match job-posting.html values.
-->
<script setup lang="ts">
// No reactive state needed — this is a static page
// Just rendering job posting details
</script>

<template>
  <div class="min-h-screen bg-surface-sunken">
    <!-- Topbar -->
    <header class="sticky top-0 h-[52px] bg-surface-raised border-b border-border-strong flex items-center px-6 z-[200]">
      <span class="text-[22px] font-black text-brand-blue" style="letter-spacing: -0.5px;">JobFairX</span>
    </header>

    <!-- Main container -->
    <div class="max-w-[820px] mx-auto my-8 px-6">

      <!-- Event context banner -->
      <div class="bg-brand-blue-light border border-[#b6d0fe] rounded-lg p-5 mb-4 flex items-center gap-4">
        <div class="w-12 h-12 rounded-md bg-brand-blue flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6 text-white">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div>
          <h3 class="text-md font-bold text-brand-blue">Dallas Healthcare Hiring Event</h3>
          <p class="text-sm text-text-secondary mt-0.5">April 22, 2026 &middot; 11:00 AM – 3:00 PM CT &middot; Virtual interviews</p>
        </div>
      </div>

      <!-- Job header card -->
      <div class="bg-surface-raised rounded-lg border border-border-strong p-7 mb-4">
        <h1 class="text-3xl font-bold text-text-primary mb-1.5">Registered Nurse</h1>
        <div class="text-lg font-semibold text-brand-blue mb-1">JobFairX Healthcare Partners</div>
        <div class="text-base text-text-secondary mb-4">Dallas, TX (Remote eligible)</div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="py-1.5 px-3.5 rounded-full text-sm font-medium bg-surface-sunken text-text-primary">Full-time</span>
          <span class="py-1.5 px-3.5 rounded-full text-sm font-medium bg-surface-sunken text-text-primary">$55,000 – $72,000/year</span>
          <span class="py-1.5 px-3.5 rounded-full text-sm font-medium bg-surface-sunken text-text-primary">Remote eligible</span>
          <span class="py-1.5 px-3.5 rounded-full text-sm font-medium bg-surface-sunken text-text-primary">Healthcare</span>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-2.5 mt-2">
          <button
            type="button"
            class="inline-flex items-center justify-center gap-1.5 py-3 px-6 rounded bg-brand-blue text-white text-base font-bold border-none cursor-pointer transition-colors hover:bg-brand-blue-dark"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Schedule an interview
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center gap-1.5 py-3 px-6 rounded bg-surface-raised text-text-primary text-base font-bold border border-border-strong cursor-pointer transition-colors hover:bg-[#f6f5f3]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
            Save
          </button>
        </div>
      </div>

      <!-- Job details card -->
      <div class="bg-surface-raised rounded-lg border border-border-strong p-7 mb-4">
        <h2 class="text-xl font-bold mb-4">Job details</h2>

        <!-- Detail row 1: Job type -->
        <div class="flex items-start gap-3 py-2.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-text-tertiary flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <div>
            <div class="text-sm text-text-tertiary">Job type</div>
            <div class="text-base font-medium text-text-primary">Full-time</div>
          </div>
        </div>

        <!-- Detail row 2: Pay -->
        <div class="flex items-start gap-3 py-2.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-text-tertiary flex-shrink-0 mt-0.5">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
          <div>
            <div class="text-sm text-text-tertiary">Pay</div>
            <div class="text-base font-medium text-text-primary">$55,000 – $72,000 a year</div>
          </div>
        </div>

        <!-- Detail row 3: Location -->
        <div class="flex items-start gap-3 py-2.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-text-tertiary flex-shrink-0 mt-0.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <div>
            <div class="text-sm text-text-tertiary">Location</div>
            <div class="text-base font-medium text-text-primary">Dallas, TX (Remote eligible)</div>
          </div>
        </div>

        <!-- Detail row 4: Interview type -->
        <div class="flex items-start gap-3 py-2.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-text-tertiary flex-shrink-0 mt-0.5">
            <path d="M15 10l-4 4l6 6l4-16l-18 7l4 2l2 6l3-4" />
          </svg>
          <div>
            <div class="text-sm text-text-tertiary">Interview type</div>
            <div class="text-base font-medium text-text-primary">Virtual interview via video</div>
          </div>
        </div>
      </div>

      <!-- Full job description card -->
      <div class="bg-surface-raised rounded-lg border border-border-strong p-7">
        <h2 class="text-xl font-bold mb-4">Full job description</h2>

        <p class="text-base text-text-secondary leading-[1.7] mb-2.5">
          We are seeking a compassionate and skilled Registered Nurse to join our healthcare team. The ideal candidate will provide high-quality patient care in a fast-paced environment and collaborate with a multidisciplinary team.
        </p>

        <h3 class="text-lg font-bold text-text-primary mt-5 mb-2.5">Responsibilities</h3>
        <ul class="ml-5 mb-4">
          <li class="text-base text-text-secondary leading-[1.7] mb-1">Provide direct patient care including assessment, planning, implementation, and evaluation</li>
          <li class="text-base text-text-secondary leading-[1.7] mb-1">Administer medications and treatments as prescribed by physicians</li>
          <li class="text-base text-text-secondary leading-[1.7] mb-1">Monitor and record patient conditions, vital signs, and medical information</li>
          <li class="text-base text-text-secondary leading-[1.7] mb-1">Collaborate with doctors, specialists, and other healthcare professionals</li>
          <li class="text-base text-text-secondary leading-[1.7] mb-1">Educate patients and families on health management and disease prevention</li>
          <li class="text-base text-text-secondary leading-[1.7] mb-1">Maintain accurate and detailed patient records</li>
        </ul>

        <h3 class="text-lg font-bold text-text-primary mt-5 mb-2.5">Requirements</h3>
        <ul class="ml-5 mb-4">
          <li class="text-base text-text-secondary leading-[1.7] mb-1">Active RN license in the state of Texas</li>
          <li class="text-base text-text-secondary leading-[1.7] mb-1">Bachelor of Science in Nursing (BSN) preferred</li>
          <li class="text-base text-text-secondary leading-[1.7] mb-1">Minimum 1 year of clinical nursing experience</li>
          <li class="text-base text-text-secondary leading-[1.7] mb-1">BLS and ACLS certification required</li>
          <li class="text-base text-text-secondary leading-[1.7] mb-1">Strong communication and critical thinking skills</li>
          <li class="text-base text-text-secondary leading-[1.7] mb-1">Experience with electronic health records (EHR) systems</li>
        </ul>

        <h3 class="text-lg font-bold text-text-primary mt-5 mb-2.5">Benefits</h3>
        <ul class="ml-5">
          <li class="text-base text-text-secondary leading-[1.7] mb-1">Comprehensive health, dental, and vision insurance</li>
          <li class="text-base text-text-secondary leading-[1.7] mb-1">401(k) with employer match</li>
          <li class="text-base text-text-secondary leading-[1.7] mb-1">Paid time off and holiday pay</li>
          <li class="text-base text-text-secondary leading-[1.7] mb-1">Continuing education reimbursement</li>
          <li class="text-base text-text-secondary leading-[1.7] mb-1">Flexible scheduling options</li>
        </ul>
      </div>

    </div>
  </div>
</template>
