'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion, useWebGLSupport } from '@/lib/motion';

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false });

const HERO_IMAGE = '/fahrzeuge/ABT_SQ8_abtpage.jpg';

const rise = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.15 + i * 0.09, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const webgl = useWebGLSupport();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const [ready, setReady] = useState(false);

  const use3D = webgl === true && !reduced;

  /* Der Scroll-Fortschritt der Hero-Sektion steuert die Auflösung der
     Partikelwolke (scrollRef) und schiebt die Typografie weg. */
  useEffect(() => {
    if (!sectionRef.current || reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current!,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          scrollRef.current = self.progress;
        },
      });

      gsap.to('[data-hero-type]', {
        yPercent: -38,
        opacity: 0,
        filter: 'blur(9px)',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: 'top top',
          end: '60% top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      aria-label="Einstieg"
      className={reduced ? 'relative' : 'relative h-[210svh]'}
    >
      <div
        ref={stageRef}
        className={`grain relative flex h-svh w-full flex-col overflow-hidden ${
          reduced ? '' : 'sticky top-0'
        }`}
      >
        {/* ---------- Ebene 0: Typografie, vom Fahrzeug teilweise verdeckt ---
            Erst ab md: darunter ist der Schriftzug breiter als das Display
            und würde beidseitig abgeschnitten. Dort trägt die H1 im
            Textlayer den Auftritt. */}
        <div
          data-hero-type
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 hidden justify-center md:flex"
        >
          <span
            aria-hidden="true"
            className="font-display text-chrome-gradient block translate-y-[16%] whitespace-nowrap opacity-90"
            style={{ fontSize: 'clamp(4rem, 15.5vw, 18rem)', letterSpacing: '-0.005em' }}
          >
            Finest Brands
          </span>
        </div>

        {/* ---------- Ebene 1: das Fahrzeug ---------------------------------- */}
        <div className="absolute inset-0 z-10">
          {use3D ? (
            <HeroCanvas src={HERO_IMAGE} scrollRef={scrollRef} onReady={() => setReady(true)} />
          ) : null}

          {/* Statischer Unterbau: sichtbar ohne WebGL, bei reduzierter Bewegung
              und so lange die Partikelwolke noch rechnet. */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
              use3D && ready ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {/* Ohne WebGL fehlt die Maskierung aus dem Shader – dann wäre der
                Studiohintergrund als sichtbares Rechteck erkennbar. Die
                weiche Kante übernimmt hier eine CSS-Maske. */}
            <Image
              src={HERO_IMAGE}
              alt="ABT SQ8 im Studio"
              width={1400}
              height={928}
              priority
              sizes="100vw"
              className="h-auto w-[min(88vw,1000px)] object-contain"
              style={{
                maskImage:
                  'radial-gradient(58% 58% at 50% 46%, #000 40%, rgba(0,0,0,0.28) 72%, transparent 94%)',
                WebkitMaskImage:
                  'radial-gradient(58% 58% at 50% 46%, #000 40%, rgba(0,0,0,0.28) 72%, transparent 94%)',
              }}
            />
          </div>
        </div>

        {/* ---------- Ebene 2: Text über allem ------------------------------- */}
        <div className="pointer-events-none relative z-20 flex h-full flex-col justify-between px-5 pt-28 pb-10 sm:px-8 md:px-12 lg:px-16">
          <motion.p
            custom={0}
            variants={rise}
            initial="hidden"
            animate="show"
            className="label !text-[9px] sm:!text-[11px]"
          >
            Motorworld München
            <span className="mx-2 text-chrome/40">/</span>
            Offizieller Vertragshändler
          </motion.p>

          {/* Der untere Block muss über dem Riesenschriftzug bleiben –
              sonst überlagern sich Fließtext und Display-Type. */}
          <div
            data-hero-type
            className="flex items-end justify-between gap-8 pb-[clamp(1rem,4vh,2rem)] md:pb-[clamp(9rem,23vh,15rem)]"
          >
            <div>
              <motion.h1
                custom={1}
                variants={rise}
                initial="hidden"
                animate="show"
                className="font-display text-chrome-gradient text-[clamp(2.75rem,12vw,4.5rem)] md:sr-only"
              >
                Finest Brands
              </motion.h1>

              <motion.p
                custom={2}
                variants={rise}
                initial="hidden"
                animate="show"
                className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-ink/85 md:mt-0 sm:text-base"
              >
                ABT Sportsline und BRABUS unter einem Dach – dazu ein Bestand,
                der sich nicht erklären muss. Fahrzeuge, die man gesehen haben
                will.
              </motion.p>
            </div>

            <motion.div
              custom={3}
              variants={rise}
              initial="hidden"
              animate="show"
              className="hidden shrink-0 items-center gap-3 md:flex"
            >
              <span className="label !tracking-[0.28em]">Scroll</span>
              <span className="relative block h-[1px] w-16 overflow-hidden bg-chrome/25">
                <span className="absolute inset-y-0 left-0 w-6 animate-[cue_2.6s_ease-in-out_infinite] bg-chrome" />
              </span>
            </motion.div>
          </div>
        </div>

        {/* Vignette: hält die Ränder dunkel und die Typo lesbar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[15]"
          style={{
            background:
              'radial-gradient(120% 78% at 50% 46%, transparent 34%, rgba(5,5,6,0.55) 78%, rgba(5,5,6,0.92) 100%)',
          }}
        />
      </div>
    </section>
  );
}
