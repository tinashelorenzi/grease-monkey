import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../theme';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  style,
}) => {
  const cardStyle = [
    styles.base,
    styles[variant],
    styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borders.radius.card,
  },
  
  // Variants
  default: {
    ...theme.shadows.component.card,
  },
  elevated: {
    ...theme.shadows.component.modal,
  },
  outlined: {
    borderWidth: theme.borders.width.thin,
    borderColor: theme.colors.border.primary,
    ...theme.shadows.getShadow('none'),
  },
  
  // Padding variants
  paddingSm: {
    padding: theme.spacing.sm,
  },
  paddingMd: {
    padding: theme.spacing.md,
  },
  paddingLg: {
    padding: theme.spacing.lg,
  },
});
