"use client"

import { useState, useEffect } from 'react'
import { AlertForm } from '@/components/alerts/alert-form'
import { AlertList } from '@/components/alerts/alert-list'
import { Alert } from '@/types/alerts'
import { toast } from 'sonner'
import { saveAlerts, loadAlerts, processAlert } from '@/lib/scheduler'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(() => loadAlerts())

  useEffect(() => {
    // Save alerts whenever they change
    saveAlerts(alerts)

    // Set up periodic checking
    const checkInterval = setInterval(async () => {
      const updatedAlerts = await Promise.all(
        alerts.map(async (alert) => {
          const results = await processAlert(alert)
          if (results && (results.reddit.length > 0 || results.youtube.length > 0)) {
            toast.success(
              `Found ${results.reddit.length + results.youtube.length} new items for alert "${alert.keywords.join(', ')}"`
            )
          }
          return {
            ...alert,
            lastRun: new Date().toISOString()
          }
        })
      )
      setAlerts(updatedAlerts)
    }, 5 * 60 * 1000) // Check every 5 minutes

    return () => clearInterval(checkInterval)
  }, [alerts])

  const handleCreateAlert = (alert: Alert) => {
    const newAlert = {
      ...alert,
      id: Date.now().toString(),
      active: true,
      lastRun: new Date().toISOString()
    }
    setAlerts([...alerts, newAlert])
    toast.success('Alert created successfully')
  }

  const handleToggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => {
      if (alert.id === id) {
        return { ...alert, active: !alert.active }
      }
      return alert
    }))
    toast.success('Alert status updated')
  }

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id))
    toast.success('Alert deleted')
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="space-y-4 mb-8">
        <h1 className="font-lexend text-3xl font-bold tracking-tight">Alerts</h1>
        <p className="text-muted-foreground">
          Set up automated alerts to monitor discussions across platforms and receive email notifications.
        </p>
      </div>

      <div className="space-y-8">
        <AlertForm onSubmit={handleCreateAlert} />
        <AlertList 
          alerts={alerts}
          onToggle={handleToggleAlert}
          onDelete={handleDeleteAlert}
        />
      </div>
    </div>
  )
}