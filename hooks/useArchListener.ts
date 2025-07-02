import { ArchInstance } from '@/singletons'
import { ArchEventNames, ArchEvents } from '@/types'
import { useEffect } from 'react'

export function useArchListener<Event extends ArchEventNames>(
  event: Event,
  callback: (data: ArchEvents[Event]) => void
) {
  useEffect(() => {
    return ArchInstance.subscribe(event, callback)
  }, [callback, event])
}
