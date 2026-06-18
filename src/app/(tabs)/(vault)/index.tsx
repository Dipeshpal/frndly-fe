import { useState, useCallback, useRef } from 'react';
import { View, FlatList, Pressable, Text, TextInput } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { useFolderList, useFolderPreview, useDeleteFolder, useSecretList, useDeleteSecret } from '@/features/vault/hooks/use-vault';
import { SecretCard } from '@/features/vault/components/secret-card';
import { SearchBar } from '@/components/ui/search-bar';
import { EmptyState } from '@/components/feedback/empty-state';
import { LoadingState } from '@/components/feedback/loading-state';
import { useToast } from '@/components/ui/toast';
import { Spacing, Radius } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { SECRET_CATEGORIES, CATEGORY_LABELS, type SecretCategory, type Secret } from '@/types/vault.types';

const ALL_CATEGORIES = ['all', ...SECRET_CATEGORIES] as const;

const FOLDER_ACCENT_COLORS = [
  '#4f8ef7', '#9b59b6', '#e67e22', '#27ae60',
  '#e74c3c', '#1abc9c', '#f39c12', '#2980b9',
];
function folderColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return FOLDER_ACCENT_COLORS[Math.abs(hash) % FOLDER_ACCENT_COLORS.length];
}

const CATEGORY_COLORS: Record<string, string> = {
  api_key: '#ff4d8b', database: '#4f9cf9', cloud: '#b8a4ed', personal: '#ffb084', other: '#e8b94a',
};

