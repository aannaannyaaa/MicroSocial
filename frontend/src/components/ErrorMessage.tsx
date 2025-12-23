import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  fullScreen = false,
}) => {
  const styles = StyleSheet.create({
    container: {
      flex: fullScreen ? 1 : 0,
      justifyContent: 'center',
      alignItems: 'center',
      padding: SIZES.lg,
      backgroundColor: fullScreen ? COLORS.background : 'transparent',
    },
    errorBox: {
      backgroundColor: '#FFE5E5',
      borderColor: COLORS.danger,
      borderWidth: 1,
      borderRadius: BORDER_RADIUS.md,
      padding: SIZES.lg,
      alignItems: 'center',
    },
    text: {
      fontSize: FONT_SIZES.base,
      color: COLORS.danger,
      marginBottom: onRetry ? SIZES.md : 0,
      textAlign: 'center',
    },
    retryButton: {
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.lg,
      backgroundColor: COLORS.danger,
      borderRadius: BORDER_RADIUS.md,
    },
    retryText: {
      color: COLORS.background,
      fontWeight: '600',
      fontSize: FONT_SIZES.sm,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.errorBox}>
        <Text style={styles.text}>{message}</Text>
        {onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
