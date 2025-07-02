import { FlyoutEntry, FlyoutKey } from '@/types'

class FlyoutRegistry {
  private flyouts: Map<FlyoutKey, FlyoutEntry<any>>

  constructor() {
    this.flyouts = new Map()
  }

  register<Props extends object>(props: FlyoutEntry<Props>) {
    this.flyouts.set(props.id, props)
  }

  getFlyout(id: FlyoutKey) {
    return this.flyouts.get(id)
  }
}

export const FlyoutRegistryInstance = new FlyoutRegistry()
