import { useEffect } from "react";
import React from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    // Ensure the page is shown from top on every route change
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0 });
    }
  }, [pathname]);

  return null;
}
