import { ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useAuthStore } from '@/store/auth-store';
import { useClipboardList } from '@/features/clipboard/hooks/use-clipboard';
import { useSecretList } from '@/features/vault/hooks/use-vault';
import { SummaryCard } from '@/features/dashboard/components/summary-card';
import { ActivityItem } from '@/features/dashboard/components/activity-item';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, Radius } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Shadows } from '@/theme/shadows';

const MOCK_ACTIVITIES = [
  { id: '1', icon: 'doc.on.clipboard.fill', iconColor: '#ff4d8b', title: 'Clipboard synced', subtitle: 'Sent to Chrome Browser', timestamp: new Date(Date.now() - 120000).toISOString() },
  { id: '2', icon: 'lock.fill', iconColor: '#1a3a3a', title: 'New secret added', subtitle: 'OpenAI API Key stored', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', icon: 'iphone', iconColor: '#b8a4ed', title: 'Device connected', subtitle: 'Android Phone online', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: '4', icon: 'doc.on.clipboard.fill', iconColor: '#ff4d8b', title: 'Clipboard pulled', subtitle: 'Received from MacBook', timestamp: new Date(Date.now() - 86400000).toISOString() },
];

const QUICK_ACTIONS = [
  { label: 'Sync', icon: 'arrow.triangle.2.circlepath', color: '#ff4d8b', route: '/(tabs)/(clipboard)' as const },
  { label: 'Vault', icon: 'lock.fill', color: '#1a3a3a', route: '/(tabs)/(vault)' as const },
  { label: 'Add Secret', icon: 'plus.circle.fill', color: '#b8a4ed', route: '/(tabs)/(vault)/add' as const },
  { label: 'Settings', icon: 'gear', color: '#e8b94a', route: '/(tabs)/(settings)' as const },
];

export default function DashboardScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { data: clipboardData } = useClipboardList();
  const { data: secrets } = useSecretList();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ gap: Spacing.lg, paddingBottom: Spacing.xxl }}
    >
      {/* Profile Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.md, paddingTop: Spacing.sm }}>
        <Avatar name={user?.name ?? 'User'} size={44} />
        <View style={{ flex: 1 }}>
          <Text style={{ ...Typography.titleMd, color: colors.ink }}>
            {user?.name ?? 'Welcome'}
          </Text>
          <Text style={{ ...Typography.caption, color: colors.muted }}>{user?.email ?? ''}</Text>
        </View>
      </View>

      {/* Summary Cards */}
      <View style={{ gap: Spacing.xs }}>
        <SectionHeader title="Overview" style={{ marginBottom: Spacing.xs }} />
        <View style={{ flexDirection: 'row', gap: Spacing.xs, paddingHorizontal: Spacing.md }}>
          <SummaryCard
            title="Clipboard Items"
            value={clipboardData?.total ?? 0}
            icon="doc.on.clipboard.fill"
            color={colors.brandPink}
            onPress={() => router.push('/(tabs)/(clipboard)')}
          />
          <SummaryCard
            title="Saved Secrets"
            value={secrets?.length ?? 0}
            icon="lock.fill"
            color={colors.brandTeal}
            onPress={() => router.push('/(tabs)/(vault)')}
          />
        </View>
        <View style={{ flexDirection: 'row', gap: Spacing.xs, paddingHorizontal: Spacing.md }}>
          <SummaryCard
            title="Devices"
            value={4}
            icon="laptopcomputer.and.iphone"
            color={colors.brandLavender}
          />
          <SummaryCard
            title="Recent Activity"
            value={MOCK_ACTIVITIES.length}
            icon="clock.fill"
            color={colors.brandOchre}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={{ gap: Spacing.sm }}>
        <SectionHeader title="Quick Actions" />
        <View style={{ flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.md }}>
          {QUICK_ACTIONS.map((action) => (
            <Pressable
              key={action.label}
              onPress={() => router.push(action.route)}
              style={({ pressed }) => ({
                flex: 1,
                alignItems: 'center',
                gap: Spacing.xs,
                backgroundColor: colors.canvas,
                borderRadius: Radius.md,
                borderCurve: 'continuous',
                padding: Spacing.sm,
                borderWidth: 1,
                borderColor: colors.hairline,
                boxShadow: Shadows.soft,
                opacity: pressed ? 0.8 : 1,
              })}
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, borderCurve: 'continuous', backgroundColor: `${action.color}18`, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={`sf:${action.icon}`} style={{ width: 18, height: 18, tintColor: action.color }} contentFit="contain" />
              </View>
              <Text style={{ ...Typography.caption, color: colors.body, textAlign: 'center' }}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={{ gap: Spacing.sm }}>
        <SectionHeader title="Recent Activity" />
        <Card style={{ marginHorizontal: Spacing.md }}>
          <View style={{ gap: 0 }}>
            {MOCK_ACTIVITIES.map((activity, idx) => (
              <View key={activity.id}>
                <ActivityItem
                  icon={activity.icon}
                  iconColor={activity.iconColor}
                  title={activity.title}
                  subtitle={activity.subtitle}
                  timestamp={activity.timestamp}
                />
                {idx < MOCK_ACTIVITIES.length - 1 && (
                  <View style={{ height: 1, backgroundColor: colors.hairlineSoft, marginLeft: 48 }} />
                )}
              </View>
            ))}
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
