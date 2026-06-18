import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MaterialIcons } from '@expo/vector-icons';
import { devicesApi } from '@/api/devices';
import { getDeviceId } from '@/utils/secure-storage';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/components/ui/toast';
import { Spacing, Radius } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { LoadingState } from '@/components/feedback/loading-state';
import { EmptyState } from '@/components/feedback/empty-state';

function osIconName(osType: string): 'phone-iphone' | 'phone-android' | 'laptop' | 'computer' {
  if (osType === 'ios') return 'phone-iphone';
  if (osType === 'android') return 'phone-android';
  if (osType === 'web') return 'laptop';
  return 'computer';
}

function timeAgo(iso: string | null | undefined): string {
  if (!iso) return 'unknown';
  const ts = new Date(iso).getTime();
  if (isNaN(ts)) return 'unknown';
  const diff = Math.floor((Date.now() - ts) / 60000);
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
}

export default function DevicesScreen() {
  const { colors } = useTheme();
  const toast = useToast();
  const qc = useQueryClient();
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    getDeviceId().then(setCurrentDeviceId);
  }, []);

  const { data: devices, isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: () => devicesApi.list(),
    refetchInterval: 30000,
  });

  const { mutate: deleteDevice, isPending: isDeleting } = useMutation({
    mutationFn: (deviceId: string) => devicesApi.delete(deviceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['devices'] });
      setConfirmingId(null);
      toast.show('Device removed', 'success');
    },
    onError: () => {
      setConfirmingId(null);
      toast.show('Failed to remove device', 'error');
    },
  });

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xxl * 2 }}
    >
      <Text style={{ ...Typography.bodySm, color: colors.muted }}>
        Devices that have synced clipboard through your account. Auto-registered on login.
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
        const isCurrent = currentDeviceId !== null && device.device_id === currentDeviceId;
        const isConfirming = confirmingId === device.device_id;
        const accentColor = isCurrent ? colors.brandBlue : colors.border;

        return (
          <View
            key={device.id}
            style={{
              backgroundColor: colors.surfaceCard,
              borderWidth: 1,
              borderColor: accentColor,
              borderLeftWidth: 4,
              borderLeftColor: accentColor,
              borderRadius: Radius.md,
              borderCurve: 'continuous',
              padding: Spacing.md,
              gap: Spacing.sm,
            }}
          >
            {/* Row 1: icon + name + badge */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <View style={{
                width: 44,
                height: 44,
                borderRadius: Radius.sm,
                backgroundColor: isCurrent ? `${colors.brandBlue}18` : colors.canvas,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <MaterialIcons
                  name={osIconName(device.os_type)}
                  size={24}
                  color={isCurrent ? colors.brandBlue : colors.muted}
                />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, flexWrap: 'wrap' }}>
                  <Text style={{ ...Typography.bodyLg, color: colors.ink, fontWeight: '600' }} numberOfLines={1}>
                    {device.name || 'Unknown device'}
                  </Text>
                  {isCurrent && (
                    <View style={{ paddingHorizontal: 8, paddingVertical: 2, backgroundColor: `${colors.brandBlue}22`, borderRadius: Radius.pill }}>
                      <Text style={{ fontSize: 11, color: colors.brandBlue, fontWeight: '600' }}>This device</Text>
                    </View>
                  )}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <View style={{
                    width: 7,
                    height: 7,
                    borderRadius: 4,
                    backgroundColor: device.online ? '#22c55e' : colors.muted,
                  }} />
                  <Text style={{ ...Typography.bodySm, color: colors.muted }}>
                    {device.online ? 'Online' : `Last seen ${timeAgo(device.last_seen)}`}
                    {' · '}{device.os_type}{' · '}{device.device_type}
                  </Text>
                </View>
              </View>
            </View>

            {/* Row 2: confirm / remove (only non-current devices) */}
            {!isCurrent && (
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.xs }}>
                {isConfirming ? (
                  <>
                    <Pressable
                      onPress={() => setConfirmingId(null)}
                      style={({ pressed }) => ({
                        paddingHorizontal: 14,
                        paddingVertical: 7,
                        borderRadius: Radius.md,
                        backgroundColor: pressed ? colors.surfaceSoft : colors.surfaceCard,
                        borderWidth: 1,
                        borderColor: colors.border,
                        opacity: pressed ? 0.7 : 1,
                      })}
                    >
                      <Text style={{ ...Typography.caption, color: colors.muted }}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => deleteDevice(device.device_id)}
                      disabled={isDeleting}
                      style={({ pressed }) => ({
                        paddingHorizontal: 14,
                        paddingVertical: 7,
                        borderRadius: Radius.md,
                        backgroundColor: pressed ? '#ff444433' : '#ff444422',
                        borderWidth: 1,
                        borderColor: '#ff444444',
                        opacity: isDeleting ? 0.5 : pressed ? 0.7 : 1,
                      })}
                    >
                      <Text style={{ ...Typography.caption, color: '#ff4444', fontWeight: '600' }}>
                        {isDeleting ? 'Removing…' : 'Confirm Remove'}
                      </Text>
                    </Pressable>
                  </>
                ) : (
                  <Pressable
                    onPress={() => setConfirmingId(device.device_id)}
                    style={({ pressed, hovered }: any) => ({
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                      borderRadius: Radius.md,
                      backgroundColor: pressed || hovered ? '#ff444422' : 'transparent',
                      borderWidth: 1,
                      borderColor: hovered ? '#ff444444' : colors.border,
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <MaterialIcons name="delete-outline" size={14} color="#ff4444" />
                      <Text style={{ ...Typography.caption, color: '#ff4444', fontWeight: '600' }}>Remove</Text>
                    </View>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}
