'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';
import Magnetic from '@/components/ui/Magnetic';
import TransitionLink from '@/components/ui/TransitionLink';
import { usePrefersReducedMotion } from '@/lib/motion';
import { vehicleTransitionName } from '@/lib/view-transition';
import type { Vehicle } from '@/lib/vehicles';

export default function VehicleDetail({
  vehicle,
  prev,
  next,
}: {
  vehicle: Vehicle;
  prev: Vehicle;
  next: Vehicle;
}) {
  const reduced = usePrefersReducedMotion();
  const hero = useRef<HTMLDivElement>(null);
  const heroImg = useRef<HTMLDivElement>(null);

  /* Der Hero läuft beim Scrollen langsamer weg als der Inhalt darunter. */
  useEffect(() => {
    if (reduced || !hero.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.to(heroImg.current, {
        yPercent: 16,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: hero.current!,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, hero);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <article className="bg-void">
      {/* ---------------------------------------------------------------- Hero */}
      <header ref={hero} className="relative h-[86svh] min-h-[560px] overflow-hidden">
        <div ref={heroImg} className="absolute inset-0 will-change-transform">
          <Image
            src={vehicle.hero}
            alt={vehicle.name}
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-[0.72] contrast-[1.05]"
            style={{ viewTransitionName: vehicleTransitionName(vehicle.slug) }}
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(5,5,6,0.97) 4%, rgba(5,5,6,0.55) 34%, rgba(5,5,6,0.25) 62%, rgba(5,5,6,0.75) 100%)',
          }}
        />

        <div className="relative z-10 mx-auto flex h-full max-w-[1500px] flex-col justify-end px-5 pb-14 sm:px-8 md:px-12 lg:px-16">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="label mb-4"
            style={{ color: vehicle.accent }}
          >
            {vehicle.brand}
            <span className="mx-3 text-chrome/35">/</span>
            <span className="text-chrome/70">{vehicle.year}</span>
          </motion.p>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-chrome-gradient max-w-[14ch] text-[clamp(2.75rem,9vw,8rem)]"
          >
            {vehicle.name}
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-[46ch] leading-relaxed text-ink/85"
          >
            {vehicle.subtitle} — {vehicle.tagline}
          </motion.p>
        </div>
      </header>

      {/* -------------------------------------------------------------- Daten */}
      <section aria-label="Technische Daten" className="border-y border-chrome/12 bg-carbon">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-px bg-chrome/10 px-0 sm:grid-cols-4">
          {vehicle.specs.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="bg-carbon">
              <div className="px-5 py-10 sm:px-8 md:px-10">
                <p className="label mb-4 !text-[10px]">{s.label}</p>
                <p className="font-display text-[clamp(1.75rem,3.6vw,3rem)] text-chrome-hi">
                  {s.value}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- Text + Bild */}
      <section className="mx-auto max-w-[1500px] px-5 py-[clamp(5rem,12vh,9rem)] sm:px-8 md:px-12 lg:px-16">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <p className="label mb-6">Zum Fahrzeug</p>
            <p className="text-[clamp(1.15rem,1.9vw,1.5rem)] leading-[1.55] text-chrome">
              {vehicle.body}
            </p>

            <p className="mt-10 max-w-[44ch] text-xs leading-relaxed text-ink-dim/80">
              Konzeptentwurf: Die technischen Angaben sind Beispieldaten für
              diesen Entwurf und stellen kein verbindliches Angebot dar.
            </p>

            <Magnetic strength={0.24}>
              <a
                href={`mailto:kontakt@example.com?subject=${encodeURIComponent(
                  `Anfrage ${vehicle.name}`,
                )}`}
                className="group mt-10 inline-flex items-center gap-4 border border-chrome/30 px-8 py-4 text-sm transition-colors duration-500 hover:border-chrome hover:bg-chrome hover:text-black"
              >
                <span>Fahrzeug anfragen</span>
                <span className="transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </Magnetic>
          </Reveal>

          <div className="flex flex-col gap-8">
            {vehicle.gallery.map((src, i) => (
              <Reveal key={src} delay={i * 0.08}>
                <div className="hairline relative aspect-[3/2] overflow-hidden border">
                  <Image
                    src={src}
                    alt={`${vehicle.name} – Aufnahme ${i + 2}`}
                    fill
                    sizes="(min-width: 1024px) 60vw, 92vw"
                    className="object-cover brightness-[0.88] transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03]"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Weiterblättern */}
      <nav
        aria-label="Weitere Fahrzeuge"
        className="grid border-t border-chrome/12 sm:grid-cols-2"
      >
        {[
          { v: prev, dir: '←', label: 'Vorheriges' },
          { v: next, dir: '→', label: 'Nächstes' },
        ].map(({ v, dir, label }, i) => (
          <TransitionLink
            key={v.slug}
            href={`/fahrzeuge/${v.slug}`}
            className={`group relative overflow-hidden px-5 py-14 sm:px-8 md:px-12 ${
              i === 0 ? 'sm:border-r sm:border-chrome/12' : ''
            } ${i === 1 ? 'text-right' : ''}`}
          >
            <Image
              src={v.hero}
              alt=""
              aria-hidden="true"
              fill
              sizes="50vw"
              className="object-cover opacity-0 grayscale transition-opacity duration-700 group-hover:opacity-25"
            />
            <span className="label relative !text-[10px]">
              {i === 1 ? `${label} ${dir}` : `${dir} ${label}`}
            </span>
            <span className="font-display relative mt-3 block text-[clamp(1.5rem,3.5vw,2.75rem)] text-chrome transition-colors duration-500 group-hover:text-chrome-hi">
              {v.name}
            </span>
          </TransitionLink>
        ))}
      </nav>
    </article>
  );
}
