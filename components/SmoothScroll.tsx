'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '@/lib/motion';
import { registerLenis } from '@/lib/scroll-lock';

/**
 * Lenis als Scroll-Basis, damit GSAP-Choreografie und Scroll sauber
 * denselben Takt haben. Bei `prefers-reduced-motion` bleibt der native
 * Scroll unangetastet – nur ScrollTrigger wird registriert.
 */
export default function SmoothScroll() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (reduced) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenis.on('scroll', ScrollTrigger.update);
    // Damit die Intro-Sequenz das Scrollen sperren kann.
    registerLenis(lenis);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      registerLenis(null);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}
