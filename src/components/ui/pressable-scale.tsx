import { useRef } from 'react';
import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import { Animated, Platform, Pressable } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const isWeb = Platform.OS === 'web';

interface PressableScaleProps {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  /** scale when pressed */
  pressedScale?: number;
  /** scale when hovered (web only) */
  hoverScale?: number;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export function PressableScale({
  children,
  onPress,
  style,
  pressedScale = 0.97,
  hoverScale = 1.02,
  disabled,
  accessibilityLabel,
}: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const springTo = (toValue: number) =>
    Animated.spring(scale, { toValue, damping: 15, stiffness: 220, useNativeDriver: true }).start();

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPressIn={() => springTo(pressedScale)}
      onPressOut={() => springTo(1)}
      {...(isWeb
        ? {
            onHoverIn: () => springTo(hoverScale),
            onHoverOut: () => springTo(1),
          }
        : {})}
      style={[style, { transform: [{ scale }] }]}
    >
      {children}
    </AnimatedPressable>
  );
}
