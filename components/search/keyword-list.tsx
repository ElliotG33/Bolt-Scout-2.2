"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface KeywordListProps {
  keywords: string[]
  onRemove: (index: number) => void
  variant?: 'default' | 'secondary' | 'destructive'
}

export function KeywordList({ keywords, onRemove, variant = 'default' }: KeywordListProps) {
  if (keywords.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No keywords added yet
      </p>
    )
  }

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'secondary':
        return 'border-indigo-500/30 bg-indigo-500/10 text-indigo-500'
      case 'destructive':
        return 'border-destructive/30 bg-destructive/10 text-destructive'
      default:
        return 'border-primary/30 bg-primary/10 text-primary'
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <AnimatePresence>
        {keywords.map((keyword, index) => (
          <motion.div
            key={`${keyword}-${index}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`
              inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold
              ${getVariantStyles(variant)}
            `}
          >
            {keyword}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-1 h-3.5 w-3.5 rounded-full p-0 hover:bg-background/80"
              onClick={() => onRemove(index)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove</span>
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}