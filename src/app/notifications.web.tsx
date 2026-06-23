import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LandingShell, C, T, s } from '@/components/web/landing-shell';

const FEATURES = [
  { icon: '🔔', title: 'Smart Alerts', desc: 'Set threshold-based triggers on any data point,device disconnect, clipboard surge, vault access from new location.' },
  { icon: '📱', title: 'Push to Any Device', desc: 'Native push notifications on iOS and Android. Desktop toasts on Windows and macOS. Zero setup required.' },
  { icon: '🔕', title: 'Focus Modes', desc: 'Schedule quiet hours, snooze by category, or mute entire notification channels without losing history.' },
  { icon: '📊', title: 'Alert Analytics', desc: 'See which alerts fire most, response time trends, and false-positive rates. Tune your rules over time.' },
  { icon: '🌐', title: 'Webhook Support', desc: 'Forward any alert to Slack, Discord, PagerDuty, or your own endpoint via configurable webhooks.' },
  { icon: '🔍', title: 'Full Alert History', desc: '90-day searchable alert log with read/unread state synced across all devices. Never lose context.' },
];

const MOCK_ALERTS = [
  { icon: '🔐', title: 'New vault access', desc: 'Logged in from London, UK', time: '30s ago', level: 'warn', color: C.violet },
  { icon: '📋', title: 'Clipboard synced', desc: '3 items pushed to iPhone 16', time: '2m ago', level: 'info', color: C.blue },
  { icon: '✅', title: 'Device connected', desc: 'Windows PC joined your network', time: '5m ago', level: 'ok', color: C.emerald },
  { icon: '⚠️', title: 'Breach detected', desc: 'email@example.com found in leak', time: '1h ago', level: 'error', color: '#ffb4ab' },
];

