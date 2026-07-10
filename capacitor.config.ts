import type { CapacitorConfig } from '@capacitor/cli';

// TODO: replace with your real production domain (the one deployed on Vercel)
// before running `npx cap sync ios`. This is the URL the native WKWebView loads.
const PRODUCTION_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com';

const config: CapacitorConfig = {
  appId: 'com.englishup.app',
  appName: 'EnglishUp',
  webDir: 'public',
  server: {
    url: PRODUCTION_URL,
    cleartext: false,
  },
  ios: {
    contentInset: 'automatic',
  },
};

export default config;
