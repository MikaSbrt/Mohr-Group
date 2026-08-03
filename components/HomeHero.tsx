'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import TransitionLink from '@/components/ui/TransitionLink';
import { usePrefersReducedMotion } from '@/lib/motion';

/**
 * Startsektion der Homepage.
 *
 * Nach der Begrüßungssequenz braucht es einen klaren Anfang – ohne ihn
 * landet man mitten in der Seite. Vollbild, ein Motiv, eine Aussage.
 *
 * Beide Motive wurden gebaut und im Browser verglichen. Entschieden:
 * `drei-autos`.
 *
 *   – Inhaltlich richtig: RS7 und G-Klasse sind ABT- und BRABUS-Terrain,
 *     also genau die Häuser, die vertreten werden. Auf dem Odeonsplatz-Bild
 *     steht ein Pininfarina Battista – keine der fünf Marken.
 *   – Die Stimmung trägt: kalt, dunkel, neblig. Der Odeonsplatz bringt eine
 *     gelbe Fassade und hellen Himmel mit und kämpft gegen das Chrome-auf-
 *     Schwarz der Seite an.
 *   – Das Motiv liest: drei Fahrzeuge füllen das Bild. Beim Odeonsplatz sitzt
 *     der Wagen klein unten rechts und verschwindet hinter dem Textverlauf.
 *
 * Einziger Nachteil ist die Auflösung (1316 px). Bei 1920 geprüft: Nebel und
 * dunkle Gradation kaschieren die Hochskalierung. Sollte ein hochauflösendes
 * Original auftauchen, einfach die Datei ersetzen.
 *
 * Umstellen: `VARIANTE` ändern, beide Motive liegen in `public/hero/`.
 */
const VARIANTE: 'odeonsplatz' | 'drei-autos' = 'drei-autos';

const MOTIVE = {
  odeonsplatz: {
    src: '/hero/odeonsplatz.jpg',
    w: 3543,
    h: 2363,
    alt: 'Hypersportwagen auf dem Odeonsplatz in München',
    /* Der Wagen steht unten rechts, die Theatinerkirche oben.
       Der Bildausschnitt hält beides. */
    position: '54% 62%',
    /* Das Motiv ist hell (gelbe Fassade, heller Himmel) und muss für
       weiße Schrift deutlich heruntergezogen werden. */
    filter: 'brightness(0.46) contrast(1.12) saturate(0.72)',
    veil: 'linear-gradient(to bottom, rgba(5,5,6,0.78) 0%, rgba(5,5,6,0.30) 34%, rgba(5,5,6,0.55) 68%, rgba(5,5,6,0.96) 100%)',
    credit: 'Odeonsplatz, München',
  },
  'drei-autos': {
    src: '/hero/drei-autos.png',
    w: 1316,
    h: 700,
    alt: 'Drei veredelte Fahrzeuge auf einem Parkdeck',
    position: '50% 54%',
    filter: 'brightness(0.72) contrast(1.1) saturate(0.9)',
    veil: 'linear-gradient(to bottom, rgba(5,5,6,0.72) 0%, rgba(5,5,6,0.22) 30%, rgba(5,5,6,0.48) 66%, rgba(5,5,6,0.96) 100%)',
    credit: 'Aus dem Bestand',
  },
} as const;

export default function HomeHero() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  const motiv = MOTIVE[VARIANTE];

  /* Leichter Parallaxversatz des Bildes. Bewusst über `scrollY` statt über
     einen ScrollTrigger: die Sektion steht immer ganz oben, da genügt der
     rohe Scrollwert und spart eine weitere GSAP-Instanz. */
  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setShift(Math.min(window.scrollY, 900) * 0.16));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [reduced]);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      <div className="absolute inset-0 -z-10" style={{ transform: `translate3d(0,${shift}px,0)` }}>
        <Image
          src={motiv.src}
          alt={motiv.alt}
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover"
          style={{ objectPosition: motiv.position, filter: motiv.filter }}
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: motiv.veil }} />

      <div className="relative w-full px-5 pb-[clamp(4.5rem,11vh,8rem)] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <p className="label animate-hero-in">Motorworld München</p>

          <h1
            id="hero-title"
            className="font-display text-chrome-gradient animate-hero-in mt-5 max-w-[11ch] text-[clamp(3.2rem,12vw,9.5rem)] leading-[0.86]"
            style={{ animationDelay: '90ms' }}
          >
            Finest Brands
          </h1>

          <p
            className="animate-hero-in mt-8 max-w-[46ch] text-[15px] leading-relaxed text-ink/85 sm:text-[17px]"
            style={{ animationDelay: '180ms' }}
          >
            Offizieller Vertragshändler für ABT Sportsline, BRABUS, TECHART,
            ZENVO und KTM X-BOW – unter einem Dach in München.
          </p>

          <div
            className="animate-hero-in mt-10 flex flex-wrap items-center gap-4"
            style={{ animationDelay: '260ms' }}
          >
            <TransitionLink
              href="/fahrzeuge"
              className="group inline-flex items-center gap-4 border border-chrome/30 bg-chrome/5 px-7 py-4 text-sm backdrop-blur-sm transition-colors duration-500 hover:border-chrome/70 hover:bg-chrome/10"
            >
              <span>Fahrzeuge ansehen</span>
              <span
                aria-hidden="true"
                className="block h-px w-7 bg-chrome transition-all duration-500 group-hover:w-11"
              />
            </TransitionLink>
            <TransitionLink
              href="/kontakt"
              className="px-2 py-4 text-sm text-ink/70 underline-offset-8 transition-colors duration-500 hover:text-chrome hover:underline"
            >
              Kontakt aufnehmen
            </TransitionLink>
          </div>
        </div>
      </div>

      {/* Scrollhinweis */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-2"
      >
        <span className="label !text-[8px] !text-ink-dim/60">Scrollen</span>
        <span className="relative block h-9 w-px overflow-hidden bg-chrome/15">
          <span className="animate-scroll-hint absolute inset-x-0 top-0 block h-3 bg-chrome/70" />
        </span>
      </div>
    </section>
  );
}
