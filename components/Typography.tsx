import { AppTheme } from '@/constants'
import { useTheme } from '@/hooks'
import { memo, useMemo } from 'react'
import { Text, TextProps, TextStyle } from 'react-native'

type TypographyVariant = 'heading' | 'subheading' | 'body' | 'caption'

interface TypographyProps extends TextProps {
  variant?: TypographyVariant
  color?: keyof AppTheme['colors']['text']
}

export const Typography = memo(function Typography(props: TypographyProps) {
  const { variant = 'body', color = 'primary', style, ...rest } = props
  const theme = useTheme()

  const textStyle = useMemo(() => {
    return [
      baseStyle(theme, variant),
      { color: theme.colors.text[color] },
      style,
    ]
  }, [theme, variant, color, style])

  return <Text {...rest} style={textStyle} />
})

function baseStyle(theme: AppTheme, variant: TypographyVariant): TextStyle {
  const base: TextStyle = {
    fontFamily: theme.typography.fontFamily,
    lineHeight: theme.typography.lineHeight,
  }

  switch (variant) {
    case 'heading':
      return {
        ...base,
        fontSize: theme.typography.heading,
        fontWeight: '700',
      }
    case 'subheading':
      return {
        ...base,
        fontSize: theme.typography.subheading,
        fontWeight: '600',
      }
    case 'caption':
      return {
        ...base,
        fontSize: theme.typography.fontSize - 2,
        fontWeight: '400',
      }
    case 'body':
    default:
      return {
        ...base,
        fontSize: theme.typography.fontSize,
        fontWeight: '400',
      }
  }
}
