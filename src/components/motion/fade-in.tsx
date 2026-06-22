import { useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import { Animated } from 'react-native';

interface FadeInProps {
  children: ReactNode;
  index?: number;
  step?: number;
  style?: ViewStyle;
}

export function FadeIn({ children, index = 0, step = 60, style }: FadeInProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.spring(anim, { toValue: 1, damping: 18, useNativeDriver: true }).start();
    }, index * step);
    return () => clearTimeout(timer);
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });

  return (
    <Animated.View style={[style, { opacity: anim, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
