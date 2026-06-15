import { Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/use-theme';
import { useUIStore } from '@/store/ui-store';
import { Spacing } from '@/theme/spacing';

/** Native stack header-left button that opens the mobile drawer. */
export function HamburgerButton() {
  const { colors } = useTheme();
  const openDrawer = useUIStore((s) => s.openDrawer);

  return (
    <Pressable
      onPress={openDrawer}
      accessibilityRole="button"
      accessibilityLabel="Open menu"
      hitSlop={Spacing.sm}
      style={({ pressed }) => ({ paddingHorizontal: Spacing.xs, opacity: pressed ? 0.6 : 1 })}
    >
      <Image source="sf:line.3.horizontal" style={{ width: 22, height: 22, tintColor: colors.ink }} contentFit="contain" />
    </Pressable>
  );
}
