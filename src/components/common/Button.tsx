import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../../theme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}) => {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyleCombined = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? theme.colors.neutral.white : theme.colors.primary.darkBlue}
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={textStyleCombined}>{title}</Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borders.radius.button,
    ...theme.shadows.component.button,
  },
  
  // Variants
  primary: {
    backgroundColor: theme.colors.primary.darkBlue,
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: theme.colors.primary.silver,
    borderWidth: 0,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: theme.borders.width.base,
    borderColor: theme.colors.primary.darkBlue,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  
  // Sizes
  sm: {
    paddingVertical: theme.spacing.component.button.paddingVertical - 4,
    paddingHorizontal: theme.spacing.component.button.paddingHorizontal - 8,
    minHeight: 32,
  },
  md: {
    paddingVertical: theme.spacing.component.button.paddingVertical,
    paddingHorizontal: theme.spacing.component.button.paddingHorizontal,
    minHeight: 44,
  },
  lg: {
    paddingVertical: theme.spacing.component.button.paddingVertical + 4,
    paddingHorizontal: theme.spacing.component.button.paddingHorizontal + 8,
    minHeight: 52,
  },
  
  // Text styles
  text: {
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center',
  },
  
  primaryText: {
    color: theme.colors.neutral.white,
  },
  secondaryText: {
    color: theme.colors.text.primary,
  },
  outlineText: {
    color: theme.colors.primary.darkBlue,
  },
  ghostText: {
    color: theme.colors.primary.darkBlue,
  },
  
  smText: {
    fontSize: theme.typography.fontSize.sm,
  },
  mdText: {
    fontSize: theme.typography.fontSize.base,
  },
  lgText: {
    fontSize: theme.typography.fontSize.lg,
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: theme.colors.text.disabled,
  },
});
