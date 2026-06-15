import { Tabs, TabList, TabTrigger, TabSlot, TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, View, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { Spacing } from '@/theme/spacing';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <View style={styles.tabListContainer}>
          <ThemedView style={styles.innerContainer}>
            <TabTrigger name="dashboard" href="/(tabs)/(dashboard)" asChild>
              <WebTabButton>Home</WebTabButton>
            </TabTrigger>
            <TabTrigger name="clipboard" href="/(tabs)/(clipboard)" asChild>
              <WebTabButton>Clipboard</WebTabButton>
            </TabTrigger>
            <TabTrigger name="vault" href="/(tabs)/(vault)" asChild>
              <WebTabButton>Vault</WebTabButton>
            </TabTrigger>
            <TabTrigger name="settings" href="/(tabs)/(settings)" asChild>
              <WebTabButton>Settings</WebTabButton>
            </TabTrigger>
          </ThemedView>
        </View>
      </TabList>
    </Tabs>
  );
}

export function WebTabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
      <ThemedView type={isFocused ? 'backgroundElement' : undefined} style={styles.tabButton}>
        <ThemedText type={isFocused ? 'default' : 'small'}>{children}</ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    padding: Spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.xxl,
  },
  tabButton: {
    paddingVertical: Spacing.xxs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Spacing.sm,
  },
});