// ── Folder card with hover peek ───────────────────────────────────────────────
function FolderCard({
  name, count, onPress, onDelete, confirmingDelete, onConfirmDelete, onCancelDelete,
}: {
  name: string; count: number;
  onPress: () => void;
  onDelete: () => void;
  confirmingDelete: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) {
  const { colors } = useTheme();
  const [hovered, setHovered] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const accent = folderColor(name);

  const { data: preview } = useFolderPreview(showPreview ? name : null);

  const handleHoverIn = () => {
    setHovered(true);
    hoverTimerRef.current = setTimeout(() => setShowPreview(true), 400);
  };
  const handleHoverOut = () => {
    setHovered(false);
    setShowPreview(false);
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  };

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      style={{
        backgroundColor: hovered ? colors.surfaceSoft : colors.surfaceCard,
        borderWidth: 1,
        borderColor: hovered ? accent : colors.border,
        borderTopWidth: 3,
        borderTopColor: accent,
        borderRadius: Radius.lg,
        borderCurve: 'continuous',
        overflow: 'hidden',
        minHeight: 110,
      }}
    >
      {/* Main card content */}
      <View style={{ padding: Spacing.md, gap: Spacing.sm, flex: 1, justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <MaterialIcons name="folder" size={32} color={accent} />
          {/* Delete control */}
          {!confirmingDelete ? (
            <Pressable
              onPress={(e) => { e.stopPropagation?.(); onDelete(); }}
              style={({ pressed, hovered: h }: any) => ({
                opacity: (hovered || h) ? 1 : 0,
                padding: 4,
                borderRadius: Radius.xs,
                backgroundColor: h ? '#ff444420' : 'transparent',
              })}
            >
              <MaterialIcons name="delete-outline" size={16} color={colors.error} />
            </Pressable>
          ) : (
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <Pressable
                onPress={(e) => { e.stopPropagation?.(); onCancelDelete(); }}
                style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.xs, borderWidth: 1, borderColor: colors.border }}
              >
                <Text style={{ ...Typography.caption, color: colors.muted }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={(e) => { e.stopPropagation?.(); onConfirmDelete(); }}
                style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.xs, backgroundColor: '#ff444422', borderWidth: 1, borderColor: '#ff444444' }}
              >
                <Text style={{ ...Typography.caption, color: colors.error, fontWeight: '600' }}>Delete all</Text>
              </Pressable>
            </View>
          )}
        </View>
        <View style={{ gap: 2 }}>
          <Text style={{ ...Typography.titleSm, color: colors.ink }} numberOfLines={2}>{name}</Text>
          <Text style={{ ...Typography.bodySm, color: colors.muted }}>
            {count} {count === 1 ? 'secret' : 'secrets'}
          </Text>
        </View>
      </View>

      {/* Hover peek preview */}
      {showPreview && preview && preview.length > 0 && (
        <Animated.View
          entering={FadeIn.duration(150)}
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.canvas,
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm,
            gap: 6,
          }}
        >
          {preview.map((s) => (
            <View key={s.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: CATEGORY_COLORS[s.category] ?? colors.muted }} />
              <Text style={{ ...Typography.caption, color: colors.muted, flex: 1 }} numberOfLines={1}>{s.name}</Text>
              <Text style={{ fontSize: 10, color: colors.muted, opacity: 0.6 }}>{CATEGORY_LABELS[s.category as SecretCategory] ?? s.category}</Text>
            </View>
          ))}
          {count > (preview.length) && (
            <Text style={{ ...Typography.caption, color: colors.muted, opacity: 0.5 }}>+{count - preview.length} more</Text>
          )}
        </Animated.View>
      )}
    </Pressable>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function VaultScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const toast = useToast();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<SecretCategory | 'all'>('all');
  const [confirmingDeleteFolder, setConfirmingDeleteFolder] = useState<string | null>(null);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const { data: folders, isLoading: foldersLoading } = useFolderList();
  const { data: secrets, isLoading: secretsLoading } = useSecretList(
    search || undefined,
    activeCategory === 'all' ? undefined : activeCategory,
    selectedFolder ?? undefined,
  );
  const { mutate: deleteFolder } = useDeleteFolder();
  const { mutate: deleteSecret } = useDeleteSecret();

  const handleDeleteFolder = useCallback((folderName: string) => {
    deleteFolder(folderName, {
      onSuccess: () => {
        toast.show(`Folder "${folderName}" deleted`, 'success');
        setConfirmingDeleteFolder(null);
      },
      onError: () => toast.show('Failed to delete folder', 'error'),
    });
  }, [deleteFolder, toast]);

  const handleDeleteSecret = useCallback((id: string) => {
    deleteSecret(id);
  }, [deleteSecret]);

  const handleEdit = useCallback((secret: Secret) => {
    router.push({ pathname: '/(tabs)/(vault)/[id]', params: { id: secret.id } });
  }, [router]);

  const handleCreateFolder = useCallback(() => {
    const name = newFolderName.trim();
    if (!name) return;
    setCreatingFolder(false);
    setNewFolderName('');
    router.push({ pathname: '/(tabs)/(vault)/add', params: { folder: name } });
  }, [newFolderName, router]);

  // ── Folder browser ──────────────────────────────────────────────────────────
  if (selectedFolder === null) {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          key="folder-browser"
          contentInsetAdjustmentBehavior="automatic"
          data={folders ?? []}
          keyExtractor={(item) => item.name}
          numColumns={2}
          columnWrapperStyle={{ gap: Spacing.md, paddingHorizontal: Spacing.md }}
          contentContainerStyle={{ gap: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.xxl * 2 }}
          ListHeaderComponent={
            <View style={{ gap: Spacing.sm, paddingHorizontal: Spacing.md }}>
              {/* Create folder inline input */}
              {creatingFolder && (
                <Animated.View
                  entering={FadeInDown.springify().damping(18)}
                  style={{
                    backgroundColor: colors.surfaceCard,
                    borderWidth: 1,
                    borderColor: colors.brandBlue,
                    borderRadius: Radius.md,
                    borderCurve: 'continuous',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.sm,
                    gap: Spacing.sm,
                  }}
                >
                  <MaterialIcons name="folder" size={20} color={colors.brandBlue} />
                  <TextInput
                    autoFocus
                    value={newFolderName}
                    onChangeText={setNewFolderName}
                    placeholder="Folder name…"
                    placeholderTextColor={colors.muted}
                    onSubmitEditing={handleCreateFolder}
                    returnKeyType="done"
                    style={{ flex: 1, ...Typography.bodyLg, color: colors.ink, outlineStyle: 'none' as any }}
                  />
                  <Pressable onPress={handleCreateFolder} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
                    <MaterialIcons name="check" size={20} color={colors.brandBlue} />
                  </Pressable>
                  <Pressable onPress={() => { setCreatingFolder(false); setNewFolderName(''); }} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
                    <MaterialIcons name="close" size={20} color={colors.muted} />
                  </Pressable>
                </Animated.View>
              )}
              {foldersLoading && <LoadingState message="Loading folders…" style={{ paddingVertical: Spacing.xl }} />}
            </View>
          }
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(index * 60).springify().damping(18)}
              style={{ flex: 1 }}
            >
              <FolderCard
                name={item.name}
                count={item.count}
                onPress={() => setSelectedFolder(item.name)}
                onDelete={() => setConfirmingDeleteFolder(item.name)}
                confirmingDelete={confirmingDeleteFolder === item.name}
                onConfirmDelete={() => handleDeleteFolder(item.name)}
                onCancelDelete={() => setConfirmingDeleteFolder(null)}
              />
            </Animated.View>
          )}
          ListEmptyComponent={
            !foldersLoading ? (
              <EmptyState
                icon="lock"
                title="No folders yet"
                description="Create a folder to organise your secrets, or add a secret directly."
                action={{ label: 'Add secret', onPress: () => router.push('/(tabs)/(vault)/add') }}
              />
            ) : null
          }
        />

        {/* FABs */}
        <View style={{ position: 'absolute', bottom: Spacing.xl, right: Spacing.xl, gap: Spacing.sm, alignItems: 'flex-end' }}>
          {/* New folder FAB */}
          <Pressable
            onPress={() => setCreatingFolder(true)}
            style={({ pressed, hovered }: any) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.xs,
              paddingHorizontal: Spacing.md,
              paddingVertical: 10,
              borderRadius: Radius.pill,
              borderCurve: 'continuous',
              backgroundColor: hovered ? colors.surfaceSoft : colors.surfaceCard,
              borderWidth: 1,
              borderColor: colors.border,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <MaterialIcons name="create-new-folder" size={18} color={colors.brandBlue} />
            <Text style={{ ...Typography.caption, color: colors.brandBlue, fontWeight: '600' }}>New folder</Text>
          </Pressable>
          {/* Add secret FAB */}
          <Pressable
            onPress={() => router.push('/(tabs)/(vault)/add')}
            style={({ pressed, hovered }: any) => ({
              width: 56, height: 56,
              borderRadius: 28,
              backgroundColor: colors.brandBlue,
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              transform: [{ scale: pressed ? 0.95 : hovered ? 1.05 : 1 }],
            })}
          >
            <MaterialIcons name="add" size={28} color="#ffffff" />
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Secrets list (folder open) ──────────────────────────────────────────────
  const accent = folderColor(selectedFolder);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        key="secrets-list"
        contentInsetAdjustmentBehavior="automatic"
        data={secrets ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: Spacing.md, paddingBottom: Spacing.xxl * 2 }}
        ListHeaderComponent={
          <View style={{ gap: Spacing.md, paddingTop: Spacing.sm }}>
            {/* Back + folder name */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md }}>
              <Pressable
                onPress={() => { setSelectedFolder(null); setSearch(''); setActiveCategory('all'); }}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.6 : 1,
                  padding: 6,
                  borderRadius: Radius.sm,
                  backgroundColor: colors.surfaceCard,
                  borderWidth: 1,
                  borderColor: colors.border,
                })}
              >
                <MaterialIcons name="arrow-back" size={20} color={colors.ink} />
              </Pressable>
              <MaterialIcons name="folder" size={22} color={accent} />
              <Text style={{ ...Typography.headlineLgMobile, color: colors.ink, flex: 1 }} numberOfLines={1}>
                {selectedFolder}
              </Text>
            </View>

            {/* Search */}
            <View style={{ paddingHorizontal: Spacing.md }}>
              <View style={{
                backgroundColor: colors.surfaceCard,
                borderWidth: 1, borderColor: colors.border,
                borderRadius: Radius.md,
                paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
                flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
              }}>
                <MaterialIcons name="search" size={18} color={colors.muted} />
                <View style={{ flex: 1, height: 40, justifyContent: 'center' }}>
                  <SearchBar value={search} onChangeText={setSearch} placeholder="Search secrets…" />
                </View>
              </View>
            </View>

            {/* Category pills */}
            <View style={{ flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.md, flexWrap: 'wrap' }}>
              {ALL_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setActiveCategory(cat as SecretCategory | 'all')}
                    style={({ pressed, hovered }: any) => ({
                      paddingHorizontal: 16, paddingVertical: 8,
                      borderRadius: Radius.pill,
                      backgroundColor: isActive ? colors.brandBlue : hovered ? colors.surfaceSoft : colors.surfaceCard,
                      borderWidth: 1,
                      borderColor: isActive ? colors.brandBlue : colors.border,
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <Text style={{ ...Typography.labelCaps, color: isActive ? '#ffffff' : colors.muted, textTransform: 'uppercase', fontSize: 11 }}>
                      {cat === 'all' ? 'All' : CATEGORY_LABELS[cat as SecretCategory]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {secretsLoading && <LoadingState message="Loading secrets…" style={{ paddingVertical: Spacing.xl }} />}
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 40).springify().damping(18)}
            style={{ paddingHorizontal: Spacing.md }}
          >
            <SecretCard secret={item} onDelete={handleDeleteSecret} onEdit={handleEdit} />
          </Animated.View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.xs }} />}
        ListEmptyComponent={
          !secretsLoading ? (
            <EmptyState
              icon="lock"
              title="No secrets in this folder"
              description="Add secrets to this folder to see them here."
              action={{ label: 'Add secret', onPress: () => router.push({ pathname: '/(tabs)/(vault)/add', params: { folder: selectedFolder } }) }}
            />
          ) : null
        }
      />

      <Pressable
        onPress={() => router.push({ pathname: '/(tabs)/(vault)/add', params: { folder: selectedFolder } })}
        style={({ pressed, hovered }: any) => ({
          position: 'absolute', bottom: Spacing.xl, right: Spacing.xl,
          width: 56, height: 56, borderRadius: 28,
          backgroundColor: colors.brandBlue,
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          transform: [{ scale: pressed ? 0.95 : hovered ? 1.05 : 1 }],
        })}
      >
        <MaterialIcons name="add" size={28} color="#ffffff" />
      </Pressable>
    </View>
  );
}
