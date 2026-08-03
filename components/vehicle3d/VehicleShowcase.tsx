'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Reveal from '@/components/ui/Reveal';
import TransitionLink from '@/components/ui/TransitionLink';
import { details } from '@/lib/rs6-details';
import { useIntro } from '@/components/intro/IntroProvider';
import {
  useCoarsePointer,
  usePrefersReducedMotion,
  useWebGLSupport,
} from '@/lib/motion';

const VehicleCanvas = dynamic(() => import('./VehicleCanvas'), { ssr: false });

/**
 * Fahrzeugstudie am 3D-Modell.
 *
 * Die Legende ist die Steuerung: ein Klick fährt die Kamera an die Stelle,
 * ein zweiter auf denselben Punkt führt zurück zur Gesamtansicht. Mit der
 * Maus dreht Ziehen das Fahrzeug zusätzlich frei.
 *
 * Ohne WebGL steht hier die reale Aufnahme aus der Motorworld – dieselbe,
 * die zuvor die ganze Sektion trug (`components/VehicleStudy.tsx`).
 */

/** Vorschau ohne WebGL und Bezug zur echten Fahrzeugseite. */
const FAHRZEUG = {
  slug: 'abt-rs6-legacy-edition',
  name: 'ABT RS6 Legacy Edition',
  bild: '/fahrzeuge/ABT_RS6_Legacy_Edition_portfolio.jpg',
};

