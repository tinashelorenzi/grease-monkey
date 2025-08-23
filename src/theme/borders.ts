export const borders = {
  // Border Radius
  radius: {
    none: 0,
    sm: 2,
    base: 4,
    md: 6,
    lg: 8,
    xl: 12,
    '2xl': 16,
    '3xl': 24,
    full: 9999,
    
    // Specific component radius
    button: 8,
    card: 12,
    input: 8,
    modal: 16,
    avatar: 50,
  },
  
  // Border Width
  width: {
    none: 0,
    thin: 1,
    base: 2,
    thick: 3,
    thicker: 4,
  },
  
  // Border Styles
  style: {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
  },
  
  // Predefined border styles
  border: {
    none: {
      borderWidth: 0,
    },
    thin: {
      borderWidth: 1,
      borderStyle: 'solid',
    },
    base: {
      borderWidth: 2,
      borderStyle: 'solid',
    },
    thick: {
      borderWidth: 3,
      borderStyle: 'solid',
    },
  },
} as const;

export type BorderKey = keyof typeof borders;
