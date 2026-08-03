import Image from 'next/image';

export default function SiteFooter() {
  return (
    <footer id="kontakt" className="border-t border-chrome/12 bg-carbon">
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-20 sm:px-8 md:grid-cols-[1.3fr_1fr] md:px-12 lg:px-16">
        <div>
          <Image
            src="/logos/mohr-group-logo.png"
            alt="MOHR GROUP"
            width={455}
            height={364}
            className="mb-8 h-16 w-auto"
          />
          <p className="font-display text-chrome-gradient max-w-[16ch] text-[clamp(2rem,4.5vw,3.75rem)]">
            Sprechen wir über Ihren Auftritt
          </p>
          <p className="mt-6 max-w-[46ch] text-sm leading-relaxed text-ink-dim">
            Dies ist ein unverbindlicher Konzeptentwurf für einen digitalen
            Markenauftritt der MOHR GROUP – kein Live-Angebot, keine
            Bestandsanzeige und keine verbindliche Fahrzeugbeschreibung.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
            <a
              href="mailto:kontakt@example.com"
              className="border-b border-chrome/25 pb-1 transition-colors hover:border-chrome hover:text-white"
            >
              kontakt@example.com
            </a>
            <a
              href="tel:+490000000000"
              className="border-b border-chrome/25 pb-1 transition-colors hover:border-chrome hover:text-white"
            >
              +49 000 000 00 00
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-10">
          <div>
            <p className="label mb-4">Standort</p>
            <p className="text-sm leading-relaxed text-ink">
              Motorworld München
              <br />
              München, Deutschland
            </p>
          </div>

          <div>
            <p className="label mb-4">Marken</p>
            <p className="text-sm leading-relaxed text-ink">
              ABT Sportsline · BRABUS · KTM X-BOW
              <br />
              sowie ausgewählte Sport- und Klassikfahrzeuge
            </p>
          </div>

          <p className="text-xs leading-relaxed text-ink-dim/80">
            Fahrzeugaufnahmen: Bildmaterial der MOHR GROUP. Alle Markenzeichen
            sind Eigentum der jeweiligen Rechteinhaber. Technische Angaben sind
            Beispieldaten dieses Entwurfs und unverbindlich.
          </p>
        </div>
      </div>
    </footer>
  );
}
