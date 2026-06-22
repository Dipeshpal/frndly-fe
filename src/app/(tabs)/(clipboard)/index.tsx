import { useState, useCallback } from 'react';
import { Platform, View, Text, TextInput, FlatList, Alert, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { DatePickerPopover } from '@/components/ui/date-picker-popover';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '@/hooks/use-theme';
import { useInfiniteClipboardList, usePushClipboard, useDeleteClipboardItem } from '@/features/clipboard/hooks/use-clipboard';
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

type FlatItem =
  | { type: 'item'; data: ClipboardItem }
  | { type: 'header'; deviceId: string; displayName: string };

// ── Date helpers ──────────────────────────────────────────────────────────────

function toDateString(d: Date): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function offsetDate(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDateLabel(dateStr: string | null): string {
  if (!dateStr) return 'All Time';
  const today = toDateString(new Date());
  const yesterday = toDateString(offsetDate(new Date(), -1));
  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ClipboardScreen() {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [inputText, setInputText] = useState('');
  const [groupByDevice, setGroupByDevice] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  // null = all time, string = YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState<string | null>(toDateString(new Date()));
  const isWeb = Platform.OS === 'web';

  useDeviceRegistry();
  const { data: devices, isLoading: devicesLoading } = useConnectedDevices();
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteClipboardList({ search: search || undefined, date: selectedDate ?? undefined });
  const { push, loading: pushing } = usePushClipboard();
  const { mutate: deleteItem } = useDeleteClipboardItem();

  useClipboardAutoSync(push);

  const allItems = data?.pages.flatMap((p) => p.items) ?? [];

  const deviceNameMap: Record<string, string> = {};
  if (devices) {
    for (const d of devices) deviceNameMap[d.device_id] = d.name;
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

  const goToPrevDay = () => {
    const base = selectedDate ? new Date(selectedDate) : new Date();
    setSelectedDate(toDateString(offsetDate(base, -1)));
  };

  const goToNextDay = () => {
    const base = selectedDate ? new Date(selectedDate) : new Date();
    const next = offsetDate(base, 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (next <= today) setSelectedDate(toDateString(next));
  };

  const isNextDisabled = selectedDate === toDateString(new Date()) || selectedDate === null;
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Apply device filter client-side
  const filteredItems = allItems.filter((item) =>
    selectedDeviceId ? item.device_name === selectedDeviceId : true
  );

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
    <View style={{ flex: 1 }}>
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
                      <Text style={{ ...Typography.bodySm, color: colors.muted }}>{device.last_seen ? new Date(device.last_seen).toLocaleString() : 'Never'}</Text>
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

          {/* ── Date Navigation Bar ────────────────────────────── */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: Spacing.md,
            gap: Spacing.sm,
          }}>
            {/* All Time toggle */}
            <Pressable
              onPress={() => setSelectedDate(null)}
              style={({ pressed, hovered }: any) => ({
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 9999,
                borderWidth: 1,
                backgroundColor: selectedDate === null
                  ? colors.brandBlue
                  : hovered ? colors.surfaceSoft : colors.surfaceCard,
                borderColor: selectedDate === null ? colors.brandBlue : colors.border,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{ ...Typography.labelCaps, fontSize: 11, color: selectedDate === null ? '#fff' : colors.muted }}>
                All
              </Text>
            </Pressable>

            {/* Prev day */}
            <Pressable
              onPress={goToPrevDay}
              hitSlop={8}
              style={({ pressed }: any) => ({
                width: 32, height: 32,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.surfaceCard,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <Text style={{ color: colors.ink, fontSize: 14 }}>‹</Text>
            </Pressable>

            {/* Date display — label only, no click handler */}
            <View style={{ flex: 1 }}>
              <View
                style={{
                  paddingVertical: 9,
                  paddingHorizontal: Spacing.md,
                  borderRadius: 9999,
                  borderWidth: 1,
                  borderColor: selectedDate !== null ? colors.brandBlue : colors.border,
                  backgroundColor: selectedDate !== null ? `${colors.brandBlue}18` : colors.surfaceCard,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ ...Typography.bodySm, color: selectedDate !== null ? colors.brandBlue : colors.muted, fontWeight: '600' }}>
                  {formatDateLabel(selectedDate)}
                </Text>
              </View>
            </View>

            {/* Next day */}
            <Pressable
              onPress={goToNextDay}
              disabled={isNextDisabled}
              hitSlop={8}
              style={({ pressed }: any) => ({
                width: 32, height: 32,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.surfaceCard,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isNextDisabled ? 0.3 : pressed ? 0.6 : 1,
              })}
            >
              <Text style={{ color: colors.ink, fontSize: 14 }}>›</Text>
            </Pressable>

            {/* Calendar picker button */}
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={({ pressed, hovered }: any) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: Spacing.sm,
                paddingVertical: 8,
                borderRadius: 9999,
                borderWidth: 1,
                borderColor: showDatePicker ? colors.brandBlue : colors.border,
                backgroundColor: showDatePicker
                  ? `${colors.brandBlue}18`
                  : pressed || hovered ? colors.surfaceStrong : colors.surfaceCard,
              })}
            >
              <Text style={{ fontSize: 15 }}>📅</Text>
              <Text style={{ ...Typography.bodySm, color: colors.ink, fontWeight: '500' }}>
                {selectedDate
                  ? new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                  : 'Pick date'}
              </Text>
            </Pressable>
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
                    paddingHorizontal: 16, paddingVertical: 8,
                    backgroundColor: selectedDeviceId === null ? colors.brandBlue : colors.surfaceCard,
                    borderWidth: 1,
                    borderColor: selectedDeviceId === null ? colors.brandBlue : colors.border,
                    borderRadius: 9999,
                  }}
                >
                  <Text style={{ ...Typography.labelCaps, fontSize: 11, color: selectedDeviceId === null ? '#ffffff' : colors.muted }}>
                    All
                  </Text>
                </Pressable>
                {devices.map((device) => (
                  <Pressable
                    key={device.device_id}
                    onPress={() => setSelectedDeviceId(device.device_id)}
                    style={{
                      paddingHorizontal: 16, paddingVertical: 8,
                      backgroundColor: selectedDeviceId === device.device_id ? colors.brandBlue : colors.surfaceCard,
                      borderWidth: 1,
                      borderColor: selectedDeviceId === device.device_id ? colors.brandBlue : colors.border,
                      borderRadius: 9999,
                      flexDirection: 'row', gap: Spacing.xs, alignItems: 'center',
                    }}
                  >
                    <Text style={{ ...Typography.labelCaps, fontSize: 11, color: selectedDeviceId === device.device_id ? '#ffffff' : colors.muted }}>
                      {device.name}
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                      {device.os_type === 'ios' ? '📱' : device.os_type === 'android' ? '🤖' : '💻'}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

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
                <Text style={{ ...Typography.labelCaps, color: colors.muted, fontSize: 11 }}>{item.displayName}</Text>
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
            description={selectedDate ? `Nothing synced on ${formatDateLabel(selectedDate)}.` : 'Content you sync will appear here across all your devices.'}
          />
        ) : null
      }
      ListFooterComponent={
        hasNextPage ? (
          <View style={{ paddingHorizontal: Spacing.md, paddingVertical: Spacing.md }}>
            <Pressable
              onPress={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              style={({ pressed, hovered }: any) => ({
                paddingVertical: Spacing.sm,
                borderRadius: 9999,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: hovered ? colors.surfaceSoft : colors.surfaceCard,
                alignItems: 'center',
                opacity: pressed || isFetchingNextPage ? 0.7 : 1,
                flexDirection: 'row',
                justifyContent: 'center',
                gap: Spacing.sm,
              })}
            >
              {isFetchingNextPage
                ? <ActivityIndicator size="small" color={colors.muted} />
                : null}
              <Text style={{ ...Typography.bodySm, color: colors.muted }}>
                {isFetchingNextPage ? 'Loading…' : 'Load more'}
              </Text>
            </Pressable>
          </View>
        ) : null
      }
    />
    <DatePickerPopover
      visible={showDatePicker}
      value={selectedDate}
      max={toDateString(new Date())}
      onChange={(d) => setSelectedDate(d)}
      onClose={() => setShowDatePicker(false)}
    />
    </View>
  );
}
