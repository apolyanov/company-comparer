import { AppTheme, MonochromeDarkTheme, MonochromeTheme } from '@/constants'
import { useColorScheme } from 'react-native'

export const useTheme = (): AppTheme => {
  const scheme = useColorScheme()

  if (scheme === 'dark') {
    return MonochromeDarkTheme
  }

  return MonochromeTheme
}
