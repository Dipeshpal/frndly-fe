import { View, Text, StyleSheet } from 'react-native';
import { LandingShell, C, T, s } from '@/components/web/landing-shell';

const SECTIONS = [
  {
    title: 'Information We Collect',
    body: `We collect only what is necessary to provide the Frndly service. This includes your email address and hashed password at registration, device identifiers for sync purposes, and encrypted blobs of your vault, clipboard, and notes data.\n\nWe do not collect plaintext content. All user data is encrypted client-side before transmission. We have no technical ability to read your vault entries, notes, or clipboard history.`,
  },
  {
    title: 'How We Use Your Information',
    body: `Your email is used solely for account authentication, password recovery, and optional product updates you can unsubscribe from at any time.\n\nDevice identifiers are used to route encrypted sync payloads between your connected nodes. No personal data is shared with third parties for advertising or analytics purposes.`,
  },
  {
    title: 'Data Storage and Security',
    body: `All data transmitted to Frndly servers is encrypted in transit using TLS 1.3 and at rest using AES-256. Vault and notes content is additionally encrypted client-side with keys derived from your master password using PBKDF2 (310,000 iterations).\n\nYour master password is never transmitted to or stored on our servers. If you lose it, we cannot recover your encrypted data.`,
  },
  {
    title: 'Data Retention',
    body: `Active account data is retained for the lifetime of your account. Clipboard history is retained for 30 days by default and can be cleared at any time. Alert history is retained for 90 days.\n\nUpon account deletion, all server-side data is permanently purged within 30 days. This action is irreversible.`,
  },
  {
    title: 'Third-Party Services',
    body: `Frndly uses minimal third-party infrastructure. We use cloud hosting providers operating under strict data processing agreements. We do not use advertising networks, social media trackers, or behavioral analytics platforms.\n\nGoogle Sign-In is available as an optional authentication method. If used, Google's privacy policy applies to that authentication flow only.`,
  },
  {
    title: 'Your Rights',
    body: `You have the right to access, export, correct, or delete your personal data at any time from your account settings. You may also request a full data export or permanent account deletion by contacting us.\n\nResidents of the EU/EEA have additional rights under GDPR including the right to data portability and the right to object to processing.`,
  },
  {
    title: 'Changes to This Policy',
    body: `We will notify you of material changes to this policy via email at least 30 days before they take effect. Continued use of Frndly after that date constitutes acceptance of the updated policy.\n\nThis policy was last updated on June 2026.`,
  },
];

export default function PrivacyPage() {
  return (
    <LandingShell>
      <View style={[s.section, { paddingVertical: 80 }]}>
        <View style={[s.chip, { backgroundColor: C.blue + '18', borderWidth: 1, borderColor: C.blue + '40', marginBottom: 24 }]}>
          <Text style={[T.caps, { color: C.blue }]}>LEGAL</Text>
        </View>
        <Text style={[T.display, { color: C.text, maxWidth: 700 }]}>Privacy Policy</Text>
        <Text style={[T.body, { color: C.textMuted, marginTop: 16, maxWidth: 600 }]}>
          Frndly is built on a foundation of trust. This policy explains exactly what data we collect, how we use it, and the rights you have over it.
        </Text>
        <Text style={[T.caps, { color: C.textDim, marginTop: 8 }]}>Last updated: June 2026</Text>

        <View style={styles.content}>
          {SECTIONS.map((sec, i) => (
            <View key={i} style={styles.section}>
              <Text style={[T.h3, { color: C.text }]}>{sec.title}</Text>
              <Text style={[T.body, { color: C.textMuted, marginTop: 12, lineHeight: 28 }]}>{sec.body}</Text>
            </View>
          ))}
        </View>
      </View>
    </LandingShell>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: 56,
    maxWidth: 720,
    gap: 0,
  },
  section: {
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderColor: C.border,
  },
});
