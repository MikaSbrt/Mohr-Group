/**
 * Die fünf Vertragspartner der MOHR GROUP.
 *
 * Wird gemeinsam von der Intro-Sequenz und der Vertragspartner-Sektion
 * genutzt, damit Reihenfolge und Logo-Zuordnung nur an einer Stelle stehen.
 *
 * `w`/`h` sind die echten Pixelmaße der freigestellten Logodateien. Sie
 * unterscheiden sich stark (TECHART ist ein 13:1-Schriftzug, ZENVO ein fast
 * quadratisches Emblem), deshalb wird im Layout immer über eine feste Box
 * mit `object-contain` skaliert statt über eine gemeinsame Breite.
 */
export type Partner = {
  key: string;
  name: string;
  logo: string;
  w: number;
  h: number;
  /** Logo liegt als schwarze Pfade vor und muss auf dunklem Grund invertiert werden. */
  invertLogo?: boolean;
  /**
   * Feinabgleich für die Begrüßungssequenz.
   *
   * `object-contain` setzt alle Logos in dieselbe Box – das macht sie aber
   * nicht vergleichbar. ABT, TECHART und KTM sind reine Schriftzüge, ihre
   * Schrift sitzt auf der Boxmitte. BRABUS und ZENVO sind gestapelte Zeichen
   * (Emblem plus Schriftzug); bei ihnen liegt die Schrift darunter bzw.
   * darüber. Beim Überblenden springt die Schriftlinie dadurch sichtbar.
   *
   * `introOffsetY` verschiebt das Zeichen so, dass die *Schriftzüge* aller
   * fünf auf einer Linie liegen. Angabe in Prozent der eigenen Höhe, damit
   * der Abgleich auf jeder Boxgröße gleich bleibt.
   */
  introOffsetY?: number;
  /** Optische Größe angleichen, falls ein Zeichen zu dominant oder zu zart wirkt. */
  introScale?: number;
  claim: string;
  text: string;
  /** Streiflicht der Kachel. Nur dort farbig, wo die Marke wirklich eine Farbe führt. */
  glow: string;
  /** Hintergrundbild der Kachel. Fehlt es, trägt ein Grafitverlauf die Fläche. */
  image?: string;
  imageClass?: string;
  href?: string;
};

export const partners: Partner[] = [
  {
    key: 'abt',
    name: 'ABT Sportsline',
    logo: '/logos/abt-sportsline-logo.png',
    w: 331,
    h: 130,
    // Die Masse sitzt im oberen Teil des Schriftzugs, der Schwerpunkt lag
    // 13 px über der Boxmitte.
    introOffsetY: 11,
    claim: 'Seit 1896',
    text: 'Europas größter Veredler für Audi und Volkswagen. Was in Kempten entwickelt wird, kommt aus dem Motorsport – und geht auch dorthin zurück.',
    glow: 'rgba(226,0,26,0.42)',
    image: '/fahrzeuge/ABT_RSQ8-S.jpg',
    imageClass: 'opacity-70 contrast-[1.08] brightness-[0.55] saturate-[0.85]',
    href: '/abt-sportsline',
  },
  {
    key: 'brabus',
    name: 'BRABUS',
    logo: '/logos/brabus-logo.svg',
    w: 709,
    h: 311,
    invertLogo: true,
    // Emblem über dem Schriftzug – ohne Versatz sitzt „BRABUS“ zu tief.
    introOffsetY: -30,
    claim: 'Handarbeit aus Bottrop',
    text: 'Der Maßstab für Mercedes-Veredelung. Motor, Aerodynamik, Interieur – jedes Teil wird ersetzt, nicht ergänzt.',
    glow: 'rgba(193,0,0,0.42)',
    image: '/fahrzeuge/BRABUS_G800_Superblack.jpg',
    imageClass: 'opacity-55 grayscale-[0.85] contrast-[1.25] brightness-[0.44]',
  },
  {
    key: 'techart',
    name: 'TECHART',
    logo: '/logos/techart-logo.png',
    w: 365,
    h: 28,
    introOffsetY: 2,
    claim: 'Manufaktur für Porsche',
    text: 'Individualisierung auf Werksniveau: Aerodynamik, Fahrwerk und Interieur für jede aktuelle Porsche-Baureihe.',
    // TECHART führt keine Signalfarbe – ein kühles Stahlgrau bleibt markengerecht.
    glow: 'rgba(150,166,184,0.30)',
    // Ruhiger Showroom-Hintergrund; die Motorworld-Aufnahmen zeigen die
    // Markenwand der Halle und wären unter einem TECHART-Logo verwirrend.
    image: '/fahrzeuge/Porsche_911_Carrera_4_GTS_1.webp',
    imageClass: 'opacity-50 grayscale-[0.75] contrast-[1.2] brightness-[0.42]',
  },
  {
    key: 'zenvo',
    name: 'ZENVO',
    logo: '/logos/zenvo-logo.png',
    w: 827,
    h: 729,
    // Schriftzug liegt im oberen Drittel des Emblems, muss also leicht herunter.
    introOffsetY: 5,
    // Das Zeichen ist fast quadratisch und wirkt neben den Schriftzügen zart.
    introScale: 1.12,
    claim: 'Hypercars aus Dänemark',
    text: 'Kleinserie in Handarbeit, jedes Fahrzeug ein Einzelstück. Zenvo baut keine Autos in Stückzahlen, sondern in Kapiteln.',
    glow: 'rgba(150,166,184,0.26)',
    // Kein passendes Fahrzeugfoto im Bestand – die Kachel trägt bewusst nur Grafit.
  },
  {
    key: 'ktm',
    name: 'KTM X-BOW',
    logo: '/logos/ktm-xbow-logo.png',
    w: 288,
    h: 49,
    introOffsetY: -6,
    claim: 'Ready to Race',
    text: 'Carbon-Monocoque, kein Gramm zu viel. Der X-BOW bringt Rennstreckenphysik auf die Straße.',
    glow: 'rgba(255,102,0,0.34)',
    image: '/fahrzeuge/KTM_X-BOW_GT-XR.jpg',
    imageClass: 'opacity-60 grayscale-[0.5] contrast-[1.15] brightness-[0.5]',
  },
];
