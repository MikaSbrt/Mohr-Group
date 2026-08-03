'use client';

import Image from 'next/image';
import { partners, type Partner } from '@/lib/partners';
import Reveal from '@/components/ui/Reveal';
import TransitionLink from '@/components/ui/TransitionLink';

/**
 * Alle fünf Vertragspartner als bleibende Übersicht – im Duktus des
 * BrandVault (Markenfarbe als Streiflicht, Chrome-Shine auf der Logoform),
 * nur eben für fünf statt zwei Marken.
 *
 * Hierarchie über die Fläche: ABT und BRABUS sind die Häuser, mit denen die
 * MOHR GROUP am engsten verbunden ist, sie bekommen die breiten Kacheln.
 */
function Tile({ partner, large }: { partner: Partner; large?: boolean }) {
  const inner = (
    <>
      {partner.image ? (
        <Image
          src={partner.image}
          alt=""
          aria-hidden="true"
          fill
          sizes={large ? '(min-width: 1024px) 46vw, 92vw' : '(min-width: 1024px) 30vw, 92vw'}
          className={`object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.06] ${partner.imageClass ?? ''}`}
        />
      ) : (
        /* ZENVO: im Bestand liegt kein passendes Fahrzeugfoto. Statt ein
           fremdes Auto unterzuschieben trägt die Kachel bewusst nur Grafit. */
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 100% at 50% 0%, #24262b 0%, #131417 46%, #08090b 100%)',
          }}
        />
      )}

      {/* Markenfarbe als Streiflicht von oben */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-45 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{
          background: `radial-gradient(72% 62% at 50% -8%, ${partner.glow} 0%, transparent 70%)`,
        }}
      />
      {/* Lesbarkeit */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(5,5,6,0.30) 0%, rgba(5,5,6,0.05) 34%, rgba(5,5,6,0.62) 78%, rgba(5,5,6,0.92) 100%)',
        }}
      />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-between p-6 text-center sm:p-8">
        <p className="label !text-[9px] !text-chrome/60">{partner.claim}</p>

        <div
          className={`relative flex w-full items-center justify-center transition-transform duration-700 ease-out-expo group-hover:scale-[1.07] group-focus-visible:scale-[1.07] ${
            large ? 'h-[74px] sm:h-[92px]' : 'h-[58px] sm:h-[70px]'
          }`}
        >
          {/* Bild und Reflex teilen sich exakt dieselbe Box. Stünde das Bild
              in seiner Eigengröße, wäre die Maske des Reflexes (mask-size:
              contain über die volle Breite) größer als das Logo und der
              Schimmer liefe daneben. */}
          <span className="relative block h-full w-[78%]">
            <Image
              src={partner.logo}
              alt={partner.name}
              width={partner.w}
              height={partner.h}
              className={`h-full w-full object-contain drop-shadow-[0_8px_28px_rgba(0,0,0,0.7)] ${
                partner.invertLogo ? 'invert' : ''
              }`}
            />
            <span
              aria-hidden="true"
              className="logo-shine"
              style={{ ['--logo' as string]: `url('${partner.logo}')` }}
            />
          </span>
        </div>

        {/* Bewusst immer sichtbar, nur gedämpft: auf Touch-Geräten gibt es
            keinen Hover-Zustand, der Text wäre dort sonst nie lesbar. */}
        <div>
          <p className="mx-auto max-w-[34ch] text-[13.5px] leading-relaxed text-white/55 transition-colors duration-500 group-hover:text-white/88 group-focus-visible:text-white/88 sm:text-sm">
            {partner.text}
          </p>
          {partner.href && (
            <p className="label mt-4 !text-[9px] !text-chrome/50 transition-colors duration-500 group-hover:!text-chrome group-focus-visible:!text-chrome">
              Mehr erfahren
            </p>
          )}
        </div>
      </div>
    </>
  );

  const shell = `group relative isolate flex overflow-hidden border border-chrome/10 bg-anthracite transition-colors duration-700 hover:border-chrome/25 focus-visible:border-chrome/25 ${
    large ? 'aspect-[16/10]' : 'aspect-[4/5] sm:aspect-[4/3]'
  }`;

  if (partner.href) {
    return (
      <TransitionLink href={partner.href} className={shell} aria-label={partner.name}>
        {inner}
      </TransitionLink>
    );
  }

  // Ohne eigene Seite bleibt die Kachel per Tastatur erreichbar, damit der
  // Hover-Zustand nicht nur mit der Maus zugänglich ist.
  return (
    <article className={shell} tabIndex={0} aria-label={partner.name}>
      {inner}
    </article>
  );
}

export default function Partners() {
  const [abt, brabus, ...rest] = partners;

  return (
    <section
      id="vertragspartner"
      aria-labelledby="partner-title"
      className="relative px-5 pt-[clamp(7rem,16vh,11rem)] pb-[clamp(5rem,10vh,8rem)] sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-[1500px]">
        <Reveal>
          <p className="label">Vertragspartner</p>
          <h2
            id="partner-title"
            className="font-display text-chrome-gradient mt-5 max-w-[14ch] text-[clamp(2.6rem,8vw,6rem)]"
          >
            Fünf Häuser, eine Adresse
          </h2>
          <p className="mt-7 max-w-[52ch] text-[15px] leading-relaxed text-ink/80 sm:text-base">
            Die MOHR GROUP ist offizieller Vertragshändler für ABT Sportsline,
            BRABUS, TECHART, ZENVO und KTM X-BOW – zu sehen in der Motorworld
            München.
          </p>
        </Reveal>

        <div className="mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-6">
          <Reveal className="lg:col-span-3">
            <Tile partner={abt} large />
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-3">
            <Tile partner={brabus} large />
          </Reveal>
          {rest.map((p, i) => (
            <Reveal key={p.key} delay={0.06 * i} className="lg:col-span-2">
              <Tile partner={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
