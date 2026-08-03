import type { Metadata } from 'next';
import Image from 'next/image';
import PageIntro from '@/components/PageIntro';
import Reveal from '@/components/ui/Reveal';
import TransitionLink from '@/components/ui/TransitionLink';
import { vehicles } from '@/lib/vehicles';

export const metadata: Metadata = {
  title: 'ABT Sportsline',
  description:
    'Die MOHR GROUP ist offizieller Vertragshändler für ABT Sportsline – Europas größten Veredler für Audi und Volkswagen.',
};

const facts = [
  { k: 'Gegründet', v: '1896 in Kempten' },
  { k: 'Marken', v: 'Audi · Volkswagen · SEAT · Cupra' },
  { k: 'Motorsport', v: 'DTM · Formel E · GT' },
  { k: 'Status', v: 'Offizieller Vertragshändler' },
];

const services = [
  {
    title: 'Leistung',
    text: 'Steuergeräte, Turbolader, Abgasanlage. ABT entwickelt am eigenen Prüfstand und gibt auf jede Stufe Garantie – die Freigabe kommt aus Kempten, nicht aus einer Kennfelddatei.',
  },
  {
    title: 'Aerodynamik',
    text: 'Breitbau, Frontsplitter, Heckflügel. Jedes Teil ist im Windkanal entstanden und wird als Carbon- oder GFK-Bauteil in Serienqualität gefertigt.',
  },
  {
    title: 'Räder & Fahrwerk',
    text: 'Geschmiedete Schmiederäder bis 23 Zoll, Gewindefahrwerke und Höhenverstellungen. Abgestimmt auf die jeweilige Baureihe, nicht auf einen Katalogwert.',
  },
  {
    title: 'Interieur',
    text: 'Leder, Alcantara, Carbon. Vom Schaltknauf bis zur kompletten Neubelederung – auf Wunsch mit eigener Steppung und Farbwahl.',
  },
];

export default function AbtPage() {
  const abtCars = vehicles.filter((v) => v.brand === 'ABT Sportsline').slice(0, 3);

  return (
    <>
      <PageIntro
        label="Vertragshändler"
        title="ABT Sportsline"
        lead="Seit 1896 in Kempten, heute Europas größter Veredler für Audi und Volkswagen. Was im Motorsport entsteht, findet den Weg auf die Straße – und die MOHR GROUP ist offizieller Vertragshändler dafür."
        image="/fahrzeuge/ABT_RSQ8-S.jpg"
        imageAlt="ABT RSQ8-S im Studio"
      />

      <section className="px-5 py-[clamp(4rem,9vh,7rem)] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <div className="relative mx-auto w-[min(60vw,15rem)]">
              <Image
                src="/logos/abt-sportsline-logo.png"
                alt="ABT Sportsline"
                width={331}
                height={130}
                className="h-auto w-full"
              />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <dl className="mt-[clamp(3rem,6vw,5rem)] grid gap-px border border-chrome/10 bg-chrome/10 sm:grid-cols-2 lg:grid-cols-4">
              {facts.map((f) => (
                <div key={f.k} className="bg-void px-6 py-7">
                  <dt className="label !text-[9px]">{f.k}</dt>
                  <dd className="font-display text-chrome-gradient mt-3 text-[clamp(1.1rem,2vw,1.5rem)]">
                    {f.v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-chrome/10 px-5 py-[clamp(4rem,9vh,7rem)] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <p className="label">Programm</p>
            <h2 className="font-display text-chrome-gradient mt-5 max-w-[18ch] text-[clamp(2rem,5.5vw,3.6rem)]">
              Vier Felder, ein Anspruch
            </h2>
          </Reveal>

          <div className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-px border border-chrome/10 bg-chrome/10 lg:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={0.05 * i}>
                <article className="h-full bg-void px-7 py-9 sm:px-9 sm:py-11">
                  <h3 className="font-display text-chrome-gradient text-[clamp(1.5rem,3vw,2.1rem)]">
                    {s.title}
                  </h3>
                  <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-ink/78">
                    {s.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-chrome/10 px-5 py-[clamp(4rem,9vh,7rem)] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <p className="label">Im Bestand</p>
            <h2 className="font-display text-chrome-gradient mt-5 text-[clamp(2rem,5.5vw,3.6rem)]">
              ABT bei MOHR
            </h2>
          </Reveal>

          <div className="mt-[clamp(2rem,4vw,3rem)] grid gap-5 sm:grid-cols-3">
            {abtCars.map((v, i) => (
              <Reveal key={v.slug} delay={0.06 * i}>
                <TransitionLink
                  href={`/fahrzeuge/${v.slug}`}
                  className="group block overflow-hidden border border-chrome/10"
                >
                  <span className="relative block aspect-[4/3] overflow-hidden">
                    <Image
                      src={v.hero}
                      alt={v.name}
                      fill
                      sizes="(min-width: 640px) 32vw, 92vw"
                      className="object-cover brightness-[0.72] contrast-[1.08] transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.05]"
                    />
                  </span>
                  <span className="block px-5 py-5">
                    <span className="label !text-[9px] !text-abt">ABT Sportsline</span>
                    <span className="font-display text-chrome-gradient mt-2 block text-[clamp(1.1rem,2vw,1.5rem)]">
                      {v.name}
                    </span>
                  </span>
                </TransitionLink>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.12}>
            <TransitionLink
              href="/fahrzeuge"
              className="group mt-10 inline-flex items-center gap-4 border border-chrome/25 px-7 py-4 text-sm transition-colors duration-500 hover:border-chrome/60 hover:bg-chrome/5"
            >
              <span>Alle Fahrzeuge</span>
              <span
                aria-hidden="true"
                className="block h-px w-7 bg-chrome transition-all duration-500 group-hover:w-10"
              />
            </TransitionLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
