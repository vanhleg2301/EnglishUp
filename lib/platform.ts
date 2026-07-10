import { Capacitor } from '@capacitor/core';

/**
 * True when running inside the native iOS app shell (Capacitor/WKWebView).
 * Apple Guideline 3.1.1 forbids surfacing purchase flows for digital
 * content that don't go through Apple's In-App Purchase, so any Stripe/
 * subscription UI must stay hidden on this platform.
 */
export function isNativeIOS(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';
}
