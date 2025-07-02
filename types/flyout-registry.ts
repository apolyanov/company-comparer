import { ComponentType } from 'react'

export type FlyoutKey = string

export type FlyoutContentBaseProps<Props extends object = object> = {
  onClose: () => void
} & Props

export interface FlyoutProps<Props extends object = object> {
  Content: ComponentType<FlyoutContentBaseProps & Props>
  title?: string | ((props: Props) => string)
}

export interface FlyoutEntry<Props extends object = object> {
  id: string
  props: FlyoutProps<Props>
}
