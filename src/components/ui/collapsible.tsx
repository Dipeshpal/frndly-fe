import { PropsWithChildren, useState, useRef, useEffect } from 'react';
import { Pressable, View, Animated } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/spacing';

function FadeInView({ children, style }: { children: React.ReactNode; style?: object }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  }, []);
  return <Animated.View style={[style, { opacity: anim }]}>{children}</Animated.View>;
}

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { colors } = useTheme();

  return (
    <View>
      <Pressable
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, opacity: pressed ? 0.7 : 1 })}
        onPress={() => setIsOpen((v) => !v)}
      >
        <Image
          source="sf:chevron.right"
          style={{ width: 14, height: 14, tintColor: colors.muted, transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
          contentFit="contain"
        />
        <ThemedText type="small">{title}</ThemedText>
      </Pressable>
      {isOpen && (
        <FadeInView style={{ marginTop: Spacing.xs, marginLeft: Spacing.md }}>
          {children}
        </FadeInView>
      )}
    </View>
  );
}
