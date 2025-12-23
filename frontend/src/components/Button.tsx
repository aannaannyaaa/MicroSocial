import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, SIZES, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../utils/constants';

interface ButtonProps {
  onPress: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
  fullWidth = false,
}) => {
  const styles = StyleSheet.create({
    button: {
      paddingVertical: size === 'sm' ? SIZES.base : size === 'lg' ? SIZES.lg : SIZES.md,
      paddingHorizontal: size === 'sm' ? SIZES.md : size === 'lg' ? SIZES.xl : SIZES.lg,
      borderRadius: BORDER_RADIUS.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      ...(variant === 'primary' && {
        backgroundColor: COLORS.primary,
      }),
      ...(variant === 'secondary' && {
        backgroundColor: COLORS.secondary,
      }),
      ...(variant === 'outline' && {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary,
      }),
      ...(disabled && { opacity: 0.6 }),
      ...(fullWidth && { width: '100%' }),
    },
    text: {
      fontSize: size === 'sm' ? FONT_SIZES.sm : size === 'lg' ? FONT_SIZES.lg : FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.semibold,
      color: variant === 'outline' ? COLORS.primary : COLORS.background,
      marginRight: loading ? SIZES.sm : 0,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.7}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? COLORS.primary : COLORS.background}
          style={{ marginRight: SIZES.sm }}
        />
      )}
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};