export default function VehicleShowcase() {
  const { stage } = useIntro();
  const reduced = usePrefersReducedMotion();
  const grob = useCoarsePointer();
  const webgl = useWebGLSupport();
  const [aktiv, setAktiv] = useState<string | null>(null);
  /* Mausrad-Zoom ist erst nach einem Klick in die Fläche frei. Ohne diese
     Sperre bliebe die Seite hängen, sobald jemand mit dem Zeiger über dem
     Fahrzeug weiterblättert – ein 3D-Fenster, das Scrollen frisst, ist
     ärgerlicher als ein Klick. Beim Verlassen wird wieder abgegeben. */
  const [zoomFrei, setZoomFrei] = useState(false);
  const [jeAktiviert, setJeAktiviert] = useState(false);

  /* Das 3D-Fenster wird erst aufgebaut, wenn man sich der Sektion nähert,
     und zeichnet nur, solange sie im Bild ist.

     Vorher entstand beides sofort beim Seitenaufruf – mitten in der
     Begrüßung. Das Entpacken und Aufbauen des Modells (271.000 Dreiecke,
     198 Meshes, Shader, Spiegelung) blockierte den Hauptstrang über sieben
     Sekunden: die Logos blieben stehen und Scrollen kam nicht an.

     `rootMargin` gibt gut einen Bildschirm Vorlauf, damit die Arbeit
     während des Scrollens dorthin passiert und nicht erst beim Ankommen.
     Einmal aufgebaut bleibt es stehen – ein zweiter Aufbau wäre teurer als
     ein ruhendes Fenster. */
  const buehneRef = useRef<HTMLDivElement>(null);
  const [aufgebaut, setAufgebaut] = useState(false);
  const [imBild, setImBild] = useState(false);

  useEffect(() => {
    const el = buehneRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setAufgebaut(true);
      setImBild(true);
      return;
    }
    const nah = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setAufgebaut(true);
          nah.disconnect();
        }
      },
      { rootMargin: '900px 0px' },
    );
    const sichtbar = new IntersectionObserver(([e]) => setImBild(e.isIntersecting), {
      rootMargin: '120px 0px',
    });
    nah.observe(el);
    sichtbar.observe(el);
    return () => {
      nah.disconnect();
      sichtbar.disconnect();
    };
  }, []);

  /* Zusätzlich: sobald die Begrüßung durch ist und der Hauptstrang wirklich
     nichts zu tun hat, wird schon aufgebaut – auch wenn die Sektion noch
     weit weg ist.

     Der Aufbau kostet auf schwacher Hardware ein paar Sekunden am Stück.
     Läuft er beim Heranscrollen, merkt man ihn als Ruckler; läuft er in
     einer Lesepause, merkt man ihn nicht. `requestIdleCallback` feuert
     genau dann nicht, wenn gerade gescrollt wird – im schlechtesten Fall
     bleibt es beim Verhalten von vorher. */
  useEffect(() => {
    if (aufgebaut || stage === 'running' || stage === 'welcome' || stage === 'zoom') return;
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (!w.requestIdleCallback) return;
    const id = w.requestIdleCallback(() => setAufgebaut(true), { timeout: 9000 });
    return () => w.cancelIdleCallback?.(id);
  }, [aufgebaut, stage]);

  return (
    <section
      id="studie"
      aria-labelledby="studie-titel"
      className="relative overflow-hidden border-y border-chrome/10 bg-carbon px-5 py-[clamp(4.5rem,10vh,8rem)] sm:px-8 lg:px-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(58% 52% at 66% 44%, rgba(94,140,190,0.14) 0%, transparent 70%)',
        }}
      />

      {/* Drei Blöcke statt zwei Spalten mit verschachteltem Inhalt: so steht
          auf schmalen Schirmen die Überschrift oben, darunter das Fahrzeug,
          darunter die Legende. Läge die Liste wie sonst über der Bühne,
          zoomte ein Antippen auf etwas außerhalb des Bildschirms. Ab `lg`
          rücken Kopf und Liste in die linke Spalte, die Bühne rechts über
          beide Zeilen. */}
      <div className="relative mx-auto grid max-w-[1500px] gap-[clamp(2rem,3.5vw,3.5rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-x-[clamp(2.5rem,4vw,4.5rem)]">
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <Reveal>
            <p className="label">Studie</p>
            <h2
              id="studie-titel"
              className="font-display text-chrome-gradient mt-5 max-w-[13ch] text-[clamp(2rem,5vw,3.4rem)]"
            >
              Der RS6-R, aus jedem Winkel
            </h2>
            <p className="mt-6 max-w-[44ch] text-[15px] leading-relaxed text-ink/80">
              {webgl === false
                ? 'Ihr Browser stellt kein 3D dar – hier die Aufnahme aus unserer Halle.'
                : grob
                  ? 'Mit zwei Fingern drehen und zoomen. Ein Tippen auf einen Punkt der Liste führt Sie an die Stelle heran.'
                  : 'Ziehen dreht das Fahrzeug, das Mausrad zoomt. Ein Klick auf einen Punkt der Liste führt Sie an die Stelle heran.'}
            </p>
          </Reveal>
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <div
            ref={buehneRef}
            className="relative aspect-[4/3] w-full overflow-hidden border border-chrome/10 bg-void/40 sm:aspect-[16/11]"
            onPointerDown={() => {
              setZoomFrei(true);
              setJeAktiviert(true);
            }}
            onPointerLeave={() => setZoomFrei(false)}
            /* Ohne das scrollt Lenis die Seite trotzdem weiter: der
               Sanftscroller hört global auf das Mausrad, ein `preventDefault`
               der OrbitControls erreicht ihn nicht. `data-lenis-prevent`
               lässt ihn Ereignisse in dieser Fläche auslassen – aber nur,
               solange der Zoom frei ist, sonst käme man hier nicht mehr
               vorbei. */
            {...(zoomFrei ? { 'data-lenis-prevent': '' } : {})}
          >
            {webgl === null ? (
              /* Noch nicht geprüft: leere Fläche statt Fallbackbild, sonst
                 lädt das Foto und wird sofort wieder ersetzt. */
              null
            ) : webgl && aufgebaut ? (
              <VehicleCanvas
                aktiv={aktiv}
                reduced={reduced}
                grob={grob}
                zoomFrei={zoomFrei}
                imBild={imBild}
              />
            ) : webgl ? null : (
              <Image
                src={FAHRZEUG.bild}
                alt={`${FAHRZEUG.name} in der Motorworld München`}
                fill
                sizes="(min-width: 1024px) 55vw, 92vw"
                className="object-cover brightness-[0.78] contrast-[1.08]"
              />
            )}

            {/* Hinweis nur, bis die Fläche einmal angeklickt wurde – danach
                weiß man es und der Hinweis hätte nur noch gestört. Am
                Fingergerät entfällt er, dort ist Zoom ohnehin frei. */}
            {webgl === true && !grob && !reduced && !jeAktiviert && (
              <p className="label pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-chrome/15 bg-void/70 px-4 py-2 !text-[9px] !text-ink-dim/80 backdrop-blur-sm">
                Klicken, dann mit dem Rad zoomen
              </p>
            )}
          </div>

          {/* Namensnennung ist Auflage der Lizenz (CC-BY-NC-SA 4.0), nicht
              Höflichkeit – sie muss sichtbar bleiben, solange das Modell
              eingebunden ist. */}
          <p className="mt-4 text-[10px] leading-relaxed text-ink-dim/55">
            {webgl === false ? (
              <>{FAHRZEUG.name} · Motorworld München</>
            ) : (
              <>
                3D-Modell „2020 ABT Sportline Audi RS6-R“ von{' '}
                <a
                  href="https://sketchfab.com/ddiaz-design"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-chrome/25 underline-offset-2 transition-colors hover:text-ink-dim"
                >
                  Ddiaz Design
                </a>
                , lizenziert unter{' '}
                <a
                  href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-chrome/25 underline-offset-2 transition-colors hover:text-ink-dim"
                >
                  CC-BY-NC-SA 4.0
                </a>
                . Nur für diesen nicht öffentlichen Entwurf.
              </>
            )}
          </p>
        </div>

        <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
          {webgl !== false && (
            <Reveal delay={0.08}>
              <ul className="border-t border-chrome/12">
                {details.map((d) => {
                  const offen = aktiv === d.id;
                  return (
                    <li key={d.id} className="border-b border-chrome/12">
                      <button
                        type="button"
                        onClick={() => setAktiv(offen ? null : d.id)}
                        aria-expanded={offen}
                        className={`group flex w-full items-center gap-4 py-4 text-left transition-colors duration-400 ${
                          offen ? 'text-chrome' : 'text-ink/75 hover:text-chrome'
                        }`}
                      >
                        {/* Der Strich wächst in der aktiven Zeile – das
                            ersetzt eine Nummerierung und bleibt ruhig. */}
                        <span
                          aria-hidden="true"
                          className={`block h-px shrink-0 bg-chrome transition-all duration-500 ${
                            offen ? 'w-9 opacity-90' : 'w-4 opacity-40 group-hover:w-7'
                          }`}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] uppercase tracking-[0.16em]">
                            {d.titel}
                          </span>
                          <span
                            className={`grid transition-all duration-500 ${
                              offen
                                ? 'mt-2 grid-rows-[1fr] opacity-100'
                                : 'grid-rows-[0fr] opacity-0'
                            }`}
                          >
                            <span className="overflow-hidden">
                              <span className="block max-w-[38ch] text-[13px] leading-relaxed text-ink-dim">
                                {d.text}
                              </span>
                            </span>
                          </span>
                        </span>
                        {d.wert && (
                          <span className="label shrink-0 !text-[9px] !text-ink-dim/70">
                            {d.wert}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          )}

          <Reveal delay={0.14}>
            <TransitionLink
              href={`/fahrzeuge/${FAHRZEUG.slug}`}
              className="group mt-9 inline-flex items-center gap-4 border border-chrome/25 px-7 py-4 text-sm transition-colors duration-500 hover:border-chrome/60 hover:bg-chrome/5"
            >
              <span>{FAHRZEUG.name} ansehen</span>
              <span
                aria-hidden="true"
                className="block h-px w-7 bg-chrome transition-all duration-500 group-hover:w-11"
              />
            </TransitionLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
