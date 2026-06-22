import { useState, useEffect, useRef, useCallback } from 'react';
import { View, ScrollView, Text, TextInput, Pressable, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '@/hooks/use-theme';
import { useNote, useUpdateNote, useDeleteNote } from '@/features/notes/hooks/use-notes';
import { useFolders, useCreateFolder } from '@/features/notes/hooks/use-folders';
import { LoadingState } from '@/components/feedback/loading-state';
import { Spacing, Radius } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

// 'view' = read-only, 'split' only available on web — side-by-side editor + preview
type Mode = 'view' | 'edit' | 'split' | 'preview';

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
  const { mutate: createFolder } = useCreateFolder();

  const [mode, setMode] = useState<Mode>('view');
  const [expandedPanel, setExpandedPanel] = useState<'editor' | 'preview' | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [localTitle, setLocalTitle] = useState<string | null>(null);
  const [localContent, setLocalContent] = useState<string | null>(null);
  const [localTags, setLocalTags] = useState<string[] | null>(null);
  const [localFolderId, setLocalFolderId] = useState<string | null | undefined>(undefined);

  const content = localContent ?? note?.content ?? '';
  const hasContentTitle = content.trim().startsWith('#');
  const extractedTitle = hasContentTitle ? (content.trim().match(/^#+\s*(.*)/)?.[1]?.trim() ?? '') : null;
  const title = hasContentTitle ? (extractedTitle ?? '') : (localTitle ?? note?.title ?? '');
  const tags = localTags ?? note?.tags ?? [];
  const folderId = localFolderId === undefined ? (note?.folder_id ?? null) : localFolderId;
  const canEditTitle = (mode === 'edit' || mode === 'split') && !hasContentTitle;
  const canEdit = mode === 'edit' || mode === 'split';

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentFolder = folders.find((f) => f.id === folderId) ?? null;

  useEffect(() => {
    navigation.setOptions({ title: title || 'Note' });
  }, [navigation, title]);

  useEffect(() => {
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, []);

  useEffect(() => { setExpandedPanel(null); }, [mode]);

  const nextMode = (): Mode => {
    if (mode === 'view') return 'edit';
    if (!isWeb) return mode === 'edit' ? 'preview' : 'view';
    if (mode === 'edit') return 'split';
    if (mode === 'split') return 'preview';
    return 'view';
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

          {/* Edit/Mode toggle */}
          {mode === 'view' ? (
            <Pressable
              onPress={() => setMode(isWeb ? 'split' : 'edit')}
              hitSlop={8}
              style={{
                paddingHorizontal: Spacing.sm,
                paddingVertical: 4,
                borderRadius: Radius.sm,
                backgroundColor: colors.brandBlue,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
              accessibilityLabel="Edit"
            >
              {!isWeb ? (
                <Image source="sf:pencil" style={{ width: 16, height: 16, tintColor: '#fff' }} contentFit="contain" />
              ) : (
                <Text style={{ fontSize: 12, color: '#fff' }}>Edit</Text>
              )}
            </Pressable>
          ) : (
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
              accessibilityLabel={mode === 'edit' ? (isWeb ? 'Split' : 'Preview') : (mode === 'split' ? 'Preview' : 'Edit')}
            >
              {!isWeb ? (
                <Image
                  source={`sf:${mode === 'edit' ? 'eye' : mode === 'split' ? 'rectangle.split.2x1' : 'pencil'}`}
                  style={{ width: 16, height: 16, tintColor: mode !== 'edit' ? '#fff' : colors.muted }}
                  contentFit="contain"
                />
              ) : (
                <Text style={{ fontSize: 12, color: mode !== 'edit' ? '#fff' : colors.muted }}>
                  {mode === 'edit' ? (isWeb ? 'Split' : 'Preview') : (mode === 'split' ? 'Preview' : 'Edit')}
                </Text>
              )}
            </Pressable>
          )}

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const isHeader = val.trim().startsWith('#');
    const ext = isHeader ? (val.trim().match(/^#+\s*(.*)/)?.[1]?.trim() ?? '') : null;
    const nextTitle = isHeader ? ext : title;
    if (isHeader && ext !== null) {
      setLocalTitle(ext);
    }
    scheduleSave({ title: nextTitle ?? '', content: val, tags, folder_id: folderId });
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
      {mode === 'view' ? (
        <Text style={{ ...Typography.titleLg, color: colors.ink, paddingBottom: Spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.hairline }}>
          {title}
        </Text>
      ) : (
        <View>
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
              opacity: canEditTitle ? 1 : 0.6,
            }}
            editable={canEditTitle}
          />
          {hasContentTitle && (
            <Text style={{ ...Typography.caption, color: colors.muted, marginTop: 4 }}>
              ℹ️ Title automatically set from Markdown header
            </Text>
          )}
        </View>
      )}

      {/* Folder badge + picker */}
      <View>
        <Pressable
          onPress={() => canEdit && setShowFolderPicker((v) => !v)}
          disabled={!canEdit}
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
            {currentFolder ? currentFolder.name : 'No folder'}
          </Text>
          {canEdit && (
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
              minWidth: 200,
              overflow: 'hidden',
            }}
          >
            {folders.map((f) => (
              <Pressable
                key={f.id}
                onPress={() => { handleFolderChange(f.id); setShowFolderPicker(false); }}
                style={({ pressed, hovered }: any) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  padding: Spacing.sm,
                  paddingLeft: f.parent_id ? Spacing.lg : Spacing.sm,
                  backgroundColor: folderId === f.id
                    ? `${colors.brandLavender}22`
                    : hovered ? colors.surfaceSoft : 'transparent',
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                {!isWeb ? (
                  <Image source="sf:folder" style={{ width: 12, height: 12, tintColor: folderId === f.id ? colors.brandLavender : colors.muted }} contentFit="contain" />
                ) : (
                  <Text style={{ fontSize: 11 }}>📁</Text>
                )}
                <Text style={{ ...Typography.bodySm, color: folderId === f.id ? colors.brandLavender : colors.ink }}>{f.name}</Text>
              </Pressable>
            ))}

            {/* Divider */}
            {folders.length > 0 && <View style={{ height: 1, backgroundColor: colors.hairline }} />}

            {/* Create new folder */}
            {creatingFolder ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, padding: Spacing.sm }}>
                <Text style={{ fontSize: 11 }}>📁</Text>
                <TextInput
                  value={newFolderName}
                  onChangeText={setNewFolderName}
                  placeholder="Folder name…"
                  placeholderTextColor={colors.muted}
                  autoFocus
                  onSubmitEditing={() => {
                    if (newFolderName.trim()) {
                      createFolder(
                        { name: newFolderName.trim(), parent_id: null },
                        {
                          onSuccess: (folder: any) => {
                            handleFolderChange(folder.id);
                            setShowFolderPicker(false);
                          },
                        }
                      );
                    }
                    setCreatingFolder(false);
                    setNewFolderName('');
                  }}
                  onBlur={() => { setCreatingFolder(false); setNewFolderName(''); }}
                  style={{ ...Typography.bodySm, color: colors.ink, flex: 1, padding: 0 }}
                />
              </View>
            ) : (
              <Pressable
                onPress={() => setCreatingFolder(true)}
                style={({ pressed, hovered }: any) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  padding: Spacing.sm,
                  backgroundColor: hovered ? colors.surfaceSoft : 'transparent',
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text style={{ fontSize: 12, color: colors.muted }}>+</Text>
                <Text style={{ ...Typography.bodySm, color: colors.muted }}>New folder</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>

      {/* Tags */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, alignItems: 'center' }}>
        {tags.map((tag) => (
          <Pressable
            key={tag}
            onPress={() => canEdit && removeTag(tag)}
            disabled={!canEdit}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: `${colors.brandLavender}22`, borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 3 }}
          >
            <Text style={{ ...Typography.caption, color: colors.brandLavender }}>{tag}</Text>
            {canEdit && (
              <Text style={{ ...Typography.caption, color: colors.brandLavender }}>✕</Text>
            )}
          </Pressable>
        ))}
        {canEdit && (
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
    const editorHidden = expandedPanel === 'preview';
    const previewHidden = expandedPanel === 'editor';
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ scrollbarWidth: 'none' } as any}
        contentContainerStyle={{ padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.md }}
      >
        {header}
        <View style={{ flexDirection: 'row', gap: Spacing.md, minHeight: 500 }}>
          {/* Editor panel */}
          <View
            style={{
              flex: editorHidden ? 0 : 1,
              overflow: 'hidden',
              borderWidth: editorHidden ? 0 : 1,
              borderColor: expandedPanel === 'editor' ? colors.brandLavender : colors.hairline,
              borderRadius: Radius.md,
              padding: editorHidden ? 0 : Spacing.md,
              backgroundColor: colors.surfaceCard,
            }}
          >
            {!editorHidden && (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xs }}>
                  <Text style={{ ...Typography.caption, color: colors.muted }}>MARKDOWN</Text>
                  <Pressable
                    onPress={() => setExpandedPanel((p) => p === 'editor' ? null : 'editor')}
                    hitSlop={8}
                    style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 2 })}
                  >
                    <Text style={{ fontSize: 14, color: expandedPanel === 'editor' ? colors.brandLavender : colors.muted }}>
                      {expandedPanel === 'editor' ? '⊟' : '⊞'}
                    </Text>
                  </Pressable>
                </View>
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
              </>
            )}
          </View>

          {/* Divider — hidden when one panel is expanded */}
          {!editorHidden && !previewHidden && (
            <View style={{ width: 1, backgroundColor: colors.hairline }} />
          )}

          {/* Preview panel */}
          <View
            style={{
              flex: previewHidden ? 0 : 1,
              overflow: 'hidden',
              borderWidth: previewHidden ? 0 : 1,
              borderColor: expandedPanel === 'preview' ? colors.brandLavender : colors.hairline,
              borderRadius: Radius.md,
              padding: previewHidden ? 0 : Spacing.md,
            }}
          >
            {!previewHidden && (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xs }}>
                  <Text style={{ ...Typography.caption, color: colors.muted }}>PREVIEW</Text>
                  <Pressable
                    onPress={() => setExpandedPanel((p) => p === 'preview' ? null : 'preview')}
                    hitSlop={8}
                    style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 2 })}
                  >
                    <Text style={{ fontSize: 14, color: expandedPanel === 'preview' ? colors.brandLavender : colors.muted }}>
                      {expandedPanel === 'preview' ? '⊟' : '⊞'}
                    </Text>
                  </Pressable>
                </View>
                <Markdown style={markdownStyles}>
                  {content || '*Nothing to preview yet.*'}
                </Markdown>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    );
  }

  // VIEW mode — read-only display
  if (mode === 'view') {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        style={{ scrollbarWidth: 'none' } as any}
        contentContainerStyle={{ padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.md }}
      >
        {header}
        <Markdown style={markdownStyles}>
          {content || '*Nothing to display.*'}
        </Markdown>
      </ScrollView>
    );
  }

  // EDIT or PREVIEW mode
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={{ scrollbarWidth: 'none' } as any}
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
