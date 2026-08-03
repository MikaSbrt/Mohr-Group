'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Lightformer,
  MeshReflectorMaterial,
  OrbitControls,
  useGLTF,
} from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  GESAMTANSICHT,
  MODELL_PFAD,
  MODELL_SKALIERUNG,
  details,
} from '@/lib/rs6-details';

/* Der Draco-Dekoder liegt unter `public/draco/` im Projekt. Ohne diese
   Angabe holt drei ihn von einem Google-CDN – eine Fremdanfrage, die wir für
   eine Seite mit fünf Zeilen Inhalt nicht brauchen und die offline scheitert. */
const DRACO = '/draco/';

useGLTF.preload(MODELL_PFAD, DRACO);

/** Materialnamen aus dem Modell, an denen die Beleuchtung hängt. */
const MAT_LEUCHTE = 'BLight_Geo_lodASG1';
const MAT_ROTGLAS = 'red_glass';

/** Eine ausgemessene Leuchte: Mittelpunkt im Raum, vorn oder hinten. */
type Lampe = { p: [number, number, number]; rot: boolean };

/**
 * Ermittelt die Mittelpunkte der vier Leuchteinheiten aus dem Modell.
 *
 * Zuvor standen die Lampen auf geschätzten Werten. Sie saßen dadurch vor der
 * Haube statt in den Scheinwerfern und leuchteten das Fahrzeug von außen an –
 * das las als Flutlicht, nicht als eingeschaltete Beleuchtung.
 *
 * Hier wird stattdessen über die Eckpunkte der Leuchtengeometrie gemittelt,
 * getrennt nach vorn/hinten (Vorzeichen von Z) und links/rechts (Vorzeichen
 * von X). Nur Punkte jenseits von einem Meter aus der Mitte zählen, damit
 * Zierteile in der Fahrzeugmitte das Ergebnis nicht verziehen.
 */
function lampenAusModell(scene: THREE.Object3D): Lampe[] {
  scene.updateWorldMatrix(true, true);

  const gruppen = new Map<string, { s: THREE.Vector3; n: number; rot: boolean }>();
  const v = new THREE.Vector3();

  scene.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    const name = (o.material as THREE.Material | undefined)?.name;
    const rot = name === MAT_ROTGLAS;
    if (name !== MAT_LEUCHTE && !rot) return;

    const pos = o.geometry.getAttribute('position');
    if (!pos) return;

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos as THREE.BufferAttribute, i).applyMatrix4(o.matrixWorld);
      if (Math.abs(v.z) < 1) continue;
      const key = `${v.z >= 0 ? 'v' : 'h'}${v.x >= 0 ? 'l' : 'r'}`;
      let g = gruppen.get(key);
      if (!g) {
        g = { s: new THREE.Vector3(), n: 0, rot: v.z < 0 };
        gruppen.set(key, g);
      }
      g.s.add(v);
      g.n++;
    }
  });

  return [...gruppen.values()]
    .filter((g) => g.n > 0)
    .map((g) => ({
      p: [g.s.x / g.n, g.s.y / g.n, g.s.z / g.n] as [number, number, number],
      rot: g.rot,
    }));
}

