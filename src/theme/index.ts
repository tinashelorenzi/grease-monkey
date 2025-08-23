import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { borders } from './borders';
import { shadows } from './shadows';

export const theme = {
  colors,
  typography,
  spacing,
  borders,
  shadows,
} as const;

// Export individual theme components
export { colors, typography, spacing, borders, shadows };

// Export types
export type Theme = typeof theme;
export type { ColorKey, ColorValue } from './colors';
export type { TypographyKey, TextStyleKey } from './typography';
export type { SpacingKey } from './spacing';
export type { BorderKey } from './borders';
export type { ShadowLevel } from './shadows';

// Default export
export default theme;
