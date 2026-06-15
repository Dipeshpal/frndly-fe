import { TextStyle } from 'react-native';

export const Typography: Record<string, TextStyle> = {
  displayXl: { fontSize: 36, fontWeight: '500', lineHeight: 40, letterSpacing: -1.5 },
  displayLg: { fontSize: 28, fontWeight: '500', lineHeight: 32, letterSpacing: -1 },
  displayMd: { fontSize: 24, fontWeight: '500', lineHeight: 28, letterSpacing: -0.5 },
  displaySm: { fontSize: 20, fontWeight: '500', lineHeight: 24, letterSpacing: -0.3 },
  titleLg: { fontSize: 20, fontWeight: '600', lineHeight: 26, letterSpacing: -0.3 },
  titleMd: { fontSize: 17, fontWeight: '600', lineHeight: 22, letterSpacing: 0 },
  titleSm: { fontSize: 15, fontWeight: '600', lineHeight: 20, letterSpacing: 0 },
  bodyMd: { fontSize: 15, fontWeight: '400', lineHeight: 22, letterSpacing: 0 },
  bodySm: { fontSize: 13, fontWeight: '400', lineHeight: 18, letterSpacing: 0 },
  caption: { fontSize: 12, fontWeight: '500', lineHeight: 16, letterSpacing: 0 },
  captionUppercase: { fontSize: 11, fontWeight: '600', lineHeight: 14, letterSpacing: 1.2 },
  button: { fontSize: 14, fontWeight: '600', lineHeight: 14, letterSpacing: 0 },
  navLink: { fontSize: 13, fontWeight: '500', lineHeight: 18, letterSpacing: 0 },
} as const;
