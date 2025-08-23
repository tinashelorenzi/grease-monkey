import { colors } from './colors';
import { typography } from './typography';
import { spacing, spacingUtils } from './spacing';
import { borders } from './borders';
import { shadows } from './shadows';

// Enhanced theme object with utilities and component tokens
export const theme = {
  // Core design tokens
  colors,
  typography,
  spacing,
  borders,
  shadows,
  
  // Utilities
  utils: {
    spacing: spacingUtils,
  },
  
  // Component tokens for consistent styling
  components: {
    // Button component tokens
    button: {
      height: {
        xs: 32,
        sm: 36,
        base: 44,
        md: 48,
        lg: 52,
        xl: 56,
      },
      padding: {
        xs: { horizontal: spacing[3], vertical: spacing[2] },
        sm: { horizontal: spacing[4], vertical: spacing[2.5] },
        base: { horizontal: spacing[6], vertical: spacing[3] },
        md: { horizontal: spacing[6], vertical: spacing[3] },
        lg: { horizontal: spacing[8], vertical: spacing[4] },
        xl: { horizontal: spacing[10], vertical: spacing[5] },
      },
      radius: borders.radius.button.base,
      typography: typography.textStyles.button.base,
      shadow: shadows.component.button,
      gap: spacing[2],
    },
    
    // Input component tokens
    input: {
      height: {
        xs: 36,
        sm: 40,
        base: 44,
        md: 48,
        lg: 52,
      },
      padding: {
        horizontal: spacing[4],
        vertical: spacing[3.5],
      },
      radius: borders.radius.input.base,
      border: borders.component.input,
      typography: typography.textStyles.body.base,
      gap: spacing[2],
      labelSpacing: spacing[1.5],
    },
    
    // Card component tokens
    card: {
      padding: {
        xs: spacing[3],
        sm: spacing[4],
        base: spacing[5],
        md: spacing[6],
        lg: spacing[8],
      },
      margin: {
        xs: spacing[2],
        sm: spacing[3],
        base: spacing[4],
        md: spacing[6],
      },
      radius: borders.radius.card.base,
      shadow: shadows.component.card,
      border: borders.component.card,
      gap: spacing[4],
    },
    
    // Typography component tokens
    text: {
      display: typography.textStyles.display,
      heading: typography.textStyles.heading,
      body: typography.textStyles.body,
      label: typography.textStyles.label,
      caption: typography.textStyles.caption,
      overline: typography.textStyles.overline,
    },
    
    // Navigation component tokens
    navigation: {
      header: {
        height: 56,
        padding: { horizontal: spacing[5], vertical: spacing[4] },
        shadow: shadows.component.navigation.header,
        typography: typography.textStyles.heading.h5,
      },
      tab: {
        height: 60,
        padding: { horizontal: spacing[4], vertical: spacing[3] },
        shadow: shadows.component.navigation.tab,
        typography: typography.textStyles.label.sm,
      },
    },
    
    // Modal component tokens
    modal: {
      padding: spacing[6],
      margin: spacing[5],
      radius: borders.radius.modal.base,
      shadow: shadows.component.modal,
      backdrop: {
        color: colors.background.overlay,
      },
    },
    
    // List component tokens
    list: {
      item: {
        padding: spacing[4],
        margin: spacing[1],
        gap: spacing[3],
        shadow: shadows.component.list.item,
      },
      section: {
        padding: spacing[5],
        shadow: shadows.component.list.section,
        typography: typography.textStyles.overline.base,
      },
    },
    
    // Avatar component tokens
    avatar: {
      size: {
        xs: spacing[6],
        sm: spacing[8],
        base: spacing[10],
        md: spacing[12],
        lg: spacing[16],
      },
      radius: borders.radius.avatar.base,
      border: borders.component.avatar,
    },
    
    // Toast/Alert component tokens
    toast: {
      padding: spacing[4],
      margin: spacing[4],
      radius: borders.radius.md,
      shadow: shadows.component.toast,
      iconSpacing: spacing[3],
    },
    
    // FAB component tokens
    fab: {
      size: spacing[14],
      radius: borders.radius.full,
      shadow: shadows.component.fab,
    },
    
    // Form component tokens
    form: {
      fieldSpacing: spacing[5],
      sectionSpacing: spacing[8],
      groupSpacing: spacing[6],
      helperSpacing: spacing[1.5],
    },
  },
  
  // Semantic color combinations for different states
  states: {
    default: {
      background: colors.background.card,
      text: colors.text.primary,
      border: colors.border.primary,
    },
    primary: {
      background: colors.primary.darkBlue,
      text: colors.text.inverse,
      border: colors.primary.darkBlue,
    },
    secondary: {
      background: colors.primary.silver,
      text: colors.text.primary,
      border: colors.primary.silver,
    },
    success: {
      background: colors.semantic.success.primary,
      text: colors.text.inverse,
      border: colors.semantic.success.primary,
    },
    warning: {
      background: colors.semantic.warning.primary,
      text: colors.text.inverse,
      border: colors.semantic.warning.primary,
    },
    error: {
      background: colors.semantic.error.primary,
      text: colors.text.inverse,
      border: colors.semantic.error.primary,
    },
    info: {
      background: colors.semantic.info.primary,
      text: colors.text.inverse,
      border: colors.semantic.info.primary,
    },
    disabled: {
      background: colors.background.disabled,
      text: colors.text.disabled,
      border: colors.border.primary,
    },
  },
  
  // Interaction states
  interactions: {
    hover: {
      scale: 0.98,
      opacity: 0.8,
    },
    press: {
      scale: 0.95,
      opacity: 0.7,
    },
    focus: {
      borderWidth: borders.width.focus,
      borderColor: colors.border.focus,
    },
    disabled: {
      opacity: 0.5,
    },
  },
  
  // Animation values
  animation: {
    duration: {
      fast: 150,
      normal: 200,
      slow: 300,
      slower: 500,
    },
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
    spring: {
      tension: 100,
      friction: 8,
    },
  },
  
  // Layout constants
  layout: {
    screen: {
      padding: {
        horizontal: spacing[5], // 20px
        vertical: spacing[6],   // 24px
      },
    },
    container: {
      maxWidth: 1200,
      padding: {
        horizontal: spacing[5], // 20px
        vertical: spacing[6],   // 24px
      },
    },
    grid: {
      columns: 12,
      gutter: spacing[4], // 16px
    },
    breakpoints: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      '2xl': 1400,
    },
  },
  
  // Accessibility
  accessibility: {
    minTouchTarget: spacing.interactive.touchTarget,
    focusRing: borders.focusRing,
    contrast: {
      minimum: 4.5,  // WCAG AA
      enhanced: 7,   // WCAG AAA
    },
  },
} as const;

