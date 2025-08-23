import React from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';
import { theme } from '../../theme';

export interface TextProps {
  children: React.ReactNode;
  variant?: TextStyleKey;
  color?: keyof typeof theme.colors.text;
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: keyof typeof theme.typography.fontWeight;
  size?: keyof typeof theme.typography.fontSize;
  style?: TextStyle;
  numberOfLines?: number;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant,
  color = 'primary',
  align = 'left',
  weight,
  size,
  style,
  numberOfLines,
}) => {
  const textStyle = [
    styles.base,
    variant && theme.typography.textStyles[variant],
    weight && { fontWeight: theme.typography.fontWeight[weight] },
    size && { fontSize: theme.typography.fontSize[size] },
    { color: theme.colors.text[color] },
    { textAlign: align },
    style,
  ];

  return (
    <RNText style={textStyle} numberOfLines={numberOfLines}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: theme.typography.fontFamily.primary,
    color: theme.colors.text.primary,
  },
});
