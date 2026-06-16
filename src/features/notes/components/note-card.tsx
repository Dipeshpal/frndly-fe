import { View, Text, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, Radius } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import type { Note } from '@/types/note.types';

interface NoteCardProps {
  note: Note;
  onPress: (note: Note) => void;
  onDelete: (id: string) => void;
  onPin: (note: Note) => void;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s/g, '')
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/>\s/g, '')
    .trim()
    .slice(0, 120);
}

export function NoteCard({ note, onPress, onDelete, onPin }: NoteCardProps) {
  const { colors } = useTheme();
  const isWeb = Platform.OS === 'web';
  const preview = stripMarkdown(note.content);

  return (
    <Pressable
      onPress={() => onPress(note)}
      style={({ pressed, hovered }: any) => ({
        backgroundColor: hovered ? colors.surfaceSoft : colors.surfaceCard,
        borderRadius: Radius.lg,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: hovered ? colors.brandLavender : colors.hairline,
        borderLeftWidth: 4,
        borderLeftColor: note.is_pinned ? colors.brandLavender : colors.hairline,
        padding: Spacing.md,
        gap: Spacing.sm,
        opacity: pressed ? 0.9 : 1,
        transition: 'all 0.15s',
      })}
      accessibilityRole="button"
      accessibilityLabel={note.title}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Text style={{ ...Typography.titleSm, color: colors.ink, flex: 1, marginRight: Spacing.sm }} numberOfLines={1}>
          {note.title}
        </Text>
        <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
          <Pressable
            onPress={() => onPin(note)}
            hitSlop={8}
            style={({ pressed, hovered }: any) => ({
              opacity: pressed ? 0.6 : 1,
              backgroundColor: hovered ? colors.surfaceStrong : 'transparent',
              padding: 4,
              borderRadius: Radius.sm,
            })}
            accessibilityLabel={note.is_pinned ? 'Unpin note' : 'Pin note'}
          >
            {!isWeb ? (
              <Image
                source={`sf:${note.is_pinned ? 'pin.fill' : 'pin'}`}
                style={{ width: 16, height: 16, tintColor: note.is_pinned ? colors.brandLavender : colors.muted }}
                contentFit="contain"
              />
            ) : (
              <Text style={{ fontSize: 14 }}>{note.is_pinned ? '📌' : '📍'}</Text>
            )}
          </Pressable>
          <Pressable
            onPress={() => onDelete(note.id)}
            hitSlop={8}
            style={({ pressed, hovered }: any) => ({
              opacity: pressed ? 0.6 : 1,
              backgroundColor: hovered ? colors.surfaceStrong : 'transparent',
              padding: 4,
              borderRadius: Radius.sm,
            })}
            accessibilityLabel="Delete note"
          >
            {!isWeb ? (
              <Image source="sf:trash" style={{ width: 16, height: 16, tintColor: colors.error }} contentFit="contain" />
            ) : (
              <Text style={{ fontSize: 14 }}>🗑️</Text>
            )}
          </Pressable>
        </View>
      </View>

      {/* Content preview */}
      {preview.length > 0 && (
        <Text style={{ ...Typography.bodySm, color: colors.muted }} numberOfLines={2}>
          {preview}
        </Text>
      )}

      {/* Footer: tags + date */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: Spacing.xs }}>
        <View style={{ flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' }}>
          {note.tags.slice(0, 3).map((tag) => (
            <View
              key={tag}
              style={{
                backgroundColor: `${colors.brandLavender}22`,
                borderRadius: 9999,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              <Text style={{ ...Typography.caption, color: colors.brandLavender }}>{tag}</Text>
            </View>
          ))}
          {note.tags.length > 3 && (
            <Text style={{ ...Typography.caption, color: colors.muted }}>+{note.tags.length - 3}</Text>
          )}
        </View>
        <Text style={{ ...Typography.caption, color: colors.mutedSoft }}>
          {new Date(note.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </Text>
      </View>
    </Pressable>
  );
}
