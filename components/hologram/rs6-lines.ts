import * as THREE from 'three';

/**
 * Kantenmodell eines RS6 Avant, prozedural aus Linienzügen.
 *
 * Grundlage sind die eigenen ABT-RS6-Aufnahmen im Bestand
 * (`public/fahrzeuge/ABT_RS6-S.jpg`, `ABT_RS6_Legacy_Edition_abtpage.jpg`):
 * daraus abgelesen sind Radstand, Dachverlauf, Schulterlinie, der Zuschnitt
 * des Single-Frame-Grills, die Lage der Ringe auf seiner Oberkante, die
 * segmentierte Tagfahrlichtgrafik und die beiden seitlichen Lufteinlässe.
 *
 * Bewusst kein Nachbau des realen Fahrzeugs, sondern eine Zeichnung seiner
 * Kanten – ein Designelement. Die Genauigkeit tragen die Fotos auf der
 * Fahrzeugseite.
 *
 * Koordinaten: X = Länge (−vorn / +hinten), Y = Höhe (0 = Boden), Z = Breite.
 */

export type P3 = [number, number, number];

/* ---- Hauptmaße, aus den Referenzfotos abgelesen ------------------------- */
export const FRONT = -2.44;
export const REAR = 2.42;
export const HALF_W = 0.86; // halbe Karosseriebreite
export const SILL = 0.22;
export const SHOULDER = 0.78; // Schulterlinie / Sicke
export const BELT = 0.92; // Fensterunterkante
export const ROOF = 1.43;
export const ARCH = 0.86; // Scheitel der Radhausbögen
export const AXLE_F = -1.45;
export const AXLE_R = 1.42;
export const WHEEL_R = 0.42;

/** Sammelt Linienzüge zu einer einzigen LineSegments-Geometrie. */
export class LineBuilder {
  private v: number[] = [];

  /** Verbindet die Punkte fortlaufend; `closed` schließt den Zug zum Ring. */
  strip(pts: P3[], closed = false) {
    for (let i = 0; i < pts.length - 1; i++) this.seg(pts[i], pts[i + 1]);
    if (closed && pts.length > 2) this.seg(pts[pts.length - 1], pts[0]);
    return this;
  }

  /** Wie `strip`, zusätzlich gespiegelt auf die andere Fahrzeugseite. */
  mirrored(pts: P3[], closed = false) {
    this.strip(pts, closed);
    this.strip(
      pts.map(([x, y, z]) => [x, y, -z] as P3),
      closed,
    );
    return this;
  }

  seg(a: P3, b: P3) {
    this.v.push(a[0], a[1], a[2], b[0], b[1], b[2]);
    return this;
  }

  /** Kreis in der YZ-Ebene bei festem X – für alles an Front und Heck. */
  circleYZ(x: number, cy: number, cz: number, r: number, seg = 32, closed = true) {
    const pts: P3[] = [];
    for (let i = 0; i < seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      pts.push([x, cy + Math.sin(a) * r, cz + Math.cos(a) * r]);
    }
    return this.strip(pts, closed);
  }

  /** Kreis in der XY-Ebene bei festem Z – für die Räder. Deren Achse muss
      quer zum Fahrzeug liegen, nicht längs. */
  circleXY(z: number, cx: number, cy: number, r: number, seg = 32, closed = true) {
    const pts: P3[] = [];
    for (let i = 0; i < seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, z]);
    }
    return this.strip(pts, closed);
  }

  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.v, 3));
    return g;
  }

  get count() {
    return this.v.length / 6;
  }
}

/* ------------------------------------------------------------------------ */
/* Seitenprofil für die Extrusion                                           */
/* ------------------------------------------------------------------------ */

/**
 * Die ausgeschnittenen Radhäuser sind entscheidend: ohne sie liest das
 * Extrusionsvolumen als Keil statt als Fahrzeug.
 */
export function buildBodyShape() {
  const s = new THREE.Shape();
  s.moveTo(FRONT, SILL);

  // vorderes Radhaus
  s.lineTo(-2.02, SILL);
  s.bezierCurveTo(-1.99, 0.62, AXLE_F - 0.3, ARCH, AXLE_F, ARCH);
  s.bezierCurveTo(AXLE_F + 0.3, ARCH, -0.91, 0.62, -0.88, SILL);

  // Schweller
  s.lineTo(0.86, SILL);

  // hinteres Radhaus
  s.bezierCurveTo(0.89, 0.62, AXLE_R - 0.3, ARCH, AXLE_R, ARCH);
  s.bezierCurveTo(AXLE_R + 0.3, ARCH, 1.95, 0.62, 1.98, SILL);

  // Heckschürze
  s.lineTo(2.4, SILL);
  s.lineTo(REAR + 0.04, 0.6);

  // Heckklappe, Dachkante nach vorn
  s.lineTo(2.32, 0.98);
  s.quadraticCurveTo(2.12, 1.22, 1.84, 1.33);
  s.lineTo(1.44, 1.4);
  s.lineTo(0.98, ROOF);
  s.lineTo(0.06, ROOF - 0.01);

  // A-Säule, Windschutzscheibe, Motorhaube
  s.quadraticCurveTo(-0.36, 1.3, -0.64, 1.02);
  s.lineTo(-0.9, 0.9);
  s.lineTo(-1.42, 0.85);
  s.lineTo(-1.96, 0.79);

  // Frontpartie
  s.quadraticCurveTo(-2.24, 0.72, -2.36, 0.6);
  s.lineTo(FRONT - 0.04, 0.4);
  s.closePath();
  return s;
}

