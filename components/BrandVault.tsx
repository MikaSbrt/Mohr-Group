'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '@/lib/motion';

type Brand = {
  key: 'abt' | 'brabus';
  name: string;
  logo: string;
  /* Echte Pixelmaße der Logodatei. Ein pauschaler Wert für beide Marken
     verzerrt sie, weil `w-full h-auto` das Seitenverhältnis aus diesen
     Attributen ableitet. */
  w: number;
  h: number;
  invertLogo?: boolean;
  image: string;
  claim: string;
  text: string;
  glow: string;
  /** Grading des Hintergrundbilds – die Motorworld-Aufnahmen brauchen mehr. */
  imageClass: string;
};

const brands: Brand[] = [
  {
    key: 'abt',
    name: 'ABT Sportsline',
    logo: '/logos/abt-sportsline-logo.png',
    w: 331,
    h: 130,
    image: '/fahrzeuge/ABT_RSQ8-S.jpg',
    /* Die Kurzprofile der Marken stehen in der Vertragspartner-Sektion
       (`lib/partners.ts`). Hier geht es bewusst um etwas anderes: was ein
       Vertragshändler für den Kunden tatsächlich bedeutet. */
    claim: 'Vertragshändler seit Jahren',
    text: 'Freigegebene Leistungsstufen, eintragungsfähige Bauteile, Garantie vom Werk. Wir bestellen keine Teile – wir bauen ein Programm, das ABT so vorgesehen hat.',
    glow: 'rgba(226,0,26,0.40)',
    imageClass: 'opacity-80 contrast-[1.08] brightness-[0.62] saturate-[0.85]',
  },
  {
    key: 'brabus',
    name: 'BRABUS',
    logo: '/logos/brabus-logo.svg',
    w: 709,
    h: 311,
    invertLogo: true,
    image: '/fahrzeuge/BRABUS_G800_Superblack.jpg',
    claim: 'Direkt aus Bottrop',
    text: 'Vom Monoblock-Rad bis zur kompletten Neubelederung: Konfiguration, Bestellung und Abnahme laufen bei uns – Sie sehen das Ergebnis, nicht den Weg dorthin.',
    glow: 'rgba(193,0,0,0.52)',
    /* Motorworld-Aufnahme mit unruhiger, warm beleuchteter Kulisse. Fast
       vollständig entsättigt, damit nicht Sepia, sondern das Markenrot
       die Farbe der Sektion bestimmt. */
    imageClass: 'opacity-55 grayscale-[0.88] contrast-[1.28] brightness-[0.42]',
  },
];

function Panel({
  brand,
  priority,
  hideContent,
}: {
  brand: Brand;
  priority?: boolean;
  /** Startet unsichtbar; der Scroll blendet den Inhalt ein. */
  hideContent?: boolean;
}) {
  return (
    <div className="group absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden">
      <Image
        src={brand.image}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        priority={priority}
        className={`object-cover ${brand.imageClass}`}
      />

      {/* Markenfarbe als Streiflicht von oben, nicht als Farbfläche über dem
          ganzen Bild – sonst verschwindet das Fahrzeug darunter. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(58% 52% at 50% -6%, ${brand.glow} 0%, transparent 68%)`,
        }}
      />
      {/* Lesbarkeit für Logo und Text */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(5,5,6,0.62) 0%, rgba(5,5,6,0.10) 26%, rgba(5,5,6,0.30) 52%, rgba(5,5,6,0.88) 92%)',
        }}
      />
      {/* Weicher Kern hinter Logo und Fließtext */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(42% 38% at 50% 46%, rgba(5,5,6,0.62) 0%, transparent 72%)',
        }}
      />

      <div
        data-brand-content={brand.key}
        style={hideContent ? { opacity: 0 } : undefined}
        className="relative z-10 flex w-full max-w-[46rem] flex-col items-center px-6 text-center"
      >
        <p className="label mb-8 !text-chrome/70">{brand.claim}</p>

        <div className="relative w-[min(62vw,22rem)]">
          <Image
            src={brand.logo}
            alt={brand.name}
            width={brand.w}
            height={brand.h}
            className={`h-auto w-full drop-shadow-[0_10px_34px_rgba(0,0,0,0.75)] ${
              brand.invertLogo ? 'invert' : ''
            }`}
          />
          <span
            aria-hidden="true"
            className="logo-shine"
            style={{ ['--logo' as string]: `url('${brand.logo}')` }}
          />
        </div>

        <p className="mt-10 max-w-[42ch] text-[15px] leading-relaxed text-white/80 sm:text-base">
          {brand.text}
        </p>
        <p className="label mt-8 !text-white/55">Offizieller Vertragshändler</p>
      </div>
    </div>
  );
}

export default function BrandVault() {
  const reduced = usePrefersReducedMotion();
  const section = useRef<HTMLElement>(null);
  const wipe = useRef<HTMLDivElement>(null);
  const edge = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || !section.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* Eine einzige Timeline über den gesamten Sticky-Weg.
         Wichtig: Prozentangaben in start/end beziehen sich auf die
         Elementhöhe, nicht auf den nutzbaren Scrollweg – Auslöser jenseits
         von (Höhe − Viewport) feuern nie. Über Timeline-Positionen ist die
         Choreografie dagegen exakt auf den Scrub abgebildet. */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current!,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.4,
        },
      });

      // BRABUS schiebt sich als harte Kante über ABT
      tl.fromTo(
        wipe.current,
        { clipPath: 'inset(0% 0% 0% 100%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: 0.8 },
        0,
      )
        .fromTo(edge.current, { left: '100%' }, { left: '0%', ease: 'none', duration: 0.8 }, 0)
        /* Beide Panels zentrieren ihren Inhalt. Ohne diese Staffelung stünden
           während des Wischs ABT- und BRABUS-Text übereinander: ABT tritt ab,
           bevor die Kante die Mitte erreicht, BRABUS kommt danach. */
        .to('[data-brand-content="abt"]', { opacity: 0, ease: 'none', duration: 0.18 }, 0.06)
        .to('[data-brand-content="brabus"]', { opacity: 1, ease: 'none', duration: 0.16 }, 0.62);

      // Letztes Fünftel bleibt bewusst stehen – BRABUS bekommt seinen Moment.
      tl.to({}, { duration: 0.2 });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  /* Ohne Bewegung: beide Marken einfach untereinander. */
  if (reduced) {
    return (
      <section id="marken" ref={section} aria-label="Marken">
        {brands.map((b) => (
          <div key={b.key} className="relative h-[70svh] min-h-[520px]">
            <Panel brand={b} />
          </div>
        ))}
      </section>
    );
  }

  return (
    <section id="marken" ref={section} aria-label="Marken" className="relative h-[260svh]">
      <div className="sticky top-0 h-svh overflow-hidden bg-void">
        <Panel brand={brands[0]} priority />

        <div ref={wipe} className="absolute inset-0" style={{ willChange: 'clip-path' }}>
          <Panel brand={brands[1]} hideContent />
        </div>

        {/* Chromkante an der Schnittstelle */}
        <div
          ref={edge}
          aria-hidden="true"
          className="absolute inset-y-0 z-20 w-px bg-gradient-to-b from-transparent via-chrome to-transparent"
          style={{ left: '100%' }}
        />

        <p className="label absolute bottom-8 left-1/2 z-20 -translate-x-1/2 !text-white/45">
          Zwei Namen · Eine Adresse
        </p>
      </div>
    </section>
  );
}
