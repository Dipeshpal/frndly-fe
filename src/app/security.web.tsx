import { View, Text, StyleSheet } from 'react-native';
import { LandingShell, C, T, s } from '@/components/web/landing-shell';

const PILLARS = [
  { icon: '🔑', title: 'Zero-Knowledge Architecture', color: C.violet },
  { icon: '🔐', title: 'AES-256 Encryption', color: C.blue },
  { icon: '🛡️', title: 'Secure Key Derivation', color: C.emerald },
  { icon: '🌐', title: 'Encrypted Transit', color: C.blueDim },
];

const SECTIONS = [
  {
    title: 'Zero-Knowledge Design',
    body: `Frndly is built on a strict zero-knowledge architecture. Your master password never leaves your device. We derive a 256-bit encryption key locally using PBKDF2-HMAC-SHA256 with 310,000 iterations and a unique per-user salt. This key is used to encrypt all your data before it is ever transmitted.\n\nOur servers store only ciphertext. Even with full access to our database, neither Frndly employees nor any third party can read your stored data. This is not a policy promise, it is a cryptographic guarantee.`,
  },
  {
    title: 'Encryption Standards',
    body: `All vault entries, notes, and clipboard history are encrypted using AES-256-GCM, an authenticated encryption mode that provides both confidentiality and integrity. Each encrypted item uses a unique 96-bit random IV to prevent ciphertext reuse attacks.\n\nData in transit is protected using TLS 1.3, the current industry gold standard for transport security. We enforce HSTS and reject connections on older protocol versions.`,
  },
  {
    title: 'Key Derivation',
    body: `Your master password is processed through PBKDF2-HMAC-SHA256 with a unique per-account salt and 310,000 iterations, exceeding OWASP recommended minimums by a significant margin. This makes brute-force attacks computationally prohibitive even with specialized hardware.\n\nThe derived key is used to encrypt a randomly generated account encryption key (AEK). The AEK in turn encrypts your data. This layered approach allows password changes without re-encrypting all your data.`,
  },
  {
    title: 'Authentication Security',
    body: `Frndly uses a split-key authentication model. A second key derived from your master password (distinct from the encryption key) is used to authenticate you with our servers. This means your encryption key is never sent during login.\n\nAll sessions are bound to short-lived JWTs with automatic rotation. Suspicious logins from new locations trigger immediate notification alerts. We support two-factor authentication via TOTP authenticator apps.`,
  },
  {
    title: 'Infrastructure',
    body: `Frndly infrastructure runs in isolated environments with least-privilege access controls. All internal service communication is mutually authenticated using TLS. Database access is restricted to application service accounts with no direct internet exposure.\n\nWe perform automated dependency scanning, static analysis, and regular penetration testing. Our incident response plan ensures a maximum 72-hour breach notification window.`,
  },
  {
    title: 'Responsible Disclosure',
    body: `We take security reports seriously. If you discover a vulnerability in Frndly, please report it responsibly. We commit to acknowledging all valid reports within 48 hours and providing a resolution timeline within 7 days.\n\nWe do not pursue legal action against good-faith security researchers who follow responsible disclosure practices.`,
  },
];

export default function SecurityPage() {
  return (
    <LandingShell>
      <View style={[s.section, { paddingVertical: 80 }]}>
        <View style={[s.chip, { backgroundColor: C.emerald + '18', borderWidth: 1, borderColor: C.emerald + '40', marginBottom: 24 }]}>
          <Text style={[T.caps, { color: C.emerald }]}>SECURITY WHITEPAPER</Text>
        </View>
        <Text style={[T.display, { color: C.text, maxWidth: 700 }]}>How Frndly Protects Your Data</Text>
        <Text style={[T.body, { color: C.textMuted, marginTop: 16, maxWidth: 600 }]}>
          A technical overview of the cryptographic architecture and security practices that ensure only you can access your data.
        </Text>
        <Text style={[T.caps, { color: C.textDim, marginTop: 8 }]}>June 2026</Text>

        {/* Security pillars */}
        <View style={styles.pillars}>
          {PILLARS.map((p) => (
            <View key={p.title} style={[styles.pillar, { borderTopWidth: 2, borderTopColor: p.color }]}>
              <Text style={{ fontSize: 28 }}>{p.icon}</Text>
              <Text style={[T.sm, { color: C.text, fontWeight: '600', marginTop: 12 }]}>{p.title}</Text>
            </View>
          ))}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {SECTIONS.map((sec, i) => (
            <View key={i} style={styles.secBlock}>
              <View style={styles.stepNum}>
                <Text style={[T.caps, { color: C.emerald }]}>0{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[T.h3, { color: C.text }]}>{sec.title}</Text>
                <Text style={[T.body, { color: C.textMuted, marginTop: 12, lineHeight: 28 }]}>{sec.body}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom note */}
        <View style={[styles.note]}>
          <Text style={[T.caps, { color: C.emerald, marginBottom: 8 }]}>SECURITY CONTACT</Text>
          <Text style={[T.body, { color: C.textMuted }]}>
            Found a vulnerability? Report it responsibly and we will acknowledge within 48 hours.
          </Text>
        </View>
      </View>
    </LandingShell>
  );
}

const styles = StyleSheet.create({
  pillars: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 48,
    flexWrap: 'wrap',
  },
  pillar: {
    flex: 1,
    minWidth: 160,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 20,
  },
  content: {
    marginTop: 64,
    maxWidth: 720,
    gap: 0,
  },
  secBlock: {
    flexDirection: 'row',
    gap: 24,
    paddingVertical: 36,
    borderBottomWidth: 1,
    borderColor: C.border,
  },
  stepNum: {
    width: 32,
    paddingTop: 4,
  },
  note: {
    marginTop: 56,
    maxWidth: 720,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.emerald + '40',
    borderRadius: 12,
    padding: 24,
  },
});
