export interface BrowserInstructions {
  name: string
  steps: string[]
}

export interface DeviceCard {
  type: 'supported' | 'incompatible'
  title: string
  items: string[]
}

export interface AllowlistEntry {
  domain: string
  protocol: string
  ports: string
}

export interface IssueSection {
  label: string
  title: string
  description: string
  content: 'camera-mic' | 'browser' | 'connection'
}
