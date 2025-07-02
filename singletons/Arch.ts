import { ArchEventNames, ArchEvents, ArchListenerEntry } from '@/types'

class Arch {
  private subsbribers: Map<ArchEventNames, ArchListenerEntry[]>

  constructor() {
    this.subsbribers = new Map()
  }

  emit<Event extends ArchEventNames>(event: Event, data: ArchEvents[Event]) {
    this.subsbribers.get(event)?.forEach((subscriber) => {
      subscriber.callback(data)
    })
  }

  subscribe<Event extends ArchEventNames>(
    event: Event,
    callback: (data: ArchEvents[Event]) => void
  ) {
    const subscriberId = this.generateId()

    if (this.subsbribers.has(event)) {
      const listeners = this.subsbribers.get(event)

      listeners?.push({ id: subscriberId, callback })
    } else {
      this.subsbribers.set(event, [{ id: subscriberId, callback }])
    }

    return () => {
      this.unsubscribe(event, subscriberId)
    }
  }

  private unsubscribe<Event extends ArchEventNames>(event: Event, id: string) {
    if (this.subsbribers.has(event)) {
      this.subsbribers.set(
        event,
        this.subsbribers.get(event)?.filter((entry) => entry.id !== id) ?? []
      )
    }
  }

  private generateId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }
}

export const ArchInstance = new Arch()
