import { useRef, useEffect } from 'react';
import { View, Animated, Easing } from 'react-native';
import type { ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Radius } from '@/theme/spacing';

interface ProgressProps {
  value: number;
  height?: number;
  color?: string;
  trackColor?: string;
  style?: ViewStyle;
}

export function Progress({ value, height = 8, color, trackColor, style }: ProgressProps) {
  const { colors } = useTheme();
  const clamped = Math.max(0, Math.min(1, value));
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: clamped,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [clamped]);

  const animatedWidth = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[
        { height, borderRadius: Radius.pill, backgroundColor: trackColor ?? colors.surfaceStrong, overflow: 'hidden' },
        style,
      ]}
    >
      <Animated.View style={{ width: animatedWidth, height: '100%', borderRadius: Radius.pill, backgroundColor: color ?? colors.brandBlue }} />
    </View>
  );
}
