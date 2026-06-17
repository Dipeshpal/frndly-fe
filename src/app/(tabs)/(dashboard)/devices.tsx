import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { devicesApi } from '@/api/devices';
import { getDeviceId } from '@/utils/secure-storage';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { LoadingState } from '@/components/feedback/loading-state';
import { EmptyState } from '@/components/feedback/empty-state';

function osIcon(osType: string): string {
  if (osType === 'ios') return '📱';
  if (osType === 'android') return '🤖';
  if (osType === 'web') return '💻';
  return '🖥️';
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
}

export default function DevicesScreen() {
  const { colors } = useTheme();
  const qc = useQueryClient();
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);

  useEffect(() => {
    getDeviceId().then(setCurrentDeviceId);
  }, []);

  const { data: devices, isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: () => devicesApi.list(),
    refetchInterval: 30000,
  });

  const { mutate: deleteDevice } = useMutation({
    mutationFn: (deviceId: string) => devicesApi.delete(deviceId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['devices'] }),
    onError: () => Alert.alert('Error', 'Failed to remove device'),
  });

  const handleDelete = (deviceId: string, name: string) => {
    if (deviceId === currentDeviceId) {
      Alert.alert('Cannot Remove', 'Cannot remove the current device.');
      return;
    }
    Alert.alert('Remove Device', `Remove "${name}" from your account?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deleteDevice(deviceId) },
    ]);
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xxl }}
    >
      <Text style={{ ...Typography.bodySm, color: colors.muted }}>
        Devices that have synced clipboard through your account. Auto-registering on login.
      </Text>

      {isLoading && <LoadingState message="Loading devices…" style={{ paddingVertical: Spacing.xl }} />}

      {!isLoading && (!devices || devices.length === 0) && (
        <EmptyState
          icon="desktopcomputer"
          title="No devices"
          description="Devices appear here after syncing clipboard."
        />
      )}

      {devices?.map((device) => {
        const isCurrent = device.device_id === currentDeviceId;
        return (
          <View
            key={device.id}
            style={{
              backgroundColor: colors.surfaceCard,
              borderWidth: 1,
              borderColor: isCurrent ? colors.brandBlue : '#262626',
              borderRadius: 12,
              borderCurve: 'continuous',
              padding: Spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.md,
            }}
          >
            <Text style={{ fontSize: 28 }}>{osIcon(device.os_type)}</Text>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: device.online ? '#22c55e' : colors.muted,
                  }}
                />
                <Text style={{ ...Typography.bodyLg, color: colors.ink, fontWeight: '600' }} numberOfLines={1}>
                  {device.name}
                </Text>
                {isCurrent && (
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      backgroundColor: `${colors.brandBlue}22`,
                      borderRadius: 999,
                    }}
                  >
                    <Text style={{ fontSize: 11, color: colors.brandBlue, fontWeight: '600' }}>This device</Text>
                  </View>
                )}
              </View>
              <Text style={{ ...Typography.bodySm, color: colors.muted, marginTop: 2 }}>
                {device.os_type} · {device.device_type} · {device.online ? 'Online' : `Last seen ${timeAgo(device.last_seen)}`}
              </Text>
            </View>
            {!isCurrent && (
              <Pressable
                onPress={() => handleDelete(device.device_id, device.name)}
                style={({ pressed }: any) => ({
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: pressed ? '#ff444422' : '#ff444411',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#ff444433',
                })}
              >
                <Text style={{ fontSize: 12, color: '#ff4444', fontWeight: '600' }}>Remove</Text>
              </Pressable>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}
