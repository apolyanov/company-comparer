export const MonochromeTheme = {
  colors: {
    background: {
      main: '#CCCCCC',
      contrast: '#111111',
      surface: '#FFFFFF',
      surfaceContrast: '#000000',
      overlay: 'rgba(0, 0, 0, 0.3)',
    },
    text: {
      primary: '#111111',
      secondary: '#555555',
      placeholder: '#999999',
      disabled: '#C0C0C0',
    },
    border: {
      main: '#D6D6D6',
    },
    accent: {
      main: '#000000',
      contrast: '#FFFFFF',
    },
    state: {
      disabled: '#C0C0C0',
    },
  },

  typography: {
    fontSize: 16,
    heading: 24,
    subheading: 18,
    lineHeight: 24,
    fontFamily: 'System',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
}

export const MonochromeDarkTheme = {
  colors: {
    background: {
      main: '#0A0A0A',
      contrast: '#FFFFFF',
      surface: '#1A1A1A',
      surfaceContrast: '#FFFFFF',
      overlay: 'rgba(255, 255, 255, 0.2)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#AAAAAA',
      placeholder: '#777777',
      disabled: '#444444',
    },
    border: {
      main: '#333333',
    },
    accent: {
      main: '#FFFFFF',
      contrast: '#0A0A0A',
    },
    state: {
      disabled: '#444444',
    },
  },

  typography: {
    fontSize: 16,
    heading: 24,
    subheading: 18,
    lineHeight: 24,
    fontFamily: 'System',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
}

export type AppTheme = typeof MonochromeTheme
