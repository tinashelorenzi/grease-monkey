export const borders = {
  // Border radius scale for consistent rounded corners
  radius: {
    none: 0,
    xs: 2,
    sm: 4,
    base: 6,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    '4xl': 32,
    full: 9999,
    
    // Component-specific radius values
    button: {
      xs: 4,
      sm: 6,
      base: 8,
      md: 10,
      lg: 12,
      xl: 16,
      pill: 9999,
    },
    
    input: {
      xs: 4,
      sm: 6,
      base: 8,
      md: 10,
      lg: 12,
    },
    
    card: {
      xs: 6,
      sm: 8,
      base: 12,
      md: 16,
      lg: 20,
      xl: 24,
    },
    
    modal: {
      xs: 8,
      sm: 12,
      base: 16,
      md: 20,
      lg: 24,
      xl: 32,
    },
    
    avatar: {
      xs: 4,
      sm: 6,
      base: 8,
      md: 12,
      lg: 16,
      xl: 20,
      full: 9999,
    },
    
    image: {
      xs: 4,
      sm: 6,
      base: 8,
      md: 12,
      lg: 16,
      xl: 20,
    },
    
    badge: {
      xs: 2,
      sm: 4,
      base: 6,
      md: 8,
      full: 9999,
    },
    
    tab: {
      xs: 4,
      sm: 6,
      base: 8,
      md: 10,
      top: { topLeft: 8, topRight: 8, bottomLeft: 0, bottomRight: 0 },
    },
  },
  
  // Border width scale
  width: {
    none: 0,
    hairline: 0.5,
    thin: 1,
    base: 1.5,
    thick: 2,
    thicker: 3,
    thickest: 4,
    
    // Semantic widths
    divider: 1,
    focus: 2,
    accent: 3,
  },
  
  // Border styles
  style: {
    solid: 'solid' as const,
    dashed: 'dashed' as const,
    dotted: 'dotted' as const,
  },
  
  // Predefined border combinations
  preset: {
    none: {
      borderWidth: 0,
    },
    
    hairline: {
      borderWidth: 0.5,
      borderStyle: 'solid' as const,
    },
    
    thin: {
      borderWidth: 1,
      borderStyle: 'solid' as const,
    },
    
    base: {
      borderWidth: 1.5,
      borderStyle: 'solid' as const,
    },
    
    thick: {
      borderWidth: 2,
      borderStyle: 'solid' as const,
    },
    
    dashed: {
      borderWidth: 1,
      borderStyle: 'dashed' as const,
    },
    
    dotted: {
      borderWidth: 1,
      borderStyle: 'dotted' as const,
    },
  },
  
  // Component-specific border styles
  component: {
    // Button borders
    button: {
      none: { borderWidth: 0 },
      default: { 
        borderWidth: 1,
        borderStyle: 'solid' as const,
      },
      thick: { 
        borderWidth: 2,
        borderStyle: 'solid' as const,
      },
      focus: { 
        borderWidth: 2,
        borderStyle: 'solid' as const,
      },
    },
    
    // Input field borders
    input: {
      default: { 
        borderWidth: 1,
        borderStyle: 'solid' as const,
      },
      focus: { 
        borderWidth: 2,
        borderStyle: 'solid' as const,
      },
      error: { 
        borderWidth: 2,
        borderStyle: 'solid' as const,
      },
      disabled: { 
        borderWidth: 1,
        borderStyle: 'solid' as const,
      },
    },
    
    // Card borders
    card: {
      none: { borderWidth: 0 },
      subtle: { 
        borderWidth: 1,
        borderStyle: 'solid' as const,
      },
      default: { 
        borderWidth: 1,
        borderStyle: 'solid' as const,
      },
      accent: { 
        borderWidth: 2,
        borderStyle: 'solid' as const,
      },
    },
    
    // Tab borders
    tab: {
      default: { 
        borderWidth: 1,
        borderStyle: 'solid' as const,
      },
      active: { 
        borderWidth: 2,
        borderStyle: 'solid' as const,
      },
      bottom: {
        borderBottomWidth: 2,
        borderStyle: 'solid' as const,
      },
    },
    
    // Modal borders
    modal: {
      default: { 
        borderWidth: 1,
        borderStyle: 'solid' as const,
      },
      none: { borderWidth: 0 },
    },
    
    // Divider borders
    divider: {
      horizontal: {
        borderBottomWidth: 1,
        borderStyle: 'solid' as const,
      },
      vertical: {
        borderRightWidth: 1,
        borderStyle: 'solid' as const,
      },
      thick: {
        borderBottomWidth: 2,
        borderStyle: 'solid' as const,
      },
    },
    
    // Avatar borders
    avatar: {
      none: { borderWidth: 0 },
      thin: { 
        borderWidth: 1,
        borderStyle: 'solid' as const,
      },
      thick: { 
        borderWidth: 3,
        borderStyle: 'solid' as const,
      },
      status: { 
        borderWidth: 4,
        borderStyle: 'solid' as const,
      },
    },
  },
  
  // Border utilities for specific sides
  sides: {
    top: (width: number, style: 'solid' | 'dashed' | 'dotted' = 'solid') => ({
      borderTopWidth: width,
      borderTopStyle: style,
    }),
    
    right: (width: number, style: 'solid' | 'dashed' | 'dotted' = 'solid') => ({
      borderRightWidth: width,
      borderRightStyle: style,
    }),
    
    bottom: (width: number, style: 'solid' | 'dashed' | 'dotted' = 'solid') => ({
      borderBottomWidth: width,
      borderBottomStyle: style,
    }),
    
    left: (width: number, style: 'solid' | 'dashed' | 'dotted' = 'solid') => ({
      borderLeftWidth: width,
      borderLeftStyle: style,
    }),
    
    horizontal: (width: number, style: 'solid' | 'dashed' | 'dotted' = 'solid') => ({
      borderLeftWidth: width,
      borderRightWidth: width,
      borderLeftStyle: style,
      borderRightStyle: style,
    }),
    
    vertical: (width: number, style: 'solid' | 'dashed' | 'dotted' = 'solid') => ({
      borderTopWidth: width,
      borderBottomWidth: width,
      borderTopStyle: style,
      borderBottomStyle: style,
    }),
  },
  
  // Rounded corner utilities
  rounded: {
    // All corners
    all: (radius: number) => ({ borderRadius: radius }),
    
    // Individual corners
    topLeft: (radius: number) => ({ borderTopLeftRadius: radius }),
    topRight: (radius: number) => ({ borderTopRightRadius: radius }),
    bottomLeft: (radius: number) => ({ borderBottomLeftRadius: radius }),
    bottomRight: (radius: number) => ({ borderBottomRightRadius: radius }),
    
    // Grouped corners
    top: (radius: number) => ({
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
    }),
    
    bottom: (radius: number) => ({
      borderBottomLeftRadius: radius,
      borderBottomRightRadius: radius,
    }),
    
    left: (radius: number) => ({
      borderTopLeftRadius: radius,
      borderBottomLeftRadius: radius,
    }),
    
    right: (radius: number) => ({
      borderTopRightRadius: radius,
      borderBottomRightRadius: radius,
    }),
  },
  
  // Focus ring utilities
  focusRing: {
    none: {},
    
    default: {
      borderWidth: 2,
      borderStyle: 'solid' as const,
    },
    
    thick: {
      borderWidth: 3,
      borderStyle: 'solid' as const,
    },
    
    // With offset (using margin for ring effect)
    offset: {
      borderWidth: 2,
      borderStyle: 'solid' as const,
      margin: 2,
    },
  },
} as const;

// Type definitions
export type BorderRadiusKey = keyof typeof borders.radius;
export type BorderWidthKey = keyof typeof borders.width;
export type BorderStyleKey = keyof typeof borders.style;
export type BorderPresetKey = keyof typeof borders.preset;
export type ComponentBorderKey = keyof typeof borders.component;