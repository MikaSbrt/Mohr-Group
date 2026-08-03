'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';
import TransitionLink from '@/components/ui/TransitionLink';
import Magnetic from '@/components/ui/Magnetic';
import { usePrefersReducedMotion, useWebGLSupport } from '@/lib/motion';

const HologramCanvas = dynamic(() => import('./HologramCanvas'), { ssr: false });

/** Das reale Fahrzeug hinter dem Hologramm. */
const VEHICLE = {
  slug: 'abt-rs6-legacy-edition',
  name: 'ABT RS6 Legacy Edition',
  image: '/fahrzeuge/ABT_RS6_Legacy_Edition_abtpage.jpg',
};

export default function HologramSpotlight() {
  const reduced = usePrefersReducedMotion();
  const webgl = useWebGLSupport();

  return (
    <section
      id="spotlight"
      aria-labelledby="spotlight-title"
      className="relative overflow-hidden border-y border-chrome/10 bg-carbon px-5 py-[clamp(5rem,12vh,9rem)] sm:px-8 lg:px-12"
    >
      {/* Kaltes Streiflicht als Bühne */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 55% at 68% 42%, rgba(94,140,190,0.16) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto grid max-w-[1500px] items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <Reveal>
          <p className="label">Spotlight</p>
          <h2
            id="spotlight-title"
            className="font-display text-chrome-gradient mt-5 text-[clamp(2.4rem,6.5vw,4.6rem)]"
          >
            Der RS6, in Linien zerlegt
          </h2>
          <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-ink/80 sm:text-base">
            Eine Studie in Kanten: Breitbau, Dachlinie, Radstand – reduziert auf
            das, was die Silhouette ausmacht. Bewegen Sie den Zeiger, das Modell
            folgt.
          </p>
          <p className="mt-4 max-w-[46ch] text-[13px] leading-relaxed text-ink-dim">
            Stilisiertes Designelement, keine Fahrzeugabbildung. Wie der Wagen
            wirklich aussieht, zeigen die Aufnahmen auf der Fahrzeugseite.
          </p>

          <div className="mt-9">
            <Magnetic strength={0.2}>
              <TransitionLink
                href={`/fahrzeuge/${VEHICLE.slug}`}
                className="group inline-flex items-center gap-4 border border-chrome/25 px-7 py-4 text-sm transition-colors duration-500 hover:border-chrome/60 hover:bg-chrome/5"
              >
                <span>{VEHICLE.name} ansehen</span>
                <span
                  aria-hidden="true"
                  className="block h-px w-7 bg-chrome transition-all duration-500 group-hover:w-10"
                />
              </TransitionLink>
            </Magnetic>
          </div>
        </Reveal>

        <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
          {webgl === null ? (
            /* Noch nicht geprüft. Bewusst eine leere Fläche statt des
               Fallback-Bildes – sonst lädt das Foto und wird eine Zehntel-
               sekunde später wieder ersetzt. */
            <div className="h-full w-full border border-chrome/10 bg-void/40" />
          ) : webgl ? (
            /* Bei `prefers-reduced-motion` läuft dieselbe Szene, nur
               eingefroren: eine statische Grafik ohne jede Bewegung. */
            <HologramCanvas reduced={reduced} />
          ) : (
            /* Ohne WebGL: das echte Fahrzeug, kühl abgestimmt, damit die
               Sektion denselben Ton behält. */
            <div className="relative h-full w-full overflow-hidden border border-chrome/10">
              <Image
                src={VEHICLE.image}
                alt={VEHICLE.name}
                fill
                sizes="(min-width: 1024px) 55vw, 92vw"
                className="object-cover opacity-80 contrast-[1.1] brightness-[0.72] saturate-[0.75]"
              />
            </div>
          )}

          <p className="label absolute -bottom-1 left-0 !text-[9px] !text-ink-dim/70">
            {VEHICLE.name} · Studie
          </p>
        </div>
      </div>
    </section>
  );
}
