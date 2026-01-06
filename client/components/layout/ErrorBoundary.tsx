import React from "react";

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    try {
      // send to Sentry if available
      if (typeof (window as any).Sentry !== "undefined") {
        (window as any).Sentry.captureException(error);
      }
    } catch (e) {
      // ignore
    }
    // eslint-disable-next-line no-console
    console.error("Unhandled error caught by ErrorBoundary", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
          <div className="max-w-xl text-center">
            <h1 className="text-2xl font-semibold mb-4">
              Une erreur est survenue
            </h1>
            <p className="text-slate-300 mb-6">
              Nous sommes désolés — notre équipe a été prévenue automatiquement.
            </p>
            <p className="text-sm text-slate-400">
              Veuillez réessayer plus tard ou contacter le support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