function Fahrzeug({ onLampen }: { onLampen: (l: Lampe[]) => void }) {
  const { scene } = useGLTF(MODELL_PFAD, DRACO);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    scene.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;

      /* Bewusst gegen `MeshStandardMaterial` geprüft, nicht gegen
         `MeshPhysicalMaterial`: der glTF-Loader erzeugt Letzteres nur, wo
         Erweiterungen wie Transmission oder Clearcoat im Spiel sind. Das
         Scheinwerfermaterial ist ein gewöhnliches Standardmaterial und wurde
         von der engeren Abfrage übersprungen – die Leuchten blieben dunkel.
         Physical erbt von Standard, diese Prüfung erfasst also beide. */
      const m = o.material;
      if (!(m instanceof THREE.MeshStandardMaterial)) return;
      m.envMapIntensity = 1.15;

      /* Lackflächen kommen ohne Klarlack aus dem Export. Erst der Clearcoat
         macht aus Grau echten Autolack. */
      if (
        m instanceof THREE.MeshPhysicalMaterial &&
        m.metalness > 0.5 &&
        m.roughness < 0.5
      ) {
        m.clearcoat = 1;
        m.clearcoatRoughness = 0.06;
      }

      /* Scheinwerfer und Rückleuchten zum Leuchten bringen.

         Entscheidend ist `emissiveMap`: als Leuchtvorlage dient dieselbe
         Textur wie für die Farbe. Ohne sie würde das ganze Gehäuse gleich
         hell glühen, mit ihr leuchten nur die hellen Stellen – also genau
         die Lichtleiter und LED-Bänder, das dunkle Gehäuse bleibt dunkel.

         `toneMapped = false` nimmt die Flächen aus der Belichtungskurve
         heraus. Die Szene ist bewusst dunkel abgestimmt (Exposure 0,74);
         ohne diese Ausnahme würden die Lichter mit abgedunkelt und wirkten
         nur hellgrau statt eingeschaltet. */
      if (m.name === MAT_LEUCHTE) {
        m.emissive = new THREE.Color('#dceaff');
        m.emissiveMap = m.map;
        m.emissiveIntensity = 1.9;
        m.toneMapped = false;
      }

      /* Die roten Heckscheiben liegen als durchscheinendes Glas vor. Etwas
         weniger Transmission, dafür Eigenleuchten: so liest es als
         eingeschaltetes Rücklicht und nicht als rote Scheibe. */
      if (m instanceof THREE.MeshPhysicalMaterial && m.name === MAT_ROTGLAS) {
        m.emissive = new THREE.Color('#ff2010');
        m.emissiveIntensity = 1.5;
        m.transmission = 0.3;
        m.toneMapped = false;
      }
    });

    /* Bei `frameloop="demand"` (Reduced Motion) zeichnet R3F nur auf
       Anforderung. Das Modell ist erst nach dem ersten und einzigen Bild
       fertig – ohne diesen Anstoß bliebe die Fläche leer. Mehrfach, damit
       auch Bodenschatten und Spiegelung ihre Berechnung abschließen. */
    onLampen(lampenAusModell(scene));

    invalidate();
    const t1 = setTimeout(invalidate, 80);
    const t2 = setTimeout(invalidate, 400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [scene, invalidate, onLampen]);

  return <primitive object={scene} scale={MODELL_SKALIERUNG} />;
}

/**
 * Die Halle um das Fahrzeug.
 *
 * Zuvor stand der Wagen im leeren Schwarz und schwebte dadurch. Drei Dinge
 * geben ihm einen Ort: ein spiegelnder Boden, an dem die Räder aufsetzen,
 * Lichtbänder über ihm, die sich darin abzeichnen, und eine dunkle Rundwand,
 * die den Raum schließt, ohne dass man eine Kante sieht.
 */
function Halle({ grob }: { grob: boolean }) {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position-y={0} receiveShadow>
        <planeGeometry args={[70, 70]} />
        {/* Polierter Estrich: spiegelt, aber weich. Eine scharfe Spiegelung
            sähe nach Wasser aus, nicht nach Hallenboden. Auflösung am
            Fingergerät halbiert – der Boden wird für die Spiegelung ein
            zweites Mal gezeichnet. */}
        <MeshReflectorMaterial
          resolution={grob ? 192 : 384}
          blur={[600, 190]}
          mixBlur={1.1}
          mixStrength={2.6}
          depthScale={1.1}
          minDepthThreshold={0.35}
          maxDepthThreshold={1.4}
          color="#0a0b0d"
          metalness={0.62}
          roughness={0.88}
          mirror={0}
        />
      </mesh>

      {/* Standmarkierung, wie sie auf den Aufnahmen aus der Halle unter den
          Fahrzeugen liegt. */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.004}>
        <ringGeometry args={[3.15, 3.28, 96]} />
        <meshBasicMaterial
          color="#9fb8d4"
          transparent
          opacity={0.22}
          toneMapped={false}
        />
      </mesh>

      {/* Lichtbänder unter der Decke. Sie leuchten selbst und sind vor allem
          als Streifen im Boden zu sehen – das macht die Halle aus. */}
      {[-3.4, 0, 3.4].map((x) => (
        <mesh key={x} position={[x, 6.2, 0]} rotation-x={Math.PI / 2}>
          <planeGeometry args={[0.85, 17]} />
          <meshBasicMaterial color="#cdddf2" toneMapped={false} />
        </mesh>
      ))}

      {/* Rundwand statt Ecken: Der Nebel lässt sie ausklingen, dadurch hat
          der Raum eine Begrenzung, aber keine sichtbare Kante. */}
      <mesh position-y={8}>
        <cylinderGeometry args={[21, 21, 22, 64, 1, true]} />
        <meshStandardMaterial
          color="#0e1013"
          side={THREE.BackSide}
          roughness={1}
          metalness={0}
        />
      </mesh>
    </group>
  );
}

