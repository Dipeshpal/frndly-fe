import { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, Alert } from 'react-native';
import { Image } from 'expo-image';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '@/hooks/use-theme';
import { useClipboardList, usePushClipboard, useDeleteClipboardItem } from '@/features/clipboard/hooks/use-clipboard';
import { ClipboardItemCard } from '@/features/clipboard/components/clipboard-item';
import { SearchBar } from '@/components/ui/search-bar';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/feedback/empty-state';
import { LoadingState } from '@/components/feedback/loading-state';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

const MOCK_DEVICES = [
  { id: '1', name: 'Android Phone', online: true, lastSync: '2m ago', icon: 'iphone' },
  { id: '2', name: 'Chrome Browser', online: true, lastSync: '5m ago', icon: 'desktopcomputer' },
  { id: '3', name: 'MacBook', online: false, lastSync: '2h ago', icon: 'laptopcomputer' },
  { id: '4', name: 'Windows Laptop', online: false, lastSync: '1d ago', icon: 'laptopcomputer' },
];

export default function ClipboardScreen() {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [inputText, setInputText] = useState('');
  const isWeb = process.env.EXPO_OS === 'web';

  const { data, isLoading, refetch } = useClipboardList(search || undefined);
  const { push, loading: pushing } = usePushClipboard();
  const { mutate: deleteItem } = useDeleteClipboardItem();

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

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      data={data?.items ?? []}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ gap: Spacing.lg, paddingBottom: Spacing.xxl }}
      ListHeaderComponent={
        <View style={{ gap: Spacing.lg }}>
          {/* Push Area */}
          <View style={{ gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingTop: Spacing.sm }}>
            <Text style={{ ...Typography.headlineLgMobile, color: colors.ink }}>Push to devices</Text>
            <View style={{
              backgroundColor: 'rgba(20,20,20,0.9)',
              borderRadius: 12,
              borderCurve: 'continuous',
              borderWidth: 1,
              borderColor: '#262626',
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
                style={{ ...Typography.bodyLg, color: colors.ink, minHeight: 80, textAlignVertical: 'top' }}
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
              {MOCK_DEVICES.map((device) => (
                <View
                  key={device.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing.md,
                    backgroundColor: 'rgba(20,20,20,0.9)',
                    borderRadius: 12,
                    borderCurve: 'continuous',
                    borderWidth: 1,
                    borderColor: '#262626',
                    padding: Spacing.md,
                  }}
                >
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: device.online ? '#22c55e' : colors.muted }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...Typography.bodyLg, color: colors.ink }}>{device.name}</Text>
                    <Text style={{ ...Typography.bodySm, color: colors.muted }}>{device.lastSync}</Text>
                  </View>
                  {!isWeb && <Image source={`sf:${device.icon}`} style={{ width: 20, height: 20, tintColor: colors.muted }} contentFit="contain" />}
                </View>
              ))}
            </View>
          </View>

          {/* Search History */}
          <View style={{ gap: Spacing.sm }}>
            <Text style={{ ...Typography.headlineLgMobile, color: colors.ink, paddingHorizontal: Spacing.md }}>Clipboard History</Text>
            {!isWeb && (
              <View style={{ paddingHorizontal: Spacing.md }}>
                <SearchBar value={search} onChangeText={setSearch} placeholder="Search history…" />
              </View>
            )}

            {isLoading && <LoadingState message="Loading clipboard history…" style={{ paddingVertical: Spacing.xl }} />}
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <View style={{ paddingHorizontal: Spacing.md }}>
          <ClipboardItemCard item={item} onDelete={handleDelete} />
        </View>
      )}
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
