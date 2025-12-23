import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeAreaProps {
  children: ReactNode;
  style?: ViewStyle;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
}

export const SafeArea: React.FC<SafeAreaProps> = ({
  children,
  style,
  edges = ['top', 'right', 'bottom', 'left'],
}) => {
  const insets = useSafeAreaInsets();

  const paddingStyle: ViewStyle = {};
  if (edges.includes('top')) paddingStyle.paddingTop = insets.top;
  if (edges.includes('right')) paddingStyle.paddingRight = insets.right;
  if (edges.includes('bottom')) paddingStyle.paddingBottom = insets.bottom;
  if (edges.includes('left')) paddingStyle.paddingLeft = insets.left;

  return (
    <View style={[paddingStyle, style]}>
      {children}
    </View>
  );
};
