'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useDeviceTier } from '@/lib/motion';
import {
  buildAudiRings,
  buildBodyShape,
  buildFlankLines,
  buildFrontLines,
  buildRearLines,
  buildWheel,
  wheelPositions,
} from './rs6-lines';

/**
 * Stilisiertes Fahrzeug-Hologramm auf Basis des ABT RS6 Avant.
 *
 * Bewusst keine Produktabbildung: für die ABT-Umbauten gibt es kein frei
 * nutzbares 3D-Modell, und ein Serien-Audi wäre falsch. Gezeichnet werden
 * deshalb nur die Kanten – Silhouette, Fenstergrafik, Grill, Leuchten,
 * Ringe – abgelesen von den eigenen Aufnahmen im Bestand.
 * Geometrie und Maße: `./rs6-lines.ts`
 */
function Hologram({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const scan = useRef<THREE.LineSegments>(null);
  const body = useRef<THREE.LineSegments>(null);
  const rings = useRef<THREE.LineSegments>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const bodyEdges = useMemo(() => {
    /* Ohne Fase: die abgeschrägten Flächen erzeugen sonst dutzende
       Nebenkanten und die Dachpartie wird unleserlich. So bleiben genau
       die beiden Profilkonturen plus die Querkanten an den Profilecken –
       das liest wie eine Designzeichnung. */
    const geo = new THREE.ExtrudeGeometry(buildBodyShape(), {
      depth: 1.72,
      bevelEnabled: false,
      curveSegments: 10,
    });
    geo.translate(0, 0, -0.86);
    // Nur echte Kanten, kein Dreiecksnetz – sonst wird es ein Drahtknäuel.
    return new THREE.EdgesGeometry(geo, 18);
  }, []);

  const flanks = useMemo(buildFlankLines, []);
  const front = useMemo(buildFrontLines, []);
  const rear = useMemo(buildRearLines, []);
  const ringsGeo = useMemo(buildAudiRings, []);
  const wheel = useMemo(buildWheel, []);

  const grid = useMemo(() => {
    const g = new THREE.GridHelper(16, 26, 0x3a4652, 0x1f262e);
    const m = g.material as THREE.Material;
    m.transparent = true;
    m.opacity = 0.14;
    m.depthWrite = false;
    return g;
  }, []);

  // Scanrahmen, der durch das Fahrzeug wandert
  const scanGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p: number[] = [];
    const seg = (a: number[], b: number[]) => p.push(...a, ...b);
    seg([-2.6, 0, -1.05], [2.6, 0, -1.05]);
    seg([2.6, 0, -1.05], [2.6, 0, 1.05]);
    seg([2.6, 0, 1.05], [-2.6, 0, 1.05]);
    seg([-2.6, 0, 1.05], [-2.6, 0, -1.05]);
    g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    return g;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (group.current) {
      if (reduced) {
        group.current.rotation.y = -0.62;
        group.current.rotation.x = 0.1;
      } else {
        const targetY = -0.5 + pointer.current.x * 0.6 + t * 0.1;
        const targetX = 0.09 + pointer.current.y * 0.16;
        const k = Math.min(1, delta * 2.2);
        group.current.rotation.y += (targetY - group.current.rotation.y) * k;
        group.current.rotation.x += (targetX - group.current.rotation.x) * k;
        group.current.position.y = -0.42 + Math.sin(t * 0.8) * 0.03;
      }
    }

    if (reduced) return;

    if (scan.current) {
      const p = (Math.sin(t * 0.5) + 1) / 2;
      scan.current.position.y = 0.05 + p * 1.5;
      (scan.current.material as THREE.LineBasicMaterial).opacity = 0.18 + (1 - p) * 0.28;
    }

    if (body.current) {
      // Feines Flackern, wie ein Signal das noch nicht ganz stabil steht
      const m = body.current.material as THREE.LineBasicMaterial;
      m.opacity = 0.7 + Math.sin(t * 13) * 0.035 + Math.sin(t * 3.1) * 0.05;
    }

    if (rings.current) {
      // Die Ringe pulsieren etwas stärker – sie sind der Blickfang vorn
      const m = rings.current.material as THREE.LineBasicMaterial;
      m.opacity = 0.82 + Math.sin(t * 1.9) * 0.16;
    }
  });

  /* Der Zeiger wird global gelesen, nicht über die Canvas-Events: das Canvas
     hat `pointer-events: none`, damit es auf dem Handy nicht das Scrollen
     abfängt. Position normiert auf −1 … 1. */
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced]);

  return (
    <group ref={group} position={[0, -0.42, 0]}>
      {/* Silhouette */}
      <lineSegments ref={body} geometry={bodyEdges}>
        <lineBasicMaterial
          color="#dceaff"
          transparent
          opacity={0.72}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Flanken: Fenster, Sicken, Türfugen, Spiegel */}
      <lineSegments geometry={flanks}>
        <lineBasicMaterial
          color="#a8c4e4"
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Front und Heck */}
      <lineSegments geometry={front}>
        <lineBasicMaterial
          color="#c2d8f2"
          transparent
          opacity={0.62}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <lineSegments geometry={rear}>
        <lineBasicMaterial
          color="#b6cbe6"
          transparent
          opacity={0.52}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Audi-Ringe */}
      <lineSegments ref={rings} geometry={ringsGeo}>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Räder */}
      {wheelPositions.map((p, i) => (
        <lineSegments key={i} geometry={wheel} position={p} rotation={[0, 0, 0]}>
          <lineBasicMaterial
            color="#8fa8c4"
            transparent
            opacity={0.42}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      ))}

      <primitive object={grid} position={[0, 0, 0]} />

      <lineSegments ref={scan} geometry={scanGeo}>
        <lineBasicMaterial
          color="#e2001a"
          transparent
          opacity={0.34}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export default function HologramCanvas({ reduced = false }: { reduced?: boolean }) {
  const tier = useDeviceTier();

  return (
    <Canvas
      dpr={tier === 'high' ? [1, 1.8] : [1, 1.35]}
      camera={{ position: [5.0, 1.35, 4.7], fov: 33 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={reduced ? 'demand' : 'always'}
      style={{ pointerEvents: 'none' }}
    >
      <Hologram reduced={reduced} />
    </Canvas>
  );
}
