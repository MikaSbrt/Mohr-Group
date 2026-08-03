/**
 * Ansichten der 3D-Studie zum ABT RS6-R.
 *
 * Das Modell ist im Original winzig (rund 0,05 Einheiten lang). Es wird beim
 * Laden mit `MODELL_SKALIERUNG` auf Meter gebracht, dadurch entspricht eine
 * Einheit hier einem Meter und die Werte unten lassen sich am realen Fahrzeug
 * nachvollziehen: Länge gut 5, Breite knapp 2,1, Höhe rund 1,5.
 *
 * Achsen nach glTF-Konvention: X quer, Y hoch, Z längs. **Die Front liegt bei
 * positivem Z**, das Heck bei negativem – am Modell nachgesehen, nicht
 * angenommen: eine Kamera bei −Z zeigt den Heckdeckel mit dem ABT-Schriftzug.
 */

export const MODELL_PFAD = '/modelle/abt-rs6-r.glb';
export const MODELL_SKALIERUNG = 100;

/** Blick auf das ganze Fahrzeug, zugleich der Ausgangszustand. */
export const GESAMTANSICHT = {
  kamera: [4.0, 1.5, 4.75] as const,
  ziel: [0, 0.68, 0] as const,
};

export type Detail = {
  id: string;
  titel: string;
  /** Kurzer Satz in der Legende. */
  text: string;
  /** Kennwert rechts in der Zeile, wo es einen gibt. */
  wert?: string;
  /** Kameraposition für diese Ansicht, in Metern. */
  kamera: readonly [number, number, number];
  /** Punkt, auf den die Kamera blickt. */
  ziel: readonly [number, number, number];
};

/*
 * Zum Bildausschnitt: das Ziel liegt bewusst nicht auf dem Detail selbst,
 * sondern ein Stück dahinter in Richtung Fahrzeugmitte. Zielt man genau auf
 * die Nase, schiebt die Perspektive den gesamten Aufbau dahinter aus dem
 * rechten Bildrand – das Fahrzeug „flieht“ aus dem Ausschnitt. Der versetzte
 * Zielpunkt hält die sichtbare Masse mittig.
 *
 * Ein Innenraum-Punkt war vorgesehen und ist wieder entfallen: hinter der
 * getönten Verglasung ist am Modell zu wenig zu erkennen, der Ausschnitt
 * zeigte im Ergebnis Tür und Dachkante statt Sitzen.
 */
export const details: Detail[] = [
  {
    id: 'front',
    titel: 'Frontschürze',
    text: 'Breitbau-Front mit Carbon-Splitter und geöffnetem Wabengitter.',
    wert: 'Carbon',
    /* Flach über dem Boden, damit Splitter und Schürze die Ansicht tragen.
       Tiefer geht nicht: die OrbitControls lassen den Blick nicht unter die
       Waagerechte, sonst sieht man unter das Fahrzeug. */
    kamera: [1.7, 0.78, 5.3],
    ziel: [0.1, 0.52, 1.9],
  },
  {
    id: 'licht',
    titel: 'Lichtsignatur',
    text: 'Schmale Scheinwerfer mit gestufter Tagfahrlichtgrafik.',
    wert: 'Matrix LED',
    kamera: [2.3, 1.05, 4.0],
    ziel: [0.7, 0.72, 2.15],
  },
  {
    id: 'rad',
    titel: 'ABT Schmiederad',
    text: 'Einteilige Schmiedefelge, dahinter die rot lackierte Bremsanlage.',
    wert: '22 Zoll',
    kamera: [3.9, 1.0, 3.5],
    ziel: [0.55, 0.5, 1.25],
  },
  {
    id: 'flanke',
    titel: 'Breitbau',
    text: 'Verbreiterte Kotflügel über beiden Achsen, dazu die Seitenschweller.',
    wert: '+ 4,5 cm',
    kamera: [5.3, 1.3, 0.25],
    ziel: [0.15, 0.72, 0],
  },
  {
    id: 'heck',
    titel: 'Heck und Dachkantenspoiler',
    text: 'Diffusor, vier Endrohre und der verlängerte Spoiler über der Klappe.',
    wert: '4 × 102 mm',
    kamera: [-2.85, 1.5, -5.9],
    ziel: [-0.05, 0.85, -1.6],
  },
];
