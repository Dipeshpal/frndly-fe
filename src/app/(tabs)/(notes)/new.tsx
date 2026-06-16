import { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, Pressable, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/use-theme';
import { useCreateNote } from '@/features/notes/hooks/use-notes';
import { useFolders } from '@/features/notes/hooks/use-folders';
import { Spacing, Radius } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import type { CreateNoteInput } from '@/types/note.types';

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
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(initialFolderId ?? null);
  const [showFolderPicker, setShowFolderPicker] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<NewNoteForm>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', content: '' },
  });

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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
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
      ),
    });
  }, [navigation, loading, selectedFolderId, tags]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingBottom: Spacing.xxl }}
      keyboardShouldPersistTaps="handled"
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
              style={{
                ...Typography.titleLg,
                color: colors.ink,
                borderBottomWidth: 1,
                borderBottomColor: errors.title ? colors.error : colors.hairline,
                paddingBottom: Spacing.sm,
              }}
            />
            {errors.title && (
              <Text style={{ ...Typography.caption, color: colors.error, marginTop: 4 }}>
                {errors.title.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Content — main focus, large area */}
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

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: colors.hairline, marginHorizontal: Spacing.md }} />

      {/* Metadata section — Folder + Tags */}
      <View style={{ gap: Spacing.md, padding: Spacing.md }}>
        {/* Folder picker */}
        <View style={{ gap: Spacing.xs }}>
          <Text style={{ ...Typography.labelCaps, color: colors.muted }}>FOLDER</Text>
          <Pressable
            onPress={() => setShowFolderPicker((v) => !v)}
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
              opacity: pressed ? 0.8 : 1,
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
              {selectedFolder ? selectedFolder.name : 'Unfiled'}
            </Text>
            {!isWeb ? (
              <Image source="sf:chevron.down" style={{ width: 11, height: 11, tintColor: colors.muted }} contentFit="contain" />
            ) : (
              <Text style={{ fontSize: 11, color: colors.muted }}>▼</Text>
            )}
          </Pressable>

          {showFolderPicker && (
            <View
              style={{
                backgroundColor: colors.surfaceCard,
                borderWidth: 1,
                borderColor: colors.hairline,
                borderRadius: Radius.md,
                overflow: 'hidden',
              }}
            >
              <Pressable
                onPress={() => { setSelectedFolderId(null); setShowFolderPicker(false); }}
                style={({ pressed, hovered }: any) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: Spacing.sm,
                  padding: Spacing.sm,
                  backgroundColor: selectedFolderId === null
                    ? `${colors.brandLavender}22`
                    : hovered ? colors.surfaceSoft : 'transparent',
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ ...Typography.bodySm, color: colors.muted }}>— Unfiled</Text>
              </Pressable>
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
                    <Image source="sf:folder" style={{ width: 13, height: 13, tintColor: colors.muted }} contentFit="contain" />
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
        <View style={{ gap: Spacing.xs }}>
          <Text style={{ ...Typography.labelCaps, color: colors.muted }}>TAGS</Text>
          {tags.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs }}>
              {tags.map((tag) => (
                <Pressable
                  key={tag}
                  onPress={() => removeTag(tag)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: `${colors.brandLavender}22`, borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 3 }}
                >
                  <Text style={{ ...Typography.caption, color: colors.brandLavender }}>{tag}</Text>
                  <Text style={{ ...Typography.caption, color: colors.brandLavender }}>✕</Text>
                </Pressable>
              ))}
            </View>
          )}
          <TextInput
            value={tagInput}
            onChangeText={setTagInput}
            placeholder="Add tags, comma-separated…"
            placeholderTextColor={colors.muted}
            onSubmitEditing={() => addTag(tagInput)}
            onBlur={() => { if (tagInput.trim()) addTag(tagInput); }}
            returnKeyType="done"
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
