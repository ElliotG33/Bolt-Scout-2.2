export interface Alert {
  id: string
  email: string
  keywords: string[]
  frequency: number
  active: boolean
  createdAt: string
  lastRun?: string
}