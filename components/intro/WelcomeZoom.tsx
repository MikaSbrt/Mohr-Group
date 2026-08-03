'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Der Durchflug durch „Herzlich Willkommen“.
 *
 * Die Schrift ist hier kein Text, sondern ein Loch: eine schwarze Fläche
 * über der ganzen Seite, aus der die Buchstaben ausgespart sind. Dadurch ist
 * die Startseite ausschließlich *durch* die Schrift zu sehen. Beim Scrollen
 * wächst sie, bis ein einzelner Buchstabe das Bild ausfüllt – dann ist die
 * Fläche weg und man steht auf der Seite.
 *
 * Warum nicht `background-clip: text`: das färbt Schrift mit einem Bild,
 * kann aber nichts aus einer Fläche herausschneiden. Eine SVG-Maske kann
 * genau das – weiß deckt, schwarz stanzt aus.
 *
 * Warum alles im SVG und nichts in HTML: eine CSS-Skalierung auf HTML-Text
 * vergrößert dessen bereits gerastertes Bild, die Schrift verwischt dabei
 * sichtbar. Im SVG wird bei jeder Größe neu aus der Kontur gezeichnet.
 */

/* Das Ziel des Durchflugs: das „I“ von WILLKOMMEN. Ein voller senkrechter
   Balken, also durchgehend Fläche – zoomt man auf einen Punkt darin, wächst
   diese Fläche über den ganzen Bildschirm. Der Wortmittelpunkt taugt dafür
   nicht: dort liegt das Leerzeichen, und durch ein Leerzeichen kommt man
   nicht hindurch. */
const TEXT = 'HERZLICH WILLKOMMEN';
const ZIELBUCHSTABE = 10;

/* Größte Vergrößerung. Großzügig gewählt: der Balken des „I“ ist bei
   50 px Schriftgrad nur rund acht Pixel breit, er muss also weit über
   Hundertfach wachsen, bevor er ein Fenster von 1440 px Breite ausfüllt.
   Bei zu kleinem Wert bliebe links und rechts vom Balken Seite sichtbar und
   der Schluss käme allein aus dem Ausblenden – der Durchflug wäre dann kein
   Durchflug. */
const MAX_SKALIERUNG = 320;

/** Nur noch eine Sicherung ganz am Ende, kein gestalterisches Mittel. */
const AUSBLENDE_AB = 0.94;

/** Der helle Schriftzug tritt früh zurück und überlässt der Maske das Bild. */
const CHROM_BIS = 0.12;

/** Wo die Schrift steht und wie groß sie ist – am Vorhang abgemessen. */
export type Anker = { x: number; y: number; grad: number };

export default function WelcomeZoom({
  fortschritt,
  anker,
}: {
  fortschritt: number;
  anker: Anker;
}) {
  const [mass, setMass] = useState({ b: 1440, h: 900 });
  const textRef = useRef<SVGTextElement>(null);
  /** Mittelpunkt des Zielbuchstabens, in Bildkoordinaten. */
  const [ziel, setZiel] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const messen = () => setMass({ b: window.innerWidth, h: window.innerHeight });
    messen();
    window.addEventListener('resize', messen);
    return () => window.removeEventListener('resize', messen);
  }, []);

  /* Die Lage des Buchstabens wird am gerenderten Text erfragt, nicht
     geschätzt: Zeichenbreiten hängen an der Schrift, und schon ein paar
     Pixel daneben hieße, man führe am Balken vorbei statt hindurch. */
  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    try {
      const e = el.getExtentOfChar(ZIELBUCHSTABE);
      setZiel({ x: e.x + e.width / 2, y: e.y + e.height / 2 });
    } catch {
      /* Sollte die Schrift noch nicht geladen sein, bleibt es beim
         Wortmittelpunkt – sichtbar wäre nur ein etwas anderer Fluchtpunkt. */
      setZiel(null);
    }
  }, [mass, anker]);

  const { b, h } = mass;
  const p = Math.min(1, Math.max(0, fortschritt));

  /* Exponentiell, nicht linear: am Anfang öffnet sich die Schrift langsam
     und lesbar, zum Schluss rauscht sie vorbei. Linear fühlte sich an, als
     würde man an einem Bild ziehen, nicht als würde man hineinfahren. */
  const k = Math.pow(MAX_SKALIERUNG, p);

  const zx = ziel?.x ?? anker.x;
  const zy = ziel?.y ?? anker.y;

  /* Der Buchstabe wandert während des Zooms in die Bildmitte – sonst führe
     man an ihm vorbei statt hindurch. */
  const mx = zx + (b / 2 - zx) * p;
  const my = zy + (h / 2 - zy) * p;
  const verwandlung = `translate(${mx} ${my}) scale(${k}) translate(${-zx} ${-zy})`;

  const deckkraft =
    p <= AUSBLENDE_AB ? 1 : 1 - (p - AUSBLENDE_AB) / (1 - AUSBLENDE_AB);
  const chrom = Math.max(0, 1 - p / CHROM_BIS);

  const schrift = {
    fontFamily: 'var(--font-display)',
    fontSize: anker.grad,
    letterSpacing: '0.02em',
  } as const;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ opacity: deckkraft }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${b} ${h}`}
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        <defs>
          <mask id="mg-willkommen" maskUnits="userSpaceOnUse" x="0" y="0" width={b} height={h}>
            {/* Weiß deckt, Schwarz stanzt aus. */}
            <rect x="0" y="0" width={b} height={h} fill="#ffffff" />
            <g transform={verwandlung}>
              <text
                x={anker.x}
                y={anker.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#000000"
                style={schrift}
              >
                {TEXT}
              </text>
            </g>
          </mask>

          {/* Derselbe Verlauf wie `.text-chrome-gradient`, nur als SVG. 176°
              entspricht einer fast senkrechten Achse von oben nach unten. */}
          <linearGradient id="mg-chrom" x1="0" y1="0" x2="0.07" y2="1">
            <stop offset="2%" stopColor="#ffffff" />
            <stop offset="22%" stopColor="#f4f5f7" />
            <stop offset="48%" stopColor="#b9bac0" />
            <stop offset="74%" stopColor="#74767d" />
            <stop offset="100%" stopColor="#b9bac0" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width={b} height={h} fill="#050506" mask="url(#mg-willkommen)" />

        {/* Der helle Schriftzug liegt über der Maske und tritt früh zurück.
            Ohne ihn spränge der Chromverlauf des Vorhangs hart auf die
            dunkle Aussparung um. Er trägt zugleich die Messung: an ihm wird
            die Lage des Zielbuchstabens erfragt. */}
        <g transform={verwandlung}>
          <text
            ref={textRef}
            x={anker.x}
            y={anker.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="url(#mg-chrom)"
            opacity={chrom}
            style={schrift}
          >
            {TEXT}
          </text>
        </g>
      </svg>
    </div>
  );
}
