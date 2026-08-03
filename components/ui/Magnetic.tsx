'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/motion';

/**
 * Magnetischer Wrapper: das Element folgt dem Cursor leicht nach.
 * Nur an Zeigegeräten aktiv und bei reduzierter Bewegung komplett aus.
 */
export default function Magnetic({
  children,
  strength = 0.32,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.35 });

  /* Kein festes `inline-block` in der Basisklasse: das würde mit einem
     `hidden` aus dem className um dieselbe display-Eigenschaft streiten,
     und welche Regel gewinnt, hängt dann von der Reihenfolge im Stylesheet
     ab – nicht von der Reihenfolge der Klassen. */
  const cls = className ?? 'inline-block';

  if (reduced) return <span className={cls}>{children}</span>;

  return (
    <motion.span
      ref={ref}
      className={cls}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
