import type { BrowserInstructions, DeviceCard, AllowlistEntry } from '@/types/troubleshooting'

export const BROWSER_INSTRUCTIONS: BrowserInstructions[] = [
  {
    name: 'Chrome',
    steps: [
      'Click or tap the camera icon in the address bar.',
      'Ensure camera and microphone permissions are set to Allow.',
    ],
  },
  {
    name: 'Safari',
    steps: [
      'Click the camera icon in the address bar.',
      'Set the camera and microphone to Always Allowed.',
    ],
  },
  {
    name: 'Edge',
    steps: [
      'Click the lock icon in the address bar.',
      'Set the camera and microphone to Allow.',
    ],
  },
  {
    name: 'Firefox',
    steps: [
      'On the test screen, click the lock or camera icon to ensure permissions are set to Allow.',
    ],
  },
]

export const DEVICE_CARDS: DeviceCard[] = [
  {
    type: 'supported',
    title: 'Supported devices and browsers',
    items: [
      'Desktop or laptop: Chrome, Firefox, Edge, Safari',
      'iPad or iPhone: Safari',
      'Android: Chrome, Firefox',
    ],
  },
  {
    type: 'incompatible',
    title: 'Incompatible devices and browsers',
    items: ['Internet Explorer', 'Chrome on iOS'],
  },
]

export const ALLOWLIST_ENTRIES: AllowlistEntry[] = [
  {
    domain: '*.jobfairx.com',
    protocol: 'TCP',
    ports: '443',
  },
  {
    domain: 'turn.jobfairx.com',
    protocol: 'TCP, UDP',
    ports: '443, 3478',
  },
  {
    domain: 'stun.jobfairx.com',
    protocol: 'TCP, UDP',
    ports: '443, 3478',
  },
]
