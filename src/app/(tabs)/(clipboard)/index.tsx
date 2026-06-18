import { useState, useCallback } from 'react';
import { Platform, View, Text, TextInput, FlatList, Alert, Pressable, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '@/hooks/use-theme';
import { useClipboardList, usePushClipboard, useDeleteClipboardItem } from '@/features/clipboard/hooks/use-clipboard';
import { useDeviceRegistry, useConnectedDevices } from '@/features/clipboard/hooks/use-devices';
import { useClipboardAutoSync } from '@/hooks/use-clipboard-auto-sync';
import { ClipboardItemCard } from '@/features/clipboard/components/clipboard-item';
import { SearchBar } from '@/components/ui/search-bar';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/feedback/empty-state';
import { LoadingState } from '@/components/feedback/loading-state';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import type { ClipboardItem } from '@/types/clipboard.types';

type DateFilter = 'all' | 'today' | 'yesterday' | 'week' | 'older';

type FlatItem =
  | { type: 'item'; data: ClipboardItem }
  | { type: 'header'; deviceId: string; displayName: string };

export default function ClipboardScreen() {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [inputText, setInputText] = useState('');
  const [groupByDevice, setGroupByDevice] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const isWeb = Platform.OS === 'web';

  useDeviceRegistry();
  const { data: devices, isLoading: devicesLoading } = useConnectedDevices();
  const { data, isLoading } = useClipboardList(search || undefined);
  const { push, loading: pushing } = usePushClipboard();
  const { mutate: deleteItem } = useDeleteClipboardItem();

  useClipboardAutoSync(push);

  const deviceNameMap: Record<string, string> = {};
  if (devices) {
    for (const d of devices) {
      deviceNameMap[d.device_id] = d.name;
    }
  }

  const handlePaste = useCallback(async () => {
    const text = await Clipboard.getStringAsync();
    if (text) setInputText(text);
  }, []);

  const handlePush = useCallback(() => {
    if (!inputText.trim()) return;
    push(inputText.trim(), {
      onSuccess: () => setInputText(''),
      onError: () => Alert.alert('Error', 'Failed to sync clipboard'),
    });
  }, [inputText, push]);

  const handleDelete = useCallback((id: string) => {
    Alert.alert('Delete item', 'Remove this clipboard entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteItem(id) },
    ]);
  }, [deleteItem]);

  const items = data?.items ?? [];

  // Apply device and date filters
  const filteredItems = items.filter((item) => {
    if (selectedDeviceId && item.device_name !== selectedDeviceId) return false;
    if (dateFilter !== 'all') {
      const d = new Date(item.created_at);
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterdayStart = new Date(todayStart.getTime() - 86_400_000);
      const weekAgo = new Date(now.getTime() - 7 * 86_400_000);
      if (dateFilter === 'today' && d < todayStart) return false;
      if (dateFilter === 'yesterday' && (d >= todayStart || d < yesterdayStart)) return false;
      if (dateFilter === 'week' && d < weekAgo) return false;
      if (dateFilter === 'older' && d >= weekAgo) return false;
    }
    return true;
  });

  let flatData: FlatItem[];
  if (groupByDevice && filteredItems.length > 0) {
    const grouped: Record<string, ClipboardItem[]> = {};
    for (const item of filteredItems) {
      (grouped[item.device_name] ??= []).push(item);
    }
    flatData = Object.entries(grouped).flatMap(([deviceId, groupItems]) => [
      { type: 'header', deviceId, displayName: deviceNameMap[deviceId] ?? deviceId },
      ...groupItems.map((d) => ({ type: 'item' as const, data: d })),
    ]);
  } else {
    flatData = filteredItems.map((d) => ({ type: 'item' as const, data: d }));
  }

  return (
    <FlatList<FlatItem>
      contentInsetAdjustmentBehavior="automatic"
      data={flatData}
      keyExtractor={(item) =>
        item.type === 'header' ? `header-${item.deviceId}` : item.data.id
      }
      contentContainerStyle={{ gap: Spacing.lg, paddingBottom: Spacing.xxl }}
      ListHeaderComponent={
        <View style={{ gap: Spacing.lg }}>
          {/* Push Area */}
          <View style={{ gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingTop: Spacing.sm }}>
            <Text style={{ ...Typography.headlineLgMobile, color: colors.ink }}>Push to devices</Text>
            <View style={{
              backgroundColor: colors.surfaceCard,
              borderRadius: 12,
              borderCurve: 'continuous',
              borderWidth: 1,
              borderColor: colors.border,
              padding: Spacing.md,
              gap: Spacing.md,
            }}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type or paste to sync…"
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={4}
                style={[{ ...Typography.bodyLg, color: colors.ink, minHeight: 80, textAlignVertical: 'top', outlineStyle: 'none' } as any]}
                accessibilityLabel="Clipboard input"
              />
              <View style={{ flexDirection: 'row', gap: Spacing.sm, justifyContent: 'flex-end' }}>
                <Button label="Paste" onPress={handlePaste} variant="ghost" size="sm" />
                <Button label="Push" onPress={handlePush} loading={pushing} size="sm" variant="blue" />
              </View>
            </View>
          </View>

          {/* Connected Devices */}
          <View style={{ gap: Spacing.sm }}>
            <Text style={{ ...Typography.headlineLgMobile, color: colors.ink, paddingHorizontal: Spacing.md }}>Connected Devices</Text>
            <View style={{ gap: Spacing.sm, paddingHorizontal: Spacing.md }}>
              {devicesLoading ? (
                <LoadingState message="Loading devices…" style={{ paddingVertical: Spacing.xl }} />
              ) : devices && devices.length > 0 ? (
                devices.map((device) => (
                  <View
                    key={device.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: Spacing.md,
                      backgroundColor: colors.surfaceCard,
                      borderRadius: 12,
                      borderCurve: 'continuous',
                      borderWidth: 1,
                      borderColor: colors.border,
                      padding: Spacing.md,
                    }}
                  >
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: device.online ? '#22c55e' : colors.muted }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ ...Typography.bodyLg, color: colors.ink }}>{device.name}</Text>
                      <Text style={{ ...Typography.bodySm, color: colors.muted }}>{new Date(device.last_seen).toLocaleString()}</Text>
                    </View>
                    <Text style={{ fontSize: 18 }}>
                      {device.os_type === 'ios' ? '📱' : device.os_type === 'android' ? '🤖' : '💻'}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={{ ...Typography.bodySm, color: colors.muted, textAlign: 'center', paddingVertical: Spacing.md }}>No devices connected</Text>
              )}
            </View>
          </View>

          {/* Clipboard History header + controls */}
          <View style={{ gap: Spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md }}>
              <Text style={{ ...Typography.headlineLgMobile, color: colors.ink }}>Clipboard History</Text>
              <Pressable
                onPress={() => setGroupByDevice((v) => !v)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                  backgroundColor: groupByDevice ? `${colors.brandBlue}22` : 'transparent',
                  borderWidth: 1,
                  borderColor: groupByDevice ? colors.brandBlue : colors.border,
                  borderRadius: 999,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: groupByDevice ? colors.brandBlue : colors.muted }}>
                  Group by Device
                </Text>
              </Pressable>
            </View>
            {!isWeb && (
              <View style={{ paddingHorizontal: Spacing.md }}>
                <SearchBar value={search} onChangeText={setSearch} placeholder="Search history…" />
              </View>
            )}

            {/* Device Filter Pills */}
            {devices && devices.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: Spacing.sm }}
              >
                <Pressable
                  onPress={() => setSelectedDeviceId(null)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: selectedDeviceId === null ? colors.brandBlue : colors.surfaceCard,
                    borderWidth: 1,
                    borderColor: selectedDeviceId === null ? colors.brandBlue : colors.border,
                    borderRadius: 9999,
                  }}
                >
                  <Text
                    style={{
                      ...Typography.labelCaps,
                      fontSize: 11,
                      color: selectedDeviceId === null ? '#ffffff' : colors.muted,
                    }}
                  >
                    All
                  </Text>
                </Pressable>

                {devices.map((device) => (
                  <Pressable
                    key={device.device_id}
                    onPress={() => setSelectedDeviceId(device.device_id)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      backgroundColor: selectedDeviceId === device.device_id ? colors.brandBlue : colors.surfaceCard,
                      borderWidth: 1,
                      borderColor: selectedDeviceId === device.device_id ? colors.brandBlue : colors.border,
                      borderRadius: 9999,
                      flexDirection: 'row',
                      gap: Spacing.xs,
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        ...Typography.labelCaps,
                        fontSize: 11,
                        color: selectedDeviceId === device.device_id ? '#ffffff' : colors.muted,
                      }}
                    >
                      {device.name}
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                      {device.os_type === 'ios' ? '📱' : device.os_type === 'android' ? '🤖' : '💻'}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {/* Date Filter Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: Spacing.sm }}
            >
              {(['all', 'today', 'yesterday', 'week', 'older'] as const).map((filter) => {
                const labels: Record<DateFilter, string> = {
                  all: 'All',
                  today: 'Today',
                  yesterday: 'Yesterday',
                  week: 'This Week',
                  older: 'Older',
                };
                return (
                  <Pressable
                    key={filter}
                    onPress={() => setDateFilter(filter)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      backgroundColor: dateFilter === filter ? colors.brandBlue : colors.surfaceCard,
                      borderWidth: 1,
                      borderColor: dateFilter === filter ? colors.brandBlue : colors.border,
                      borderRadius: 9999,
                    }}
                  >
                    <Text
                      style={{
                        ...Typography.labelCaps,
                        fontSize: 11,
                        color: dateFilter === filter ? '#ffffff' : colors.muted,
                      }}
                    >
                      {labels[filter]}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {isLoading && <LoadingState message="Loading clipboard history…" style={{ paddingVertical: Spacing.xl }} />}
          </View>
        </View>
      }
      renderItem={({ item }) => {
        if (item.type === 'header') {
          return (
            <View style={{ paddingHorizontal: Spacing.md, paddingTop: Spacing.xs, paddingBottom: Spacing.xs }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
                <Text style={{ ...Typography.labelCaps, color: colors.muted, fontSize: 11 }}>
                  {item.displayName}
                </Text>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
              </View>
            </View>
          );
        }
        return (
          <View style={{ paddingHorizontal: Spacing.md }}>
            <ClipboardItemCard item={item.data} onDelete={handleDelete} />
          </View>
        );
      }}
      ItemSeparatorComponent={() => <View style={{ height: Spacing.xs }} />}
      ListEmptyComponent={
        !isLoading ? (
          <EmptyState
            icon="doc.on.clipboard"
            title="No clipboard history"
            description="Content you sync will appear here across all your devices."
          />
        ) : null
      }
    />
  );
}
