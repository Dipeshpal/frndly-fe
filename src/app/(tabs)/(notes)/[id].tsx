import { useState, useEffect, useRef, useCallback } from 'react';
import { View, ScrollView, Text, TextInput, Pressable, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '@/hooks/use-theme';
import { useNote, useUpdateNote, useDeleteNote } from '@/features/notes/hooks/use-notes';
import { useFolders } from '@/features/notes/hooks/use-folders';
import { LoadingState } from '@/components/feedback/loading-state';
import { Spacing, Radius } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

// 'split' only available on web — side-by-side editor + preview
type Mode = 'edit' | 'split' | 'preview';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const router = useRouter();
  const isWeb = Platform.OS === 'web';

  const { data: note, isLoading } = useNote(id);
  const { mutate: updateNote, isPending: isSaving } = useUpdateNote();
  const { mutate: deleteNote } = useDeleteNote();
  const { data: folders = [] } = useFolders();

  const [mode, setMode] = useState<Mode>('edit');
  const [tagInput, setTagInput] = useState('');
  const [showFolderPicker, setShowFolderPicker] = useState(false);

  const [localTitle, setLocalTitle] = useState<string | null>(null);
  const [localContent, setLocalContent] = useState<string | null>(null);
  const [localTags, setLocalTags] = useState<string[] | null>(null);
  const [localFolderId, setLocalFolderId] = useState<string | null | undefined>(undefined);

  const title = localTitle ?? note?.title ?? '';
  const content = localContent ?? note?.content ?? '';
  const tags = localTags ?? note?.tags ?? [];
  const folderId = localFolderId === undefined ? (note?.folder_id ?? null) : localFolderId;

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentFolder = folders.find((f) => f.id === folderId) ?? null;

  useEffect(() => {
    navigation.setOptions({ title: title || 'Note' });
  }, [navigation, title]);

  useEffect(() => {
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, []);

  const modeIcon = () => {
    if (mode === 'edit') return isWeb ? '⬜⬜' : 'eye';
    if (mode === 'split') return isWeb ? '▪️⬜' : 'pencil';
    return isWeb ? '👁️' : 'pencil';
  };

  const nextMode = (): Mode => {
    if (!isWeb) return mode === 'edit' ? 'preview' : 'edit';
    if (mode === 'edit') return 'split';
    if (mode === 'split') return 'preview';
    return 'edit';
  };

  const modeLabel = () => {
    if (mode === 'edit') return isWeb ? 'Split' : 'Preview';
    if (mode === 'split') return 'Preview';
    return 'Edit';
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
          {isSaving && (
            <Text style={{ ...Typography.caption, color: colors.muted }}>Saving…</Text>
          )}
          <Pressable
            onPress={handlePinToggle}
            hitSlop={8}
            style={{ padding: 4 }}
            accessibilityLabel={note?.is_pinned ? 'Unpin' : 'Pin'}
          >
            {!isWeb ? (
              <Image
                source={`sf:${note?.is_pinned ? 'pin.fill' : 'pin'}`}
                style={{ width: 18, height: 18, tintColor: note?.is_pinned ? colors.brandLavender : colors.muted }}
                contentFit="contain"
              />
            ) : (
              <Text style={{ fontSize: 16 }}>{note?.is_pinned ? '📌' : '📍'}</Text>
            )}
          </Pressable>

          {/* Mode toggle */}
          <Pressable
            onPress={() => setMode(nextMode())}
            hitSlop={8}
            style={{
              paddingHorizontal: Spacing.sm,
              paddingVertical: 4,
              borderRadius: Radius.sm,
              backgroundColor: mode !== 'edit' ? colors.brandLavender : colors.surfaceCard,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
            accessibilityLabel={modeLabel()}
          >
            {!isWeb ? (
              <Image
                source={`sf:${mode === 'edit' ? 'eye' : mode === 'split' ? 'rectangle.split.2x1' : 'pencil'}`}
                style={{ width: 16, height: 16, tintColor: mode !== 'edit' ? '#fff' : colors.muted }}
                contentFit="contain"
              />
            ) : (
              <Text style={{ fontSize: 12, color: mode !== 'edit' ? '#fff' : colors.muted }}>
                {modeLabel()}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={handleDelete}
            hitSlop={8}
            style={{ padding: 4 }}
            accessibilityLabel="Delete note"
          >
            {!isWeb ? (
              <Image source="sf:trash" style={{ width: 18, height: 18, tintColor: colors.error }} contentFit="contain" />
            ) : (
              <Text style={{ fontSize: 16 }}>🗑️</Text>
            )}
          </Pressable>
        </View>
      ),
    });
  }, [navigation, mode, note?.is_pinned, isSaving, colors, isWeb]);

  const scheduleSave = useCallback((updates: {
    title?: string; content?: string; tags?: string[]; folder_id?: string | null;
  }) => {
    if (!id) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      updateNote({ id, data: updates });
    }, 600);
  }, [id, updateNote]);

  const handleTitleChange = (val: string) => {
    setLocalTitle(val);
    scheduleSave({ title: val, content, tags, folder_id: folderId });
  };

  const handleContentChange = (val: string) => {
    setLocalContent(val);
    scheduleSave({ title, content: val, tags, folder_id: folderId });
  };

  const addTag = (raw: string) => {
    const parts = raw.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    const next = [...new Set([...tags, ...parts])];
    setLocalTags(next);
    setTagInput('');
    scheduleSave({ title, content, tags: next, folder_id: folderId });
  };

  const removeTag = (tag: string) => {
    const next = tags.filter((t) => t !== tag);
    setLocalTags(next);
    scheduleSave({ title, content, tags: next, folder_id: folderId });
  };

  const handleFolderChange = (newFolderId: string | null) => {
    setLocalFolderId(newFolderId);
    setShowFolderPicker(false);
    scheduleSave({ title, content, tags, folder_id: newFolderId });
  };

  const handlePinToggle = () => {
    if (!note || !id) return;
    updateNote({ id, data: { is_pinned: !note.is_pinned } });
  };

  const handleDelete = () => {
    Alert.alert('Delete note', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteNote(id, { onSuccess: () => router.back() }),
      },
    ]);
  };

  if (isLoading) return <LoadingState message="Loading note…" />;
  if (!note) return null;

  const markdownStyles = {
    body: { color: colors.ink, ...Typography.bodyLg, backgroundColor: 'transparent' },
    heading1: { ...Typography.displayMd, color: colors.ink, marginTop: Spacing.lg, marginBottom: Spacing.sm },
    heading2: { ...Typography.titleLg, color: colors.ink, marginTop: Spacing.md, marginBottom: Spacing.xs },
    heading3: { ...Typography.titleMd, color: colors.bodyStrong, marginTop: Spacing.sm, marginBottom: Spacing.xs },
    paragraph: { ...Typography.bodyLg, color: colors.ink, marginVertical: Spacing.xs },
    code_inline: { ...Typography.monoCode, color: colors.brandPink, backgroundColor: colors.surfaceCard, paddingHorizontal: 4, borderRadius: 4 },
    fence: { ...Typography.monoCode, color: colors.ink, backgroundColor: colors.surfaceCard, borderRadius: Radius.md, padding: Spacing.md, marginVertical: Spacing.sm },
    blockquote: { backgroundColor: `${colors.brandLavender}18`, borderLeftWidth: 4, borderLeftColor: colors.brandLavender, paddingLeft: Spacing.md, paddingVertical: Spacing.xs, marginVertical: Spacing.sm, borderRadius: Radius.sm },
    bullet_list_icon: { color: colors.brandLavender, marginTop: 6 },
    ordered_list_icon: { color: colors.brandLavender },
    link: { color: colors.brandBlue },
    hr: { backgroundColor: colors.hairline, height: 1, marginVertical: Spacing.md },
    strong: { fontWeight: '700' as const },
    em: { fontStyle: 'italic' as const },
  };

  const header = (
    <>
      {/* Title */}
      <TextInput
        value={title}
        onChangeText={handleTitleChange}
        placeholder="Note title…"
        placeholderTextColor={colors.muted}
        style={{
          ...Typography.titleLg,
          color: colors.ink,
          borderBottomWidth: 1,
          borderBottomColor: colors.hairline,
          paddingBottom: Spacing.sm,
        }}
        editable={mode !== 'preview'}
      />

      {/* Folder badge + picker */}
      <View>
        <Pressable
          onPress={() => mode !== 'preview' && setShowFolderPicker((v) => !v)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' }}
        >
          {!isWeb ? (
            <Image
              source={`sf:${currentFolder ? 'folder.fill' : 'folder'}`}
              style={{ width: 13, height: 13, tintColor: currentFolder ? colors.brandLavender : colors.muted }}
              contentFit="contain"
            />
          ) : (
            <Text style={{ fontSize: 12 }}>📁</Text>
          )}
          <Text style={{ ...Typography.caption, color: currentFolder ? colors.brandLavender : colors.muted }}>
            {currentFolder ? currentFolder.name : 'Unfiled'}
          </Text>
          {mode !== 'preview' && (
            <Text style={{ ...Typography.caption, color: colors.muted }}>▾</Text>
          )}
        </Pressable>

        {showFolderPicker && (
          <View
            style={{
              backgroundColor: colors.surfaceCard,
              borderWidth: 1,
              borderColor: colors.hairline,
              borderRadius: Radius.md,
              marginTop: 4,
              zIndex: 10,
              minWidth: 180,
            }}
          >
            <Pressable
              onPress={() => handleFolderChange(null)}
              style={({ pressed }: any) => ({ padding: Spacing.sm, opacity: pressed ? 0.7 : 1 })}
            >
              <Text style={{ ...Typography.bodySm, color: colors.muted }}>— Unfiled</Text>
            </Pressable>
            {folders.map((f) => (
              <Pressable
                key={f.id}
                onPress={() => handleFolderChange(f.id)}
                style={({ pressed }: any) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  padding: Spacing.sm,
                  paddingLeft: f.parent_id ? Spacing.lg : Spacing.sm,
                  backgroundColor: folderId === f.id ? `${colors.brandLavender}22` : 'transparent',
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                {!isWeb ? (
                  <Image source="sf:folder" style={{ width: 12, height: 12, tintColor: colors.muted }} contentFit="contain" />
                ) : (
                  <Text style={{ fontSize: 11 }}>📁</Text>
                )}
                <Text style={{ ...Typography.bodySm, color: colors.ink }}>{f.name}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Tags */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, alignItems: 'center' }}>
        {tags.map((tag) => (
          <Pressable
            key={tag}
            onPress={() => mode !== 'preview' && removeTag(tag)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: `${colors.brandLavender}22`, borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 3 }}
          >
            <Text style={{ ...Typography.caption, color: colors.brandLavender }}>{tag}</Text>
            {mode !== 'preview' && (
              <Text style={{ ...Typography.caption, color: colors.brandLavender }}>✕</Text>
            )}
          </Pressable>
        ))}
        {mode !== 'preview' && (
          <TextInput
            value={tagInput}
            onChangeText={setTagInput}
            placeholder="+ tag"
            placeholderTextColor={colors.muted}
            onSubmitEditing={() => addTag(tagInput)}
            onBlur={() => { if (tagInput.trim()) addTag(tagInput); }}
            returnKeyType="done"
            blurOnSubmit={false}
            style={{ ...Typography.caption, color: colors.ink, minWidth: 60, height: 24, padding: 0 }}
          />
        )}
      </View>
    </>
  );

  // SPLIT mode — web only: editor left, preview right
  if (mode === 'split') {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.md }}
      >
        {header}
        <View style={{ flexDirection: 'row', gap: Spacing.md, minHeight: 500 }}>
          {/* Editor panel */}
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: colors.hairline,
              borderRadius: Radius.md,
              padding: Spacing.md,
              backgroundColor: colors.surfaceCard,
            }}
          >
            <Text style={{ ...Typography.caption, color: colors.muted, marginBottom: Spacing.xs }}>MARKDOWN</Text>
            <TextInput
              value={content}
              onChangeText={handleContentChange}
              placeholder={'Write in markdown…\n\n# Heading\n**bold** _italic_ `code`'}
              placeholderTextColor={colors.muted}
              multiline
              textAlignVertical="top"
              scrollEnabled={false}
              style={{ ...Typography.bodyMd, color: colors.ink, minHeight: 460, lineHeight: 24 }}
              autoCorrect={false}
              autoCapitalize="sentences"
            />
          </View>

          {/* Divider */}
          <View style={{ width: 1, backgroundColor: colors.hairline }} />

          {/* Preview panel */}
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: colors.hairline,
              borderRadius: Radius.md,
              padding: Spacing.md,
            }}
          >
            <Text style={{ ...Typography.caption, color: colors.muted, marginBottom: Spacing.xs }}>PREVIEW</Text>
            <Markdown style={markdownStyles}>
              {content || '*Nothing to preview yet.*'}
            </Markdown>
          </View>
        </View>
      </ScrollView>
    );
  }

  // EDIT or PREVIEW mode
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.md }}
    >
      {header}

      {mode === 'edit' ? (
        <TextInput
          value={content}
          onChangeText={handleContentChange}
          placeholder={'Write in markdown…\n\n# Heading\n**bold** _italic_ `code`'}
          placeholderTextColor={colors.muted}
          multiline
          textAlignVertical="top"
          scrollEnabled={false}
          style={{ ...Typography.bodyMd, color: colors.ink, minHeight: 400, lineHeight: 24 }}
          autoCorrect={false}
          autoCapitalize="sentences"
        />
      ) : (
        <Markdown style={markdownStyles}>
          {content || '*Nothing to preview yet.*'}
        </Markdown>
      )}
    </ScrollView>
  );
}
