import { useState } from 'react';
import { View, Text, Pressable, TextInput, Alert, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/use-theme';
import { useFolders, useCreateFolder, useDeleteFolder, useUpdateFolder } from '@/features/notes/hooks/use-folders';
import { Spacing, Radius } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import type { Folder } from '@/types/folder.types';

interface FolderTreeProps {
  selectedFolderId: string | null | 'all';
  onSelectFolder: (id: string | null | 'all') => void;
}

interface FolderNodeProps {
  folder: Folder;
  subfolders: Folder[];
  allFolders: Folder[];
  selectedFolderId: string | null | 'all';
  onSelectFolder: (id: string | null | 'all') => void;
  depth: number;
}

function FolderNode({ folder, subfolders, allFolders, selectedFolderId, onSelectFolder, depth }: FolderNodeProps) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(true);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(folder.name);
  const isWeb = Platform.OS === 'web';
  const { mutate: deleteFolder } = useDeleteFolder();
  const { mutate: updateFolder } = useUpdateFolder();

  const isSelected = selectedFolderId === folder.id;
  const hasChildren = subfolders.length > 0;

  const handleDelete = () => {
    Alert.alert(`Delete "${folder.name}"?`, 'Notes inside will become unfiled.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteFolder(folder.id) },
    ]);
  };

  const handleRename = () => {
    if (renameValue.trim() && renameValue !== folder.name) {
      updateFolder({ id: folder.id, data: { name: renameValue.trim() } });
    }
    setRenaming(false);
  };

  return (
    <View>
      <Pressable
        onPress={() => onSelectFolder(folder.id)}
        style={({ pressed, hovered }: any) => ({
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: Spacing.sm + depth * 16,
          paddingRight: Spacing.sm,
          paddingVertical: 6,
          borderRadius: Radius.sm,
          backgroundColor: isSelected ? `${colors.brandLavender}30` : hovered ? colors.surfaceCard : 'transparent',
          opacity: pressed ? 0.8 : 1,
          gap: Spacing.xs,
        })}
      >
        {/* Expand/collapse toggle */}
        {hasChildren ? (
          <Pressable onPress={() => setExpanded((v) => !v)} hitSlop={4}>
            {!isWeb ? (
              <Image
                source={`sf:${expanded ? 'chevron.down' : 'chevron.right'}`}
                style={{ width: 10, height: 10, tintColor: colors.muted }}
                contentFit="contain"
              />
            ) : (
              <Text style={{ color: colors.muted, fontSize: 10 }}>{expanded ? '▼' : '▶'}</Text>
            )}
          </Pressable>
        ) : (
          <View style={{ width: 10 }} />
        )}

        {/* Folder icon */}
        {!isWeb ? (
          <Image
            source={`sf:${isSelected ? 'folder.fill' : 'folder'}`}
            style={{ width: 15, height: 15, tintColor: isSelected ? colors.brandLavender : colors.muted }}
            contentFit="contain"
          />
        ) : (
          <Text style={{ fontSize: 13 }}>📁</Text>
        )}

        {/* Name or rename input */}
        {renaming ? (
          <TextInput
            value={renameValue}
            onChangeText={setRenameValue}
            onSubmitEditing={handleRename}
            onBlur={handleRename}
            autoFocus
            style={{ ...Typography.bodySm, color: colors.ink, flex: 1, padding: 0 }}
          />
        ) : (
          <Text
            style={{ ...Typography.bodySm, color: isSelected ? colors.brandLavender : colors.body, flex: 1 }}
            numberOfLines={1}
            onLongPress={() => { setRenameValue(folder.name); setRenaming(true); }}
          >
            {folder.name}
          </Text>
        )}

        {/* Delete button — show on hover/select */}
        {isSelected && !renaming && (
          <Pressable onPress={handleDelete} hitSlop={6}>
            {!isWeb ? (
              <Image source="sf:trash" style={{ width: 12, height: 12, tintColor: colors.error }} contentFit="contain" />
            ) : (
              <Text style={{ fontSize: 11 }}>🗑️</Text>
            )}
          </Pressable>
        )}
      </Pressable>

      {/* Children */}
      {expanded && hasChildren && (
        <View>
          {subfolders.map((child) => (
            <FolderNode
              key={child.id}
              folder={child}
              subfolders={allFolders.filter((f) => f.parent_id === child.id)}
              allFolders={allFolders}
              selectedFolderId={selectedFolderId}
              onSelectFolder={onSelectFolder}
              depth={depth + 1}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export function FolderTree({ selectedFolderId, onSelectFolder }: FolderTreeProps) {
  const { colors } = useTheme();
  const isWeb = Platform.OS === 'web';
  const { data: folders = [] } = useFolders();
  const { mutate: createFolder } = useCreateFolder();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const rootFolders = folders.filter((f) => f.parent_id === null);

  const handleCreate = (parentId?: string | null) => {
    if (newName.trim()) {
      createFolder({ name: newName.trim(), parent_id: parentId ?? null });
      setNewName('');
      setCreating(false);
    }
  };

  const rowStyle = (active: boolean) => ({
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    backgroundColor: active ? `${colors.brandLavender}30` : 'transparent',
    gap: Spacing.xs,
  });

  return (
    <View style={{ gap: 2 }}>
      {/* All Notes */}
      <Pressable
        onPress={() => onSelectFolder('all')}
        style={({ pressed, hovered }: any) => ({
          ...rowStyle(selectedFolderId === 'all'),
          backgroundColor: selectedFolderId === 'all'
            ? `${colors.brandLavender}30`
            : hovered ? colors.surfaceCard : 'transparent',
          opacity: pressed ? 0.8 : 1,
        })}
      >
        {!isWeb ? (
          <Image
            source="sf:tray.full"
            style={{ width: 15, height: 15, tintColor: selectedFolderId === 'all' ? colors.brandLavender : colors.muted }}
            contentFit="contain"
          />
        ) : (
          <Text style={{ fontSize: 13 }}>📋</Text>
        )}
        <Text style={{ ...Typography.bodySm, color: selectedFolderId === 'all' ? colors.brandLavender : colors.body }}>
          All Notes
        </Text>
      </Pressable>

      {/* Divider */}
      {folders.length > 0 && (
        <View style={{ height: 1, backgroundColor: colors.hairline, marginVertical: Spacing.xs }} />
      )}

      {/* Folder nodes */}
      {rootFolders.map((folder) => (
        <FolderNode
          key={folder.id}
          folder={folder}
          subfolders={folders.filter((f) => f.parent_id === folder.id)}
          allFolders={folders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={onSelectFolder}
          depth={0}
        />
      ))}

      {/* New folder input */}
      {creating ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.sm, gap: Spacing.xs }}>
          {!isWeb ? (
            <Image source="sf:folder.badge.plus" style={{ width: 15, height: 15, tintColor: colors.brandLavender }} contentFit="contain" />
          ) : (
            <Text style={{ fontSize: 13 }}>📁</Text>
          )}
          <TextInput
            value={newName}
            onChangeText={setNewName}
            placeholder="Folder name…"
            placeholderTextColor={colors.muted}
            onSubmitEditing={() => handleCreate()}
            onBlur={() => { if (!newName.trim()) setCreating(false); else handleCreate(); }}
            autoFocus
            style={{ ...Typography.bodySm, color: colors.ink, flex: 1, padding: 0, height: 28 }}
          />
        </View>
      ) : (
        <Pressable
          onPress={() => setCreating(true)}
          style={({ pressed, hovered }: any) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.xs,
            paddingHorizontal: Spacing.sm,
            paddingVertical: 6,
            opacity: pressed ? 0.6 : hovered ? 1 : 0.7,
          })}
        >
          {!isWeb ? (
            <Image source="sf:plus" style={{ width: 12, height: 12, tintColor: colors.muted }} contentFit="contain" />
          ) : (
            <Text style={{ fontSize: 11, color: colors.muted }}>+</Text>
          )}
          <Text style={{ ...Typography.caption, color: colors.muted }}>New Folder</Text>
        </Pressable>
      )}
    </View>
  );
}
