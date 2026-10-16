"use client";

import type { LenisOptions } from "lenis";
import { ReactLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, type ReactNode } from "react";

/* Single source of truth for the page's scroll feel.
   - Desktop (wheel/trackpad): smoothWheel + a light lerp — cinematic but still
     responsive, no "wheel then wait" lag.
   - Mobile (touch): syncTouch drives the scroll off the finger through Lenis so
     the page tracks the finger directly and keeps natural momentum after release.
     syncTouchLerp is kept tight (0.08) so there is no floaty/sticky delay; the
     multiplier is nudged >1 so a short flick still travels a natural distance.
   One explicit rAF drives Lenis. GSAP ScrollTrigger is updated from
   lenis.on("scroll") in ConceptBClient, so there is no competing loop. */
const options: LenisOptions = {
  autoRaf: false,

  // Desktop
  smoothWheel: true,
  wheelMultiplier: 1,
  lerp: 0.12,

  // Mobile / touch — the priority path
  syncTouch: true,
  touchMultiplier: 1.6,
  syncTouchLerp: 0.08,

  orientation: "vertical",
  gestureOrientation: "vertical",

  overscroll: true,
  // Anchor nav (#film, #contact, …) lands below the fixed header instead of
  // beneath it. Lenis ignores CSS scroll-margin-top, so the offset lives here.
  anchors: { offset: -96 },
  respectReducedMotion: true,
  stopInertiaOnNavigate: true,
};

export default function SmoothScroll({ children }: Readonly<{ children: ReactNode }>) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    let frame = 0;
    const raf = (time: number) => {
      lenisRef.current?.lenis?.raf(time);
      frame = window.requestAnimationFrame(raf);
    };
    frame = window.requestAnimationFrame(raf);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <ReactLenis ref={lenisRef} root options={options}>
      {children}
    </ReactLenis>
  );
}
