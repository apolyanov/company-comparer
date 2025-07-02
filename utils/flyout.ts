import { ArchInstance, FlyoutRegistryInstance } from '@/singletons'
import { FlyoutEntry } from '@/types'

export function registerFlyout<Props extends object>(
  props: FlyoutEntry<Props>
) {
  FlyoutRegistryInstance.register(props)

  return {
    open: (contentProps: Props) => openFlyout(props.id, contentProps),
    close: () => closeFlyout(props.id),
  }
}

export function closeFlyout(id: string) {
  ArchInstance.emit('closeFlyout', { id })
}

export function openFlyout<Props extends object>(id: string, props: Props) {
  ArchInstance.emit('openFlyout', { id, props })
}
