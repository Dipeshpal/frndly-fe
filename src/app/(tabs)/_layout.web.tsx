import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Slot, useRouter, useSegments } from 'expo-router';
import Animated, { useAnimatedStyle, withTiming, withSpring, FadeIn, ZoomIn, ZoomOut } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
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
    if (iconName.includes('bell')) return '🔔';
    if (iconName.includes('desktop') || iconName.includes('computer')) return '🖥️';
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
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    if (!isWeb) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    setShowMenu(!showMenu);
  };

  const plusIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: withSpring(showMenu ? '45deg' : '0deg', { damping: 12, stiffness: 200 }) }]
    };
  });

  const getEmoji = (iconName: string) => {
    if (iconName.includes('house')) return '🏠';
    if (iconName.includes('clipboard')) return '📋';
    if (iconName.includes('lock')) return '🔒';
    if (iconName.includes('note')) return '📝';
    if (iconName.includes('gear')) return '⚙️';
    if (iconName.includes('bell')) return '🔔';
    if (iconName.includes('desktop') || iconName.includes('computer')) return '🖥️';
    return '🔹';
  };

  const mainSegments = ['(dashboard)', '(alerts)', '(devices)', '(settings)'];
  const menuSegments = ['(clipboard)', '(vault)', '(notes)'];
  
  const mainItems = NAV_ITEMS.filter(item => mainSegments.includes(item.segment));
  const menuItems = NAV_ITEMS.filter(item => menuSegments.includes(item.segment));

  const renderItem = (item: NavItem) => {
    const active = item.segment === activeSegment;
    return (
      <Pressable
        key={item.segment}
        onPress={() => router.push(item.route)}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: Spacing.xs,
          paddingHorizontal: Spacing.xs,
          backgroundColor: active ? `${colors.brandBlue}20` : 'transparent',
          borderRadius: Radius.lg,
          flex: 1,
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
  };

  return (
    <>
      {/* Overlay to close menu when clicking outside */}
      {showMenu && (
        <Pressable 
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 60, zIndex: 40 }}
          onPress={() => setShowMenu(false)} 
        />
      )}
      
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
        {mainItems.slice(0, 2).map(renderItem)}
        
        {/* Center FAB */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ position: 'relative', width: 48, height: 48, marginTop: -20, zIndex: 60 }}>
            {/* Popover Menu (Semi-circle) */}
            {showMenu && menuItems.map((item, index) => {
              const isLeft = index === 0;
              const isTop = index === 1;
              const isRight = index === 2;
              const active = activeSegment === item.segment;
              
              return (
                <Animated.View
                  key={item.segment}
                  entering={ZoomIn.duration(200).delay(index * 50)}
                  exiting={ZoomOut.duration(150)}
                  style={{
                    position: 'absolute',
                    bottom: isTop ? 80 : 38,
                    left: isLeft ? -70 : isTop ? -8 : undefined,
                    right: isRight ? -70 : undefined,
                    alignItems: 'center',
                    width: 64,
                    zIndex: 60,
                  }}
                >
                  <Pressable
                    onPress={() => {
                      if (!isWeb) Haptics.selectionAsync().catch(() => {});
                      setShowMenu(false);
                      router.push(item.route);
                    }}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: active ? `${colors.brandBlue}20` : colors.surfaceCard,
                      borderWidth: 1,
                      borderColor: colors.hairline,
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.2,
                      shadowRadius: 8,
                      elevation: 10,
                      marginBottom: 4,
                    }}
                  >
                    {!isWeb ? (
                      <Image source={`sf:${active ? item.iconActive : item.icon}`} style={{ width: 20, height: 20, tintColor: active ? colors.brandBlue : colors.ink }} contentFit="contain" />
                    ) : (
                      <Text style={{ fontSize: 20 }}>{getEmoji(item.icon)}</Text>
                    )}
                  </Pressable>
                  <Text style={{ ...Typography.labelCaps, color: active ? colors.brandBlue : colors.ink, fontSize: 10 }}>{item.label}</Text>
                </Animated.View>
              );
            })}

            <Pressable
              onPress={toggleMenu}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: showMenu ? colors.surfaceCard : colors.brandBlue,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
                borderWidth: showMenu ? 1 : 0,
                borderColor: colors.hairline,
                zIndex: 61,
              }}
            >
              <Animated.Text style={[{ color: showMenu ? colors.ink : '#fff', fontSize: 24, fontWeight: 'bold', lineHeight: 28 }, plusIconStyle]}>+</Animated.Text>
            </Pressable>
          </View>
        </View>

        {mainItems.slice(2).map(renderItem)}
      </View>
    </>
  );
}

export default function WebLayout() {
  const { colors } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const user = useAuthStore((s) => s.user);
  const { isDesktop, isMobile } = useBreakpoint();
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const [toggleHover, setToggleHover] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!hasInitialized) {
      if (!isDesktop && !isMobile) {
        if (!sidebarCollapsed) {
          toggleSidebar();
        }
      }
      setHasInitialized(true);
    }
  }, [isDesktop, isMobile, hasInitialized]);

  const collapsed = sidebarCollapsed;

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
            <View 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: collapsed ? 'center' : 'space-between', 
                paddingHorizontal: collapsed ? 0 : Spacing.xs,
                height: 40,
              }}
            >
              {!collapsed && <Text style={{ ...Typography.titleLg, color: colors.ink }}>Frndly</Text>}
              <Pressable 
                onPress={toggleSidebar} 
                onHoverIn={() => setToggleHover(true)}
                onHoverOut={() => setToggleHover(false)}
                accessibilityRole="button" 
                accessibilityLabel={collapsed ? "Expand sidebar" : "Collapse sidebar"} 
                style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: 16,
                  backgroundColor: toggleHover ? colors.surfaceStrong : colors.surfaceCard,
                  borderWidth: 1,
                  borderColor: toggleHover ? colors.brandBlue : colors.hairline,
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <MaterialIcons 
                  name={collapsed ? "chevron-right" : "chevron-left"} 
                  size={20} 
                  color={toggleHover ? colors.brandBlue : colors.ink} 
                />
              </Pressable>
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
        </View>

        {/* Content */}
        {(() => {
          const isFullWidth = activeSegment === '(notes)';
          return (
            <View style={{ flex: 1, alignItems: isFullWidth ? 'stretch' : 'center', paddingVertical: isMobile ? Spacing.sm : Spacing.lg }}>
              <Animated.View
                key={activeSegment}
                entering={FadeIn.duration(220)}
                style={{
                  flex: 1,
                  width: '100%',
                  maxWidth: isFullWidth ? undefined : 1100,
                  paddingHorizontal: isMobile ? Spacing.md : Spacing.lg,
                }}
              >
                <Slot />
              </Animated.View>
            </View>
          );
        })()}

        {/* Bottom Navigation (Mobile Only) */}
        {isMobile && <BottomNav activeSegment={activeSegment} />}
      </View>
    </View>
  );
}

