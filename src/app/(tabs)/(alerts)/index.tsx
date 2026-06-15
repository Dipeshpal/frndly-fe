import { ScrollView, View, Text, TextInput, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { useTheme } from '@/hooks/use-theme';
import { useAlerts } from '@/features/alerts/hooks/use-alerts';

export default function AlertsScreen() {
  const { colors } = useTheme();
  const { data: alerts } = useAlerts();

  const getIconForApp = (app?: string) => {
    if (!app) return 'notifications';
    const l = app.toLowerCase();
    if (l.includes('mail') || l.includes('gmail')) return 'mail';
    if (l.includes('slack') || l.includes('chat')) return 'chat-bubble';
    if (l.includes('cal')) return 'event';
    if (l.includes('pay') || l.includes('bank') || l.includes('revolut')) return 'payments';
    if (l.includes('sync') || l.includes('system')) return 'cloud-sync';
    return 'notifications';
  };

  const getColorForApp = (app?: string) => {
    if (!app) return colors.muted;
    const l = app.toLowerCase();
    if (l.includes('mail') || l.includes('gmail')) return colors.brandBlue;
    if (l.includes('slack') || l.includes('chat')) return '#ffb786';
    if (l.includes('cal')) return colors.brandLavender;
    if (l.includes('pay') || l.includes('bank')) return '#4ade80';
    return colors.muted;
  };

  const getDeviceIcon = (device?: string) => {
    if (!device) return 'devices';
    const l = device.toLowerCase();
    if (l.includes('iphone') || l.includes('phone') || l.includes('mobile')) return 'smartphone';
    if (l.includes('mac') || l.includes('laptop') || l.includes('pc')) return 'laptop-mac';
    if (l.includes('watch')) return 'watch';
    if (l.includes('server') || l.includes('node')) return 'dns';
    return 'devices';
  };

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isSameDay = (d1: Date, d2: Date) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

  const groups = {
    today: [] as any[],
    yesterday: [] as any[],
    older: [] as any[],
  };

  alerts?.forEach(alert => {
    const d = new Date(alert.received_at);
    if (isSameDay(d, today)) groups.today.push(alert);
    else if (isSameDay(d, yesterday)) groups.yesterday.push(alert);
    else groups.older.push(alert);
  });

  const renderAlert = (alert: any) => (
    <Pressable key={alert.id} style={({hovered}: any) => ({
      backgroundColor: hovered ? colors.surfaceSoft : colors.surfaceCard,
      borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: Spacing.md,
      flexDirection: 'row', gap: Spacing.md,
      borderLeftWidth: alert.is_read ? 0 : 4, borderLeftColor: getColorForApp(alert.source_app)
    })}>
      <View style={{ width: 48, height: 48, backgroundColor: '#0c0c0c', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
        <MaterialIcons name={getIconForApp(alert.source_app)} size={24} color={getColorForApp(alert.source_app)} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ ...Typography.labelCaps, color: getColorForApp(alert.source_app) }}>{(alert.source_app || 'SYSTEM').toUpperCase()}</Text>
          <Text style={{ ...Typography.labelCaps, color: colors.muted }}>
            {new Date(alert.received_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Text>
        </View>
        <Text style={{ ...Typography.bodyLg, color: colors.ink, fontWeight: alert.is_read ? '400' : '600' }} numberOfLines={1}>{alert.title}</Text>
        <Text style={{ ...Typography.bodySm, color: colors.muted, marginTop: 4 }} numberOfLines={2}>{alert.message}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12 }}>
          <MaterialIcons name={getDeviceIcon(alert.device_name)} size={14} color={colors.muted} />
          <Text style={{ ...Typography.labelCaps, color: colors.muted }}>{alert.device_name || 'Unknown Device'}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: Spacing.xxl }}>
      <View style={{ paddingHorizontal: Spacing.md, paddingTop: Spacing.lg }}>
        
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl }}>
          <Text style={{ ...Typography.displaySm, color: colors.ink }}>Alerts</Text>
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            <Pressable style={{ padding: Spacing.sm, borderRadius: 20 }}>
              <MaterialIcons name="filter-list" size={24} color={colors.muted} />
            </Pressable>
            <Pressable style={{ padding: Spacing.sm, borderRadius: 20 }}>
              <MaterialIcons name="settings" size={24} color={colors.muted} />
            </Pressable>
          </View>
        </View>

        {/* Search Bar */}
        <View style={{ marginBottom: Spacing.xl, position: 'relative' }}>
          <View style={{ position: 'absolute', left: 16, top: 16, zIndex: 1 }}>
            <MaterialIcons name="search" size={20} color={colors.muted} />
          </View>
          <TextInput 
            placeholder="Search notification history..."
            placeholderTextColor={colors.muted}
            style={{
              backgroundColor: '#0c0c0c',
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              paddingVertical: 16,
              paddingLeft: 48,
              paddingRight: 16,
              color: colors.ink,
              ...Typography.bodyLg,
            }}
          />
        </View>

        {/* Groups */}
        <View style={{ gap: Spacing.xl }}>
          
          {groups.today.length > 0 && (
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.md }}>
                <Text style={{ ...Typography.labelCaps, color: colors.muted, textTransform: 'uppercase' }}>Today</Text>
                {groups.today.some(a => !a.is_read) && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.brandBlue, shadowColor: colors.brandBlue, shadowOpacity: 0.6, shadowRadius: 8 }} />}
              </View>
              <View style={{ gap: Spacing.sm }}>
                {groups.today.map(renderAlert)}
              </View>
            </View>
          )}

          {groups.yesterday.length > 0 && (
            <View style={{ opacity: 0.8 }}>
              <Text style={{ ...Typography.labelCaps, color: colors.muted, textTransform: 'uppercase', marginBottom: Spacing.md }}>Yesterday</Text>
              <View style={{ gap: Spacing.sm }}>
                {groups.yesterday.map(renderAlert)}
              </View>
            </View>
          )}

          {groups.older.length > 0 && (
            <View style={{ opacity: 0.6 }}>
              <Text style={{ ...Typography.labelCaps, color: colors.muted, textTransform: 'uppercase', marginBottom: Spacing.md }}>Older</Text>
              <View style={{ gap: Spacing.sm }}>
                {groups.older.map(renderAlert)}
              </View>
            </View>
          )}

          {!alerts?.length && (
            <View style={{ padding: Spacing.xl, alignItems: 'center', opacity: 0.5 }}>
              <MaterialIcons name="notifications-none" size={48} color={colors.muted} />
              <Text style={{ ...Typography.bodyLg, color: colors.muted, marginTop: Spacing.md }}>No new alerts</Text>
            </View>
          )}

        </View>
      </View>
    </ScrollView>
  );
}
