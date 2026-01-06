// Sentry initialization helper (client-side) - lightweight skeleton
// This version avoids bundling Sentry during dev to prevent dependency resolution errors.
// To fully enable Sentry either:
//  - install @sentry/browser as a dependency, or
//  - add the Sentry browser bundle via a script tag that exposes `window.Sentry`.

export function initSentry() {
  try {
    const dsn =
      (import.meta as any).env?.VITE_SENTRY_DSN ||
      (typeof window !== "undefined"
        ? (window as any).__SENTRY_DSN__
        : undefined);
    if (!dsn) return;

    if (typeof window !== "undefined" && (window as any).Sentry) {
      try {
        (window as any).Sentry.init({
          dsn,
          release: (import.meta as any).env?.VITE_COMMIT_SHA || undefined,
          environment: (import.meta as any).env?.VITE_APP_ENV || "production",
        });
        // eslint-disable-next-line no-console
        console.info("[sentry] initialized via global Sentry");
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("[sentry] failed to init global Sentry", e);
      }
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        "[sentry] DSN provided but Sentry lib not available. Install @sentry/browser or include Sentry script.",
      );
    }
  } catch (e) {
    // ignore silently
  }
}
