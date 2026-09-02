'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CountdownValues } from '@/types'
import { EVENT_DATE } from '@/lib/constants'
import { pad } from '@/lib/utils'

function computeCountdown(target: Date): CountdownValues {
  const diff = target.getTime() - Date.now()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  }

  const totalSeconds = Math.floor(diff / 1000)
  const days    = Math.floor(totalSeconds / 86400)
  const hours   = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds, isExpired: false }
}

/**
 * useCountdown — ticks every second, targeting EVENT_DATE by default.
 * Cleans up the interval on unmount.
 */
export function useCountdown(target: Date = EVENT_DATE): CountdownValues & { formatted: { days: string; hours: string; minutes: string; seconds: string } } {
  const [values, setValues] = useState<CountdownValues>(() => computeCountdown(target))

  const tick = useCallback(() => {
    setValues(computeCountdown(target))
  }, [target])

  useEffect(() => {
    // Tick immediately so there's no initial stale display
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [tick])

  return {
    ...values,
    formatted: {
      days:    pad(values.days),
      hours:   pad(values.hours),
      minutes: pad(values.minutes),
      seconds: pad(values.seconds),
    },
  }
}
