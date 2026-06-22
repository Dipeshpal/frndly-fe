import { useState, useCallback } from 'react';
import { View, FlatList, Pressable, Alert, Text, Platform, TextInput } from 'react-native';
import { FadeIn as FadeInDown } from '@/components/motion/fade-in';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/use-theme';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useNoteList, useDeleteNote, useUpdateNote } from '@/features/notes/hooks/use-notes';
import { useFolders } from '@/features/notes/hooks/use-folders';
import { NoteCard } from '@/features/notes/components/note-card';
import { FolderTree } from '@/features/notes/components/folder-tree';
import { EmptyState } from '@/components/feedback/empty-state';
import { LoadingState } from '@/components/feedback/loading-state';
import { Spacing, Radius } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import type { Note } from '@/types/note.types';

export default function NotesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | undefined>(undefined);
  // null = unfiled, string = folder id, 'all' = all notes
  const [selectedFolder, setSelectedFolder] = useState<string | null | 'all'>('all');
  const isWeb = Platform.OS === 'web';
  const { isMobile } = useBreakpoint();

  const isAll = selectedFolder === 'all';
  const folderId = isAll ? undefined : (selectedFolder as string | null | undefined);

  const { data, isLoading } = useNoteList(
    search || undefined,
    activeTag,
    folderId,
    isAll,
  );
  const { mutate: deleteNote } = useDeleteNote();
  const { mutate: updateNote } = useUpdateNote();
  const { data: folders = [] } = useFolders();

  const allTags = [...new Set((data?.items ?? []).flatMap((n) => n.tags))];

  const handlePress = useCallback((note: Note) => {
    router.push({ pathname: '/(tabs)/(notes)/[id]', params: { id: note.id } });
  }, [router]);

  const handleDelete = useCallback((id: string) => {
    Alert.alert('Delete note', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteNote(id) },
    ]);
  }, [deleteNote]);

  const handlePin = useCallback((note: Note) => {
    updateNote({ id: note.id, data: { is_pinned: !note.is_pinned } });
  }, [updateNote]);

  const handleNewNote = () => {
    const params = typeof selectedFolder === 'string' && selectedFolder !== 'all'
      ? { folderId: selectedFolder }
      : {};
    router.push({ pathname: '/(tabs)/(notes)/new', params });
  };

  const notesList = (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      data={data?.items ?? []}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ gap: Spacing.md, paddingBottom: Spacing.xxl * 2, paddingTop: Spacing.sm }}
      ListHeaderComponent={
        <View style={{ gap: Spacing.md }}>
          {/* Search */}
          <View
            style={{
              backgroundColor: colors.surfaceCard,
              borderWidth: 1,
              borderColor: colors.hairline,
              borderRadius: Radius.lg,
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.sm,
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.sm,
            }}
          >
            {!isWeb ? (
              <Image source="sf:magnifyingglass" style={{ width: 16, height: 16, tintColor: colors.muted }} contentFit="contain" />
            ) : (
              <Text style={{ fontSize: 16 }}>🔍</Text>
            )}
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search notes…"
              placeholderTextColor={colors.muted}
              style={{ flex: 1, ...Typography.bodyMd, color: colors.ink, height: 36 }}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')} hitSlop={8}>
                <Text style={{ ...Typography.caption, color: colors.muted }}>✕</Text>
              </Pressable>
            )}
          </View>

          {/* Tag pills */}
          {allTags.length > 0 && (
            <View style={{ flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' }}>
              <Pressable
                onPress={() => setActiveTag(undefined)}
                style={({ pressed, hovered }: any) => ({
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  borderRadius: 9999,
                  backgroundColor: activeTag === undefined ? colors.brandLavender : hovered ? colors.surfaceSoft : colors.surfaceCard,
                  borderWidth: 1,
                  borderColor: activeTag === undefined ? colors.brandLavender : colors.hairline,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ ...Typography.caption, color: activeTag === undefined ? '#fff' : colors.muted }}>All</Text>
              </Pressable>
              {allTags.map((tag) => {
                const isActive = activeTag === tag;
                return (
                  <Pressable
                    key={tag}
                    onPress={() => setActiveTag(isActive ? undefined : tag)}
                    style={({ pressed, hovered }: any) => ({
                      paddingHorizontal: 14,
                      paddingVertical: 6,
                      borderRadius: 9999,
                      backgroundColor: isActive ? colors.brandLavender : hovered ? colors.surfaceSoft : colors.surfaceCard,
                      borderWidth: 1,
                      borderColor: isActive ? colors.brandLavender : colors.hairline,
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <Text style={{ ...Typography.caption, color: isActive ? '#fff' : colors.muted }}>{tag}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          {isLoading && <LoadingState message="Loading notes…" style={{ paddingVertical: Spacing.xl }} />}
        </View>
      }
      renderItem={({ item, index }) => {
        const folderName = folders.find((f) => f.id === item.folder_id)?.name;
        return (
          <FadeInDown index={index} step={40}>
            <NoteCard note={item} folderName={folderName} onPress={handlePress} onDelete={handleDelete} onPin={handlePin} />
          </FadeInDown>
        );
      }}
      ItemSeparatorComponent={() => <View style={{ height: Spacing.xs }} />}
      ListEmptyComponent={
        !isLoading ? (
          <EmptyState
            icon="note.text"
            title="No notes here"
            description="Create a note in this folder."
            action={{ label: 'New note', onPress: handleNewNote }}
          />
        ) : null
      }
    />
  );

  // Desktop/Tablet: sidebar + content two-column
  if (!isMobile) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Folder sidebar */}
        <View
          style={{
            width: 200,
            borderRightWidth: 1,
            borderRightColor: colors.hairline,
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.sm,
          }}
        >
          <Text style={{ ...Typography.labelCaps, color: colors.muted, paddingHorizontal: Spacing.sm, marginBottom: Spacing.sm }}>
            FOLDERS
          </Text>
          <FolderTree selectedFolderId={selectedFolder} onSelectFolder={setSelectedFolder} />
        </View>

        {/* Notes list */}
        <View style={{ flex: 1, paddingHorizontal: Spacing.md, position: 'relative' }}>
          {notesList}

          <Pressable
            onPress={handleNewNote}
            style={({ pressed, hovered }: any) => ({
              position: 'absolute',
              bottom: Spacing.xl,
              right: Spacing.xl,
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: colors.brandLavender,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              transform: [{ scale: pressed ? 0.95 : hovered ? 1.05 : 1 }],
            })}
            accessibilityRole="button"
            accessibilityLabel="New note"
          >
            <Text style={{ fontSize: 22, color: '#ffffff' }}>+</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Mobile: folder pills at top + notes list
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={data?.items ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: Spacing.md, paddingBottom: Spacing.xxl * 2 }}
        ListHeaderComponent={
          <View style={{ gap: Spacing.md, paddingTop: Spacing.sm, paddingHorizontal: Spacing.md }}>
            {/* Search */}
            <View
              style={{
                backgroundColor: colors.surfaceCard,
                borderWidth: 1,
                borderColor: colors.hairline,
                borderRadius: Radius.lg,
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.sm,
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.sm,
              }}
            >
              {!isWeb ? (
                <Image source="sf:magnifyingglass" style={{ width: 16, height: 16, tintColor: colors.muted }} contentFit="contain" />
              ) : (
                <Text style={{ fontSize: 16 }}>🔍</Text>
              )}
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search notes…"
                placeholderTextColor={colors.muted}
                style={{ flex: 1, ...Typography.bodyMd, color: colors.ink, height: 36 }}
              />
            </View>

            {/* Folder tree inline on mobile */}
            <View
              style={{
                backgroundColor: colors.surfaceCard,
                borderRadius: Radius.md,
                borderWidth: 1,
                borderColor: colors.hairline,
                padding: Spacing.sm,
              }}
            >
              <FolderTree selectedFolderId={selectedFolder} onSelectFolder={setSelectedFolder} />
            </View>

            {isLoading && <LoadingState message="Loading notes…" style={{ paddingVertical: Spacing.xl }} />}
          </View>
        }
        renderItem={({ item, index }) => {
          const folderName = folders.find((f) => f.id === item.folder_id)?.name;
          return (
            <FadeInDown index={index} step={40} style={{ paddingHorizontal: Spacing.md }}>
              <NoteCard note={item} folderName={folderName} onPress={handlePress} onDelete={handleDelete} onPin={handlePin} />
            </FadeInDown>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.xs }} />}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon="note.text"
              title="No notes here"
              description="Create a note in this folder."
              action={{ label: 'New note', onPress: handleNewNote }}
            />
          ) : null
        }
      />

      {/* FAB */}
      <Pressable
        onPress={handleNewNote}
        style={({ pressed, hovered }: any) => ({
          position: 'absolute',
          bottom: Spacing.xl,
          right: Spacing.xl,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.brandLavender,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 5,
          transform: [{ scale: pressed ? 0.95 : hovered ? 1.05 : 1 }],
        })}
        accessibilityRole="button"
        accessibilityLabel="New note"
      >
        {!isWeb ? (
          <Image source="sf:plus" style={{ width: 24, height: 24, tintColor: '#ffffff' }} contentFit="contain" />
        ) : (
          <Text style={{ fontSize: 24, color: '#ffffff', fontWeight: 'bold' }}>+</Text>
        )}
      </Pressable>
    </View>
  );
}
