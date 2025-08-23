import { Platform } from 'react-native';

// Font scale for better hierarchy
const fontScale = {
  xs: 0.75,    // 12px
  sm: 0.875,   // 14px
  base: 1,     // 16px
  lg: 1.125,   // 18px
  xl: 1.25,    // 20px
  '2xl': 1.5,  // 24px
  '3xl': 1.875,// 30px
  '4xl': 2.25, // 36px
  '5xl': 3,    // 48px
  '6xl': 3.75, // 60px
  '7xl': 4.5,  // 72px
};

export const typography = {
  // Font Families with fallbacks
  fontFamily: {
    primary: Platform.select({
      ios: '-apple-system',
      android: 'Roboto',
      default: 'system-ui',
    }),
    secondary: Platform.select({
      ios: 'SF Pro Display',
      android: 'Roboto',
      default: 'system-ui',
    }),
    monospace: Platform.select({
      ios: 'SF Mono',
      android: 'Roboto Mono',
      default: 'monospace',
    }),
  },
  
  // Base font size (16px)
  baseFontSize: 16,
  
  // Font Sizes with consistent scale
  fontSize: {
    xs: 12,      // fontScale.xs * 16
    sm: 14,      // fontScale.sm * 16
    base: 16,    // fontScale.base * 16
    lg: 18,      // fontScale.lg * 16
    xl: 20,      // fontScale.xl * 16
    '2xl': 24,   // fontScale['2xl'] * 16
    '3xl': 30,   // fontScale['3xl'] * 16
    '4xl': 36,   // fontScale['4xl'] * 16
    '5xl': 48,   // fontScale['5xl'] * 16
    '6xl': 60,   // fontScale['6xl'] * 16
    '7xl': 72,   // fontScale['7xl'] * 16
  },
  
  // Font Weights with proper fallbacks
  fontWeight: {
    thin: '100' as const,
    extralight: '200' as const,
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
  },
  
  // Line Heights for better readability
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  // Letter Spacing for different contexts
  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
  
  // Text Decoration
  textDecoration: {
    none: 'none',
    underline: 'underline',
    lineThrough: 'line-through',
  },
  
  // Text Transform
  textTransform: {
    none: 'none',
    capitalize: 'capitalize',
    uppercase: 'uppercase',
    lowercase: 'lowercase',
  },
  
  // Comprehensive text styles
  textStyles: {
    // Display styles for hero sections
    display: {
      '2xl': {
        fontSize: 72,
        fontWeight: '800',
        lineHeight: 1.1,
        letterSpacing: -0.025,
      },
      xl: {
        fontSize: 60,
        fontWeight: '800',
        lineHeight: 1.1,
        letterSpacing: -0.025,
      },
      lg: {
        fontSize: 48,
        fontWeight: '700',
        lineHeight: 1.2,
        letterSpacing: -0.025,
      },
      md: {
        fontSize: 36,
        fontWeight: '700',
        lineHeight: 1.25,
        letterSpacing: -0.025,
      },
      sm: {
        fontSize: 30,
        fontWeight: '600',
        lineHeight: 1.3,
        letterSpacing: -0.025,
      },
      xs: {
        fontSize: 24,
        fontWeight: '600',
        lineHeight: 1.4,
        letterSpacing: 0,
      },
    },
    
    // Heading styles with proper hierarchy
    heading: {
      h1: {
        fontSize: 36,
        fontWeight: '700',
        lineHeight: 1.25,
        letterSpacing: -0.025,
      },
      h2: {
        fontSize: 30,
        fontWeight: '600',
        lineHeight: 1.3,
        letterSpacing: -0.025,
      },
      h3: {
        fontSize: 24,
        fontWeight: '600',
        lineHeight: 1.4,
        letterSpacing: 0,
      },
      h4: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 1.4,
        letterSpacing: 0,
      },
      h5: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 1.5,
        letterSpacing: 0,
      },
      h6: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 1.5,
        letterSpacing: 0,
      },
    },
    
    // Body text styles
    body: {
      xl: {
        fontSize: 20,
        fontWeight: '400',
        lineHeight: 1.6,
        letterSpacing: 0,
      },
      lg: {
        fontSize: 18,
        fontWeight: '400',
        lineHeight: 1.6,
        letterSpacing: 0,
      },
      base: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 1.6,
        letterSpacing: 0,
      },
      sm: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 1.6,
        letterSpacing: 0,
      },
      xs: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 1.5,
        letterSpacing: 0,
      },
    },
    
    // UI component styles
    label: {
      lg: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 1.5,
        letterSpacing: 0,
      },
      base: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 1.5,
        letterSpacing: 0,
      },
      sm: {
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 1.5,
        letterSpacing: 0.025,
      },
    },
    
    // Button text styles
    button: {
      lg: {
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 1.25,
        letterSpacing: 0,
      },
      base: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 1.25,
        letterSpacing: 0,
      },
      sm: {
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 1.25,
        letterSpacing: 0,
      },
      xs: {
        fontSize: 12,
        fontWeight: '600',
        lineHeight: 1.25,
        letterSpacing: 0.025,
      },
    },
    
    // Caption and helper text
    caption: {
      base: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 1.5,
        letterSpacing: 0.025,
      },
      sm: {
        fontSize: 11,
        fontWeight: '400',
        lineHeight: 1.5,
        letterSpacing: 0.025,
      },
    },
    
    // Overline text (small labels)
    overline: {
      base: {
        fontSize: 10,
        fontWeight: '600',
        lineHeight: 1.5,
        letterSpacing: 0.1,
        textTransform: 'uppercase' as const,
      },
      sm: {
        fontSize: 9,
        fontWeight: '600',
        lineHeight: 1.5,
        letterSpacing: 0.1,
        textTransform: 'uppercase' as const,
      },
    },
    
    // Code and monospace text
    code: {
      base: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 1.5,
        letterSpacing: 0,
      },
      sm: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 1.5,
        letterSpacing: 0,
      },
    },
  },
  
  // Text utilities for common use cases
  utilities: {
    truncate: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    textCenter: {
      textAlign: 'center' as const,
    },
    textLeft: {
      textAlign: 'left' as const,
    },
    textRight: {
      textAlign: 'right' as const,
    },
    textJustify: {
      textAlign: 'justify' as const,
    },
  },
} as const;

// Type definitions
export type TypographyKey = keyof typeof typography;
export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;
export type LineHeight = keyof typeof typography.lineHeight;
export type LetterSpacing = keyof typeof typography.letterSpacing;
export type TextStyleVariant = keyof typeof typography.textStyles;
export type DisplayVariant = keyof typeof typography.textStyles.display;
export type HeadingVariant = keyof typeof typography.textStyles.heading;
export type BodyVariant = keyof typeof typography.textStyles.body;
export type LabelVariant = keyof typeof typography.textStyles.label;
export type ButtonVariant = keyof typeof typography.textStyles.button;