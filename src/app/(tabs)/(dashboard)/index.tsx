import { ScrollView, View, Text, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { ClipboardItemCard } from '@/features/clipboard/components/clipboard-item';
import { useClipboardList, useDeviceList } from '@/features/clipboard/hooks/use-clipboard';
import { useSecretList } from '@/features/vault/hooks/use-vault';
import { SummaryCard } from '@/features/dashboard/components/summary-card';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { useTheme } from '@/hooks/use-theme';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useDashboardStats } from '@/features/dashboard/hooks/use-dashboard';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { data: clipboardData } = useClipboardList();
  const { data: secrets } = useSecretList();
  const { data: devices } = useDeviceList();
  const { data: stats } = useDashboardStats();
  const isWeb = Platform.OS === 'web';

  const clipboardCount = clipboardData?.total ?? 0;
  const secretCount = secrets?.length ?? 0;
  const { isMobile, isDesktop } = useBreakpoint();

  const formatBytes = (bytes = 0) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <ScrollView 
      style={{ flex: 1, width: '100%' }} 
      contentInsetAdjustmentBehavior="automatic" 
      contentContainerStyle={{ width: '100%', gap: Spacing.lg, paddingBottom: Spacing.xxl }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Greeting */}
      <View style={{ width: '100%', paddingHorizontal: Spacing.md, flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', gap: Spacing.md }}>
        <View style={{ flex: 1, flexShrink: 1 }}>
          <Text style={{ ...Typography.displaySm, color: colors.ink }}>Welcome back, {user?.name ?? 'Alex'}</Text>
          <Text style={{ ...Typography.bodyLg, color: colors.muted }}>Your digital ecosystem is synced and secure.</Text>
        </View>
      </View>

      {/* Metrics Grid */}
      <View style={{ width: '100%', paddingHorizontal: Spacing.md, flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md }}>
        <SummaryCard 
          title="Sync Activity" 
          value={formatBytes(stats?.sync_activity_bytes)} 
          icon={isWeb ? '🔄' : 'sync'} 
          color={colors.brandBlue} 
          statusLabel="+12%" 
          statusColor="#4ade80" 
        />
        <SummaryCard 
          title="Encrypted Vaults" 
          value={stats?.encrypted_vaults_count ?? secretCount} 
          icon={isWeb ? '🛡️' : 'shield'} 
          color={colors.brandLavender} 
          statusLabel="Stable" 
          onPress={() => router.push('/(tabs)/(vault)')} 
        />
        <SummaryCard 
          title="Request Speed" 
          value={`${stats?.request_speed_ms ?? 0}ms`} 
          icon={isWeb ? '⚡' : 'bolt'} 
          color="#ffb786" 
          statusLabel="Fast" 
          statusColor="#ffb786" 
        />
        <SummaryCard 
          title="Linked Nodes" 
          value={String(stats?.linked_nodes_count ?? devices?.length ?? 0).padStart(2, '0')} 
          icon={isWeb ? '💻' : 'desktop_windows'} 
          color={colors.brandBlue} 
          statusLabel="Online" 
          statusColor="#4ade80" 
        />
        <SummaryCard 
          title="Daily Notifications" 
          value={stats?.daily_notifications_count ?? 0} 
          icon={isWeb ? '🔔' : 'notifications'} 
          color="#ffb786" 
        />
        <SummaryCard 
          title="Daily Clips" 
          value={stats?.daily_clipboard_items_count ?? 0} 
          icon={isWeb ? '📋' : 'content_paste'} 
          color={colors.brandLavender} 
        />
      </View>

      {/* Two Column Layout for Desktop, Stacked for Mobile */}
      <View style={{ width: '100%', paddingHorizontal: Spacing.md, flexDirection: isDesktop ? 'row' : 'column', gap: Spacing.lg }}>
        
        {/* Left: Recent Clipboard */}
        <View style={{ flex: isDesktop ? 2 : 1, gap: Spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ ...Typography.headlineLgMobile, color: colors.ink }}>Recent Clipboard</Text>
            <Pressable onPress={() => router.push('/(tabs)/(clipboard)')}>
              <Text style={{ ...Typography.labelCaps, color: colors.brandBlue }}>View All</Text>
            </Pressable>
          </View>
          <View style={{ gap: Spacing.sm }}>
            {clipboardData?.items?.slice(0, 3).map(item => (
              <ClipboardItemCard key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* Right: Active Devices & Quick Secrets */}
        <View style={{ flex: 1, gap: Spacing.lg }}>
          
          <View style={{ gap: Spacing.md }}>
            <Text style={{ ...Typography.headlineLgMobile, color: colors.ink }}>Active Devices</Text>
            <View style={{ backgroundColor: colors.surfaceCard, borderWidth: 1, borderColor: colors.border, borderRadius: 12, overflow: 'hidden' }}>
              {devices?.map((device, idx) => {
                const d = device as any;
                const isoDate = d.last_active || d.last_seen;
                const date = isoDate ? new Date(isoDate) : null;
                const now = new Date();
                let timeAgo = 'Unknown';
                if (date && !isNaN(date.getTime())) {
                  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
                  timeAgo = diffMins < 1 ? 'just now' : diffMins < 60 ? `${diffMins}m ago` : diffMins < 1440 ? `${Math.floor(diffMins/60)}h ago` : `${Math.floor(diffMins/1440)}d ago`;
                }
                const deviceName = d.device_name || d.name || 'Unknown Device';

                return (
                <View key={`${d.device_id || d.id || idx}`} style={{ padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border, opacity: d.is_current_session ? 1 : 0.6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: d.is_current_session || d.online ? '#4ade80' : colors.muted }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...Typography.bodyLg, color: colors.ink, fontWeight: '600' }}>{deviceName}</Text>
                    <Text style={{ fontSize: 12, color: colors.muted }}>{d.is_current_session ? 'Current Session' : (timeAgo === 'Unknown' ? 'Status unknown' : `Last active ${timeAgo}`)}</Text>
                  </View>
                  <Text style={{ fontSize: 20 }}>{deviceName.toLowerCase().includes('phone') || deviceName.toLowerCase().includes('ios') || deviceName.toLowerCase().includes('android') ? '📱' : '💻'}</Text>
                </View>
              )})}
              <Pressable onPress={() => router.push('/(tabs)/(dashboard)/devices')} style={{ padding: Spacing.sm, backgroundColor: colors.surfaceSoft, alignItems: 'center' }}>
                <Text style={{ ...Typography.labelCaps, color: colors.brandBlue }}>Manage Devices</Text>
              </Pressable>
            </View>
          </View>

          <View style={{ gap: Spacing.md }}>
            <Text style={{ ...Typography.headlineLgMobile, color: colors.ink }}>Quick Secrets</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {/* Category keys are safe: each category string is unique within the Set iteration */}
              {Array.from(new Set(secrets?.map(s => s.category))).map((category, i) => {
                const catColors = [colors.brandBlue, colors.brandLavender, '#ffb786', '#4ade80', '#c084fc'];
                const tagColor = catColors[i % catColors.length];
                return (
                <Pressable key={category} style={({hovered}: any) => ({
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: `${tagColor}1A`,
                  borderWidth: 1,
                  borderColor: hovered ? tagColor : `${tagColor}33`,
                  borderRadius: 999,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8
                })}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: tagColor }} />
                  <Text style={{ fontSize: 12, fontWeight: '500', color: tagColor, textTransform: 'capitalize' }}>{category}</Text>
                </Pressable>
              )})}
              <Pressable onPress={() => router.push('/(tabs)/(vault)/add')} style={{ paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: colors.border, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 12, color: colors.muted }}>+ New Secret</Text>
              </Pressable>
            </View>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}
