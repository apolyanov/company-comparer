import { AppTheme } from '@/constants'
import { useTheme } from '@/hooks'
import { memo, useMemo } from 'react'
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native'
import { Typography } from './Typography'

interface TagProps extends TouchableOpacityProps {
  label: string | number
  active?: boolean
}

export const Tag = memo(function Tag(props: TagProps) {
  const { label, active = false, style, ...rest } = props
  const theme = useTheme()

  const styles = useMemo(() => getStyles(theme, active), [theme, active])

  return (
    <TouchableOpacity {...rest} style={[styles.container, style]}>
      <Typography style={styles.text}>{label}</Typography>
    </TouchableOpacity>
  )
})

function getStyles(
  theme: AppTheme,
  active: boolean
): {
  container: ViewStyle
  text: TextStyle
} {
  const backgroundColor = active
    ? theme.colors.accent.main
    : theme.colors.background.surface

  const textColor = active
    ? theme.colors.accent.contrast
    : theme.colors.background.surfaceContrast

  const borderColor = active
    ? theme.colors.accent.main
    : theme.colors.border.main

  return StyleSheet.create({
    container: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor,
      borderColor,
      borderWidth: 1,
      alignSelf: 'flex-start',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: textColor,
    },
  })
}
