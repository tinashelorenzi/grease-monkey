// Base spacing unit (4px) for consistent spacing throughout the app
const BASE_UNIT = 4;

export const spacing = {
  // Base spacing scale (4px increments)
  0: 0,
  px: 1,
  0.5: BASE_UNIT * 0.5,  // 2px
  1: BASE_UNIT * 1,      // 4px
  1.5: BASE_UNIT * 1.5,  // 6px
  2: BASE_UNIT * 2,      // 8px
  2.5: BASE_UNIT * 2.5,  // 10px
  3: BASE_UNIT * 3,      // 12px
  3.5: BASE_UNIT * 3.5,  // 14px
  4: BASE_UNIT * 4,      // 16px
  5: BASE_UNIT * 5,      // 20px
  6: BASE_UNIT * 6,      // 24px
  7: BASE_UNIT * 7,      // 28px
  8: BASE_UNIT * 8,      // 32px
  9: BASE_UNIT * 9,      // 36px
  10: BASE_UNIT * 10,    // 40px
  11: BASE_UNIT * 11,    // 44px
  12: BASE_UNIT * 12,    // 48px
  14: BASE_UNIT * 14,    // 56px
  16: BASE_UNIT * 16,    // 64px
  18: BASE_UNIT * 18,    // 72px
  20: BASE_UNIT * 20,    // 80px
  24: BASE_UNIT * 24,    // 96px
  28: BASE_UNIT * 28,    // 112px
  32: BASE_UNIT * 32,    // 128px
  36: BASE_UNIT * 36,    // 144px
  40: BASE_UNIT * 40,    // 160px
  44: BASE_UNIT * 44,    // 176px
  48: BASE_UNIT * 48,    // 192px
  52: BASE_UNIT * 52,    // 208px
  56: BASE_UNIT * 56,    // 224px
  60: BASE_UNIT * 60,    // 240px
  64: BASE_UNIT * 64,    // 256px
  72: BASE_UNIT * 72,    // 288px
  80: BASE_UNIT * 80,    // 320px
  96: BASE_UNIT * 96,    // 384px
  
  // Semantic spacing names for common use
  none: 0,
  xs: BASE_UNIT * 1,     // 4px
  sm: BASE_UNIT * 2,     // 8px
  md: BASE_UNIT * 4,     // 16px
  lg: BASE_UNIT * 6,     // 24px
  xl: BASE_UNIT * 8,     // 32px
  '2xl': BASE_UNIT * 12, // 48px
  '3xl': BASE_UNIT * 16, // 64px
  '4xl': BASE_UNIT * 24, // 96px
  '5xl': BASE_UNIT * 32, // 128px
  
  // Screen-level spacing
  screen: {
    horizontal: BASE_UNIT * 5,    // 20px - consistent screen margins
    vertical: BASE_UNIT * 6,      // 24px - consistent screen padding
    top: BASE_UNIT * 12,          // 48px - top safe area
    bottom: BASE_UNIT * 8,        // 32px - bottom safe area
  },
  
  // Section spacing for content organization
  section: {
    xs: BASE_UNIT * 4,    // 16px - tight sections
    sm: BASE_UNIT * 6,    // 24px - small sections
    md: BASE_UNIT * 8,    // 32px - medium sections
    lg: BASE_UNIT * 12,   // 48px - large sections
    xl: BASE_UNIT * 16,   // 64px - extra large sections
  },
  
  // Component-specific spacing
  component: {
    // Button spacing
    button: {
      paddingHorizontal: {
        xs: BASE_UNIT * 3,    // 12px
        sm: BASE_UNIT * 4,    // 16px
        md: BASE_UNIT * 6,    // 24px
        lg: BASE_UNIT * 8,    // 32px
        xl: BASE_UNIT * 10,   // 40px
      },
      paddingVertical: {
        xs: BASE_UNIT * 2,    // 8px
        sm: BASE_UNIT * 2.5,  // 10px
        md: BASE_UNIT * 3,    // 12px
        lg: BASE_UNIT * 4,    // 16px
        xl: BASE_UNIT * 5,    // 20px
      },
      gap: BASE_UNIT * 2,     // 8px - space between icon and text
      marginVertical: BASE_UNIT * 2, // 8px
    },
    
    // Input field spacing
    input: {
      paddingHorizontal: BASE_UNIT * 4,    // 16px
      paddingVertical: BASE_UNIT * 3.5,    // 14px
      marginVertical: BASE_UNIT * 2,       // 8px
      gap: BASE_UNIT * 2,                  // 8px - space between label and input
      labelMarginBottom: BASE_UNIT * 1.5,  // 6px
    },
    
    // Card spacing
    card: {
      padding: {
        xs: BASE_UNIT * 3,    // 12px
        sm: BASE_UNIT * 4,    // 16px
        md: BASE_UNIT * 5,    // 20px
        lg: BASE_UNIT * 6,    // 24px
        xl: BASE_UNIT * 8,    // 32px
      },
      margin: {
        xs: BASE_UNIT * 2,    // 8px
        sm: BASE_UNIT * 3,    // 12px
        md: BASE_UNIT * 4,    // 16px
        lg: BASE_UNIT * 6,    // 24px
      },
      gap: BASE_UNIT * 4,     // 16px - space between card elements
    },
    
    // List item spacing
    list: {
      itemPadding: BASE_UNIT * 4,      // 16px
      itemMargin: BASE_UNIT * 1,       // 4px
      itemGap: BASE_UNIT * 3,          // 12px - space between list content
      sectionPadding: BASE_UNIT * 5,   // 20px - section header padding
    },
    
    // Modal and overlay spacing
    modal: {
      padding: BASE_UNIT * 6,          // 24px
      margin: BASE_UNIT * 5,           // 20px
      headerMarginBottom: BASE_UNIT * 6, // 24px
      footerMarginTop: BASE_UNIT * 6,   // 24px
    },
    
    // Tab navigation spacing
    tab: {
      paddingHorizontal: BASE_UNIT * 4, // 16px
      paddingVertical: BASE_UNIT * 3,   // 12px
      iconMarginBottom: BASE_UNIT * 1,  // 4px
    },
    
    // Form spacing
    form: {
      fieldMarginBottom: BASE_UNIT * 5,    // 20px
      sectionMarginBottom: BASE_UNIT * 8,  // 32px
      groupMarginBottom: BASE_UNIT * 6,    // 24px
      helperTextMarginTop: BASE_UNIT * 1.5, // 6px
    },
    
    // Toast and alert spacing
    toast: {
      padding: BASE_UNIT * 4,          // 16px
      margin: BASE_UNIT * 4,           // 16px
      iconMarginRight: BASE_UNIT * 3,  // 12px
    },
  },
  
  // Layout containers
  layout: {
    container: {
      paddingHorizontal: BASE_UNIT * 5, // 20px
      paddingVertical: BASE_UNIT * 6,   // 24px
    },
    header: {
      paddingHorizontal: BASE_UNIT * 5, // 20px
      paddingVertical: BASE_UNIT * 4,   // 16px
      marginBottom: BASE_UNIT * 6,      // 24px
    },
    footer: {
      paddingHorizontal: BASE_UNIT * 5, // 20px
      paddingVertical: BASE_UNIT * 6,   // 24px
      marginTop: BASE_UNIT * 8,         // 32px
    },
    sidebar: {
      padding: BASE_UNIT * 4,           // 16px
      itemPadding: BASE_UNIT * 3,       // 12px
    },
  },
  
  // Interactive element spacing
  interactive: {
    touchTarget: BASE_UNIT * 11,        // 44px - minimum touch target size
    iconButton: BASE_UNIT * 10,         // 40px - icon button size
    avatar: {
      xs: BASE_UNIT * 6,                // 24px
      sm: BASE_UNIT * 8,                // 32px
      md: BASE_UNIT * 10,               // 40px
      lg: BASE_UNIT * 12,               // 48px
      xl: BASE_UNIT * 16,               // 64px
    },
    fab: BASE_UNIT * 14,                // 56px - floating action button
  },
  
  // Content spacing
  content: {
    paragraphSpacing: BASE_UNIT * 4,    // 16px - space between paragraphs
    lineSpacing: BASE_UNIT * 1.5,       // 6px - additional line spacing
    wordSpacing: BASE_UNIT * 0.25,      // 1px - word spacing adjustment
    letterSpacing: 0.5,                 // 0.5px - letter spacing
  },
  
  // Grid and flexbox utilities
  grid: {
    gutter: BASE_UNIT * 4,              // 16px - grid gutter
    columnGap: BASE_UNIT * 4,           // 16px - column gap
    rowGap: BASE_UNIT * 4,              // 16px - row gap
  },
} as const;

// Utility functions for spacing calculations
export const spacingUtils = {
  // Calculate responsive spacing based on screen size
  responsive: (base: number, scale: number = 1) => base * scale,
  
  // Get spacing value by key
  get: (key: keyof typeof spacing): number => {
    const value = spacing[key];
    return typeof value === 'number' ? value : 0;
  },
  
  // Create consistent margin/padding objects
  marginHorizontal: (value: number) => ({ marginLeft: value, marginRight: value }),
  marginVertical: (value: number) => ({ marginTop: value, marginBottom: value }),
  paddingHorizontal: (value: number) => ({ paddingLeft: value, paddingRight: value }),
  paddingVertical: (value: number) => ({ paddingTop: value, paddingBottom: value }),
  
  // Common spacing patterns
  inset: (value: number) => ({
    top: value,
    right: value,
    bottom: value,
    left: value,
  }),
};

// Type definitions
export type SpacingKey = keyof typeof spacing;
export type ComponentSpacing = keyof typeof spacing.component;
export type LayoutSpacing = keyof typeof spacing.layout;
export type SectionSpacing = keyof typeof spacing.section;