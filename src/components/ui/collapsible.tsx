import { PropsWithChildren, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/spacing';

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
        <Animated.View entering={FadeIn.duration(200)} style={{ marginTop: Spacing.xs, marginLeft: Spacing.md }}>
          {children}
        </Animated.View>
      )}
    </View>
  );
}
