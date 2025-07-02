import { AppTheme } from '@/constants'
import { useTheme } from '@/hooks'
import { FontAwesomeIcon, Props } from '@fortawesome/react-native-fontawesome'
import { memo, useMemo } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native'

type ButtonVariant = 'primary' | 'secondary'

interface IconButtonProps extends TouchableOpacityProps {
  icon: Props['icon']
  variant?: ButtonVariant
}

export const IconButton = memo(function IconButton(props: IconButtonProps) {
  const { icon, variant = 'primary', ...rest } = props
  const theme = useTheme()

  const style = useMemo(() => styles(theme, variant), [theme, variant])

  return (
    <TouchableOpacity {...rest} style={style.button} hitSlop={24}>
      <FontAwesomeIcon icon={icon} color={style.iconColor.color} />
    </TouchableOpacity>
  )
})

const ButtonHeight = 36

function styles(
  theme: AppTheme,
  variant: ButtonVariant
): {
  button: ViewStyle
  iconColor: { color: string }
} {
  const baseStyle: ViewStyle = {
    height: ButtonHeight,
    width: ButtonHeight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ButtonHeight / 2,
  }

  const variantStyles = StyleSheet.create({
    primary: {
      backgroundColor: theme.colors.background.main,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.background.main,
      borderWidth: 1,
    },
  })

  const iconColor =
    variant === 'primary'
      ? { color: theme.colors.background.contrast }
      : { color: theme.colors.background.contrast }

  return {
    button: { ...baseStyle, ...variantStyles[variant] },
    iconColor,
  }
}
