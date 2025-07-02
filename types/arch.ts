import { FlyoutKey } from './flyout-registry'

export interface ArchEvents {
  openFlyout: {
    id: FlyoutKey
    props?: any
  }
  closeFlyout: {
    id: FlyoutKey
  }
}

export type ArchEventNames = keyof ArchEvents

export interface ArchListenerEntry {
  id: string
  callback: (data: any) => void
}

export interface ArchSubscribeFunction<Event extends ArchEventNames> {
  (event: Event, callback: (data: ArchEvents[Event]) => void): void
}
