import { ScrollView, View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { PreferenceRow } from '@/features/settings/components/preference-row';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { darkMode, notifications, clipboardAutoSync, setDarkMode, setNotifications, setClipboardAutoSync } = useSettingsStore();

  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ gap: Spacing.lg, paddingBottom: Spacing.xxl }}
    >
      {/* Profile Card */}
      <View style={{ paddingHorizontal: Spacing.md, paddingTop: Spacing.sm }}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
            <Avatar name={user?.name ?? 'User'} size={52} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ ...Typography.titleMd, color: colors.ink }} selectable>{user?.name ?? '—'}</Text>
              <Text style={{ ...Typography.bodySm, color: colors.muted }} selectable>{user?.email ?? '—'}</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Preferences */}
      <View style={{ gap: Spacing.xs }}>
        <Text style={{ ...Typography.captionUppercase, color: colors.muted, paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxs }}>
          PREFERENCES
        </Text>
        <Card style={{ marginHorizontal: Spacing.md, padding: 0, overflow: 'hidden' }}>
          <PreferenceRow
            icon="moon.fill"
            iconColor={colors.brandLavender}
            label="Dark Mode"
            type="toggle"
            value={darkMode}
            onValueChange={setDarkMode}
          />
          <View style={{ height: 1, backgroundColor: colors.hairlineSoft, marginLeft: Spacing.md }} />
          <PreferenceRow
            icon="bell.fill"
            iconColor={colors.brandOchre}
            label="Notifications"
            type="toggle"
            value={notifications}
            onValueChange={setNotifications}
          />
          <View style={{ height: 1, backgroundColor: colors.hairlineSoft, marginLeft: Spacing.md }} />
          <PreferenceRow
            icon="arrow.triangle.2.circlepath"
            iconColor={colors.brandPink}
            label="Clipboard Auto Sync"
            subtitle="Automatically sync clipboard on app open"
            type="toggle"
            value={clipboardAutoSync}
            onValueChange={setClipboardAutoSync}
          />
        </Card>
      </View>

      {/* Security */}
      <View style={{ gap: Spacing.xs }}>
        <Text style={{ ...Typography.captionUppercase, color: colors.muted, paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxs }}>
          SECURITY
        </Text>
        <Card style={{ marginHorizontal: Spacing.md, padding: 0, overflow: 'hidden' }}>
          <PreferenceRow
            icon="lock.fill"
            iconColor={colors.brandTeal}
            label="Change Password"
            onPress={() => {}}
          />
        </Card>
      </View>

      {/* App Info */}
      <View style={{ gap: Spacing.xs }}>
        <Text style={{ ...Typography.captionUppercase, color: colors.muted, paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxs }}>
          APP
        </Text>
        <Card style={{ marginHorizontal: Spacing.md, padding: 0, overflow: 'hidden' }}>
          <PreferenceRow icon="doc.text" iconColor={colors.muted} label="Terms of Service" onPress={() => {}} />
          <View style={{ height: 1, backgroundColor: colors.hairlineSoft, marginLeft: Spacing.md }} />
          <PreferenceRow icon="hand.raised.fill" iconColor={colors.muted} label="Privacy Policy" onPress={() => {}} />
          <View style={{ height: 1, backgroundColor: colors.hairlineSoft, marginLeft: Spacing.md }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm }}>
            <Text style={{ ...Typography.bodyMd, color: colors.muted, flex: 1 }}>Version</Text>
            <Text style={{ ...Typography.bodySm, color: colors.mutedSoft }}>{APP_VERSION}</Text>
          </View>
        </Card>
      </View>

      {/* Account */}
      <View style={{ gap: Spacing.xs }}>
        <Text style={{ ...Typography.captionUppercase, color: colors.muted, paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxs }}>
          ACCOUNT
        </Text>
        <Card style={{ marginHorizontal: Spacing.md, padding: 0, overflow: 'hidden' }}>
          <PreferenceRow
            icon="rectangle.portrait.and.arrow.right"
            iconColor={colors.error}
            label="Sign out"
            type="destructive"
            onPress={handleLogout}
          />
        </Card>
      </View>
    </ScrollView>
  );
}
