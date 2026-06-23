import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LandingShell, C, T, s, useIsMobile, useSection } from '@/components/web/landing-shell';

const FEATURES = [
  { icon: '✍️', title: 'Rich Text Editor', desc: 'Headers, bold, italic, inline code, blockquotes, and tables. Everything you need without the bloat.' },
  { icon: '⬛', title: 'Markdown Native', desc: 'Write in raw markdown and toggle to preview instantly. Your notes are stored as portable, future-proof `.md` files.' },
  { icon: '🔄', title: 'Real-Time Sync', desc: 'Changes propagate to every device in milliseconds. Start a note on your phone, finish it at your desk.' },
  { icon: '🔐', title: 'Encrypted Notes', desc: 'Mark any note as private. Encrypted notes require your master password to unlock, even on your own devices.' },
  { icon: '🏷️', title: 'Tags & Notebooks', desc: 'Organize with a flexible tag system or classic notebooks. Full-text search finds anything in under 50ms.' },
  { icon: '🤝', title: 'Share & Collaborate', desc: 'Publish notes as read-only web pages or invite collaborators for live co-editing. Full version history included.' },
];

const MOCK_NOTE = `# Q4 Launch Checklist

**Status:** In Progress · Last edited 2m ago

## Pre-Launch
- [x] API rate limits reviewed
- [x] Load testing complete
- [ ] CDN cache-control headers
- [ ] Feature flags enabled

## Go-Live
- [ ] Deploy to production
- [ ] Smoke test critical paths`;

const NOTE_STATS = [
  { value: '50ms', label: 'FULL-TEXT SEARCH', color: C.emerald },
  { value: '∞', label: 'NOTES & NOTEBOOKS', color: C.blue },
  { value: '100%', label: 'PORTABLE MARKDOWN', color: C.violet },
];

export default function NotesPage() {
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
          <View style={[s.chip, { backgroundColor: C.emerald + '18', borderWidth: 1, borderColor: C.emerald + '40', marginBottom: 24 }]}>
            <Text style={{ fontSize: 14 }}>📝</Text>
            <Text style={[T.caps, { color: C.emerald }]}>MARKDOWN + RICH TEXT</Text>
          </View>
          <Text style={[T.display, { color: C.text, fontSize: isMobile ? 32 : 52, lineHeight: isMobile ? 40 : 60 }]}>
            {'Notes That '}
            <Text style={{ color: C.emerald }}>Follow You</Text>
            {'\nEverywhere.'}
          </Text>
          <Text style={[T.body, { color: C.textMuted, marginTop: 20, maxWidth: isMobile ? undefined : 460 }]}>
            A distraction-free writing environment with real-time cross-device sync, encryption, and the power of markdown, all in one place.
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 36 }}>
            <Pressable onPress={goSignup} style={[s.btnPrimaryLg, { backgroundColor: C.emeraldDim }, isMobile && { flex: 1, alignItems: 'center' }]}>
              <Text style={[T.body, { color: '#fff', fontWeight: '600' }]}>Start Writing Free</Text>
            </Pressable>
          </View>
        </View>

        {!isMobile && (
          <View style={styles.mockEditor}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderColor: C.border }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {['B', 'I', '#', '< >', '🔗'].map((btn) => (
                  <View key={btn} style={styles.editorBtn}>
                    <Text style={[T.sm, { color: C.textMuted, fontFamily: 'monospace' }]}>{btn}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.syncBadge}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.emerald }} />
                <Text style={[T.caps, { color: C.emerald }]}>SYNCED</Text>
              </View>
            </View>
            <Text style={[T.sm, { color: C.text, fontFamily: 'monospace', lineHeight: 22 }]}>{MOCK_NOTE}</Text>
          </View>
        )}
      </View>

      {/* Stats */}
      <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.border }}>
        <View style={[sec, { paddingVertical: 0 }]}>
          <View style={{ flexDirection: isMobile ? 'column' : 'row' }}>
            {NOTE_STATS.map((st, i, arr) => (
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
        <Text style={[T.h2, { color: C.text }]}>Write Without Limits</Text>
        <Text style={[T.body, { color: C.textMuted, marginTop: 12, maxWidth: isMobile ? undefined : 520 }]}>
          From quick reminders to long-form technical documentation, Frndly Notes adapts to your workflow, not the other way around.
        </Text>
        <View style={s.featureGrid}>
          {FEATURES.map((f) => (
            <View key={f.title} style={s.featureCard}>
              <View style={[s.featureIconWrap, { backgroundColor: C.emeraldDim + '22' }]}>
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
        <View style={[s.ctaBanner, { backgroundColor: C.emeraldDim + 'cc', borderColor: C.emerald + '40', padding: isMobile ? 32 : 60 }]}>
          <Text style={[T.h1, { color: '#fff', textAlign: 'center', fontSize: isMobile ? 28 : 40 }]}>Your Best Ideas Deserve Better.</Text>
          <Text style={[T.body, { color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginTop: 12, maxWidth: 420 }]}>
            Free forever for personal use. Unlimited notes, real-time sync, and full encryption included.
          </Text>
          <Pressable onPress={goSignup} style={[s.btnPrimaryLg, { marginTop: 28, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }]}>
            <Text style={[T.body, { color: '#fff', fontWeight: '600' }]}>Open My Notes</Text>
          </Pressable>
        </View>
      </View>
    </LandingShell>
  );
}

const styles = StyleSheet.create({
  mockEditor: {
    width: 400,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 24,
  },
  editorBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: C.surfaceHigh,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncBadge: {
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
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
});
