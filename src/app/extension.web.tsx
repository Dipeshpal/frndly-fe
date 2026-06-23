import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { LandingShell, C, T, s, useIsMobile } from '@/components/web/landing-shell';

const ZIP_URL = '/frndly-extension.zip';

const STEPS = [
  {
    title: 'Download & unzip',
    body: `Click "Download Extension" above to grab frndly-extension.zip. Unzip it to a permanent folder (don't delete it later — Chrome loads the extension from this folder).`,
  },
  {
    title: 'Open the extensions page',
    body: `In Chrome, go to chrome://extensions/ (paste it in the address bar). Edge users: edge://extensions/.`,
  },
  {
    title: 'Enable Developer mode',
    body: `Toggle "Developer mode" on — it's in the top-right corner of the extensions page.`,
  },
  {
    title: 'Load unpacked',
    body: `Click "Load unpacked", then select the unzipped folder (the one containing manifest.json). The Frndly icon appears in your toolbar.`,
  },
  {
    title: 'Connect your account',
    body: `Click the Frndly icon, open Settings, paste your Frndly token from the mobile app, and validate. Clipboard sync starts immediately.`,
  },
];

export default function ExtensionPage() {
  const isMobile = useIsMobile();

  const download = () => Linking.openURL(ZIP_URL);

  return (
    <LandingShell>
      <View style={[s.section, { paddingVertical: isMobile ? 48 : 80 }]}>
        <View style={[s.chip, { backgroundColor: C.blue + '18', borderWidth: 1, borderColor: C.blue + '40', marginBottom: 24 }]}>
          <Text style={[T.caps, { color: C.blueDim }]}>CHROME EXTENSION</Text>
        </View>
        <Text style={[T.display, { color: C.text, maxWidth: 700, fontSize: isMobile ? 32 : 52, lineHeight: isMobile ? 40 : 60 }]}>
          Frndly on your desktop
        </Text>
        <Text style={[T.body, { color: C.textMuted, marginTop: 16, maxWidth: 600 }]}>
          Real-time clipboard sync between your phone and any Chromium browser. Install it manually in under a minute — no Chrome Web Store account required.
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 32, alignItems: 'center' }}>
          <Pressable onPress={download} style={[s.btnPrimaryLg, isMobile && { flex: 1, alignItems: 'center' }]}>
            <Text style={[T.body, { color: '#fff', fontWeight: '600' }]}>Download Extension (.zip)</Text>
          </Pressable>
          <View style={[s.chip, { backgroundColor: C.surfaceHigh, borderWidth: 1, borderColor: C.border }]}>
            <Text style={[T.caps, { color: C.textDim }]}>CHROME WEB STORE — COMING SOON</Text>
          </View>
        </View>

        {/* Steps */}
        <View style={styles.content}>
          {STEPS.map((step, i) => (
            <View key={i} style={styles.secBlock}>
              <View style={styles.stepNum}>
                <Text style={[T.caps, { color: C.blueDim }]}>0{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[T.h3, { color: C.text }]}>{step.title}</Text>
                <Text style={[T.body, { color: C.textMuted, marginTop: 12, lineHeight: 28 }]}>{step.body}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Note */}
        <View style={styles.note}>
          <Text style={[T.caps, { color: C.blueDim, marginBottom: 8 }]}>WHY DEVELOPER MODE?</Text>
          <Text style={[T.body, { color: C.textMuted }]}>
            Until Frndly is published on the Chrome Web Store, the extension is distributed directly as an unpacked package. Developer mode lets Chrome run it. We'll switch to a one-click store install soon — keep this folder until then.
          </Text>
        </View>
      </View>
    </LandingShell>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: 56,
    maxWidth: 720,
  },
  secBlock: {
    flexDirection: 'row',
    gap: 24,
    paddingVertical: 32,
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
    borderColor: C.blue + '40',
    borderRadius: 12,
    padding: 24,
  },
});
