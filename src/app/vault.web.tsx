import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LandingShell, C, T, s, useIsMobile, useSection } from '@/components/web/landing-shell';

const FEATURES = [
  { icon: '🔑', title: 'API Keys & Credentials', desc: 'Store production secrets, API tokens, and service credentials with field-level encryption. Never expose keys in plaintext again.' },
  { icon: '🗝️', title: 'Password Manager', desc: 'Generate, store, and auto-fill strong passwords. Your master key never leaves your device, zero-knowledge by design.' },
  { icon: '🔗', title: 'Shareable Secrets', desc: 'Create time-limited, view-once share links for credentials. Perfect for handing off access to teammates securely.' },
  { icon: '🏷️', title: 'Folders & Tags', desc: 'Organize by project, client, or category. Nested folders and color-coded tags keep large vaults navigable.' },
  { icon: '🕵️', title: 'Breach Monitoring', desc: 'Continuous dark-web scanning alerts you when any stored credential appears in known data breaches.' },
];

const STATS = [
  { value: 'AES-256', label: 'ENCRYPTION STANDARD', color: C.blue },
  { value: '0', label: 'PLAINTEXT STORED SERVER-SIDE', color: C.emerald },
  { value: '∞', label: 'VAULT ENTRIES', color: C.violet },
];

export default function VaultPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const sec = useSection();
  const goSignup = () => router.push('/(auth)/signup');

  return (
    <LandingShell>
      {/* Hero */}
      <View style={[sec, { paddingVertical: isMobile ? 48 : 96 }]}>
        <View style={[s.chip, { backgroundColor: C.violet + '18', borderWidth: 1, borderColor: C.violet + '40', marginBottom: 24 }]}>
          <Text style={{ fontSize: 14 }}>🔐</Text>
          <Text style={[T.caps, { color: C.violet }]}>ZERO-KNOWLEDGE VAULT</Text>
        </View>
        <Text style={[T.display, { color: C.text, maxWidth: 700, fontSize: isMobile ? 32 : 52, lineHeight: isMobile ? 40 : 60 }]}>
          {'Your Secrets, Locked Behind\n'}
          <Text style={{ color: C.violet }}>Unbreakable</Text>
          {' Encryption.'}
        </Text>
        <Text style={[T.body, { color: C.textMuted, marginTop: 20, maxWidth: isMobile ? undefined : 560 }]}>
          Store every password, API key, certificate, and sensitive file in a zero-knowledge vault. Only you hold the keys, literally.
        </Text>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 36 }}>
          <Pressable onPress={goSignup} style={[s.btnPrimaryLg, { backgroundColor: C.violetDim }, isMobile && { flex: 1, alignItems: 'center' }]}>
            <Text style={[T.body, { color: '#fff', fontWeight: '600' }]}>Start Free Vault</Text>
          </Pressable>
        </View>
      </View>

      {/* Stats */}
      <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.border }}>
        <View style={[sec, { paddingVertical: 0 }]}>
          <View style={{ flexDirection: isMobile ? 'column' : 'row' }}>
            {STATS.map((st, i) => (
              <View key={i} style={[
                styles.statItem,
                !isMobile && i < STATS.length - 1 && { borderRightWidth: 1, borderColor: C.border },
                isMobile && i < STATS.length - 1 && { borderBottomWidth: 1, borderColor: C.border },
              ]}>
                <Text style={[T.display, { color: st.color, fontSize: isMobile ? 28 : 36 }]}>{st.value}</Text>
                <Text style={[T.caps, { color: C.textDim, marginTop: 8 }]}>{st.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Features */}
      <View style={sec}>
        <Text style={[T.h2, { color: C.text }]}>Everything in One Fortified Place</Text>
        <Text style={[T.body, { color: C.textMuted, marginTop: 12, maxWidth: isMobile ? undefined : 520 }]}>
          From solo developers to enterprise teams, Frndly Vault scales to protect every credential in your ecosystem.
        </Text>
        <View style={s.featureGrid}>
          {FEATURES.map((f) => (
            <View key={f.title} style={s.featureCard}>
              <View style={[s.featureIconWrap, { backgroundColor: C.violetDim + '22' }]}>
                <Text style={{ fontSize: 24 }}>{f.icon}</Text>
              </View>
              <Text style={[T.h3, { color: C.text, marginTop: 16 }]}>{f.title}</Text>
              <Text style={[T.sm, { color: C.textMuted, marginTop: 8, lineHeight: 22 }]}>{f.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* How it works */}
      <View style={{ backgroundColor: C.surface, borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.border }}>
        <View style={sec}>
          <Text style={[T.h2, { color: C.text, textAlign: 'center' }]}>Zero-Knowledge Architecture</Text>
          <Text style={[T.body, { color: C.textMuted, textAlign: 'center', marginTop: 12, maxWidth: 560, alignSelf: 'center' }]}>
            Your master password never leaves your device. We use PBKDF2 with 310,000 iterations to derive encryption keys locally before any data is transmitted.
          </Text>
          <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 16 : 20, marginTop: 48 }}>
            {[
              { step: '01', title: 'You set a master password', desc: 'Derives a 256-bit key locally using PBKDF2. Never sent to our servers.' },
              { step: '02', title: 'Data encrypted on-device', desc: 'Every field is encrypted with AES-256-GCM before leaving your browser or app.' },
              { step: '03', title: 'Ciphertext synced to cloud', desc: 'We store only encrypted blobs. Even our engineers cannot read your data.' },
            ].map((item) => (
              <View key={item.step} style={[s.featureCard, { flex: 1 }]}>
                <Text style={[T.display, { color: C.violet + '60', fontSize: 32 }]}>{item.step}</Text>
                <Text style={[T.h3, { color: C.text, marginTop: 12 }]}>{item.title}</Text>
                <Text style={[T.sm, { color: C.textMuted, marginTop: 8, lineHeight: 22 }]}>{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* CTA */}
      <View style={sec}>
        <View style={[s.ctaBanner, { backgroundColor: C.violetDim + 'cc', borderColor: C.violet + '40', padding: isMobile ? 32 : 60 }]}>
          <Text style={[T.h1, { color: '#fff', textAlign: 'center', fontSize: isMobile ? 28 : 40 }]}>Your Vault Awaits.</Text>
          <Text style={[T.body, { color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: 12, maxWidth: 400 }]}>
            Start with unlimited vault entries, breach monitoring, and cross-device sync, free forever.
          </Text>
          <Pressable onPress={goSignup} style={[s.btnPrimaryLg, { marginTop: 28, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }]}>
            <Text style={[T.body, { color: '#fff', fontWeight: '600' }]}>Create Free Vault</Text>
          </Pressable>
        </View>
      </View>
    </LandingShell>
  );
}

const styles = StyleSheet.create({
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
});
