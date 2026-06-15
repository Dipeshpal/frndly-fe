import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import { Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const isWeb = process.env.EXPO_OS === 'web';

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

/**
 * Pressable with spring scale feedback. On web also lifts on hover.
 * Animates transform only (UI thread, GPU-friendly).
 */
export function PressableScale({
  children,
  onPress,
  style,
  pressedScale = 0.97,
  hoverScale = 1.02,
  disabled,
  accessibilityLabel,
}: PressableScaleProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value, { damping: 15, stiffness: 220 }) }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPressIn={() => { scale.value = pressedScale; }}
      onPressOut={() => { scale.value = 1; }}
      {...(isWeb
        ? {
            onHoverIn: () => { scale.value = hoverScale; },
            onHoverOut: () => { scale.value = 1; },
          }
        : {})}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}
