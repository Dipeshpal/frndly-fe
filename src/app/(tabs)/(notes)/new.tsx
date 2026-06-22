import { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, Pressable, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '@/hooks/use-theme';
import { useCreateNote } from '@/features/notes/hooks/use-notes';
import { useFolders, useCreateFolder } from '@/features/notes/hooks/use-folders';
import { Spacing, Radius } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import type { CreateNoteInput } from '@/types/note.types';

type Mode = 'edit' | 'split' | 'preview';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(500),
  content: z.string().default(''),
});

type NewNoteForm = z.infer<typeof schema>;

export default function NewNoteScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const { folderId: initialFolderId } = useLocalSearchParams<{ folderId?: string }>();
  const isWeb = Platform.OS === 'web';

  const { create, loading, error } = useCreateNote();
  const { data: folders = [] } = useFolders();
  const { mutate: createFolder } = useCreateFolder();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(initialFolderId ?? null);
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<NewNoteForm>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', content: '' },
  });

  const [mode, setMode] = useState<Mode>(Platform.OS === 'web' ? 'split' : 'edit');
  const [expandedPanel, setExpandedPanel] = useState<'editor' | 'preview' | null>(null);
  const watchedContent = watch('content') || '';
  const hasContentTitle = watchedContent.trim().startsWith('#');

  useEffect(() => {
    if (hasContentTitle) {
      const match = watchedContent.trim().match(/^#+\s*(.*)/);
      const extractedTitle = match ? match[1].trim() : '';
      setValue('title', extractedTitle, { shouldValidate: true });
    }
  }, [watchedContent, hasContentTitle, setValue]);

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

  const addTag = (raw: string) => {
    const parts = raw.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    setTags((prev) => [...new Set([...prev, ...parts])]);
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const selectedFolder = folders.find((f) => f.id === selectedFolderId);

  const onSubmit = (data: NewNoteForm) => {
    const input: CreateNoteInput = {
      title: data.title,
      content: data.content,
      tags,
      folder_id: selectedFolderId,
    };
    create(input, {
      onSuccess: (note) => {
        router.replace({ pathname: '/(tabs)/(notes)/[id]', params: { id: note.id } });
      },
      onError: () => Alert.alert('Error', error ?? 'Failed to create note'),
    });
  };

  const MODES: { key: Mode; label: string; sfIcon: string }[] = isWeb
    ? [
        { key: 'edit',    label: 'Edit',    sfIcon: 'pencil' },
        { key: 'split',   label: 'Split',   sfIcon: 'rectangle.split.2x1' },
        { key: 'preview', label: 'Preview', sfIcon: 'eye' },
      ]
    : [
        { key: 'edit',    label: 'Edit',    sfIcon: 'pencil' },
        { key: 'preview', label: 'Preview', sfIcon: 'eye' },
      ];

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
          {/* Segmented mode switcher */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: colors.surfaceCard,
              borderRadius: Radius.sm,
              borderWidth: 1,
              borderColor: colors.hairline,
              overflow: 'hidden',
            }}
          >
            {MODES.map((m, i) => {
              const active = mode === m.key;
              return (
                <Pressable
                  key={m.key}
                  onPress={() => setMode(m.key)}
                  hitSlop={4}
                  style={({ pressed }: any) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 5,
                    backgroundColor: active ? colors.brandLavender : pressed ? colors.surfaceSoft : 'transparent',
                    borderLeftWidth: i > 0 ? 1 : 0,
                    borderLeftColor: colors.hairline,
                  })}
                >
                  {!isWeb ? (
                    <Image
                      source={`sf:${m.sfIcon}`}
                      style={{ width: 14, height: 14, tintColor: active ? '#fff' : colors.muted }}
                      contentFit="contain"
                    />
                  ) : null}
                  <Text style={{ fontSize: 12, color: active ? '#fff' : colors.muted, fontWeight: active ? '600' : '400' }}>
                    {m.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            hitSlop={8}
            style={({ pressed }: any) => ({
              paddingHorizontal: Spacing.md,
              paddingVertical: 6,
              borderRadius: Radius.sm,
              backgroundColor: colors.brandLavender,
              opacity: pressed || loading ? 0.7 : 1,
            })}
          >
            <Text style={{ ...Typography.button, color: '#fff', fontSize: 14 }}>
              {loading ? 'Saving…' : 'Save'}
            </Text>
          </Pressable>
        </View>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, loading, selectedFolderId, tags, mode, colors, isWeb]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingBottom: Spacing.xxl }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={{ scrollbarWidth: 'none' } as any}
    >
      {/* Title — top, prominent, no label */}
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{ paddingHorizontal: Spacing.md, paddingTop: Spacing.md }}>
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Note title…"
              placeholderTextColor={colors.muted}
              autoFocus
              editable={mode !== 'preview' && !hasContentTitle}
              style={{
                ...Typography.titleLg,
                color: colors.ink,
                borderBottomWidth: 1,
                borderBottomColor: errors.title ? colors.error : colors.hairline,
                paddingBottom: Spacing.sm,
                opacity: (mode === 'preview' || hasContentTitle) ? 0.6 : 1,
              }}
            />
            {hasContentTitle && (
              <Text style={{ ...Typography.caption, color: colors.muted, marginTop: 4 }}>
                ℹ️ Title automatically set from Markdown header
              </Text>
            )}
            {errors.title && !hasContentTitle && (
              <Text style={{ ...Typography.caption, color: colors.error, marginTop: 4 }}>
                {errors.title.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Content — edit, split, or preview modes */}
      {mode === 'split' ? (
        (() => {
          const editorHidden = expandedPanel === 'preview';
          const previewHidden = expandedPanel === 'editor';
          return (
            <View style={{ flexDirection: 'row', gap: Spacing.md, minHeight: 500, paddingHorizontal: Spacing.md, marginTop: Spacing.md }}>
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
                    <Controller
                      control={control}
                      name="content"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder={'Write in markdown…\n\n# Heading\n**bold** _italic_ `code`'}
                          placeholderTextColor={colors.muted}
                          multiline
                          textAlignVertical="top"
                          scrollEnabled={false}
                          style={{ ...Typography.bodyMd, color: colors.ink, minHeight: 460, lineHeight: 24 }}
                          autoCorrect={false}
                          autoCapitalize="sentences"
                        />
                      )}
                    />
                  </>
                )}
              </View>

              {/* Divider */}
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
                      {watchedContent || '*Nothing to preview yet.*'}
                    </Markdown>
                  </>
                )}
              </View>
            </View>
          );
        })()
      ) : mode === 'preview' ? (
        <View style={{ paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, minHeight: 220 }}>
          <Markdown style={markdownStyles}>
            {watchedContent || '*Nothing to preview yet.*'}
          </Markdown>
        </View>
      ) : (
        <Controller
          control={control}
          name="content"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={'Start writing in markdown…\n\n# Heading\n**bold** _italic_ `code`'}
              placeholderTextColor={colors.muted}
              multiline
              textAlignVertical="top"
              style={{
                ...Typography.bodyMd,
                color: colors.ink,
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.md,
                minHeight: 220,
                lineHeight: 24,
              }}
            />
          )}
        />
      )}

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: colors.hairline, marginHorizontal: Spacing.md }} />

      {/* Metadata section — Folder + Tags */}
      <View style={{ gap: Spacing.md, padding: Spacing.md }}>
        {/* Folder picker */}
        <View style={{ gap: Spacing.xs }}>
          <Text style={{ ...Typography.labelCaps, color: colors.muted }}>FOLDER</Text>
          <Pressable
            onPress={() => mode !== 'preview' && setShowFolderPicker((v) => !v)}
            disabled={mode === 'preview'}
            style={({ pressed, hovered }: any) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.sm,
              backgroundColor: hovered ? colors.surfaceSoft : colors.surfaceCard,
              borderWidth: 1,
              borderColor: colors.hairline,
              borderRadius: Radius.md,
              borderCurve: 'continuous',
              padding: Spacing.sm,
              opacity: pressed && mode !== 'preview' ? 0.8 : 1,
            })}
          >
            {!isWeb ? (
              <Image
                source={`sf:${selectedFolder ? 'folder.fill' : 'folder'}`}
                style={{ width: 15, height: 15, tintColor: selectedFolder ? colors.brandLavender : colors.muted }}
                contentFit="contain"
              />
            ) : (
              <Text style={{ fontSize: 13 }}>📁</Text>
            )}
            <Text style={{ ...Typography.bodySm, color: selectedFolder ? colors.ink : colors.muted, flex: 1 }}>
              {selectedFolder ? selectedFolder.name : 'No folder'}
            </Text>
            {mode !== 'preview' && (
              <>
                {!isWeb ? (
                  <Image source="sf:chevron.down" style={{ width: 11, height: 11, tintColor: colors.muted }} contentFit="contain" />
                ) : (
                  <Text style={{ fontSize: 11, color: colors.muted }}>▼</Text>
                )}
              </>
            )}
          </Pressable>

          {showFolderPicker && mode !== 'preview' && (
            <View
              style={{
                backgroundColor: colors.surfaceCard,
                borderWidth: 1,
                borderColor: colors.hairline,
                borderRadius: Radius.md,
                overflow: 'hidden',
              }}
            >
              {folders.map((f) => (
                <Pressable
                  key={f.id}
                  onPress={() => { setSelectedFolderId(f.id); setShowFolderPicker(false); }}
                  style={({ pressed, hovered }: any) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing.sm,
                    padding: Spacing.sm,
                    paddingLeft: f.parent_id ? Spacing.lg : Spacing.sm,
                    backgroundColor: selectedFolderId === f.id
                      ? `${colors.brandLavender}22`
                      : hovered ? colors.surfaceSoft : 'transparent',
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  {!isWeb ? (
                    <Image source="sf:folder" style={{ width: 13, height: 13, tintColor: selectedFolderId === f.id ? colors.brandLavender : colors.muted }} contentFit="contain" />
                  ) : (
                    <Text style={{ fontSize: 11 }}>📁</Text>
                  )}
                  <Text style={{ ...Typography.bodySm, color: selectedFolderId === f.id ? colors.brandLavender : colors.ink }}>{f.name}</Text>
                </Pressable>
              ))}

              {folders.length > 0 && <View style={{ height: 1, backgroundColor: colors.hairline }} />}

              {creatingFolder ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.sm }}>
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
                              setSelectedFolderId(folder.id);
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
                    gap: Spacing.sm,
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
        <View style={{ gap: Spacing.xs }}>
          <Text style={{ ...Typography.labelCaps, color: colors.muted }}>TAGS</Text>
          {tags.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs }}>
              {tags.map((tag) => (
                <Pressable
                  key={tag}
                  onPress={() => mode !== 'preview' && removeTag(tag)}
                  disabled={mode === 'preview'}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: `${colors.brandLavender}22`, borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 3 }}
                >
                  <Text style={{ ...Typography.caption, color: colors.brandLavender }}>{tag}</Text>
                  {mode !== 'preview' && (
                    <Text style={{ ...Typography.caption, color: colors.brandLavender }}>✕</Text>
                  )}
                </Pressable>
              ))}
            </View>
          )}
          <TextInput
            value={tagInput}
            onChangeText={setTagInput}
            placeholder={mode !== 'preview' ? "Add tags, comma-separated…" : ""}
            placeholderTextColor={colors.muted}
            onSubmitEditing={() => addTag(tagInput)}
            onBlur={() => { if (tagInput.trim()) addTag(tagInput); }}
            returnKeyType="done"
            editable={mode !== 'preview'}
            style={{
              ...Typography.bodySm,
              color: colors.ink,
              backgroundColor: colors.surfaceCard,
              borderWidth: 1,
              borderColor: colors.hairline,
              borderRadius: Radius.md,
              borderCurve: 'continuous',
              padding: Spacing.sm,
              height: 40,
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
