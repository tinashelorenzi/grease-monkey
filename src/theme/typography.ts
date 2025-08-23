import { Platform } from 'react-native';

export const typography = {
  // Font Families
  fontFamily: {
    primary: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    secondary: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    monospace: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },
  
  // Font Weights
  fontWeight: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
  
  // Text Styles
  textStyles: {
    // Display styles
    display1: {
      fontSize: 48,
      fontWeight: '700',
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    display2: {
      fontSize: 36,
      fontWeight: '700',
      lineHeight: 1.25,
      letterSpacing: -0.25,
    },
    
    // Heading styles
    h1: {
      fontSize: 30,
      fontWeight: '700',
      lineHeight: 1.3,
      letterSpacing: -0.25,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 1.35,
      letterSpacing: -0.25,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 1.45,
      letterSpacing: 0,
    },
    h5: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    h6: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    
    // Body styles
    body1: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 1.6,
      letterSpacing: 0,
    },
    body2: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 1.6,
      letterSpacing: 0,
    },
    
    // Caption styles
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 1.5,
      letterSpacing: 0.25,
    },
    
    // Button styles
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 1.5,
      letterSpacing: 0.25,
    },
    
    // Overline styles
    overline: {
      fontSize: 10,
      fontWeight: '500',
      lineHeight: 1.5,
      letterSpacing: 1.5,
    },
  },
} as const;

export type TypographyKey = keyof typeof typography;
export type TextStyleKey = keyof typeof typography.textStyles;