/* ------------------------------------------------------------------------ */
/* Feinzeichnung: Flanken, Front, Heck                                      */
/* ------------------------------------------------------------------------ */

/** Fensterflächen, Sicken, Türfugen, Spiegel – alles was die Flanke gliedert. */
export function buildFlankLines() {
  const b = new LineBuilder();
  const z = HALF_W - 0.02;
  const zg = HALF_W - 0.14; // Glashaus zieht sich ein (Tumblehome)

  // Schulterlinie vom vorderen Radhaus bis zur Heckleuchte
  b.mirrored([
    [-1.9, SHOULDER, z],
    [-0.6, SHOULDER - 0.01, z],
    [1.0, SHOULDER + 0.02, z],
    [2.24, SHOULDER + 0.06, z],
  ]);

  // Untere Sicke / Schwellerkante
  b.mirrored([
    [-1.86, 0.4, z],
    [0.0, 0.36, z],
    [1.84, 0.4, z],
  ]);

  // Fenstergrafik: vordere Tür
  b.mirrored(
    [
      [-0.58, BELT + 0.04, zg],
      [-0.2, 1.26, zg],
      [0.42, 1.34, zg],
      [0.44, BELT + 0.02, zg],
    ],
    true,
  );

  // hintere Tür
  b.mirrored(
    [
      [0.52, BELT + 0.02, zg],
      [0.54, 1.35, zg],
      [1.28, 1.33, zg],
      [1.26, BELT, zg],
    ],
    true,
  );

  /* Das kleine Dreiecksfenster hinten ist bewusst weggelassen: als Linie
     legt es eine Diagonale quer über die Fensterfläche und liest im
     Drahtmodell als Fehler statt als Detail. */

  // Türfugen
  b.mirrored([
    [0.47, SILL + 0.04, z],
    [0.47, BELT + 0.02, z],
  ]);
  b.mirrored([
    [1.31, SILL + 0.04, z],
    [1.31, BELT, z],
  ]);
  b.mirrored([
    [-0.62, 0.3, z],
    [-0.6, BELT + 0.04, z],
  ]);

  // Außenspiegel an der Tür
  b.mirrored(
    [
      [-0.5, 1.0, z],
      [-0.36, 1.02, z + 0.16],
      [-0.24, 0.96, z + 0.16],
      [-0.4, 0.94, z],
    ],
    true,
  );

  // Motorhauben-Sicken
  b.mirrored([
    [-2.28, 0.68, 0.62],
    [-1.7, 0.8, 0.56],
    [-1.0, 0.86, 0.5],
  ]);

  // Dachreling
  b.mirrored([
    [0.1, ROOF + 0.02, 0.5],
    [1.5, 1.4, 0.48],
  ]);

  return b.build();
}

/** Front: Single-Frame-Grill, Scheinwerfer mit Tagfahrlicht, Lufteinlässe. */
export function buildFrontLines() {
  const b = new LineBuilder();
  const x = FRONT - 0.03;

  // Single-Frame-Grill
  b.strip(
    [
      [x, 0.72, -0.6],
      [x, 0.72, 0.6],
      [x, 0.56, 0.68],
      [x, 0.34, 0.5],
      [x, 0.34, -0.5],
      [x, 0.56, -0.68],
    ],
    true,
  );

  // Andeutung der Wabenstruktur – nur wenige Linien, kein Netz
  for (let i = 1; i <= 5; i++) {
    const zz = -0.5 + (i / 6) * 1.0;
    b.seg([x + 0.005, 0.7, zz], [x + 0.005, 0.36, zz]);
  }
  b.seg([x + 0.005, 0.53, -0.63], [x + 0.005, 0.53, 0.63]);

  // Scheinwerfer, keilförmig
  b.mirrored(
    [
      [x, 0.79, 0.64],
      [x, 0.81, 0.82],
      [x - 0.02, 0.74, 0.95],
      [x, 0.66, 0.9],
      [x, 0.64, 0.66],
    ],
    true,
  );

  // segmentiertes Tagfahrlicht
  for (let i = 0; i < 6; i++) {
    const zz = 0.68 + i * 0.042;
    b.seg([x - 0.01, 0.78, zz], [x - 0.01, 0.7, zz]);
    b.seg([x - 0.01, 0.78, -zz], [x - 0.01, 0.7, -zz]);
  }

  // seitliche Lufteinlässe
  b.mirrored(
    [
      [x, 0.32, 0.56],
      [x, 0.3, 0.88],
      [x, 0.14, 0.84],
      [x, 0.14, 0.52],
    ],
    true,
  );

  // Frontsplitter
  b.strip([
    [x - 0.02, 0.11, -0.92],
    [x - 0.02, 0.11, 0.92],
  ]);
  b.mirrored([
    [x - 0.02, 0.11, 0.92],
    [-2.1, 0.13, 0.94],
  ]);

  return b.build();
}

