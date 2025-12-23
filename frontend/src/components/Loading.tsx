import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ message, fullScreen = false }) => {
  const styles = StyleSheet.create({
    container: {
      flex: fullScreen ? 1 : 0,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};
