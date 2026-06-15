import { useState, useCallback } from 'react';
import { View, FlatList, Pressable, Alert, Text, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/use-theme';
import { useSecretList, useDeleteSecret } from '@/features/vault/hooks/use-vault';
import { SecretCard } from '@/features/vault/components/secret-card';
import { SearchBar } from '@/components/ui/search-bar';
import { EmptyState } from '@/components/feedback/empty-state';
import { LoadingState } from '@/components/feedback/loading-state';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { SECRET_CATEGORIES, CATEGORY_LABELS, type SecretCategory, type Secret } from '@/types/vault.types';

const ALL_CATEGORIES = ['all', ...SECRET_CATEGORIES] as const;

export default function VaultScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<SecretCategory | 'all'>('all');
  const isWeb = Platform.OS === 'web';

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
    <View style={{ flex: 1 }}>
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={secrets ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: Spacing.md, paddingBottom: Spacing.xxl * 2 }}
        ListHeaderComponent={
          <View style={{ gap: Spacing.md, paddingTop: Spacing.sm }}>
            {/* Search */}
            <View style={{ paddingHorizontal: Spacing.md }}>
              <View style={{ backgroundColor: colors.surfaceCard, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                {!isWeb ? (
                  <Image source="sf:magnifyingglass" style={{ width: 16, height: 16, tintColor: colors.muted }} contentFit="contain" />
                ) : (
                  <Text style={{ fontSize: 16 }}>🔍</Text>
                )}
                <View style={{ flex: 1, height: 40, justifyContent: 'center' }}>
                  <SearchBar value={search} onChangeText={setSearch} placeholder="Search secrets…" />
                </View>
              </View>
            </View>

            {/* Category Pills */}
            <View style={{ flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.md, flexWrap: 'wrap' }}>
              {ALL_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setActiveCategory(cat as SecretCategory | 'all')}
                    style={({ pressed, hovered }: any) => ({
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 9999,
                      backgroundColor: isActive ? colors.brandBlue : hovered ? colors.surfaceSoft : colors.surfaceCard,
                      borderWidth: 1,
                      borderColor: isActive ? colors.brandBlue : colors.border,
                      opacity: pressed ? 0.8 : 1,
                    })}
                    accessibilityRole="button"
                    accessibilityLabel={cat === 'all' ? 'All categories' : CATEGORY_LABELS[cat as SecretCategory]}
                  >
                    <Text style={{ ...Typography.labelCaps, color: isActive ? '#ffffff' : colors.muted, textTransform: 'uppercase', fontSize: 11 }}>
                      {cat === 'all' ? 'All' : CATEGORY_LABELS[cat as SecretCategory]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {isLoading && <LoadingState message="Loading vault…" style={{ paddingVertical: Spacing.xl }} />}
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 40).springify().damping(18)} style={{ paddingHorizontal: Spacing.md }}>
            <SecretCard secret={item} onDelete={handleDelete} onEdit={handleEdit} />
          </Animated.View>
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
      
      {/* Floating Action Button */}
      <Pressable 
        onPress={() => router.push('/(tabs)/(vault)/add')}
        style={({ pressed, hovered }: any) => ({
          position: 'absolute',
          bottom: Spacing.xl,
          right: Spacing.xl,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.brandBlue,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5,
          transform: [{ scale: pressed ? 0.95 : hovered ? 1.05 : 1 }],
        })}
      >
        {!isWeb ? (
          <Image source="sf:plus" style={{ width: 24, height: 24, tintColor: '#ffffff' }} contentFit="contain" />
        ) : (
          <Text style={{ fontSize: 24, color: '#ffffff' }}>+</Text>
        )}
      </Pressable>
    </View>
  );
}
