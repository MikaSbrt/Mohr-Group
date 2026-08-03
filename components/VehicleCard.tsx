'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import TransitionLink from '@/components/ui/TransitionLink';
import { usePrefersReducedMotion } from '@/lib/motion';
import { vehicleTransitionName } from '@/lib/view-transition';
import type { Vehicle } from '@/lib/vehicles';

export default function VehicleCard({
  vehicle,
  index,
  aspect = 'aspect-[4/3]',
  sizes = '(min-width: 1024px) 45vw, 92vw',
  priority,
}: {
  vehicle: Vehicle;
  index: number;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], ['7deg', '-7deg']), {
    stiffness: 180,
    damping: 20,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], ['-9deg', '9deg']), {
    stiffness: 180,
    damping: 20,
  });

  return (
    <TransitionLink
      href={`/fahrzeuge/${vehicle.slug}`}
      className="group block focus-visible:outline-offset-8"
      aria-label={`${vehicle.name} ansehen`}
    >
      <motion.div
        ref={ref}
        style={reduced ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
        onPointerMove={(e) => {
          if (reduced || e.pointerType !== 'mouse' || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        className="relative will-change-transform"
      >
        <div
          className={`hairline relative ${aspect} overflow-hidden border bg-anthracite`}
        >
          <Image
            src={vehicle.hero}
            alt={vehicle.name}
            fill
            sizes={sizes}
            priority={priority}
            /* Ein Teil des Bestands ist im hellen Showroom fotografiert.
               Ohne kräftiges Grading reißen diese Kacheln die dunkle
               Seite auf; beim Hover kommt die volle Helligkeit zurück. */
            className="object-cover brightness-[0.66] contrast-[1.12] saturate-[0.88] transition-[transform,filter] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045] group-hover:brightness-[0.98] group-hover:saturate-100"
            style={{ viewTransitionName: vehicleTransitionName(vehicle.slug) }}
          />

          {/* Nummer als grafisches Element */}
          <span
            aria-hidden="true"
            className="font-display pointer-events-none absolute top-3 left-4 text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-white/12 mix-blend-overlay"
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/90 via-void/20 to-void/25"
          />

          {/* Marken-Akzent, der beim Hover einläuft */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
            style={{ background: vehicle.accent }}
          />
        </div>

        <div className="flex items-baseline justify-between gap-6 pt-5">
          <div>
            <p className="label !text-[10px]" style={{ color: vehicle.accent }}>
              {vehicle.brand}
            </p>
            <h3 className="font-display mt-2 text-[clamp(1.5rem,2.6vw,2.35rem)] text-chrome transition-colors duration-500 group-hover:text-chrome-hi">
              {vehicle.name}
            </h3>
          </div>
          <span className="label shrink-0 !text-[10px] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            Ansehen →
          </span>
        </div>

        <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-ink-dim">
          {vehicle.tagline}
        </p>
      </motion.div>
    </TransitionLink>
  );
}
