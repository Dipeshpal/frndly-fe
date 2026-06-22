import { useRef, useEffect } from 'react';
import { View, Animated, Easing } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface SpinnerProps {
  size?: number;
  color?: string;
}

export function Spinner({ size = 24, color }: SpinnerProps) {
  const { colors } = useTheme();
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);

  const rotate = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
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
