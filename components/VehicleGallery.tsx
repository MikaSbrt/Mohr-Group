'use client';

import VehicleCard from '@/components/VehicleCard';
import Reveal from '@/components/ui/Reveal';
import Magnetic from '@/components/ui/Magnetic';
import TransitionLink from '@/components/ui/TransitionLink';
import { featured } from '@/lib/vehicles';

/**
 * Editorialer Rhythmus statt gleichförmigem Raster:
 * Spaltenbreite und vertikaler Versatz wechseln bewusst durch.
 */
/* Jede Zeile summiert sich exakt auf 12 Spalten – sonst bleiben
   einzelne Spalten leer und der Rhythmus wirkt wie ein Fehler statt
   wie eine Entscheidung. Der Versatz macht die Bewegung, nicht die Lücke. */
const layout = [
  { span: 'lg:col-span-12', offset: '', aspect: 'aspect-[21/9]', sizes: '(min-width:1024px) 88vw, 92vw' },
  { span: 'lg:col-span-6', offset: '', aspect: 'aspect-[4/3]', sizes: '(min-width:1024px) 44vw, 92vw' },
  { span: 'lg:col-span-6', offset: 'lg:mt-20', aspect: 'aspect-[4/3]', sizes: '(min-width:1024px) 44vw, 92vw' },
  { span: 'lg:col-span-5', offset: '', aspect: 'aspect-[4/5]', sizes: '(min-width:1024px) 37vw, 92vw' },
  { span: 'lg:col-span-7', offset: 'lg:mt-24', aspect: 'aspect-[3/2]', sizes: '(min-width:1024px) 51vw, 92vw' },
  { span: 'lg:col-span-12', offset: '', aspect: 'aspect-[21/9]', sizes: '(min-width:1024px) 88vw, 92vw' },
  { span: 'lg:col-span-7', offset: '', aspect: 'aspect-[16/10]', sizes: '(min-width:1024px) 51vw, 92vw' },
  { span: 'lg:col-span-5', offset: 'lg:mt-16', aspect: 'aspect-[4/5]', sizes: '(min-width:1024px) 37vw, 92vw' },
];

export default function VehicleGallery() {
  return (
    <section
      id="fahrzeuge"
      aria-labelledby="fahrzeuge-titel"
      className="relative bg-void py-[clamp(6rem,14vh,11rem)]"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 md:px-12 lg:px-16">
        <Reveal className="mb-[clamp(3rem,7vw,6rem)] flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="label mb-5">Im Bestand</p>
            <h2
              id="fahrzeuge-titel"
              className="font-display text-chrome-gradient max-w-[12ch] text-[clamp(2.75rem,7.5vw,7rem)]"
            >
              Ausgewählte Fahrzeuge
            </h2>
          </div>

          <Magnetic strength={0.22}>
            <TransitionLink
              href="/fahrzeuge"
              className="hairline group inline-flex items-center gap-4 border px-7 py-4 text-sm transition-colors duration-500 hover:border-chrome hover:bg-chrome hover:text-black"
            >
              <span>Alle Fahrzeuge</span>
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </TransitionLink>
          </Magnetic>
        </Reveal>

        <div className="grid grid-cols-1 gap-x-8 gap-y-[clamp(3.5rem,7vw,6rem)] lg:grid-cols-12">
          {featured.map((v, i) => {
            const l = layout[i % layout.length];
            return (
              <Reveal
                key={v.slug}
                delay={(i % 2) * 0.08}
                className={`${l.span} ${l.offset}`}
              >
                <VehicleCard
                  vehicle={v}
                  index={i}
                  aspect={l.aspect}
                  priority={i < 2}
                  sizes={l.sizes}
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
