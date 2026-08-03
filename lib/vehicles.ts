/**
 * Fahrzeug-Datensatz für die Demo.
 *
 * Bilder: echte Aufnahmen aus dem Bestand der MOHR GROUP (public/fahrzeuge).
 * Technische Daten: Beispiel-/Herstellerangaben für den Konzeptentwurf –
 * bewusst als Demo-Daten gekennzeichnet, keine Bestandsanzeige.
 */

export type Vehicle = {
  slug: string;
  brand: 'ABT Sportsline' | 'BRABUS' | 'Ferrari' | 'Lamborghini' | 'McLaren' | 'Porsche' | 'KTM';
  name: string;
  /** Kurzer Titel-Zusatz unter dem Namen */
  subtitle: string;
  /** Ein Satz für Galerie-Kachel und Meta-Description */
  tagline: string;
  /** Zwei bis drei Sätze auf der Detailseite */
  body: string;
  year: string;
  specs: { label: string; value: string }[];
  /** Hauptaufnahme – bewusst ruhige/klare Hintergründe */
  hero: string;
  /** Weitere Aufnahmen für die Detail-Galerie */
  gallery: string[];
  /** Akzentfarbe der Detailseite */
  accent: string;
  /** Bildausschnitt für den Hero der Detailseite */
  heroPosition?: string;
};

