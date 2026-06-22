import { useRef, useEffect } from 'react';
import type { ViewStyle } from 'react-native';
import { Animated, Easing } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Radius } from '@/theme/spacing';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, radius = Radius.sm, style }: SkeletonProps) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.85, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius, borderCurve: 'continuous', backgroundColor: colors.surfaceStrong },
        { opacity },
        style,
      ]}
    />
  );
}
