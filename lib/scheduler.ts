import { Alert } from '@/types/alerts'
import { searchReddit } from './reddit'
import { searchYouTube } from './youtube'

const ALERT_STORAGE_KEY = 'scout_ai_alerts'

// Store alerts in localStorage
export function saveAlerts(alerts: Alert[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ALERT_STORAGE_KEY, JSON.stringify(alerts))
  }
}

// Load alerts from localStorage
export function loadAlerts(): Alert[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(ALERT_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  }
  return []
}

// Check if it's time to run an alert
export function shouldRunAlert(alert: Alert): boolean {
  const now = new Date().getTime()
  const lastRun = new Date(alert.lastRun || 0).getTime()
  const frequency = alert.frequency * 60 * 60 * 1000 // Convert hours to milliseconds
  return now - lastRun >= frequency
}

// Process a single alert
export async function processAlert(alert: Alert) {
  if (!alert.active || !shouldRunAlert(alert)) return null

  try {
    const query = alert.keywords.join(' OR ')
    
    const [redditResults, youtubeResults] = await Promise.allSettled([
      searchReddit(query, 'day'),
      searchYouTube(query)
    ])

    return {
      reddit: redditResults.status === 'fulfilled' ? redditResults.value : [],
      youtube: youtubeResults.status === 'fulfilled' ? youtubeResults.value : [],
      quora: [],
      twitter: []
    }
  } catch (error) {
    console.error(`Failed to process alert:`, error)
    return null
  }
}