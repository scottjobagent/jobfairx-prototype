/**
 * Mock data for Edit Post page — replace with API calls when backend lands
 */

import type { EditPostState } from '@/types/job-post'

export const MOCK_EDIT_POST: EditPostState = {
  event: {
    title: 'Dallas Healthcare Hiring Event',
    date: 'April 22, 2026',
    timeRange: '11:00 AM – 3:00 PM',
  },
  package: {
    tier: 'Growth',
    jobsUsed: 2,
    jobsLimit: 3,
  },
  jobs: [
    {
      id: 'rn',
      title: 'Registered Nurse',
      salaryMin: 55000,
      salaryMax: 72000,
      salaryPeriod: 'year',
      employmentType: 'Full-time',
      description:
        'We are seeking a compassionate and skilled Registered Nurse to join our healthcare team. The ideal candidate will provide high-quality patient care in a fast-paced environment and collaborate with a multidisciplinary team to ensure the best outcome...',
    },
    {
      id: 'ma',
      title: 'Medical Assistant',
      salaryMin: 38000,
      salaryMax: 48000,
      salaryPeriod: 'year',
      employmentType: 'Full-time',
      description:
        'Join our growing clinic as a Medical Assistant supporting physicians and nurses in delivering excellent patient care. You will handle clinical and administrative duties including patient intake, vitals, scheduling, and electronic health record management...',
    },
  ],
  jobsIncomplete: false,
  interviewDetails: {
    slotDurationMins: 30,
    interviewsPerSlot: 3,
    startAdvertisingDate: '04/07/2026',
    attendanceInstructions: true,
  },
  interviewIncomplete: false,
}
