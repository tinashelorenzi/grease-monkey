import { Platform } from 'react-native';

// Define shadow levels for consistent elevation
const shadowLevels = {
  none: 'none',
  xs: 'xs',
  sm: 'sm',
  base: 'base',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  '2xl': '2xl',
  '3xl': '3xl',
} as const;

type ShadowLevel = keyof typeof shadowLevels;

// iOS shadows with proper color and opacity
const iosShadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  xs: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  base: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
  },
  '2xl': {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
  },
  '3xl': {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
  },
};

// Android shadows using elevation
const androidShadows = {
  none: { elevation: 0 },
  xs: { elevation: 1 },
  sm: { elevation: 2 },
  base: { elevation: 3 },
  md: { elevation: 4 },
  lg: { elevation: 6 },
  xl: { elevation: 8 },
  '2xl': { elevation: 12 },
  '3xl': { elevation: 16 },
};

// Colored shadows for special cases
const coloredShadows = {
  primary: {
    shadowColor: '#1a365d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  success: {
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  warning: {
    shadowColor: '#d97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  error: {
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
};

// Cross-platform shadow helper
const getShadow = (level: ShadowLevel) => {
  if (Platform.OS === 'ios') {
    return iosShadows[level];
  } else {
    return androidShadows[level];
  }
};

// Component-specific shadows
const componentShadows = {
  // Card shadows
  card: {
    default: getShadow('sm'),
    elevated: getShadow('md'),
    floating: getShadow('lg'),
  },
  
  // Button shadows
  button: {
    default: getShadow('xs'),
    primary: getShadow('sm'),
    elevated: getShadow('md'),
    floating: getShadow('lg'),
  },
  
  // Modal and overlay shadows
  modal: {
    backdrop: getShadow('2xl'),
    content: getShadow('xl'),
    floating: getShadow('3xl'),
  },
  
  // Navigation shadows
  navigation: {
    header: Platform.OS === 'ios' ? getShadow('xs') : { elevation: 4 },
    tab: Platform.OS === 'ios' ? getShadow('sm') : { elevation: 8 },
    drawer: getShadow('lg'),
  },
  
  // Input shadows
  input: {
    default: getShadow('none'),
    focused: getShadow('xs'),
    error: Platform.OS === 'ios' ? coloredShadows.error : { elevation: 2 },
  },
  
  // List and item shadows
  list: {
    item: getShadow('xs'),
    section: getShadow('sm'),
  },
  
  // Toast and alert shadows
  toast: {
    default: getShadow('lg'),
    floating: getShadow('xl'),
  },
  
  // FAB and floating elements
  fab: {
    default: getShadow('md'),
    pressed: getShadow('lg'),
    floating: getShadow('xl'),
  },
  
  // Dropdown and popup shadows
  dropdown: {
    default: getShadow('md'),
    large: getShadow('lg'),
  },
};

// Shadow presets for common use cases
const shadowPresets = {
  // Subtle shadows for minimal elevation
  subtle: {
    card: getShadow('xs'),
    button: getShadow('none'),
    input: getShadow('none'),
  },
  
  // Standard shadows for normal elevation
  standard: {
    card: getShadow('sm'),
    button: getShadow('xs'),
    input: getShadow('xs'),
  },
  
  // Pronounced shadows for high elevation
  pronounced: {
    card: getShadow('md'),
    button: getShadow('sm'),
    input: getShadow('sm'),
  },
  
  // Dramatic shadows for floating elements
  dramatic: {
    card: getShadow('lg'),
    button: getShadow('md'),
    input: getShadow('md'),
  },
};

// Inner shadows (box-shadow inset equivalent for borders)
const innerShadows = {
  none: {
    borderWidth: 0,
  },
  xs: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  sm: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  base: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
};

export const shadows = {
  // Raw shadow objects
  ios: iosShadows,
  android: androidShadows,
  colored: coloredShadows,
  inner: innerShadows,
  
  // Utility functions
  getShadow,
  
  // Component-specific shadows
  component: componentShadows,
  
  // Shadow presets
  presets: shadowPresets,
  
  // Utility for creating custom shadows
  create: (options: {
    color?: string;
    offset?: { width: number; height: number };
    opacity?: number;
    radius?: number;
    elevation?: number;
  }) => {
    if (Platform.OS === 'ios') {
      return {
        shadowColor: options.color || '#000000',
        shadowOffset: options.offset || { width: 0, height: 2 },
        shadowOpacity: options.opacity || 0.1,
        shadowRadius: options.radius || 4,
      };
    } else {
      return {
        elevation: options.elevation || 2,
      };
    }
  },
} as const;

export type { ShadowLevel };
export type ComponentShadowKey = keyof typeof componentShadows;
export type ShadowPresetKey = keyof typeof shadowPresets;