/** Die vier Ringe auf der Oberkante des Grills. */
export function buildAudiRings() {
  const b = new LineBuilder();
  const x = FRONT - 0.07;
  const r = 0.073;
  const gap = 0.112; // Ringe überschneiden sich, wie im Original
  for (let i = 0; i < 4; i++) {
    const cz = (i - 1.5) * gap;
    b.circleYZ(x, 0.72, cz, r, 30);
    b.circleYZ(x, 0.72, cz, r - 0.016, 30);
  }
  return b.build();
}

/** Heck: Leuchtenband, Diffusor, Endrohre, Dachspoiler. */
export function buildRearLines() {
  const b = new LineBuilder();
  const x = REAR + 0.03;

  // Heckleuchten
  b.mirrored(
    [
      [x, 0.74, 0.3],
      [x, 0.76, 0.8],
      [x, 0.66, 0.84],
      [x, 0.64, 0.32],
    ],
    true,
  );
  // Verbindungsstreifen
  b.seg([x, 0.7, -0.3], [x, 0.7, 0.3]);

  // Diffusor
  b.strip(
    [
      [x - 0.02, 0.3, -0.62],
      [x - 0.02, 0.3, 0.62],
      [x - 0.02, 0.14, 0.56],
      [x - 0.02, 0.14, -0.56],
    ],
    true,
  );
  for (let i = 1; i <= 4; i++) {
    const zz = -0.56 + (i / 5) * 1.12;
    b.seg([x - 0.01, 0.29, zz], [x - 0.01, 0.15, zz]);
  }

  // Endrohre
  b.mirrored([
    [x - 0.04, 0.26, 0.72],
    [x - 0.04, 0.2, 0.72],
  ]);

  // Dachspoiler
  b.mirrored([
    [1.86, 1.34, 0.5],
    [2.16, 1.24, 0.48],
  ]);
  b.strip([
    [2.16, 1.24, -0.48],
    [2.16, 1.24, 0.48],
  ]);

  return b.build();
}

/**
 * Rad mit Speichen und Bremsscheibe – ABT-Räder sind vielspeichig.
 * Liegt in der XY-Ebene, Achse quer zum Fahrzeug. Es wird um den Ursprung
 * gebaut und über `wheelPositions` gesetzt.
 */
export function buildWheel() {
  const b = new LineBuilder();
  const spokes = 20;
  const halfT = 0.085; // halbe Reifenbreite

  // Außenkontur beidseitig plus Mantellinien
  b.circleXY(halfT, 0, 0, WHEEL_R, 36);
  b.circleXY(-halfT, 0, 0, WHEEL_R, 36);
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const x = Math.cos(a) * WHEEL_R;
    const y = Math.sin(a) * WHEEL_R;
    b.seg([x, y, halfT], [x, y, -halfT]);
  }

  // Felgenbett und Nabe auf der Außenseite
  b.circleXY(halfT, 0, 0, WHEEL_R - 0.055, 32);
  b.circleXY(halfT + 0.005, 0, 0, 0.085, 16);

  // Speichen
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * Math.PI * 2;
    b.seg(
      [Math.cos(a) * 0.085, Math.sin(a) * 0.085, halfT],
      [Math.cos(a) * (WHEEL_R - 0.065), Math.sin(a) * (WHEEL_R - 0.065), halfT],
    );
  }

  // Bremsscheibe dahinter
  b.circleXY(-0.02, 0, 0, 0.235, 24);

  return b.build();
}

// Etwas eingezogen, damit die Räder in den Radhäusern sitzen und nicht
// über die Karosserie hinausstehen.
const WHEEL_Z = HALF_W - 0.12;

export const wheelPositions: P3[] = [
  [AXLE_F, WHEEL_R, WHEEL_Z],
  [AXLE_F, WHEEL_R, -WHEEL_Z],
  [AXLE_R, WHEEL_R, WHEEL_Z],
  [AXLE_R, WHEEL_R, -WHEEL_Z],
];
