import { useEffect } from 'react';
import { View } from 'react-native';
import type { ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '@/hooks/use-theme';
import { Radius } from '@/theme/spacing';

interface ProgressProps {
  /** 0..1 */
  value: number;
  height?: number;
  color?: string;
  trackColor?: string;
  style?: ViewStyle;
}

/** Animated horizontal progress bar (width via flex — clamped 0..1). */
export function Progress({ value, height = 8, color, trackColor, style }: ProgressProps) {
  const { colors } = useTheme();
  const clamped = Math.max(0, Math.min(1, value));
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(clamped, { duration: 600, easing: Easing.out(Easing.cubic) });
  }, [clamped, progress]);

  const animatedStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <View
      style={[
        { height, borderRadius: Radius.pill, backgroundColor: trackColor ?? colors.surfaceStrong, overflow: 'hidden' },
        style,
      ]}
    >
      <Animated.View style={[{ height: '100%', borderRadius: Radius.pill, backgroundColor: color ?? colors.brandBlue }, animatedStyle]} />
    </View>
  );
}
