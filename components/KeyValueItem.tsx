import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Typography } from './Typography'

export interface KeyValueItemProps {
  keyText: string
  valueText: string | number
}

export const KeyValueItem = memo(function KeyValueItem(
  props: KeyValueItemProps
) {
  return (
    <View style={styles.container}>
      <Typography>{props.keyText}</Typography>
      <Typography>{props.valueText}</Typography>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
    gap: 8,
  },
})
