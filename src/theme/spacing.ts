export const spacing = {
  // Base spacing unit (4px)
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
  '5xl': 128,
  
  // Specific spacing values
  none: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
  
  // Layout spacing
  layout: {
    screen: 16,
    section: 24,
    card: 16,
    button: 12,
    input: 16,
    icon: 8,
  },
  
  // Component spacing
  component: {
    button: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      marginVertical: 8,
    },
    input: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginVertical: 8,
    },
    card: {
      padding: 16,
      margin: 8,
    },
    list: {
      itemPadding: 16,
      itemMargin: 8,
    },
  },
} as const;

export type SpacingKey = keyof typeof spacing;
