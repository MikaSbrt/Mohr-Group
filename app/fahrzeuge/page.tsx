import type { Metadata } from 'next';
import VehicleCard from '@/components/VehicleCard';
import Reveal from '@/components/ui/Reveal';
import { vehicles } from '@/lib/vehicles';

export const metadata: Metadata = {
  title: 'Fahrzeuge',
  description:
    'Ausgewählte Fahrzeuge der MOHR GROUP – ABT Sportsline, BRABUS und Sportwagen aus dem Bestand. Konzeptentwurf.',
};

export default function FahrzeugePage() {
  return (
    <div className="bg-void pt-[clamp(8rem,18vh,12rem)] pb-[clamp(6rem,14vh,11rem)]">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 md:px-12 lg:px-16">
        <Reveal className="mb-[clamp(3rem,7vw,6rem)]">
          <p className="label mb-5">Bestand · {vehicles.length} Fahrzeuge</p>
          <h1 className="font-display text-chrome-gradient max-w-[11ch] text-[clamp(3rem,9vw,8rem)]">
            Fahrzeuge
          </h1>
          <p className="mt-8 max-w-[52ch] leading-relaxed text-ink-dim">
            Eine Auswahl aus dem Bestand der MOHR GROUP. Veredelte Fahrzeuge von
            ABT Sportsline und BRABUS, dazu Sportwagen und Klassiker, die man
            nicht in jeder Halle findet.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-x-8 gap-y-[clamp(3.5rem,6vw,5.5rem)] md:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((v, i) => (
            <Reveal key={v.slug} delay={(i % 3) * 0.07}>
              <VehicleCard
                vehicle={v}
                index={i}
                aspect="aspect-[4/3]"
                priority={i < 3}
                sizes="(min-width: 1280px) 30vw, (min-width: 768px) 46vw, 92vw"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
