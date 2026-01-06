// Sentry initialization helper (client-side)
// This file initializes Sentry only when a DSN is provided via Vite env or window.__SENTRY_DSN__
// It purposely does not include any secrets here. To enable Sentry, set VITE_SENTRY_DSN in your environment or
// assign window.__SENTRY_DSN__ before the app loads.

// The import is dynamic to avoid bundling Sentry when not configured
export function initSentry() {
  try {
    const dsn = (import.meta as any).env?.VITE_SENTRY_DSN || (typeof window !== 'undefined' ? (window as any).__SENTRY_DSN__ : undefined);
    if (!dsn) return;

    // dynamic import so Sentry is only included when configured
    void import('@sentry/browser').then((Sentry) => {
      Sentry.init({
        dsn,
        release: (import.meta as any).env?.VITE_COMMIT_SHA || undefined,
        environment: (import.meta as any).env?.VITE_APP_ENV || 'production',
      });
      // eslint-disable-next-line no-console
      console.info('[sentry] initialized');
    }).catch((e) => {
      // eslint-disable-next-line no-console
      console.warn('[sentry] failed to load', e);
    });
  } catch (e) {
    // ignore silently
  }
}
