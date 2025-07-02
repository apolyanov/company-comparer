import { AppTheme } from '@/constants'
import { useTheme } from '@/hooks'
import { memo, useMemo } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'
import { Typography } from './Typography'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonProps extends TouchableOpacityProps {
  text: string
  variant?: ButtonVariant
}

export const Button = memo(function Button(props: ButtonProps) {
  const theme = useTheme()

  const style = useMemo(() => {
    const themedStyles = styles(theme, props.variant ?? 'primary')

    return {
      button: [themedStyles.button, props.style],
      text: themedStyles.text,
    }
  }, [theme, props.variant, props.style])

  return (
    <TouchableOpacity {...props} style={style.button}>
      <Typography style={style.text}>{props.text}</Typography>
    </TouchableOpacity>
  )
})

const ButtonHeight = 48

function styles(theme: AppTheme, variant: ButtonVariant) {
  const baseButtonStyle: TouchableOpacityProps['style'] = {
    height: ButtonHeight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ButtonHeight / 2,
    minWidth: 96,
    paddingHorizontal: 8,
  }

  const variantButtonStyles = StyleSheet.create({
    primary: {
      backgroundColor: theme.colors.background.main,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.background.main,
      borderWidth: 1.5,
    },
  })

  const variantTextStyles = StyleSheet.create({
    primary: {
      color: theme.colors.background.contrast,
    },
    secondary: {
      color: theme.colors.background.contrast,
    },
  })

  return {
    button: [baseButtonStyle, variantButtonStyles[variant]],
    text: [variantTextStyles[variant]],
  }
}