/**
 * Führt die Kamera weich zur gewählten Ansicht.
 *
 * Es wird nicht die Kamera direkt gesetzt, sondern zusammen mit dem
 * Blickpunkt der OrbitControls interpoliert – sonst springt beim ersten
 * eigenen Ziehen die Ansicht zurück, weil die Controls noch das alte Ziel
 * halten.
 */
function Kamerafahrt({
  aktiv,
  reduced,
  controls,
}: {
  aktiv: string | null;
  reduced: boolean;
  controls: React.RefObject<OrbitControlsImpl | null>;
}) {
  const { camera, invalidate } = useThree();
  const zielPos = useRef(new THREE.Vector3(...GESAMTANSICHT.kamera));
  const zielBlick = useRef(new THREE.Vector3(...GESAMTANSICHT.ziel));
  const faehrt = useRef(false);

  useEffect(() => {
    const d = aktiv ? details.find((x) => x.id === aktiv) : null;
    const ansicht = d ?? GESAMTANSICHT;
    zielPos.current.set(...(ansicht.kamera as unknown as [number, number, number]));
    zielBlick.current.set(...(ansicht.ziel as unknown as [number, number, number]));

    if (reduced) {
      camera.position.copy(zielPos.current);
      if (controls.current) {
        controls.current.target.copy(zielBlick.current);
        controls.current.update();
      }
      invalidate();
      return;
    }
    faehrt.current = true;
  }, [aktiv, reduced, camera, controls, invalidate]);

  useFrame((_, dt) => {
    if (!faehrt.current || !controls.current) return;
    /* Bildratenunabhängig: bei 30 fps sind die Schritte doppelt so groß wie
       bei 60, die Fahrt dauert dadurch gleich lang. */
    const t = 1 - Math.pow(0.0016, dt);
    camera.position.lerp(zielPos.current, t);
    controls.current.target.lerp(zielBlick.current, t);
    controls.current.update();

    if (
      camera.position.distanceTo(zielPos.current) < 0.02 &&
      controls.current.target.distanceTo(zielBlick.current) < 0.02
    ) {
      camera.position.copy(zielPos.current);
      controls.current.target.copy(zielBlick.current);
      controls.current.update();
      faehrt.current = false;
    }
  });

  return null;
}

