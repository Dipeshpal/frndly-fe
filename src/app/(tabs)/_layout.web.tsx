import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Slot, useRouter, useSegments } from 'expo-router';
import Animated, { useAnimatedStyle, withTiming, FadeIn } from 'react-native-reanimated';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';
import { useUIStore } from '@/store/ui-store';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { Avatar } from '@/components/ui/avatar';
import { NAV_ITEMS, type NavItem } from '@/components/nav/nav-config';
import { Spacing, Radius } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

const SIDEBAR_FULL = 240;
const SIDEBAR_RAIL = 76;

function NavLink({ item, active, collapsed, onPress }: { item: NavItem; active: boolean; collapsed: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  const [hover, setHover] = useState(false);
  const isWeb = Platform.OS === 'web';

  const bg = active ? colors.brandBlue : hover ? colors.surfaceCard : 'transparent';
  const fg = active ? '#ffffff' : colors.body;

  const getEmoji = (iconName: string) => {
    if (iconName.includes('house')) return '🏠';
    if (iconName.includes('clipboard')) return '📋';
    if (iconName.includes('lock')) return '🔒';
    if (iconName.includes('note')) return '📝';
    if (iconName.includes('gear')) return '⚙️';
    return '🔹';
  };

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      accessibilityRole="link"
      accessibilityLabel={item.label}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        height: 44,
        paddingHorizontal: collapsed ? 0 : Spacing.md,
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: Radius.md,
        borderCurve: 'continuous',
        backgroundColor: bg,
      }}
    >
      {!isWeb ? (
        <Image source={`sf:${active ? item.iconActive : item.icon}`} style={{ width: 20, height: 20, tintColor: fg }} contentFit="contain" />
      ) : (
        <Text style={{ fontSize: 18 }}>{getEmoji(item.icon)}</Text>
      )}
      {!collapsed && <Text style={{ ...Typography.titleSm, color: fg }}>{item.label}</Text>}
    </Pressable>
  );
}

function BottomNav({ activeSegment }: { activeSegment: string }) {
  const { colors } = useTheme();
  const router = useRouter();
  const isWeb = Platform.OS === 'web';

  const getEmoji = (iconName: string) => {
    if (iconName.includes('house')) return '🏠';
    if (iconName.includes('clipboard')) return '📋';
    if (iconName.includes('lock')) return '🔒';
    if (iconName.includes('note')) return '📝';
    if (iconName.includes('gear')) return '⚙️';
    return '🔹';
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.xs,
        backgroundColor: colors.surfaceCard,
        borderTopWidth: 1,
        borderTopColor: colors.hairline,
        borderTopLeftRadius: Radius.xl,
        borderTopRightRadius: Radius.xl,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = item.segment === activeSegment;
        return (
          <Pressable
            key={item.segment}
            onPress={() => router.push(item.route)}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: Spacing.xs,
              paddingHorizontal: Spacing.sm,
              backgroundColor: active ? `${colors.brandBlue}20` : 'transparent',
              borderRadius: Radius.lg,
              minWidth: 64,
              gap: 4,
            }}
          >
            {!isWeb ? (
              <Image source={`sf:${active ? item.iconActive : item.icon}`} style={{ width: 20, height: 20, tintColor: active ? colors.brandBlue : colors.muted }} contentFit="contain" />
            ) : (
              <Text style={{ fontSize: 16 }}>{getEmoji(item.icon)}</Text>
            )}
            <Text style={{ ...Typography.labelCaps, color: active ? colors.brandBlue : colors.muted, fontSize: 10 }}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function WebLayout() {
  const { colors } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const user = useAuthStore((s) => s.user);
  const { isDesktop, isMobile } = useBreakpoint();
  const collapsed = useUIStore((s) => s.sidebarCollapsed) || (!isDesktop && !isMobile);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const activeSegment = segments.find((s) => s.startsWith('(') && s !== '(tabs)') ?? '(dashboard)';
  const activeItem = NAV_ITEMS.find((i) => i.segment === activeSegment) ?? NAV_ITEMS[0];

  const width = collapsed ? SIDEBAR_RAIL : SIDEBAR_FULL;
  const sidebarStyle = useAnimatedStyle(() => ({ width: withTiming(width, { duration: 220 }) }));

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.canvas }}>
      {/* Sidebar (Hidden on Mobile) */}
      {!isMobile && (
        <Animated.View
          style={[
            {
              backgroundColor: colors.surfaceSoft,
              borderRightWidth: 1,
              borderRightColor: colors.hairline,
              paddingVertical: Spacing.lg,
              paddingHorizontal: Spacing.sm,
              justifyContent: 'space-between',
            },
            sidebarStyle,
          ]}
        >
          <View style={{ gap: Spacing.lg }}>
            {/* Logo + collapse */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', paddingHorizontal: collapsed ? 0 : Spacing.xs }}>
              {!collapsed && <Text style={{ ...Typography.titleLg, color: colors.ink }}>Frndly</Text>}
              {!collapsed && (
                <Pressable onPress={toggleSidebar} accessibilityRole="button" accessibilityLabel="Toggle sidebar" style={{ padding: Spacing.xs }}>
                  <Text style={{ ...Typography.bodySm, color: colors.muted }}>←</Text>
                </Pressable>
              )}
            </View>

            {/* Nav */}
            <View style={{ gap: Spacing.xxs }}>
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.segment}
                  item={item}
                  active={item.segment === activeSegment}
                  collapsed={collapsed}
                  onPress={() => router.push(item.route)}
                />
              ))}
            </View>
          </View>

          {/* Profile */}
          <Pressable
            onPress={() => router.push('/(tabs)/(settings)')}
            accessibilityRole="button"
            style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.xs, justifyContent: collapsed ? 'center' : 'flex-start' }}
          >
            <Avatar name={user?.name ?? 'User'} size={36} />
            {!collapsed && (
              <View style={{ flex: 1 }}>
                <Text style={{ ...Typography.titleSm, color: colors.ink }} numberOfLines={1}>{user?.name ?? 'Guest'}</Text>
                <Text style={{ ...Typography.caption, color: colors.muted }} numberOfLines={1}>{user?.email ?? ''}</Text>
              </View>
            )}
          </Pressable>
        </Animated.View>
      )}

      {/* Main column */}
      <View style={{ flex: 1, paddingBottom: isMobile ? 60 : 0 }}>
        {/* Topbar */}
        <View
          style={{
            height: 60,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: isMobile ? Spacing.md : Spacing.lg,
            borderBottomWidth: 1,
            borderBottomColor: colors.hairline,
            backgroundColor: colors.canvas,
          }}
        >
          <Text style={{ ...Typography.titleMd, color: colors.ink }}>{activeItem.label}</Text>
          <ThemeToggle />
        </View>

        {/* Content */}
        <View style={{ flex: 1, alignItems: 'center', paddingVertical: isMobile ? Spacing.sm : Spacing.lg }}>
          <Animated.View key={activeSegment} entering={FadeIn.duration(220)} style={{ flex: 1, width: '100%', maxWidth: 1100, paddingHorizontal: isMobile ? Spacing.md : Spacing.lg }}>
            <Slot />
          </Animated.View>
        </View>

        {/* Bottom Navigation (Mobile Only) */}
        {isMobile && <BottomNav activeSegment={activeSegment} />}
      </View>
    </View>
  );
}

function ThemeToggle() {
  const { colors, isDark } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
      <Text style={{ ...Typography.bodySm, color: colors.muted }}>{isDark ? '🌙' : '☀️'}</Text>
    </View>
  );
}
