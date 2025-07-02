import { Button } from '@/components'
import { useEventCallback } from '@/hooks'
import { FlyoutContentBaseProps, SortDirection } from '@/types'
import { registerFlyout } from '@/utils'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { memo } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native'

interface DropdownOption {
  label: string
  value: string | null
}

interface DropdownOptionProps extends DropdownOption {
  active: boolean
  onPress: TouchableOpacityProps['onPress']
}

interface DropdownFlyoutContentProps {
  options: DropdownOption[]
  selectedOption: DropdownOptionProps['value']
  onSelectedValue: (value: DropdownOption['value']) => void
  sortDirection: SortDirection
}

const DropdownOptionEntry = memo(function DropdownOption(
  props: DropdownOptionProps
) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={dropdownOptionStyles.container}
    >
      <Text>{props.label}</Text>
      {props.active ? <FontAwesomeIcon icon={faCheck} /> : null}
    </TouchableOpacity>
  )
})

const DropdownFlyoutContent = memo(function DropdownFlyoutContent(
  props: FlyoutContentBaseProps<DropdownFlyoutContentProps>
) {
  const onPress = useEventCallback((value: DropdownOption['value']) => {
    return () => {
      props.onClose()
      props.onSelectedValue(value)
    }
  })

  return (
    <View>
      {props.options.map((option) => (
        <DropdownOptionEntry
          active={props.selectedOption === option.value}
          key={option.value}
          onPress={onPress(option.value)}
          {...option}
        />
      ))}
      <Button onPress={onPress(null)} text="Clear" />
    </View>
  )
})

export const DropdownFlyout = registerFlyout({
  id: 'dropdown',
  props: {
    title: (props) =>
      props.sortDirection === SortDirection.Asc
        ? 'Sort by Asc'
        : 'Sort by Desc',
    Content: DropdownFlyoutContent,
  },
})

const dropdownOptionStyles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
})
