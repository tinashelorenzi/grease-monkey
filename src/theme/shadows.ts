import { Platform } from 'react-native';

// Define shadow levels separately to avoid circular reference
const shadowLevels = {
  none: 'none',
  sm: 'sm',
  base: 'base',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  '2xl': '2xl',
} as const;

type ShadowLevel = keyof typeof shadowLevels;

// iOS shadows
const iosShadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  base: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
  },
  '2xl': {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
  },
};

// Android shadows (elevation)
const androidShadows = {
  none: { elevation: 0 },
  sm: { elevation: 1 },
  base: { elevation: 2 },
  md: { elevation: 4 },
  lg: { elevation: 8 },
  xl: { elevation: 12 },
  '2xl': { elevation: 16 },
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
  card: Platform.OS === 'ios' ? iosShadows.base : androidShadows.base,
  button: Platform.OS === 'ios' ? iosShadows.sm : androidShadows.sm,
  modal: Platform.OS === 'ios' ? iosShadows.lg : androidShadows.lg,
  floating: Platform.OS === 'ios' ? iosShadows.md : androidShadows.md,
};

export const shadows = {
  ios: iosShadows,
  android: androidShadows,
  getShadow,
  component: componentShadows,
} as const;

export type { ShadowLevel };