export const vehicles: Vehicle[] = [
  {
    slug: 'abt-sq8',
    brand: 'ABT Sportsline',
    name: 'ABT SQ8',
    subtitle: 'Widebody · Sandfarben',
    tagline: 'Der SQ8 in ABT-Vollausbau – Breitbau, Schmiederad, kompromisslose Präsenz.',
    body: 'Ein SQ8, der nicht mehr diskutiert. ABT verbreitert die Karosserie, senkt die Achse und legt eine komplette Leistungsstufe nach. Der sandfarbene Lack nimmt dem Auftritt jede Angeberei – und macht ihn genau dadurch schwerer zu ignorieren.',
    year: '2024',
    specs: [
      { label: 'Leistung', value: '600 PS' },
      { label: 'Drehmoment', value: '850 Nm' },
      { label: '0–100 km/h', value: '4,1 s' },
      { label: 'Antrieb', value: 'quattro' },
    ],
    hero: '/fahrzeuge/ABT_SQ8_abtpage.jpg',
    gallery: ['/fahrzeuge/ABT_SQ8_1.jpg', '/fahrzeuge/ABT_SQ8_2.jpg'],
    accent: '#C9A227',
  },
  {
    slug: 'abt-rsq8-s',
    brand: 'ABT Sportsline',
    name: 'ABT RSQ8-S',
    subtitle: 'Signature Edition',
    tagline: 'Schwarz auf Glut: der RSQ8-S als Bühnenstück.',
    body: 'Der RSQ8-S ist ABTs Antwort auf die Frage, wie weit man einen SUV treiben darf. Carbon-Aerodynamik, 23-Zoll-Schmiederäder und eine Leistungsstufe, die den Wagen auf Supersportwagen-Niveau beschleunigt.',
    year: '2025',
    specs: [
      { label: 'Leistung', value: '700 PS' },
      { label: 'Drehmoment', value: '880 Nm' },
      { label: '0–100 km/h', value: '3,4 s' },
      { label: 'Räder', value: '23" ABT GR' },
    ],
    hero: '/fahrzeuge/ABT_RSQ8-S.jpg',
    gallery: ['/fahrzeuge/ABT_RSQ8_Legacy_Edition_abtpage.jpg', '/fahrzeuge/ABT_RSQ8_Legacy_Edition.jpg'],
    accent: '#E2001A',
  },
  {
    slug: 'abt-rs6-legacy-edition',
    brand: 'ABT Sportsline',
    name: 'ABT RS6 Legacy Edition',
    subtitle: 'Limitiert auf 200 Stück',
    tagline: '760 PS, 1000 Nm – und eine Nummer im Carbon, die es nur 200 Mal gibt.',
    body: 'Die Legacy Edition ist ABTs Hommage an die eigene Motorsport-Historie. Jedes Exemplar trägt eine eingelassene Seriennummer, das Aero-Kit ist vollständig aus Sichtcarbon gefertigt. Der Wagen wird nicht konfiguriert, er wird zugeteilt.',
    year: '2024',
    specs: [
      { label: 'Leistung', value: '760 PS' },
      { label: 'Drehmoment', value: '1000 Nm' },
      { label: '0–100 km/h', value: '3,2 s' },
      { label: 'Auflage', value: '200 Stück' },
    ],
    hero: '/fahrzeuge/ABT_RS6_Legacy_Edition_800.jpg',
    gallery: [
      '/fahrzeuge/ABT_RS6_Legacy_Edition_abtpage.jpg',
      '/fahrzeuge/ABT_RS6_Legacy_Edition_portfolio.jpg',
    ],
    accent: '#E2001A',
  },
  {
    slug: 'abt-xgt',
    brand: 'ABT Sportsline',
    name: 'ABT XGT',
    subtitle: 'Straßenzulassung aus dem GT2-Programm',
    tagline: 'Ein Rennwagen, dem man ein Kennzeichen erlaubt hat.',
    body: 'Der XGT basiert auf dem Audi R8 LMS GT2 und wurde von ABT für die Straße homologiert. Kohlefaser-Monocoque-Anmutung, Renn-Aerodynamik, ein Innenraum, der keine Kompromisse an Komfort macht. 99 Exemplare weltweit.',
    year: '2024',
    specs: [
      { label: 'Leistung', value: '640 PS' },
      { label: 'Motor', value: '5.2 V10' },
      { label: 'Auflage', value: '99 Stück' },
      { label: 'Basis', value: 'R8 LMS GT2' },
    ],
    hero: '/fahrzeuge/ABT_XGT_abtpage.jpg',
    gallery: ['/fahrzeuge/ABT_XGT_portfolio.webp'],
    accent: '#F25C05',
  },
  {
    slug: 'abt-urus-se',
    brand: 'ABT Sportsline',
    name: 'ABT Urus SE',
    subtitle: 'Plug-in-Hybrid',
    tagline: 'Der Urus, dem ABT das letzte bisschen Zurückhaltung genommen hat.',
    body: 'Die SE-Generation bringt einen Plug-in-Hybridantrieb in den Urus – ABT legt Aerodynamik und Fahrwerk darüber. Das Ergebnis fährt rein elektrisch durch die Innenstadt und danach mit vierstelligem Drehmoment über die Landstraße.',
    year: '2025',
    specs: [
      { label: 'Systemleistung', value: '800 PS' },
      { label: 'Drehmoment', value: '950 Nm' },
      { label: '0–100 km/h', value: '3,4 s' },
      { label: 'Antrieb', value: 'Plug-in-Hybrid' },
    ],
    hero: '/fahrzeuge/ABT_Urus_SE_abtpage.jpg',
    gallery: ['/fahrzeuge/ABT_URUS_SE_portfolio.webp', '/fahrzeuge/ABT_Urus_Scatenato.jpg'],
    accent: '#0FB5A6',
  },
  {
    slug: 'brabus-g800-superblack',
    brand: 'BRABUS',
    name: 'BRABUS G800',
    subtitle: 'Superblack',
    tagline: 'Alles schwarz. Auch das, was normalerweise glänzt.',
    body: 'Der G800 Superblack treibt die Idee der G-Klasse auf die Spitze: 800 PS aus dem aufgeladenen V8, Widestar-Verbreiterung, 24-Zoll-Monoblock. Jede Chromfläche ist ersetzt, jede Fuge dunkel ausgelegt.',
    year: '2024',
    specs: [
      { label: 'Leistung', value: '800 PS' },
      { label: 'Drehmoment', value: '1000 Nm' },
      { label: '0–100 km/h', value: '4,1 s' },
      { label: 'Räder', value: '24" Monoblock' },
    ],
    hero: '/fahrzeuge/BRABUS_G800_Superblack.jpg',
    gallery: ['/fahrzeuge/BRABUS_G800_1.jpg', '/fahrzeuge/BRABUS_800.jpg'],
    accent: '#C10000',
  },
  {
    slug: 'brabus-s930',
    brand: 'BRABUS',
    name: 'BRABUS S930',
    subtitle: 'Mercedes-AMG Basis',
    tagline: 'Die Limousine für Leute, die nicht gefahren werden wollen.',
    body: 'BRABUS nimmt die AMG-Basis und schärft sie in jedem Detail nach: Motorleistung, Aerodynamik, Fahrwerk, Interieur in Handarbeit aus Bottrop. Von außen fällt das nur denen auf, die wissen, wonach sie suchen.',
    year: '2024',
    specs: [
      { label: 'Leistung', value: '930 PS' },
      { label: 'Drehmoment', value: '1250 Nm' },
      { label: '0–100 km/h', value: '2,9 s' },
      { label: 'Interieur', value: 'BRABUS Fine Leather' },
    ],
    hero: '/fahrzeuge/BRABUS_S930.jpg',
    gallery: ['/fahrzeuge/S63_AMG_Coupe.webp', '/fahrzeuge/Mercedes-AMG_GT63_Collectors_Edition.webp'],
    accent: '#C10000',
  },
  {
    slug: 'ferrari-sf90-spider',
    brand: 'Ferrari',
    name: 'Ferrari SF90 Spider',
    subtitle: 'Assetto Fiorano',
    tagline: 'Tausend PS – und ein Dach, das in vierzehn Sekunden verschwindet.',
    body: 'Der SF90 Spider ist Ferraris erster Plug-in-Hybrid-Roadster und bis heute einer der schnellsten Wagen, die Maranello je gebaut hat. Drei Elektromotoren, ein V8-Biturbo, Allrad – und trotzdem ein klappbares Hardtop.',
    year: '2023',
    specs: [
      { label: 'Systemleistung', value: '1000 PS' },
      { label: '0–100 km/h', value: '2,5 s' },
      { label: 'Vmax', value: '340 km/h' },
      { label: 'Antrieb', value: 'V8 Hybrid, AWD' },
    ],
    hero: '/fahrzeuge/Ferrari_SF90_Spider.jpg',
    gallery: ['/fahrzeuge/Ferrari_488_GTB.webp', '/fahrzeuge/Ferrari_Purosangue.webp'],
    accent: '#D40000',
  },
  {
    slug: 'lamborghini-huracan-tecnica',
    brand: 'Lamborghini',
    name: 'Lamborghini Huracán Tecnica',
    subtitle: 'Der letzte Sauger',
    tagline: 'V10, Heckantrieb, keine Aufladung. So etwas wird nicht mehr gebaut.',
    body: 'Die Tecnica sitzt exakt zwischen EVO und STO: Rennwagen-Aerodynamik, aber alltagstauglich abgestimmt. Der 5,2-Liter-V10 dreht frei bis 8.500 Touren – ein Antriebskonzept, das mit dieser Generation endet.',
    year: '2023',
    specs: [
      { label: 'Leistung', value: '640 PS' },
      { label: 'Motor', value: '5.2 V10 Saugmotor' },
      { label: '0–100 km/h', value: '3,2 s' },
      { label: 'Antrieb', value: 'Heckantrieb' },
    ],
    hero: '/fahrzeuge/Lamborghini_Huracan_Tecnica.webp',
    gallery: ['/fahrzeuge/Lamborghini_Huracan_EVO.jpg', '/fahrzeuge/Lamborghini_Aventador_LP720-4_Roadster.jpg'],
    accent: '#C9A227',
  },
  {
    slug: 'mclaren-gt',
    brand: 'McLaren',
    name: 'McLaren GT',
    subtitle: 'Volcano Red',
    tagline: 'Der Supersportwagen, in den ein Wochenendkoffer passt.',
    body: 'McLarens Interpretation eines Grand Tourers: Carbon-Monocoque wie im 720S, aber mit Kofferraum, Federungskomfort und einer Sitzposition, in der man auch nach vierhundert Kilometern noch entspannt ist.',
    year: '2022',
    specs: [
      { label: 'Leistung', value: '620 PS' },
      { label: 'Drehmoment', value: '630 Nm' },
      { label: '0–100 km/h', value: '3,2 s' },
      { label: 'Chassis', value: 'Carbon MonoCell' },
    ],
    hero: '/fahrzeuge/McLaren_GT.jpg',
    gallery: ['/fahrzeuge/McLaren_570GT.jpg'],
    accent: '#E2001A',
  },
  {
    slug: 'porsche-911-turbo-33',
    brand: 'Porsche',
    name: 'Porsche 911 Turbo 3.3',
    subtitle: '930 Targa',
    tagline: 'Der Wagen, der der Baureihe ihren Ruf gegeben hat.',
    body: 'Der 930 Turbo war in den Achtzigern das schnellste in Deutschland gebaute Serienauto – und berüchtigt für sein Fahrverhalten am Limit. Heute ist er ein Sammlerstück, das man fährt, statt es einzulagern.',
    year: '1987',
    specs: [
      { label: 'Leistung', value: '300 PS' },
      { label: 'Motor', value: '3.3 Boxer Turbo' },
      { label: 'Getriebe', value: '4-Gang manuell' },
      { label: 'Aufbau', value: 'Targa' },
    ],
    hero: '/fahrzeuge/Porsche_911_Turbo_3.3.jpg',
    gallery: ['/fahrzeuge/Porsche_911_Turbo_3.0.webp', '/fahrzeuge/Porsche_964_Carrera_Cup.jpg'],
    accent: '#B9BAC0',
  },
  {
    slug: 'ktm-x-bow-gtx',
    brand: 'KTM',
    name: 'KTM X-BOW GTX',
    subtitle: 'Carbon-Monocoque',
    tagline: 'Kein Kompromiss, keine Türen, kein Gramm zu viel.',
    body: 'Der X-BOW GTX ist ein GT-Rennwagen aus Österreich, gebaut um ein Carbon-Monocoque von Wethje mit einem Audi-Fünfzylinder dahinter. Rund tausend Kilogramm Leergewicht sorgen für ein Leistungsgewicht, das kaum ein Straßenauto erreicht.',
    year: '2023',
    specs: [
      { label: 'Leistung', value: '530 PS' },
      { label: 'Motor', value: '2.5 TFSI 5-Zylinder' },
      { label: 'Gewicht', value: 'ca. 1.000 kg' },
      { label: 'Chassis', value: 'Carbon-Monocoque' },
    ],
    hero: '/fahrzeuge/KTM_X-BOW_GTX.jpg',
    gallery: ['/fahrzeuge/KTM_X-BOW_GT-XR.jpg'],
    accent: '#F25C05',
  },
];

export const getVehicle = (slug: string) => vehicles.find((v) => v.slug === slug);

/** Startseiten-Galerie: bewusst kuratiert, nicht alle 12. */
export const featuredSlugs = [
  'abt-rsq8-s',
  'abt-rs6-legacy-edition',
  'brabus-g800-superblack',
  'ferrari-sf90-spider',
  'abt-xgt',
  'mclaren-gt',
  'porsche-911-turbo-33',
  'ktm-x-bow-gtx',
];

export const featured = featuredSlugs
  .map((s) => getVehicle(s))
  .filter((v): v is Vehicle => Boolean(v));
