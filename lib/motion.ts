'use client';

import { useEffect, useState } from 'react';

/**
 * Liest `prefers-reduced-motion` reaktiv aus.
 * Startwert ist bewusst `true`: solange wir es nicht besser wissen, wird
 * nichts Schweres gestartet – das verhindert einen Blitz aus Bewegung
 * direkt nach der Hydration.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return reduced;
}

/** Grobe Geräteklasse – entscheidet über Partikelbudget und 3D-Qualität. */
export function useDeviceTier() {
  const [tier, setTier] = useState<'low' | 'high'>('low');

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const narrow = window.matchMedia('(max-width: 900px)').matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    setTier(coarse || narrow || cores <= 4 ? 'low' : 'high');
  }, []);

  return tier;
}

/**
 * Grober Zeiger, also Finger statt Maus.
 *
 * Entscheidend dort, wo ein Element Ziehgesten auswertet: fängt ein Canvas
 * die Berührung ab, lässt sich die Seite an dieser Stelle nicht mehr
 * scrollen – der Finger dreht dann das Modell, statt weiterzublättern.
 */
export function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return coarse;
}

/** Prüft einmalig, ob WebGL überhaupt zur Verfügung steht. */
export function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      setSupported(Boolean(gl));
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}
