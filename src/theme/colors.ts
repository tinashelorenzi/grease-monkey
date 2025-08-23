export const colors = {
  // Primary Brand Colors (from Grease Monkey logo)
  primary: {
    darkBlue: '#1a365d',      // Main brand color
    lightBlue: '#2d5aa0',     // Lighter variant for interactions
    darkBlueHover: '#153450',  // Hover state
    lightBrown: '#d4a574',    // Monkey fur accent
    tan: '#f4d03f',           // Monkey face highlight
    silver: '#cbd5e0',        // Wrench/tool color
    cream: '#f7fafc',         // Light background
  },
  
  // Extended Primary Palette
  primaryExtended: {
    50: '#f0f6ff',
    100: '#e0ecff',
    200: '#c7ddff',
    300: '#a5c8ff',
    400: '#82a8ff',
    500: '#6b8eff',
    600: '#4c63d2',
    700: '#3d4eaa',
    800: '#2d5aa0',
    900: '#1a365d',
    950: '#153450',
  },
  
  // Semantic Colors with better contrast
  semantic: {
    success: {
      primary: '#059669',
      light: '#d1fae5',
      dark: '#047857',
      text: '#065f46',
    },
    warning: {
      primary: '#d97706',
      light: '#fef3c7',
      dark: '#b45309',
      text: '#92400e',
    },
    error: {
      primary: '#dc2626',
      light: '#fee2e2',
      dark: '#b91c1c',
      text: '#991b1b',
    },
    info: {
      primary: '#2563eb',
      light: '#dbeafe',
      dark: '#1d4ed8',
      text: '#1e40af',
    },
  },
  
  // Neutral grays with better progression
  neutral: {
    white: '#ffffff',
    black: '#000000',
    transparent: 'rgba(0, 0, 0, 0)',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#0d1117',
  },
  
  // Background colors with depth
  background: {
    primary: '#fafbfc',        // Main app background
    secondary: '#f1f3f5',      // Secondary sections
    tertiary: '#e9ecef',       // Subtle sections
    card: '#ffffff',           // Card backgrounds
    elevated: '#ffffff',       // Elevated components
    overlay: 'rgba(0, 0, 0, 0.6)', // Modal overlays
    disabled: '#f8f9fa',       // Disabled state
    surface: '#ffffff',        // General surfaces
    input: '#ffffff',          // Input backgrounds
  },
  
  // Text colors with proper hierarchy
  text: {
    primary: '#1f2937',        // Main text
    secondary: '#4b5563',      // Secondary text
    tertiary: '#6b7280',       // Tertiary text
    quaternary: '#9ca3af',     // Light text
    inverse: '#ffffff',        // Text on dark backgrounds
    disabled: '#d1d5db',       // Disabled text
    accent: '#1a365d',         // Accent text (brand color)
    link: '#2563eb',           // Links
    linkHover: '#1d4ed8',      // Link hover state
  },
  
  // Border colors with context
  border: {
    primary: '#e5e7eb',        // Default borders
    secondary: '#d1d5db',      // Secondary borders
    tertiary: '#f3f4f6',       // Subtle borders
    focus: '#2563eb',          // Focus states
    error: '#dc2626',          // Error states
    success: '#059669',        // Success states
    warning: '#d97706',        // Warning states
    divider: '#f3f4f6',        // Content dividers
  },
  
  // Interactive states
  interactive: {
    primary: '#1a365d',
    primaryHover: '#153450',
    primaryActive: '#0f2a42',
    primaryDisabled: '#e5e7eb',
    
    secondary: '#cbd5e0',
    secondaryHover: '#b8c5d1',
    secondaryActive: '#a5b4c2',
    secondaryDisabled: '#f3f4f6',
    
    // Button variants
    outline: {
      border: '#1a365d',
      borderHover: '#153450',
      text: '#1a365d',
      textHover: '#153450',
      background: 'transparent',
      backgroundHover: '#f0f6ff',
    },
    
    ghost: {
      text: '#1a365d',
      textHover: '#153450',
      background: 'transparent',
      backgroundHover: '#f0f6ff',
    },
  },
  
  // Status indicators
  status: {
    online: '#22c55e',
    offline: '#6b7280',
    busy: '#f59e0b',
    away: '#ef4444',
    pending: '#3b82f6',
  },
} as const;

// Color utility types
export type ColorPalette = typeof colors;
export type ColorKey = keyof typeof colors;
export type PrimaryColor = keyof typeof colors.primary;
export type SemanticColor = keyof typeof colors.semantic;
export type NeutralColor = keyof typeof colors.neutral;
export type BackgroundColor = keyof typeof colors.background;
export type TextColor = keyof typeof colors.text;
export type BorderColor = keyof typeof colors.border;