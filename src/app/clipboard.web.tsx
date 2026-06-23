import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LandingShell, C, T, s, useIsMobile, useSection } from '@/components/web/landing-shell';

const FEATURES = [
  { icon: '⚡', title: 'Instant Push', desc: 'Copy on one device, paste on another in under a second. No manual steps, no cloud delays.' },
  { icon: '📜', title: 'Full History', desc: '30 days of clipboard history synced across all connected devices. Search, filter, and restore any past entry.' },
  { icon: '💻', title: 'Code Snippets', desc: 'Syntax-highlighted code blocks preserved on paste. Your snippets arrive exactly as you copied them.' },
  { icon: '📌', title: 'Pin & Star', desc: 'Pin frequently used snippets to the top. Star templates to reuse commands, boilerplate, or frequent pastes.' },
  { icon: '🔒', title: 'Encrypted Transit', desc: 'Every clipboard item is encrypted end-to-end. Not even Frndly servers can read what you copy.' },
];

const MOCK_ITEMS = [
  { type: 'code', content: 'npm install @frndly/sdk --save', time: '2s ago' },
  { type: 'link', content: 'https://docs.frndly.app/clipboard', time: '4m ago' },
  { type: 'text', content: 'Meeting notes: sync at 3pm EST on Friday...', time: '12m ago' },
];

const CLIP_STATS = [
  { value: '<1s', label: 'SYNC LATENCY', color: C.blue },
  { value: '30d', label: 'HISTORY RETENTION', color: C.violet },
  { value: '∞', label: 'CONNECTED DEVICES', color: C.emerald },
];

export default function ClipboardPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const sec = useSection();
  const goSignup = () => router.push('/(auth)/signup');

  return (
    <LandingShell>
      {/* Hero */}
      <View style={[sec, {
        paddingVertical: isMobile ? 48 : 96,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 32 : 60,
        alignItems: isMobile ? 'flex-start' : 'center',
      }]}>
        <View style={{ flex: isMobile ? undefined : 1 }}>
          <View style={[s.chip, { backgroundColor: C.blue + '18', borderWidth: 1, borderColor: C.blue + '40', marginBottom: 24 }]}>
            <Text style={{ fontSize: 14 }}>📋</Text>
            <Text style={[T.caps, { color: C.blue }]}>INSTANT CROSS-DEVICE SYNC</Text>
          </View>
          <Text style={[T.display, { color: C.text, fontSize: isMobile ? 32 : 52, lineHeight: isMobile ? 40 : 60 }]}>
            {'Copy Once,\nPaste '}
            <Text style={{ color: C.blue }}>Anywhere.</Text>
          </Text>
          <Text style={[T.body, { color: C.textMuted, marginTop: 20, maxWidth: isMobile ? undefined : 460 }]}>
            Stop emailing yourself links and screenshots. Frndly Clipboard pushes anything you copy to every device you own, instantly and securely.
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 36 }}>
            <Pressable onPress={goSignup} style={[s.btnPrimaryLg, isMobile && { flex: 1, alignItems: 'center' }]}>
              <Text style={[T.body, { color: '#fff', fontWeight: '600' }]}>Try Clipboard Free</Text>
            </Pressable>
          </View>
        </View>

        {!isMobile && (
          <View style={styles.mockPanel}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={[T.caps, { color: C.textDim }]}>CLIPBOARD HISTORY</Text>
              <View style={styles.liveBadge}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.emerald }} />
                <Text style={[T.caps, { color: C.emerald }]}>LIVE</Text>
              </View>
            </View>
            {MOCK_ITEMS.map((item, i) => (
              <View key={i} style={styles.mockItem}>
                <View style={[styles.typeTag, { backgroundColor: item.type === 'code' ? C.violet + '22' : item.type === 'link' ? C.emerald + '22' : C.blue + '22' }]}>
                  <Text style={[T.caps, { color: item.type === 'code' ? C.violet : item.type === 'link' ? C.emerald : C.blue }]}>{item.type.toUpperCase()}</Text>
                </View>
                <Text style={[T.sm, { color: C.text, flex: 1 }]} numberOfLines={1}>{item.content}</Text>
                <Text style={[T.caps, { color: C.textDim }]}>{item.time}</Text>
              </View>
            ))}
            <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: C.border, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[T.caps, { color: C.textDim }]}>3 DEVICES CONNECTED</Text>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                {[C.emerald, C.emerald, C.emerald].map((c, i) => (
                  <View key={i} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c }} />
                ))}
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Stats */}
      <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.border }}>
        <View style={[sec, { paddingVertical: 0 }]}>
          <View style={{ flexDirection: isMobile ? 'column' : 'row' }}>
            {CLIP_STATS.map((st, i, arr) => (
              <View key={i} style={[
                styles.statItem,
                !isMobile && i < arr.length - 1 && { borderRightWidth: 1, borderColor: C.border },
                isMobile && i < arr.length - 1 && { borderBottomWidth: 1, borderColor: C.border },
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
        <Text style={[T.h2, { color: C.text }]}>Built for How You Actually Work</Text>
        <Text style={[T.body, { color: C.textMuted, marginTop: 12, maxWidth: isMobile ? undefined : 520 }]}>
          Developers, writers, and power users all copy things constantly. Frndly Clipboard makes that flow frictionless across every device.
        </Text>
        <View style={s.featureGrid}>
          {FEATURES.map((f) => (
            <View key={f.title} style={s.featureCard}>
              <View style={s.featureIconWrap}>
                <Text style={{ fontSize: 24 }}>{f.icon}</Text>
              </View>
              <Text style={[T.h3, { color: C.text, marginTop: 16 }]}>{f.title}</Text>
              <Text style={[T.sm, { color: C.textMuted, marginTop: 8, lineHeight: 22 }]}>{f.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA */}
      <View style={sec}>
        <View style={[s.ctaBanner, { backgroundColor: C.blue + 'cc', borderColor: C.blue + '60', padding: isMobile ? 32 : 60 }]}>
          <Text style={[T.h1, { color: '#fff', textAlign: 'center', fontSize: isMobile ? 28 : 40 }]}>Stop Emailing Yourself.</Text>
          <Text style={[T.body, { color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: 12, maxWidth: 400 }]}>
            Connect your devices in under 60 seconds. Free for up to 5 devices with unlimited clipboard history.
          </Text>
          <Pressable onPress={goSignup} style={[s.btnPrimaryLg, { marginTop: 28, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }]}>
            <Text style={[T.body, { color: '#fff', fontWeight: '600' }]}>Connect My Devices</Text>
          </Pressable>
        </View>
      </View>
    </LandingShell>
  );
}

const styles = StyleSheet.create({
  mockPanel: {
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
    backgroundColor: C.emerald + '18',
    borderWidth: 1,
    borderColor: C.emerald + '40',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  mockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.surfaceHigh,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
});
