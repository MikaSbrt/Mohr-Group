'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from '@/components/ui/Reveal';
import { usePrefersReducedMotion } from '@/lib/motion';

const facts = [
  { k: 'Standort', v: 'Motorworld München' },
  { k: 'Vertragshändler', v: 'ABT Sportsline · BRABUS' },
  { k: 'Schwerpunkt', v: 'Veredelung, Sportwagen, Klassiker' },
];

export default function Showroom() {
  const reduced = usePrefersReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);

  /* Ruhiger Parallax – das Bild läuft langsamer als die Seite. */
  useEffect(() => {
    if (reduced || !wrap.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        img.current,
        { yPercent: -9 },
        {
          yPercent: 9,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap.current!,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    }, wrap);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="showroom"
      aria-labelledby="showroom-titel"
      className="relative overflow-hidden border-y border-chrome/10 bg-carbon"
    >
      <div className="mx-auto grid max-w-[1500px] items-center gap-14 px-5 py-[clamp(5rem,12vh,9rem)] sm:px-8 md:px-12 lg:grid-cols-[1fr_1.15fr] lg:px-16">
        <div>
          <Reveal>
            <p className="label mb-5">Der Ort</p>
            <h2
              id="showroom-titel"
              className="font-display text-chrome-gradient max-w-[13ch] text-[clamp(2.5rem,6.5vw,5.5rem)]"
            >
              Eine Halle, in der nichts leise ist
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-8 max-w-[48ch] leading-relaxed text-ink/85">
              Die MOHR GROUP steht in der Motorworld München zwischen
              Klassikern, Rennwagen und Manufakturen – und ist dort offizieller
              Vertragshändler für ABT Sportsline und BRABUS. Wer hereinkommt,
              sucht selten ein Auto. Er sucht ein bestimmtes.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <dl className="mt-12 divide-y divide-chrome/12 border-y border-chrome/12">
              {facts.map((f) => (
                <div key={f.k} className="flex flex-wrap items-baseline gap-x-8 gap-y-1 py-5">
                  <dt className="label w-40 shrink-0">{f.k}</dt>
                  <dd className="font-display text-[clamp(1.15rem,2vw,1.6rem)] text-chrome">
                    {f.v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="hairline relative aspect-[4/3] overflow-hidden border">
            <div ref={img} className="absolute inset-x-0 -top-[10%] h-[120%]">
              <Image
                src="/fahrzeuge/ABT_RS6_Legacy_Edition_portfolio.jpg"
                alt="Showroom der MOHR GROUP in der Motorworld München"
                fill
                sizes="(min-width: 1024px) 55vw, 92vw"
                className="object-cover brightness-[0.82] contrast-[1.08]"
              />
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-void/25"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
