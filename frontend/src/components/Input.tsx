import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { COLORS, SIZES, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../utils/constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const styles = StyleSheet.create({
    container: {
      marginBottom: SIZES.md,
    },
    label: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.text,
      marginBottom: SIZES.sm,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: error ? COLORS.danger : COLORS.border,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SIZES.md,
      backgroundColor: COLORS.surface,
    },
    input: {
      flex: 1,
      paddingVertical: SIZES.md,
      fontSize: FONT_SIZES.base,
      color: COLORS.text,
      fontWeight: FONT_WEIGHTS.normal,
    },
    errorText: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.danger,
      marginTop: SIZES.sm,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {leftIcon && <View style={{ marginRight: SIZES.sm }}>{leftIcon}</View>}
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.textSecondary}
          {...props}
        />
        {rightIcon && <View style={{ marginLeft: SIZES.sm }}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
