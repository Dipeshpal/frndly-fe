import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { SlideInLeft, SlideOutLeft, FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { useUIStore } from '@/store/ui-store';
import { useAuthStore } from '@/store/auth-store';
import { Avatar } from '@/components/ui/avatar';
import { NAV_ITEMS } from '@/components/nav/nav-config';
import { Spacing, Radius } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

/** Native slide-in drawer overlay. Rendered at root; visible only when ui-store.drawerOpen. */
export function MobileDrawer() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const open = useUIStore((s) => s.drawerOpen);
  const close = useUIStore((s) => s.closeDrawer);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  if (!open) return null;

  const go = (route: Parameters<typeof router.push>[0]) => {
    close();
    router.push(route);
  };

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
      {/* Backdrop */}
      <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(180)} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Pressable onPress={close} accessibilityRole="button" accessibilityLabel="Close menu" style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} />
      </Animated.View>

      {/* Panel */}
      <Animated.View
        entering={SlideInLeft.springify().damping(20)}
        exiting={SlideOutLeft.duration(200)}
        style={{
          width: 280,
          height: '100%',
          backgroundColor: colors.surfaceSoft,
          borderRightWidth: 1,
          borderRightColor: colors.hairline,
          paddingTop: insets.top + Spacing.lg,
          paddingBottom: insets.bottom + Spacing.lg,
          paddingHorizontal: Spacing.md,
          justifyContent: 'space-between',
        }}
      >
        <View style={{ gap: Spacing.lg }}>
          <Text style={{ ...Typography.displaySm, color: colors.ink, paddingHorizontal: Spacing.xs }}>Frndly</Text>
          <View style={{ gap: Spacing.xxs }}>
            {NAV_ITEMS.map((item) => (
              <Pressable
                key={item.segment}
                onPress={() => go(item.route)}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: Spacing.sm,
                  height: 48,
                  paddingHorizontal: Spacing.md,
                  borderRadius: Radius.md,
                  borderCurve: 'continuous',
                  backgroundColor: pressed ? colors.surfaceCard : 'transparent',
                })}
              >
                <Image source={`sf:${item.icon}`} style={{ width: 22, height: 22, tintColor: colors.body }} contentFit="contain" />
                <Text style={{ ...Typography.titleSm, color: colors.ink }}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ gap: Spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.xs }}>
            <Avatar name={user?.name ?? 'User'} size={40} />
            <View style={{ flex: 1 }}>
              <Text style={{ ...Typography.titleSm, color: colors.ink }} numberOfLines={1}>{user?.name ?? 'Guest'}</Text>
              <Text style={{ ...Typography.caption, color: colors.muted }} numberOfLines={1}>{user?.email ?? ''}</Text>
            </View>
          </View>
          <Pressable
            onPress={async () => { close(); await logout(); router.replace('/(auth)/login'); }}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.sm,
              height: 44,
              paddingHorizontal: Spacing.md,
              borderRadius: Radius.md,
              borderCurve: 'continuous',
              backgroundColor: pressed ? colors.surfaceCard : 'transparent',
            })}
          >
            <Image source="sf:rectangle.portrait.and.arrow.right" style={{ width: 20, height: 20, tintColor: colors.error }} contentFit="contain" />
            <Text style={{ ...Typography.titleSm, color: colors.error }}>Sign out</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}
