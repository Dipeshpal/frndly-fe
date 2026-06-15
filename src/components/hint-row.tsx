import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { Spacing } from '@/theme/spacing';

type HintRowProps = { title?: string; hint?: ReactNode };

export function HintRow({ title = 'Try editing', hint = 'app/index.tsx' }: HintRowProps) {
  return (
    <View style={styles.stepRow}>
      <ThemedText type="small">{title}</ThemedText>
      <ThemedView type="backgroundElement" style={styles.codeSnippet}>
        <ThemedText type="small">{hint}</ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  stepRow: { flexDirection: 'row', justifyContent: 'space-between' },
  codeSnippet: { borderRadius: Spacing.xs, paddingVertical: Spacing.xxs, paddingHorizontal: Spacing.xs },
});