export default function NotificationsPage() {
  const router = useRouter();
  const goSignup = () => router.push('/(auth)/signup');

  return (
    <LandingShell>
      {/* Hero */}
      <View style={[s.section, { paddingVertical: 96, flexDirection: 'row', gap: 60, alignItems: 'center' }]}>
        <View style={{ flex: 1 }}>
          <View style={[s.chip, { backgroundColor: '#ffb4ab' + '22', borderWidth: 1, borderColor: '#ffb4ab' + '40', marginBottom: 24 }]}>
            <Text style={{ fontSize: 14 }}>🔔</Text>
            <Text style={[T.caps, { color: '#ffb4ab' }]}>REAL-TIME ALERTS</Text>
          </View>
          <Text style={[T.display, { color: C.text }]}>
            {'Stay '}
            <Text style={{ color: '#ffb4ab' }}>Ahead</Text>
            {'\nof Everything.'}
          </Text>
          <Text style={[T.body, { color: C.textMuted, marginTop: 20, maxWidth: 460 }]}>
            Know the moment something happens across your entire digital ecosystem,breach alerts, device events, vault access, and clipboard activity.
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 36 }}>
            <Pressable onPress={goSignup} style={[s.btnPrimaryLg, { backgroundColor: '#93000a' }]}>
              <Text style={[T.body, { color: '#ffb4ab', fontWeight: '600' }]}>Enable Alerts Free</Text>
            </Pressable>
          </View>
        </View>

        {/* Mock alert feed */}
        <View style={styles.mockFeed}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={[T.caps, { color: C.textDim }]}>ALERT FEED</Text>
            <View style={styles.liveBadge}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#ffb4ab' }} />
              <Text style={[T.caps, { color: '#ffb4ab' }]}>LIVE</Text>
            </View>
          </View>
          {MOCK_ALERTS.map((alert, i) => (
            <View key={i} style={[styles.alertItem, { borderLeftWidth: 3, borderLeftColor: alert.color }]}>
              <Text style={{ fontSize: 18 }}>{alert.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[T.sm, { color: C.text, fontWeight: '600' }]}>{alert.title}</Text>
                <Text style={[T.caps, { color: C.textDim, marginTop: 2 }]}>{alert.desc}</Text>
              </View>
              <Text style={[T.caps, { color: C.textDim }]}>{alert.time}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stats */}
      <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.border }}>
        <View style={[s.section, { paddingVertical: 0 }]}>
          <View style={{ flexDirection: 'row' }}>
            {[
              { value: '<2s', label: 'ALERT DELIVERY TIME', color: '#ffb4ab' },
              { value: '90d', label: 'ALERT HISTORY', color: C.blue },
              { value: '∞', label: 'ALERT RULES', color: C.emerald },
            ].map((st, i, arr) => (
              <View key={i} style={[styles.statItem, i < arr.length - 1 && { borderRightWidth: 1, borderColor: C.border }]}>
                <Text style={[T.display, { color: st.color, fontSize: 36 }]}>{st.value}</Text>
                <Text style={[T.caps, { color: C.textDim, marginTop: 8 }]}>{st.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Features */}
      <View style={s.section}>
        <Text style={[T.h2, { color: C.text }]}>Never Miss What Matters</Text>
        <Text style={[T.body, { color: C.textMuted, marginTop: 12, maxWidth: 520 }]}>
          From critical security events to routine sync confirmations, Frndly Notifications keeps you informed without drowning you in noise.
        </Text>
        <View style={s.featureGrid}>
          {FEATURES.map((f) => (
            <View key={f.title} style={s.featureCard}>
              <View style={[s.featureIconWrap, { backgroundColor: '#ffb4ab' + '18' }]}>
                <Text style={{ fontSize: 24 }}>{f.icon}</Text>
              </View>
              <Text style={[T.h3, { color: C.text, marginTop: 16 }]}>{f.title}</Text>
              <Text style={[T.sm, { color: C.textMuted, marginTop: 8, lineHeight: 22 }]}>{f.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Alert types */}
      <View style={{ backgroundColor: C.surface, borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.border }}>
        <View style={s.section}>
          <Text style={[T.h2, { color: C.text, textAlign: 'center' }]}>Every Alert Type, Covered</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 40, justifyContent: 'center' }}>
            {[
              { label: 'Security Breach', color: '#ffb4ab' },
              { label: 'Device Connect', color: C.emerald },
              { label: 'Vault Access', color: C.violet },
              { label: 'Clipboard Sync', color: C.blue },
              { label: 'Note Shared', color: C.emerald },
              { label: 'Login Attempt', color: '#ffb4ab' },
              { label: 'Sync Error', color: '#febc2e' },
              { label: 'Storage Limit', color: '#febc2e' },
            ].map((tag) => (
              <View key={tag.label} style={[styles.alertTag, { backgroundColor: tag.color + '18', borderColor: tag.color + '40' }]}>
                <Text style={[T.sm, { color: tag.color, fontWeight: '600' }]}>{tag.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* CTA */}
      <View style={s.section}>
        <View style={[s.ctaBanner, { backgroundColor: '#93000a' + 'dd', borderColor: '#ffb4ab' + '30' }]}>
          <Text style={[T.h1, { color: '#fff', textAlign: 'center' }]}>Zero Notifications Missed.</Text>
          <Text style={[T.body, { color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: 12, maxWidth: 420 }]}>
            Set up intelligent alerts across your entire ecosystem in minutes. Free tier includes unlimited alert rules.
          </Text>
          <Pressable onPress={goSignup} style={[s.btnPrimaryLg, { marginTop: 28, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }]}>
            <Text style={[T.body, { color: '#fff', fontWeight: '600' }]}>Set Up My Alerts</Text>
          </Pressable>
        </View>
      </View>
    </LandingShell>
  );
}

const styles = StyleSheet.create({
  mockFeed: {
    width: 380,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 24,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffb4ab' + '18',
    borderWidth: 1,
    borderColor: '#ffb4ab' + '40',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.surfaceHigh,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  alertTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
});
