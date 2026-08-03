'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';
import TransitionLink from '@/components/ui/TransitionLink';
import { usePrefersReducedMotion } from '@/lib/motion';

/**
 * Studie an einem echten Fahrzeug.
 *
 * Ersetzt das frühere Kanten-Hologramm (`components/hologram/`, dort noch
 * vollständig vorhanden). Der technische Charakter bleibt – Linien, die auf
 * Details zeigen –, aber die Genauigkeit kommt jetzt aus der Aufnahme statt
 * aus einem nachgebauten Modell.
 *
 * Motiv ist bewusst `..._portfolio.jpg`: die Aufnahme stammt aus der
 * Motorworld-Halle, im Hintergrund die eigene Beschilderung, am Wagen das
 * MOHR-GROUP-Kennzeichen. Eine Rundum-Sequenz war nicht möglich, im Bestand
 * liegen keine Serien desselben Fahrzeugs aus mehreren Winkeln.
 */

/* Bildmaße der Aufnahme. Das SVG nutzt denselben viewBox-Bereich, dadurch
   sind alle Koordinaten unten schlicht Pixel im Originalbild. */
const IMG_W = 911;
const IMG_H = 683;

type Marke = {
  /** Punkt am Fahrzeug */
  x: number;
  y: number;
  /** Ende der Hinweislinie, dort steht der Text */
  lx: number;
  ly: number;
  anchor: 'start' | 'end';
  titel: string;
  text: string;
};

/* Punkte am Fahrzeug, abgelesen über ein Koordinatenraster auf dem Original.
   Die Textenden liegen bewusst in ruhigen, dunklen Bildbereichen – auf der
   hellen Schaufensterfront rechts wäre helle Schrift nicht lesbar. */
const marken: Marke[] = [
  {
    x: 185,
    y: 489,
    lx: 28,
    ly: 322,
    anchor: 'start',
    titel: 'Single-Frame',
    text: 'Vier Ringe, Wabengitter',
  },
  {
    x: 250,
    y: 605,
    lx: 28,
    ly: 656,
    anchor: 'start',
    titel: 'Frontsplitter',
    text: 'Carbon, aus dem Windkanal',
  },
  {
    x: 455,
    y: 450,
    lx: 300,
    ly: 200,
    anchor: 'start',
    titel: 'Breitbau',
    text: 'Kotflügel über der Vorderachse',
  },
  {
    x: 497,
    y: 555,
    lx: 884,
    ly: 650,
    anchor: 'end',
    titel: 'Schmiederad',
    text: 'ABT, Bremssattel rot',
  },
];

export default function VehicleStudy() {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      id="studie"
      aria-labelledby="studie-titel"
      className="relative border-t border-chrome/10 px-5 py-[clamp(4.5rem,10vh,8rem)] sm:px-8 lg:px-12"
    >
      <div className="mx-auto grid max-w-[1500px] items-center gap-[clamp(2.5rem,5vw,4.5rem)] lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <div>
          <Reveal>
            <p className="label">Studie</p>
            <h2
              id="studie-titel"
              className="font-display text-chrome-gradient mt-5 max-w-[12ch] text-[clamp(2rem,5.5vw,3.6rem)]"
            >
              Der RS6, im Detail
            </h2>
            <p className="mt-7 max-w-[42ch] text-[15px] leading-relaxed text-ink/80">
              Was einen ABT vom Serienfahrzeug trennt, sieht man an vier
              Stellen. Aufgenommen bei uns in der Motorworld – kein Rendering,
              kein Katalogbild.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <TransitionLink
              href="/fahrzeuge/abt-rs6-legacy-edition"
              className="group mt-9 inline-flex items-center gap-4 border border-chrome/25 px-7 py-4 text-sm transition-colors duration-500 hover:border-chrome/60 hover:bg-chrome/5"
            >
              <span>ABT RS6 Legacy Edition ansehen</span>
              <span
                aria-hidden="true"
                className="block h-px w-7 bg-chrome transition-all duration-500 group-hover:w-11"
              />
            </TransitionLink>
          </Reveal>
        </div>

        <Reveal delay={0.06}>
          <figure className="relative">
            <div
              className="relative overflow-hidden border border-chrome/10"
              style={{ aspectRatio: `${IMG_W} / ${IMG_H}` }}
            >
              <Image
                src="/fahrzeuge/ABT_RS6_Legacy_Edition_portfolio.jpg"
                alt="ABT RS6 Legacy Edition in der Motorworld München"
                fill
                sizes="(min-width: 1024px) 58vw, 92vw"
                className="object-cover brightness-[0.68] contrast-[1.1] saturate-[0.9]"
              />

              {/* Hinweislinien. Gleicher viewBox wie das Bild, deshalb sind
                  die Koordinaten oben direkt Bildpixel. */}
              <svg
                viewBox={`0 0 ${IMG_W} ${IMG_H}`}
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                {/* Ohne Schatten verschwindet helle Schrift in den hellen
                    Stellen der Aufnahme (Schaufenster, Deckenlicht). */}
                <defs>
                  <filter id="studie-schatten" x="-25%" y="-50%" width="150%" height="200%">
                    <feDropShadow
                      dx="0"
                      dy="1"
                      stdDeviation="4"
                      floodColor="#050506"
                      floodOpacity="0.98"
                    />
                  </filter>
                </defs>
                {marken.map((m, i) => {
                  const delay = reduced ? 0 : 0.35 + i * 0.16;
                  return (
                    <motion.g
                      key={m.titel}
                      initial={reduced ? false : { opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.5, delay }}
                    >
                      <motion.line
                        x1={m.x}
                        y1={m.y}
                        x2={m.lx}
                        y2={m.ly}
                        stroke="rgba(214,222,232,0.5)"
                        strokeWidth={1.2}
                        initial={reduced ? false : { pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
                      />
                      <circle cx={m.x} cy={m.y} r={4.5} fill="rgba(226,0,26,0.9)" />
                      <circle
                        cx={m.x}
                        cy={m.y}
                        r={9}
                        fill="none"
                        stroke="rgba(226,0,26,0.45)"
                        strokeWidth={1}
                      />
                      <text
                        x={m.lx}
                        y={m.ly - 12}
                        textAnchor={m.anchor}
                        className="fill-chrome"
                        filter="url(#studie-schatten)"
                        style={{
                          fontSize: 22,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                        }}
                      >
                        {m.titel}
                      </text>
                      <text
                        x={m.lx}
                        y={m.ly + 10}
                        textAnchor={m.anchor}
                        fill="rgba(214,222,232,0.78)"
                        filter="url(#studie-schatten)"
                        style={{ fontSize: 18 }}
                      >
                        {m.text}
                      </text>
                    </motion.g>
                  );
                })}
              </svg>
            </div>

            <figcaption className="label mt-4 !text-[9px] !text-ink-dim/60">
              ABT RS6 Legacy Edition · Motorworld München
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
