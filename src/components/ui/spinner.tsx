import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '@/hooks/use-theme';

interface SpinnerProps {
  size?: number;
  color?: string;
}

/** Rotating ring spinner (rotation transform — GPU-friendly). */
export function Spinner({ size = 24, color }: SpinnerProps) {
  const { colors } = useTheme();
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 900, easing: Easing.linear }), -1, false);
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

  return (
    <Animated.View style={animatedStyle}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: Math.max(2, size / 10),
          borderColor: colors.hairline,
          borderTopColor: color ?? colors.brandBlue,
        }}
      />
    </Animated.View>
  );
}
