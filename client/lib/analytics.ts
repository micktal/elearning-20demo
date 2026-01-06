// Lightweight client-side analytics helper
// - Sends events to window.dataLayer if present (Google Tag Manager)
// - Falls back to console.log for local visibility

export function trackEvent(name: string, payload: Record<string, any> = {}) {
  try {
    const event = { event: name, ...payload, timestamp: Date.now() };
    // GTM dataLayer
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push(event);
    }
    // Optionally support navigator.sendBeacon to a telemetry endpoint if configured
    // (Not active by default to avoid leaking secrets)
    // console fallback for local debugging
    // eslint-disable-next-line no-console
    console.info('[analytics]', event);
  } catch (e) {
    // ignore
  }
}
