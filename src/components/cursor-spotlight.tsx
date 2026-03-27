"use client";

import { useEffect } from "react";

export function CursorSpotlight() {
  useEffect(() => {
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isCoarsePointer || prefersReducedMotion) {
      return;
    }

    const root = document.documentElement;

    function updateSpotlight(event: PointerEvent) {
      root.style.setProperty("--cursor-x", `${event.clientX}px`);
      root.style.setProperty("--cursor-y", `${event.clientY}px`);
      root.style.setProperty("--spotlight-opacity", "1");
    }

    function hideSpotlight() {
      root.style.setProperty("--spotlight-opacity", "0");
    }

    window.addEventListener("pointermove", updateSpotlight, { passive: true });
    window.addEventListener("pointerdown", updateSpotlight, { passive: true });
    window.addEventListener("pointerleave", hideSpotlight);
    window.addEventListener("blur", hideSpotlight);

    return () => {
      window.removeEventListener("pointermove", updateSpotlight);
      window.removeEventListener("pointerdown", updateSpotlight);
      window.removeEventListener("pointerleave", hideSpotlight);
      window.removeEventListener("blur", hideSpotlight);
      root.style.setProperty("--spotlight-opacity", "0");
    };
  }, []);

  return null;
}
