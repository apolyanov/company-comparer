import { useArchListener, useEventCallback } from '@/hooks'
import { FlyoutRegistryInstance } from '@/singletons'
import { FlyoutEntry, FlyoutProps } from '@/types'
import { closeFlyout } from '@/utils'
import { memo, useState } from 'react'
import { Flyout } from './Flyout'

export const FlyoutCenter = memo(function FlyoutCenter() {
  const [stack, setStack] = useState<FlyoutEntry[]>([])

  useArchListener('openFlyout', (data) => {
    const flyout = FlyoutRegistryInstance.getFlyout(data.id)

    if (flyout) {
      setStack((prev) => [
        ...prev,
        { id: flyout.id, props: { ...data.props, ...flyout.props } },
      ])
    }
  })

  const removeFlyout = useEventCallback(() => {
    setStack((prev) => prev.slice(0, -1))
  })

  const onClose = useEventCallback((id: string) => {
    return () => {
      closeFlyout(id)
    }
  })

  const getTitle = useEventCallback(
    (title: FlyoutEntry['props']['title'], props: FlyoutProps) => {
      if (typeof title === 'function') {
        return title(props)
      }

      return title
    }
  )

  return stack.map((flyout, index) => (
    <Flyout
      key={flyout.id}
      id={flyout.id}
      title={getTitle(flyout.props.title, flyout.props)}
      onCloseFinished={removeFlyout}
      isTop={index + 1 === stack.length}
      layer={index + 1}
    >
      <flyout.props.Content {...flyout.props} onClose={onClose(flyout.id)} />
    </Flyout>
  ))
})
