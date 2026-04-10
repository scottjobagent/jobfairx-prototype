import type { JobData } from '@/types/job'

export const JOBS: Record<string, JobData> = {
  ma: {
    title: 'Medical Assistant',
    location: 'Dallas, TX · In person',
    jobType: 'Full-time',
    pay: '$38,000 – $48,000 / year',
    benefits: 'Health insurance, Dental insurance, Vision insurance, 401(k), Paid time off',
    shift: 'Day shift',
    schedule: 'Monday to Friday',
    desc: "Join our growing clinic as a Medical Assistant supporting physicians and nurses in delivering excellent patient care. You will handle clinical and administrative duties including patient intake, vitals, scheduling, and electronic health records.\n\nResponsibilities:\n• Patient intake and vitals\n• Assist physicians with exams\n• Maintain accurate EHR records\n• Schedule follow-up appointments\n\nRequirements:\n• Medical Assistant certification\n• 1+ year of clinical experience preferred\n• Strong organizational and communication skills",
  },
  rn: {
    title: 'Registered Nurse',
    location: 'Dallas, TX · In person',
    jobType: 'Full-time',
    pay: '$55,000 – $72,000 / year',
    benefits: 'Health insurance, Dental insurance, Vision insurance, 401(k), Paid time off',
    shift: 'Day shift',
    schedule: 'Rotating weekends',
    desc: "We are seeking a compassionate and skilled Registered Nurse to join our healthcare team. The ideal candidate will provide high-quality patient care in a fast-paced environment and collaborate with a multidisciplinary team to ensure the best outcomes for every patient.\n\nResponsibilities:\n• Assess patient conditions and develop nursing care plans\n• Administer medications and treatments per physician orders\n• Monitor patient progress and document observations\n• Educate patients and families on health management\n\nRequirements:\n• Active RN license in Texas\n• BLS certification\n• Minimum 1 year of clinical experience preferred",
  },
  se: {
    title: 'Software Engineer',
    location: 'Chicago, IL · Hybrid',
    jobType: 'Full-time',
    pay: '$115,000 – $145,000 / year',
    benefits: 'Health insurance, Dental insurance, Vision insurance, 401(k) matching, Paid time off',
    shift: 'Day shift',
    schedule: 'Monday to Friday',
    desc: "Join our growing engineering team to build and scale our core platform. You'll work with modern technologies, collaborate across product and design, and contribute to system architecture decisions.\n\nResponsibilities:\n• Design, build, and maintain high-quality, scalable services\n• Write clean, well-tested, maintainable code\n• Participate in code reviews and architectural discussions\n• Partner with PM and design on new features\n\nRequirements:\n• 3+ years of professional software engineering experience\n• Strong fundamentals in data structures and algorithms\n• Experience with modern web frameworks",
  },
}

export const JOB_TYPE_OPTIONS = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship']
export const BENEFIT_OPTIONS = [
  'Health insurance',
  'Paid time off',
  'Dental insurance',
  '401(k)',
  'Vision insurance',
  'Flexible schedule',
  'Tuition reimbursement',
  'Life insurance',
  '401(k) matching',
  'Retirement plan',
  'Referral program',
  'Employee discount',
  'Flexible spending account',
  'Health savings account',
  'Relocation assistance',
  'Parental leave',
  'Professional development assistance',
  'Employee assistance program',
  'Other',
]
export const SHIFT_OPTIONS = [
  'Day shift',
  'Night shift',
  'Evening shift',
  'Overnight shift',
  'Other',
  'None',
]
export const SCHEDULE_OPTIONS = [
  'Weekly as needed',
  'Monday to Friday',
  'Rotating weekends',
  'Every weekend',
  'No weekends',
  'Choose your own hours',
  '3×12',
  '5×8',
  '4×10',
  '4×12',
  'Other',
  'None',
]
export const RATE_OPTIONS = [
  'per hour',
  'per day',
  'per week',
  'per month',
  'per year',
] as const
