import { useEffect, useState } from 'react'
import { useEventCallback } from './useEventCallback'

enum FlyoutEvent {
  Open,
  Close,
}

interface FlyoutSubscriptionCallback {
  (type: FlyoutEvent): void
}

interface FlyoutSubscription {
  id: string
  flyoutId: string
  callback: FlyoutSubscriptionCallback
}

class FlyoutOpener {
  private subscribers: FlyoutSubscription[]
  private layers: number

  constructor() {
    this.subscribers = []
    this.layers = 0
  }

  subscribe(flyoutId: string, callback: FlyoutSubscriptionCallback) {
    const id = this.generateId()

    this.subscribers.push({ id, flyoutId, callback })

    return () => {
      this.unsubscribe(id)
    }
  }

  private unsubscribe(id: string) {
    this.subscribers = this.subscribers.filter(
      (subscriber) => subscriber.id !== id
    )
  }

  emit(type: FlyoutEvent, flyoutId: string) {
    this.subscribers.forEach((subsriber) => {
      if (subsriber.flyoutId === flyoutId) {
        subsriber.callback(type)
      }
    })
  }

  getLayers() {
    return this.layers
  }

  addLayer() {
    this.layers += 1
  }

  removeLayer() {
    this.layers -= 1
  }

  private generateId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }
}

const FlyoutOpenerSingleton = new FlyoutOpener()

export function useFlyoutOpener(flyoutId: string) {
  const [currentLayer, setCurrentLayer] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = FlyoutOpenerSingleton.subscribe(flyoutId, (type) => {
      const openState = type === FlyoutEvent.Open

      if (openState) {
        FlyoutOpenerSingleton.addLayer()
      } else {
        FlyoutOpenerSingleton.removeLayer()
      }

      setCurrentLayer(FlyoutOpenerSingleton.getLayers())
      setIsOpen(openState)
    })

    return () => {
      unsubscribe()
    }
  }, [flyoutId])

  const open = useEventCallback(() => {
    FlyoutOpenerSingleton.emit(FlyoutEvent.Open, flyoutId)
  })

  const close = useEventCallback(() => {
    FlyoutOpenerSingleton.emit(FlyoutEvent.Close, flyoutId)
  })

  return {
    isOpen,
    open,
    close,
    currentLayer,
  }
}
