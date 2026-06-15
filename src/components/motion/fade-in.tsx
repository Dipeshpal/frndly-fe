import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface FadeInProps {
  children: ReactNode;
  /** stagger index — multiplied by `step` ms */
  index?: number;
  step?: number;
  style?: ViewStyle;
}

/**
 * Entrance wrapper: springy fade + upward slide, staggered by index.
 * GPU-friendly (transform + opacity only).
 */
export function FadeIn({ children, index = 0, step = 60, style }: FadeInProps) {
  return (
    <Animated.View entering={FadeInDown.delay(index * step).springify().damping(18)} style={style}>
      {children}
    </Animated.View>
  );
}