// Export individual components for tree shaking
export { colors } from './colors';
export { typography } from './typography';
export { spacing, spacingUtils } from './spacing';
export { borders } from './borders';
export { shadows } from './shadows';

// Export all types
export type Theme = typeof theme;

// Color types
export type {
  ColorPalette,
  ColorKey,
  PrimaryColor,
  SemanticColor,
  NeutralColor,
  BackgroundColor,
  TextColor,
  BorderColor,
} from './colors';

// Typography types
export type {
  TypographyKey,
  FontSize,
  FontWeight,
  LineHeight,
  LetterSpacing,
  TextStyleVariant,
  DisplayVariant,
  HeadingVariant,
  BodyVariant,
  LabelVariant,
  ButtonVariant,
} from './typography';

// Spacing types
export type {
  SpacingKey,
  ComponentSpacing,
  LayoutSpacing,
  SectionSpacing,
} from './spacing';

// Border types
export type {
  BorderRadiusKey,
  BorderWidthKey,
  BorderStyleKey,
  BorderPresetKey,
  ComponentBorderKey,
} from './borders';

// Shadow types
export type {
  ShadowLevel,
  ComponentShadowKey,
  ShadowPresetKey,
} from './shadows';

// Component token types
export type ComponentTokens = typeof theme.components;
export type ButtonTokens = typeof theme.components.button;
export type InputTokens = typeof theme.components.input;
export type CardTokens = typeof theme.components.card;
export type TextTokens = typeof theme.components.text;

// State types
export type ThemeState = keyof typeof theme.states;
export type StateTokens = typeof theme.states[ThemeState];

// Default export
export default theme;