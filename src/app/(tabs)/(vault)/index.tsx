import { useState, useCallback } from 'react';
import { View, FlatList, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/use-theme';
import { useSecretList, useDeleteSecret } from '@/features/vault/hooks/use-vault';
import { SecretCard } from '@/features/vault/components/secret-card';
import { SearchBar } from '@/components/ui/search-bar';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/feedback/empty-state';
import { LoadingState } from '@/components/feedback/loading-state';
import { Badge } from '@/components/ui/badge';
import { Spacing, Radius } from '@/theme/spacing';
import { SECRET_CATEGORIES, CATEGORY_LABELS, type SecretCategory, type Secret } from '@/types/vault.types';

const ALL_CATEGORIES = ['all', ...SECRET_CATEGORIES] as const;

export default function VaultScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<SecretCategory | 'all'>('all');

  const { data: secrets, isLoading } = useSecretList(
    search || undefined,
    activeCategory === 'all' ? undefined : activeCategory,
  );
  const { mutate: deleteSecret } = useDeleteSecret();

  const handleDelete = useCallback((id: string) => {
    Alert.alert('Delete secret', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteSecret(id) },
    ]);
  }, [deleteSecret]);

  const handleEdit = useCallback((secret: Secret) => {
    router.push({ pathname: '/(tabs)/(vault)/[id]', params: { id: secret.id } });
  }, [router]);

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      data={secrets ?? []}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ gap: Spacing.md, paddingBottom: Spacing.xxl }}
      ListHeaderComponent={
        <View style={{ gap: Spacing.md, paddingTop: Spacing.sm }}>
          {/* Add button + Search */}
          <View style={{ flexDirection: 'row', gap: Spacing.xs, paddingHorizontal: Spacing.md }}>
            <View style={{ flex: 1 }}>
              <SearchBar value={search} onChangeText={setSearch} placeholder="Search secrets…" />
            </View>
            <Pressable
              onPress={() => router.push('/(tabs)/(vault)/add')}
              style={({ pressed }) => ({
                width: 44,
                height: 44,
                borderRadius: Radius.md,
                borderCurve: 'continuous',
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.8 : 1,
              })}
              accessibilityRole="button"
              accessibilityLabel="Add secret"
            >
              <Image source="sf:plus" style={{ width: 18, height: 18, tintColor: colors.onPrimary }} contentFit="contain" />
            </Pressable>
          </View>

          {/* Category Filter */}
          <View style={{ flexDirection: 'row', gap: Spacing.xs, paddingHorizontal: Spacing.md, flexWrap: 'wrap' }}>
            {ALL_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setActiveCategory(cat as SecretCategory | 'all')}
                  style={{
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: Spacing.xxs,
                    borderRadius: Radius.pill,
                    backgroundColor: isActive ? colors.primary : colors.surfaceCard,
                    borderWidth: 1,
                    borderColor: isActive ? colors.primary : colors.hairline,
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={cat === 'all' ? 'All categories' : CATEGORY_LABELS[cat as SecretCategory]}
                >
                  <Badge
                    label={cat === 'all' ? 'All' : CATEGORY_LABELS[cat as SecretCategory]}
                    style={{ backgroundColor: 'transparent' }}
                  />
                </Pressable>
              );
            })}
          </View>

          {isLoading && <LoadingState message="Loading vault…" style={{ paddingVertical: Spacing.xl }} />}
        </View>
      }
      renderItem={({ item }) => (
        <View style={{ paddingHorizontal: Spacing.md }}>
          <SecretCard secret={item} onDelete={handleDelete} onEdit={handleEdit} />
        </View>
      )}
      ItemSeparatorComponent={() => <View style={{ height: Spacing.xs }} />}
      ListEmptyComponent={
        !isLoading ? (
          <EmptyState
            icon="lock"
            title="Vault is empty"
            description="Store API keys, tokens, and credentials securely. Values are encrypted at rest."
            action={{ label: 'Add your first secret', onPress: () => router.push('/(tabs)/(vault)/add') }}
          />
        ) : null
      }
    />
  );
}
