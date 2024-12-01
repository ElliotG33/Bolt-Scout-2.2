"use client"

import { Alert } from '@/types/alerts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Trash2, Mail, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'

interface AlertListProps {
  alerts: Alert[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function AlertList({ alerts, onToggle, onDelete }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No alerts created yet. Create one above to get started.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="font-lexend text-2xl font-semibold">Your Alerts</h2>
      
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      {alert.email}
                    </div>
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={alert.active}
                      onCheckedChange={() => onToggle(alert.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(alert.id)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {alert.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-primary/30 bg-primary/10 text-primary"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Checks every {alert.frequency} hours
                    </div>
                    <span>•</span>
                    <span>Created {formatDistanceToNow(new Date(alert.createdAt))} ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}