import { ScrollView, View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';
import { Avatar } from '@/components/ui/avatar';
import { PreferenceRow } from '@/features/settings/components/preference-row';
import { FadeIn } from '@/components/motion/fade-in';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

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
      <FadeIn index={0} style={{ paddingHorizontal: Spacing.md, paddingTop: Spacing.sm }}>
        <View style={{ backgroundColor: colors.surfaceCard, borderRadius: 12, borderCurve: 'continuous', borderWidth: 1, borderColor: colors.border, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <Avatar name={user?.name ?? 'User'} size={52} />
          <View style={{ flex: 1, gap: Spacing.xs }}>
            <Text style={{ ...Typography.headlineLgMobile, color: colors.ink }} selectable>{user?.name ?? '—'}</Text>
            <Text style={{ ...Typography.bodySm, color: colors.muted }} selectable>{user?.email ?? '—'}</Text>
          </View>
        </View>
      </FadeIn>

      {/* Preferences */}
      <FadeIn index={1} style={{ gap: Spacing.sm }}>
        <Text style={{ ...Typography.labelCaps, color: colors.muted, paddingHorizontal: Spacing.md, textTransform: 'uppercase' }}>Preferences</Text>
        <View style={{ marginHorizontal: Spacing.md, backgroundColor: colors.surfaceCard, borderRadius: 12, borderCurve: 'continuous', borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
          <PreferenceRow
            icon="moon.fill"
            iconColor={colors.brandLavender}
            label="Dark Mode"
            type="toggle"
            value={darkMode}
            onValueChange={setDarkMode}
          />
          <View style={{ height: 1, backgroundColor: colors.border }} />
          <PreferenceRow
            icon="bell.fill"
            iconColor={colors.brandOchre}
            label="Notifications"
            type="toggle"
            value={notifications}
            onValueChange={setNotifications}
          />
          <View style={{ height: 1, backgroundColor: colors.border }} />
          <PreferenceRow
            icon="arrow.triangle.2.circlepath"
            iconColor={colors.brandPink}
            label="Clipboard Auto Sync"
            subtitle="Sync on app open"
            type="toggle"
            value={clipboardAutoSync}
            onValueChange={setClipboardAutoSync}
          />
        </View>
      </FadeIn>

      {/* Account */}
      <FadeIn index={2} style={{ gap: Spacing.sm }}>
        <Text style={{ ...Typography.labelCaps, color: colors.muted, paddingHorizontal: Spacing.md, textTransform: 'uppercase' }}>Account</Text>
        <View style={{ marginHorizontal: Spacing.md, backgroundColor: colors.surfaceCard, borderRadius: 12, borderCurve: 'continuous', borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
          <PreferenceRow
            icon="rectangle.portrait.and.arrow.right"
            iconColor={colors.error}
            label="Sign out"
            type="destructive"
            onPress={handleLogout}
          />
        </View>
      </FadeIn>
    </ScrollView>
  );
}