export default function VehicleCanvas({
  aktiv,
  reduced,
  grob,
  zoomFrei,
  imBild,
}: {
  aktiv: string | null;
  reduced: boolean;
  /** Fingerbedienung: dann darf ein Finger die Geste nicht abfangen. */
  grob: boolean;
  /** Mausrad darf zoomen – erst nach einem Klick in die Fläche. */
  zoomFrei: boolean;
  /** Sektion ist im Bild. Sonst wird nicht gezeichnet. */
  imBild: boolean;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const [lampen, setLampen] = useState<Lampe[]>([]);

  /* Ein Finger macht nichts, damit die Seite scrollbar bleibt; zwei Finger
     drehen und zoomen. Anders als beim Mausrad gibt es hier keinen Konflikt,
     weil niemand mit zwei Fingern blättert. */
  const touches = useMemo(
    () => ({ ONE: undefined as unknown as number, TWO: THREE.TOUCH.DOLLY_ROTATE }),
    [],
  );

  return (
    <Canvas
      /* Kein `shadows`: keine Lichtquelle wirft mehr Schatten, das
         Schattenkarten-System hätte nichts zu tun. `ContactShadows` bringt
         seinen eigenen Durchgang mit und braucht es nicht. */
      dpr={grob ? [1, 1.4] : [1, 1.8]}
      camera={{ position: [...GESAMTANSICHT.kamera], fov: 34 }}
      /* Belichtung deutlich unter 1: das Modell ist hell lackiert (Grundton
         0,72 Grau) und lief bei 1,05 in die Sättigung – die Flächen wurden
         zu einem flachen Weiß ohne Verlauf. */
      gl={{ antialias: true, toneMappingExposure: 0.82 }}
      /* Nur zeichnen, wenn die Sektion im Bild ist. Vorher lief die Szene
         auch dann mit voller Bildrate weiter, wenn sie mehrere
         Bildschirmhöhen entfernt war – und jedes Bild kostet hier dreifach:
         die Szene selbst, ihre Spiegelung im Boden und die Schattenkarte.
         Das lief die ganze Zeit gegen das Scrollen der übrigen Seite. */
      frameloop={reduced || !imBild ? 'demand' : 'always'}
    >
      <color attach="background" args={['#08090b']} />
      <fog attach="fog" args={['#08090b', 15, 36]} />

      <Suspense fallback={null}>
        <Fahrzeug onLampen={setLampen} />
        <Halle grob={grob} />

        {/* Abglanz der Leuchten. Die Leuchtflächen strahlen nur sich selbst –
            erst der Schein ringsum lässt sie eingeschaltet wirken statt nur
            hell bemalt.

            Jede Lampe sitzt genau im ausgemessenen Mittelpunkt ihrer
            Leuchteinheit und hat bewusst kurze Reichweite: sie soll die
            Umgebung der Leuchte aufhellen, nicht das halbe Fahrzeug. */}
        {lampen.map((l, i) => (
          <pointLight
            key={i}
            position={l.p}
            distance={l.rot ? 1.1 : 1.6}
            decay={2}
            intensity={l.rot ? 0.9 : 1.8}
            color={l.rot ? '#ff2a18' : '#cfe2ff'}
          />
        ))}

        {/* Studiolicht aus Flächenstrahlern statt einer HDRI-Datei: die
            Spiegelungen auf dem Lack entstehen im Browser, es wird nichts
            nachgeladen. Die langen Streifen oben sind das, was auf der
            Motorhaube als Lichtkante zu sehen ist. */}
        <Environment resolution={256}>
          <Lightformer intensity={1.7} position={[0, 6, -8]} scale={[14, 3, 1]} />
          <Lightformer intensity={1.2} position={[0, 6, 8]} scale={[14, 3, 1]} />
          <Lightformer intensity={2.2} rotation-y={Math.PI / 2} position={[-8, 3, 0]} scale={[16, 2, 1]} />
          <Lightformer intensity={2.2} rotation-y={-Math.PI / 2} position={[8, 3, 0]} scale={[16, 2, 1]} />
          <Lightformer intensity={0.8} form="ring" position={[0, 8, 0]} scale={6} />
        </Environment>

        <ContactShadows
          position={[0, 0.012, 0]}
          opacity={0.66}
          scale={16}
          blur={2.4}
          far={4}
          resolution={512}
          color="#000000"
        />
      </Suspense>

      <ambientLight intensity={0.22} />
      <spotLight
        position={[5, 7, 4]}
        angle={0.5}
        penumbra={0.9}
        /* Ohne Schattenwurf. Er kostete pro Bild einen kompletten weiteren
           Durchgang durch alle 271.000 Dreiecke – gemessen 35 statt 44 fps –
           und war dabei praktisch unsichtbar: bei gleicher Kameraeinstellung
           wichen 0,5 % der Bildpunkte ab, im Mittel 0,34 von 765. Der
           sichtbare Schatten unter dem Fahrzeug kommt von `ContactShadows`
           und bleibt unberührt. */
        intensity={24}
      />
      <directionalLight position={[-6, 4, -5]} intensity={1.1} color="#8fb4dc" />

      <OrbitControls
        ref={controls}
        target={[...GESAMTANSICHT.ziel]}
        enablePan={false}
        /* Mausrad erst nach einem Klick in die Fläche: sonst bliebe die
           Seite hängen, sobald jemand mit dem Zeiger über dem Fahrzeug
           weiterblättert. Am Fingergerät ist Zoom immer frei, dort läuft er
           über zwei Finger und stört das Blättern nicht. */
        enableZoom={!reduced && (grob || zoomFrei)}
        enableRotate={!reduced}
        minDistance={2.0}
        maxDistance={9.5}
        enableDamping
        dampingFactor={0.07}
        rotateSpeed={0.55}
        zoomSpeed={1.1}
        touches={touches}
        /* Nicht unter die Standfläche und nicht über den Scheitel: darunter
           sieht man die offene Unterseite des Modells. */
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2 - 0.04}
        autoRotate={!reduced && aktiv === null}
        autoRotateSpeed={0.32}
      />

      <Kamerafahrt aktiv={aktiv} reduced={reduced} controls={controls} />
    </Canvas>
  );
}
